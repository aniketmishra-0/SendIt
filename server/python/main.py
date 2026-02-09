"""
SendIt - Ultra-Fast Signaling & Relay Server
Python FastAPI + WebSocket Implementation

Features:
- WebSocket signaling for WebRTC (sub-10ms latency)
- Room management with auto-cleanup
- File relay when P2P fails (chunked upload/download)
- LZ4 compression for relay transfers
- Rate limiting & security
- Health monitoring & metrics
"""

import asyncio
import hashlib
import os
import secrets
import time
from collections import defaultdict
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

import aiofiles
import lz4.frame
import orjson
import xxhash
from fastapi import (
    FastAPI,
    WebSocket,
    WebSocketDisconnect,
    HTTPException,
    UploadFile,
    File,
    Query,
    Header,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field


# ============================================
# Configuration
# ============================================

class Config:
    """Server configuration"""
    HOST: str = os.getenv("SENDIT_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("SENDIT_PORT", "8765"))
    
    # Room settings
    MAX_ROOMS: int = 10000
    MAX_PEERS_PER_ROOM: int = 2
    ROOM_TIMEOUT: int = 3600          # 1 hour
    ROOM_CODE_LENGTH: int = 6
    
    # Relay settings
    RELAY_UPLOAD_DIR: str = os.getenv("SENDIT_UPLOAD_DIR", "./uploads")
    MAX_FILE_SIZE: int = 5 * 1024 * 1024 * 1024   # 5GB
    CHUNK_SIZE: int = 1024 * 1024                   # 1MB chunks for relay
    RELAY_FILE_TTL: int = 3600                       # 1 hour
    
    # Rate limiting
    MAX_MESSAGES_PER_SECOND: int = 100
    MAX_CONNECTIONS_PER_IP: int = 10
    
    # Compression
    LZ4_COMPRESSION_LEVEL: int = 4   # Balance speed vs ratio
    MIN_COMPRESS_SIZE: int = 1024     # Don't compress < 1KB


config = Config()


# ============================================
# Models
# ============================================

class RoomInfo(BaseModel):
    code: str
    created_at: float
    peer_count: int
    has_host: bool

class ServerStats(BaseModel):
    active_rooms: int
    total_connections: int
    total_messages: int
    total_bytes_relayed: int
    uptime_seconds: float
    avg_latency_ms: float

class FileMetadata(BaseModel):
    id: str
    name: str
    size: int
    mime_type: str = "application/octet-stream"
    checksum: Optional[str] = None
    compressed: bool = False
    original_size: Optional[int] = None
    room_code: Optional[str] = None
    uploaded_at: float = Field(default_factory=time.time)
    expires_at: Optional[float] = None


# ============================================
# Room Manager
# ============================================

class Peer:
    """Represents a connected WebSocket peer"""
    __slots__ = ('ws', 'peer_id', 'is_host', 'room_code', 'ip_address',
                 'connected_at', 'messages_sent', 'last_message_time')
    
    def __init__(self, ws: WebSocket, peer_id: str, is_host: bool, 
                 room_code: str, ip_address: str):
        self.ws = ws
        self.peer_id = peer_id
        self.is_host = is_host
        self.room_code = room_code
        self.ip_address = ip_address
        self.connected_at = time.time()
        self.messages_sent = 0
        self.last_message_time = 0.0


class Room:
    """Represents a signaling room"""
    __slots__ = ('code', 'peers', 'created_at', 'last_activity', 'message_count')
    
    def __init__(self, code: str):
        self.code = code
        self.peers: dict[str, Peer] = {}
        self.created_at = time.time()
        self.last_activity = time.time()
        self.message_count = 0
    
    @property
    def is_expired(self) -> bool:
        return (time.time() - self.last_activity) > config.ROOM_TIMEOUT
    
    @property
    def has_host(self) -> bool:
        return any(p.is_host for p in self.peers.values())
    
    @property
    def peer_count(self) -> int:
        return len(self.peers)


class RoomManager:
    """High-performance room manager for signaling"""
    
    def __init__(self):
        self.rooms: dict[str, Room] = {}
        self.ip_connections: defaultdict[str, int] = defaultdict(int)
        self._cleanup_task: Optional[asyncio.Task] = None
        
        # Metrics
        self.total_messages = 0
        self.total_connections = 0
        self.start_time = time.time()
        self._latencies: list[float] = []
    
    def start(self):
        """Start background cleanup task"""
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
    
    def stop(self):
        """Stop background tasks"""
        if self._cleanup_task:
            self._cleanup_task.cancel()
    
    async def _cleanup_loop(self):
        """Periodically clean up expired rooms"""
        while True:
            try:
                await asyncio.sleep(60)  # Check every minute
                expired = [code for code, room in self.rooms.items() if room.is_expired]
                for code in expired:
                    await self.close_room(code)
                if expired:
                    print(f"[Cleanup] Removed {len(expired)} expired rooms. Active: {len(self.rooms)}")
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"[Cleanup Error] {e}")
    
    def generate_room_code(self) -> str:
        """Generate unique room code"""
        chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        while True:
            code = ''.join(secrets.choice(chars) for _ in range(config.ROOM_CODE_LENGTH))
            if code not in self.rooms:
                return code
    
    def create_room(self) -> str:
        """Create a new room and return its code"""
        if len(self.rooms) >= config.MAX_ROOMS:
            raise HTTPException(status_code=503, detail="Server at capacity")
        
        code = self.generate_room_code()
        self.rooms[code] = Room(code)
        return code
    
    def get_room(self, code: str) -> Optional[Room]:
        """Get room by code"""
        room = self.rooms.get(code.upper())
        if room and room.is_expired:
            # Lazy cleanup
            del self.rooms[code.upper()]
            return None
        return room
    
    async def add_peer(self, room: Room, peer: Peer):
        """Add peer to room and notify others"""
        room.peers[peer.peer_id] = peer
        room.last_activity = time.time()
        self.total_connections += 1
        self.ip_connections[peer.ip_address] += 1
        
        # Notify existing peers
        for pid, existing_peer in room.peers.items():
            if pid != peer.peer_id:
                await self._send_json(existing_peer.ws, {
                    "type": "peer-joined",
                    "peerId": peer.peer_id,
                    "isHost": peer.is_host,
                    "peerCount": room.peer_count
                })
        
        # Send room info to new peer
        await self._send_json(peer.ws, {
            "type": "room-joined",
            "roomCode": room.code,
            "peerId": peer.peer_id,
            "isHost": peer.is_host,
            "peerCount": room.peer_count,
            "peers": [pid for pid in room.peers if pid != peer.peer_id]
        })
    
    async def remove_peer(self, room: Room, peer_id: str):
        """Remove peer from room and notify others"""
        if peer_id in room.peers:
            peer = room.peers.pop(peer_id)
            self.ip_connections[peer.ip_address] = max(0, self.ip_connections[peer.ip_address] - 1)
            
            # Notify remaining peers
            for pid, p in room.peers.items():
                await self._send_json(p.ws, {
                    "type": "peer-left",
                    "peerId": peer_id,
                    "peerCount": room.peer_count
                })
            
            # If room is empty, clean it up
            if room.peer_count == 0:
                await self.close_room(room.code)
    
    async def relay_message(self, room: Room, sender_id: str, message: dict):
        """Relay signaling message to other peers in the room"""
        start = time.monotonic()
        room.last_activity = time.time()
        room.message_count += 1
        self.total_messages += 1
        
        target_id = message.get("targetId")
        
        for pid, peer in room.peers.items():
            if pid == sender_id:
                continue
            if target_id and pid != target_id:
                continue
            
            message["senderId"] = sender_id
            await self._send_json(peer.ws, message)
        
        # Track latency
        latency = (time.monotonic() - start) * 1000
        self._latencies.append(latency)
        if len(self._latencies) > 1000:
            self._latencies = self._latencies[-500:]
    
    async def close_room(self, code: str):
        """Close room and disconnect all peers"""
        room = self.rooms.pop(code.upper(), None)
        if room:
            for peer in list(room.peers.values()):
                try:
                    await peer.ws.close(1000, "Room closed")
                except Exception:
                    pass
    
    def check_rate_limit(self, peer: Peer) -> bool:
        """Check if peer is within rate limits"""
        now = time.time()
        if now - peer.last_message_time < 1.0 / config.MAX_MESSAGES_PER_SECOND:
            return False
        peer.last_message_time = now
        peer.messages_sent += 1
        return True
    
    def check_ip_limit(self, ip: str) -> bool:
        """Check if IP is within connection limits"""
        return self.ip_connections[ip] < config.MAX_CONNECTIONS_PER_IP
    
    @property
    def avg_latency(self) -> float:
        if not self._latencies:
            return 0.0
        return sum(self._latencies) / len(self._latencies)
    
    @staticmethod
    async def _send_json(ws: WebSocket, data: dict):
        """Send JSON data via WebSocket using orjson for speed"""
        try:
            await ws.send_bytes(orjson.dumps(data))
        except Exception:
            pass


# ============================================
# File Relay Manager
# ============================================

class FileRelay:
    """Handles file relay when P2P connection fails"""
    
    def __init__(self, upload_dir: str = config.RELAY_UPLOAD_DIR):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.files: dict[str, FileMetadata] = {}
        self._cleanup_task: Optional[asyncio.Task] = None
        self.total_bytes_relayed = 0
    
    def start(self):
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
    
    def stop(self):
        if self._cleanup_task:
            self._cleanup_task.cancel()
    
    async def _cleanup_loop(self):
        """Clean up expired relay files"""
        while True:
            try:
                await asyncio.sleep(300)  # Every 5 minutes
                now = time.time()
                expired = [fid for fid, meta in self.files.items() 
                          if meta.expires_at and now > meta.expires_at]
                for fid in expired:
                    await self.delete_file(fid)
                if expired:
                    print(f"[Relay Cleanup] Removed {len(expired)} expired files")
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"[Relay Cleanup Error] {e}")
    
    def generate_file_id(self) -> str:
        return secrets.token_urlsafe(16)
    
    async def store_file(
        self,
        file: UploadFile,
        room_code: Optional[str] = None,
        compress: bool = True,
    ) -> FileMetadata:
        """Store uploaded file with optional LZ4 compression"""
        file_id = self.generate_file_id()
        file_path = self.upload_dir / file_id
        
        original_size = 0
        hasher = xxhash.xxh64()
        
        if compress and file.size and file.size > config.MIN_COMPRESS_SIZE:
            # Compress with LZ4 for speed
            compressed_path = file_path.with_suffix('.lz4')
            async with aiofiles.open(compressed_path, 'wb') as f:
                ctx = lz4.frame.create_compression_context()
                # Write LZ4 frame header
                header = lz4.frame.compress_begin(ctx, 
                    compression_level=config.LZ4_COMPRESSION_LEVEL)
                await f.write(header)
                
                while chunk := await file.read(config.CHUNK_SIZE):
                    original_size += len(chunk)
                    hasher.update(chunk)
                    compressed_chunk = lz4.frame.compress_chunk(ctx, chunk)
                    await f.write(compressed_chunk)
                
                footer = lz4.frame.compress_flush(ctx)
                await f.write(footer)
            
            stored_size = compressed_path.stat().st_size
            stored_path = compressed_path
            is_compressed = True
        else:
            # Store raw
            async with aiofiles.open(file_path, 'wb') as f:
                while chunk := await file.read(config.CHUNK_SIZE):
                    original_size += len(chunk)
                    hasher.update(chunk)
                    await f.write(chunk)
            
            stored_size = file_path.stat().st_size
            stored_path = file_path
            is_compressed = False
        
        self.total_bytes_relayed += original_size
        
        metadata = FileMetadata(
            id=file_id,
            name=file.filename or "unknown",
            size=stored_size,
            mime_type=file.content_type or "application/octet-stream",
            checksum=hasher.hexdigest(),
            compressed=is_compressed,
            original_size=original_size,
            room_code=room_code,
            expires_at=time.time() + config.RELAY_FILE_TTL,
        )
        
        self.files[file_id] = metadata
        return metadata
    
    async def stream_file(self, file_id: str, decompress: bool = True):
        """Stream file with optional decompression"""
        meta = self.files.get(file_id)
        if not meta:
            raise HTTPException(status_code=404, detail="File not found")
        
        if meta.compressed:
            file_path = self.upload_dir / f"{file_id}.lz4"
        else:
            file_path = self.upload_dir / file_id
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found on disk")
        
        async def file_iterator():
            if meta.compressed and decompress:
                # Stream decompress
                ctx = lz4.frame.create_decompression_context()
                async with aiofiles.open(file_path, 'rb') as f:
                    while chunk := await f.read(config.CHUNK_SIZE):
                        try:
                            decompressed, _ = lz4.frame.decompress_chunk(ctx, chunk)
                            if decompressed:
                                yield decompressed
                        except Exception:
                            yield chunk
            else:
                async with aiofiles.open(file_path, 'rb') as f:
                    while chunk := await f.read(config.CHUNK_SIZE):
                        yield chunk
        
        return file_iterator, meta
    
    async def delete_file(self, file_id: str):
        """Delete a relayed file"""
        meta = self.files.pop(file_id, None)
        if meta:
            path = self.upload_dir / (f"{file_id}.lz4" if meta.compressed else file_id)
            try:
                path.unlink(missing_ok=True)
            except Exception:
                pass
    
    def get_file_meta(self, file_id: str) -> Optional[FileMetadata]:
        return self.files.get(file_id)


