/**
 * SendIt P2P Service - Ultra-Fast Local WiFi Transfer
 * 
 * This is a wrapper around WiFiTransferService for backward compatibility.
 * All new code should import from WiFiTransferService directly.
 * 
 * Features:
 * 1. WiFi Direct - Direct P2P (50 MB/s)
 * 2. Mobile Hotspot Mode (40 MB/s)
 * 3. Same Network Mode (30 MB/s)
 * 4. Device Discovery
 * 5. Real-time Progress Tracking
 */

// Re-export everything from WiFiTransferService
export * from './WiFiTransferService';

// Import and re-export default
import WiFiTransfer, {
    // Types
    ConnectionMode,
    TransferDirection,
    TransferStatus,
    DeviceInfo,
    NetworkInfo,
    FileItem,
    TransferItem,
    TransferSession,

    // Services
    networkService,
    transferEngine,
    sessionManager,
    wifiDirectManager,
    hotspotManager,

    // Utilities
    generateId,
    generateRoomCode,
    formatFileSize,
    formatSpeed,
    formatTime,
    formatDuration,
    getFileType,
    getDevicePlatform,
    getDefaultDeviceName,

    // Backward compatibility
    SignalingService,
    signalingService,
    p2pManager,
    networkDiscovery,
    generateDeviceId,
    getDeviceName,
    PeerInfo,
    FileTransfer,
    TransferStats,
} from './WiFiTransferService';

export default WiFiTransfer;