# ============================================
# Application Setup
# ============================================

room_manager = RoomManager()
file_relay = FileRelay()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown"""
    room_manager.start()
    file_relay.start()
    print(f"🚀 SendIt Server started on {config.HOST}:{config.PORT}")
    print(f"   Signaling: ws://{config.HOST}:{config.PORT}/ws/{{room_code}}")
    print(f"   Relay API: http://{config.HOST}:{config.PORT}/api/relay")
    yield
    room_manager.stop()
    file_relay.stop()
    print("👋 SendIt Server stopped")


app = FastAPI(
    title="SendIt Server",
    description="Ultra-Fast P2P Signaling & File Relay Server",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# REST API Routes
# ============================================

@app.get("/")
async def health():
    """Health check"""
    return {"status": "ok", "server": "SendIt", "version": "2.0.0"}


@app.get("/api/stats", response_model=ServerStats)
async def get_stats():
    """Server statistics"""
    return ServerStats(
        active_rooms=len(room_manager.rooms),
        total_connections=room_manager.total_connections,
        total_messages=room_manager.total_messages,
        total_bytes_relayed=file_relay.total_bytes_relayed,
        uptime_seconds=time.time() - room_manager.start_time,
        avg_latency_ms=room_manager.avg_latency,
    )


@app.post("/api/rooms")
async def create_room():
    """Create a new signaling room"""
    code = room_manager.create_room()
    return {"roomCode": code, "created": True}


@app.get("/api/rooms/{room_code}")
async def get_room(room_code: str):
    """Check if room exists"""
    room = room_manager.get_room(room_code.upper())
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return RoomInfo(
        code=room.code,
        created_at=room.created_at,
        peer_count=room.peer_count,
        has_host=room.has_host,
    )


# ============================================
# WebSocket Signaling
# ============================================

@app.websocket("/ws/{room_code}")
async def websocket_signaling(
    websocket: WebSocket,
    room_code: str,
    peer_id: str = Query(default=None),
    is_host: str = Query(default="false"),
):
    """WebSocket endpoint for real-time signaling"""
    # Get client IP
    client_ip = websocket.client.host if websocket.client else "unknown"
    
    # Rate limit check
    if not room_manager.check_ip_limit(client_ip):
        await websocket.close(4029, "Too many connections")
        return
    
    await websocket.accept()
    
    room_code = room_code.upper()
    
    # Get or create room
    room = room_manager.get_room(room_code)
    if not room:
        # Auto-create room if host
        if is_host.lower() == "true":
            room_code_new = room_manager.create_room()
            # Use the requested code if possible
            if room_code not in room_manager.rooms:
                room_manager.rooms[room_code] = room_manager.rooms.pop(room_code_new)
                room_manager.rooms[room_code].code = room_code
            room = room_manager.rooms[room_code]
        else:
            await websocket.send_bytes(orjson.dumps({
                "type": "error",
                "message": "Room not found"
            }))
            await websocket.close(4004, "Room not found")
            return
    
    # Check room capacity
    if room.peer_count >= config.MAX_PEERS_PER_ROOM:
        await websocket.send_bytes(orjson.dumps({
            "type": "error", 
            "message": "Room is full"
        }))
        await websocket.close(4003, "Room full")
        return
    
    # Create peer
    if not peer_id:
        peer_id = secrets.token_urlsafe(8)
    
    peer = Peer(
        ws=websocket,
        peer_id=peer_id,
        is_host=is_host.lower() == "true",
        room_code=room_code,
        ip_address=client_ip,
    )
    
    await room_manager.add_peer(room, peer)
    
    try:
        while True:
            # Receive message (supports both text and binary)
            data = await websocket.receive()
            
            if "text" in data:
                message = orjson.loads(data["text"])
            elif "bytes" in data:
                message = orjson.loads(data["bytes"])
            else:
                continue
            
            # Rate limit
            if not room_manager.check_rate_limit(peer):
                await websocket.send_bytes(orjson.dumps({
                    "type": "error",
                    "message": "Rate limited"
                }))
                continue
            
            # Relay message to other peers
            await room_manager.relay_message(room, peer_id, message)
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"[WS Error] {peer_id}: {e}")
    finally:
        # Clean up
        room = room_manager.get_room(room_code)
        if room:
            await room_manager.remove_peer(room, peer_id)


# ============================================
# File Relay API
# ============================================

@app.post("/api/relay/upload")
async def upload_file(
    file: UploadFile = File(...),
    room_code: Optional[str] = Query(default=None),
    compress: bool = Query(default=True),
):
    """Upload file for relay transfer"""
    if file.size and file.size > config.MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    
    metadata = await file_relay.store_file(file, room_code, compress)
    
    return {
        "fileId": metadata.id,
        "name": metadata.name,
        "size": metadata.original_size,
        "compressed": metadata.compressed,
        "compressedSize": metadata.size if metadata.compressed else None,
        "checksum": metadata.checksum,
        "expiresAt": metadata.expires_at,
        "downloadUrl": f"/api/relay/download/{metadata.id}",
    }


@app.get("/api/relay/download/{file_id}")
async def download_file(file_id: str, decompress: bool = Query(default=True)):
    """Download relayed file with streaming"""
    iterator, meta = await file_relay.stream_file(file_id, decompress)
    
    return StreamingResponse(
        iterator(),
        media_type=meta.mime_type,
        headers={
            "Content-Disposition": f'attachment; filename="{meta.name}"',
            "X-Original-Size": str(meta.original_size),
            "X-Checksum": meta.checksum or "",
            "X-Compressed": str(meta.compressed),
        },
    )


@app.get("/api/relay/info/{file_id}")
async def file_info(file_id: str):
    """Get file metadata"""
    meta = file_relay.get_file_meta(file_id)
    if not meta:
        raise HTTPException(status_code=404, detail="File not found")
    return meta


@app.delete("/api/relay/{file_id}")
async def delete_relay_file(file_id: str):
    """Delete relayed file"""
    await file_relay.delete_file(file_id)
    return {"deleted": True}


# ============================================
# Run Server
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=config.HOST,
        port=config.PORT,
        ws_ping_interval=20,
        ws_ping_timeout=20,
        ws_max_size=16 * 1024 * 1024,  # 16MB max WS message
        log_level="info",
        reload=False,
        workers=1,  # Single worker for WebSocket state
    )
