/**
 * SendIt - Ultra-Speed P2P File Transfer
 * Privacy-first, no data collection, end-to-end encrypted
 * Brand Colors: Amber #F59E0B → Red #EF4444
 */

// ============================================
// Theme Management
// ============================================
const ThemeManager = {
    init() {
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('sendit-theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            // Default to dark theme, or light if system prefers light
            const defaultTheme = systemDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', defaultTheme);
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('sendit-theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        // If no theme is set or it's dark, switch to light. Otherwise switch to dark.
        const newTheme = (!current || current === 'dark') ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('sendit-theme', newTheme);
        console.log('Theme switched to:', newTheme);
    },

    get isDark() {
        const theme = document.documentElement.getAttribute('data-theme');
        return !theme || theme === 'dark';
    }
};

// Initialize theme on load
ThemeManager.init();

// ============================================
// Configuration
// ============================================
const CONFIG = {
    CHUNK_SIZE: 64 * 1024, // 64KB chunks for optimal speed
    ICE_SERVERS: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ],
    SIGNALING_SERVER: 'wss://sendit-signal.glitch.me',
    ROOM_CODE_LENGTH: 6,
};

// ============================================
// State Management
// ============================================
class AppState {
    constructor() {
        this.roomCode = null;
        this.isHost = false;
        this.peerConnection = null;
        this.dataChannel = null;
        this.signalingSocket = null;
        this.selectedFiles = [];
        this.transfers = new Map();
        this.receivedFiles = new Map();
        this.receivingFile = null;
    }

    reset() {
        this.roomCode = null;
        this.isHost = false;
        if (this.dataChannel) {
            this.dataChannel.close();
            this.dataChannel = null;
        }
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        if (this.signalingSocket) {
            this.signalingSocket.close();
            this.signalingSocket = null;
        }
        this.selectedFiles = [];
        this.transfers.clear();
        this.receivedFiles.clear();
        this.receivingFile = null;
    }
}

const state = new AppState();

// ============================================
// DOM Elements
// ============================================
const elements = {
    connectionPanel: document.getElementById('connection-panel'),
    roomPanel: document.getElementById('room-panel'),
    btnCreateRoom: document.getElementById('btn-create-room'),
    btnJoinRoom: document.getElementById('btn-join-room'),
    roomCodeInput: document.getElementById('room-code-input'),
    currentRoomCode: document.getElementById('current-room-code'),
    btnCopyCode: document.getElementById('btn-copy-code'),
    btnLeaveRoom: document.getElementById('btn-leave-room'),
    connectionStatus: document.getElementById('connection-status'),
    dropZone: document.getElementById('drop-zone'),
    fileInput: document.getElementById('file-input'),
    selectedFiles: document.getElementById('selected-files'),
    filesList: document.getElementById('files-list'),
    btnClearFiles: document.getElementById('btn-clear-files'),
    btnSendFiles: document.getElementById('btn-send-files'),
    transfersSection: document.getElementById('transfers-section'),
    transfersList: document.getElementById('transfers-list'),
    receivedSection: document.getElementById('received-section'),
    receivedList: document.getElementById('received-list'),
    toastContainer: document.getElementById('toast-container'),
};

// ============================================
// Utility Functions
// ============================================

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < CONFIG.ROOM_CODE_LENGTH; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatSpeed(bytesPerSecond) {
    return formatFileSize(bytesPerSecond) + '/s';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconSvg = type === 'success'
        ? '<path d="M20 6L9 17l-5-5"/>'
        : type === 'error'
            ? '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6m0-6 6 6"/>'
            : '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/>';

    toast.innerHTML = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${iconSvg}
        </svg>
        <span class="toast-message">${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function getFileIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14,2 14,8 20,8"/>
    </svg>`;
}

// ============================================
// Simple Signaling (LocalStorage fallback for demo)
// ============================================

class SimpleSignaling {
    constructor() {
        this.roomCode = null;
        this.isHost = false;
        this.pollInterval = null;
        this.onMessage = null;
        this.lastMessageId = 0;
    }

    async createRoom(roomCode) {
        this.roomCode = roomCode;
        this.isHost = true;
        localStorage.setItem(`room_${roomCode}`, JSON.stringify({ created: Date.now(), messages: [] }));
        this.startPolling();
        return true;
    }

    async joinRoom(roomCode) {
        const roomData = localStorage.getItem(`room_${roomCode}`);
        if (!roomData) {
            return false;
        }
        this.roomCode = roomCode;
        this.isHost = false;
        this.startPolling();
        return true;
    }

    send(message) {
        if (!this.roomCode) return;

        const roomData = JSON.parse(localStorage.getItem(`room_${this.roomCode}`) || '{}');
        if (!roomData.messages) roomData.messages = [];

        roomData.messages.push({
            id: Date.now(),
            from: this.isHost ? 'host' : 'guest',
            data: message
        });

        localStorage.setItem(`room_${this.roomCode}`, JSON.stringify(roomData));
    }

    startPolling() {
        this.pollInterval = setInterval(() => {
            if (!this.roomCode) return;

            const roomData = JSON.parse(localStorage.getItem(`room_${this.roomCode}`) || '{}');
            const messages = roomData.messages || [];

            const sender = this.isHost ? 'guest' : 'host';
            const newMessages = messages.filter(m => m.from === sender && m.id > this.lastMessageId);

            newMessages.forEach(msg => {
                this.lastMessageId = msg.id;
                if (this.onMessage) {
                    this.onMessage(msg.data);
                }
            });
        }, 500);
    }

    close() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
        if (this.roomCode && this.isHost) {
            localStorage.removeItem(`room_${this.roomCode}`);
        }
        this.roomCode = null;
    }
}

// ============================================
// WebRTC Connection
// ============================================

async function createPeerConnection() {
    state.peerConnection = new RTCPeerConnection({
        iceServers: CONFIG.ICE_SERVERS
    });

    state.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            state.signalingSocket.send({
                type: 'ice-candidate',
                candidate: event.candidate
            });
        }
    };

    state.peerConnection.onconnectionstatechange = () => {
        const status = state.peerConnection.connectionState;
        updateConnectionStatus(status);

        if (status === 'connected') {
            showToast('Peer connected! Ready to share files.', 'success');
        } else if (status === 'disconnected' || status === 'failed') {
            showToast('Connection lost. Try rejoining the room.', 'error');
        }
    };

    state.peerConnection.ondatachannel = (event) => {
        state.dataChannel = event.channel;
        setupDataChannel();
    };

    return state.peerConnection;
}

function setupDataChannel() {
    state.dataChannel.binaryType = 'arraybuffer';

    state.dataChannel.onopen = () => {
        updateConnectionStatus('connected');
        elements.btnSendFiles.disabled = state.selectedFiles.length === 0;
    };

    state.dataChannel.onclose = () => {
        updateConnectionStatus('disconnected');
        elements.btnSendFiles.disabled = true;
    };

    state.dataChannel.onmessage = handleDataChannelMessage;
}

function handleDataChannelMessage(event) {
    if (typeof event.data === 'string') {
        const message = JSON.parse(event.data);

        switch (message.type) {
            case 'file-start':
                startReceivingFile(message);
                break;
            case 'file-end':
                finishReceivingFile(message);
                break;
            case 'file-progress':
                updateReceiveProgress(message);
                break;
        }
    } else {
        // Binary data - file chunk
        receiveFileChunk(event.data);
    }
}

function startReceivingFile(message) {
    state.receivingFile = {
        id: message.id,
        name: message.name,
        size: message.size,
        type: message.type,
        chunks: [],
        received: 0,
        startTime: Date.now()
    };

    addTransferItem(message.id, message.name, message.size, 'download');
}

function receiveFileChunk(chunk) {
    if (!state.receivingFile) return;

    state.receivingFile.chunks.push(chunk);
    state.receivingFile.received += chunk.byteLength;

    const progress = (state.receivingFile.received / state.receivingFile.size) * 100;
    const elapsed = (Date.now() - state.receivingFile.startTime) / 1000;
    const speed = state.receivingFile.received / elapsed;

    updateTransferProgress(state.receivingFile.id, progress, speed);
}

function finishReceivingFile(message) {
    if (!state.receivingFile || state.receivingFile.id !== message.id) return;

    const blob = new Blob(state.receivingFile.chunks, { type: state.receivingFile.type });
    const url = URL.createObjectURL(blob);

    state.receivedFiles.set(message.id, {
        name: state.receivingFile.name,
        size: state.receivingFile.size,
        url: url,
        blob: blob
    });

    completeTransfer(message.id);
    addReceivedFile(message.id, state.receivingFile.name, state.receivingFile.size, url);

    showToast(`Received: ${state.receivingFile.name}`, 'success');
    state.receivingFile = null;
}

async function sendFiles() {
    if (!state.dataChannel || state.dataChannel.readyState !== 'open') {
        showToast('Not connected to peer', 'error');
        return;
    }

    for (const file of state.selectedFiles) {
        await sendFile(file);
    }

    state.selectedFiles = [];
    updateSelectedFilesUI();
    showToast('All files sent successfully!', 'success');
}

async function sendFile(file) {
    const fileId = Date.now().toString();

    // Send file start message
    state.dataChannel.send(JSON.stringify({
        type: 'file-start',
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type
    }));

    addTransferItem(fileId, file.name, file.size, 'upload');

    // Read and send file in chunks
    const reader = file.stream().getReader();
    let offset = 0;
    const startTime = Date.now();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Wait for buffer to drain if necessary
        while (state.dataChannel.bufferedAmount > CONFIG.CHUNK_SIZE * 10) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        state.dataChannel.send(value);
        offset += value.byteLength;

        const progress = (offset / file.size) * 100;
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = offset / elapsed;

        updateTransferProgress(fileId, progress, speed);
    }

    // Send file end message
    state.dataChannel.send(JSON.stringify({
        type: 'file-end',
        id: fileId
    }));

    completeTransfer(fileId);
}

// ============================================
// Room Management
// ============================================

async function createRoom() {
    const roomCode = generateRoomCode();

    state.signalingSocket = new SimpleSignaling();
    await state.signalingSocket.createRoom(roomCode);

    state.signalingSocket.onMessage = handleSignalingMessage;

    await createPeerConnection();

    // Create data channel as host
    state.dataChannel = state.peerConnection.createDataChannel('fileTransfer', {
        ordered: true
    });
    setupDataChannel();

    state.roomCode = roomCode;
    state.isHost = true;

    showRoomPanel();
    showToast('Room created! Share the code with your peer.', 'success');
}

async function joinRoom() {
    const roomCode = elements.roomCodeInput.value.toUpperCase().trim();

    if (roomCode.length !== CONFIG.ROOM_CODE_LENGTH) {
        showToast('Please enter a valid room code', 'error');
        return;
    }

    state.signalingSocket = new SimpleSignaling();
    const joined = await state.signalingSocket.joinRoom(roomCode);

    if (!joined) {
        showToast('Room not found. Check the code and try again.', 'error');
        return;
    }

    state.signalingSocket.onMessage = handleSignalingMessage;

    await createPeerConnection();

    state.roomCode = roomCode;
    state.isHost = false;

    // Create and send offer
    const offer = await state.peerConnection.createOffer();
    await state.peerConnection.setLocalDescription(offer);

    state.signalingSocket.send({
        type: 'offer',
        sdp: state.peerConnection.localDescription
    });

    showRoomPanel();
    showToast('Joining room...', 'info');
}

async function handleSignalingMessage(message) {
    switch (message.type) {
        case 'offer':
            await state.peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
            const answer = await state.peerConnection.createAnswer();
            await state.peerConnection.setLocalDescription(answer);
            state.signalingSocket.send({
                type: 'answer',
                sdp: state.peerConnection.localDescription
            });
            break;

        case 'answer':
            await state.peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
            break;

        case 'ice-candidate':
            if (message.candidate) {
                await state.peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
            }
            break;
    }
}

function leaveRoom() {
    state.reset();
    showConnectionPanel();
    showToast('Left the room', 'info');
}

// ============================================
// UI Updates
// ============================================

function showRoomPanel() {
    elements.connectionPanel.classList.add('hidden');
    elements.roomPanel.classList.remove('hidden');
    elements.currentRoomCode.textContent = state.roomCode;
    updateConnectionStatus('waiting');
}

function showConnectionPanel() {
    elements.roomPanel.classList.add('hidden');
    elements.connectionPanel.classList.remove('hidden');
    elements.roomCodeInput.value = '';
    elements.filesList.innerHTML = '';
    elements.transfersList.innerHTML = '';
    elements.receivedList.innerHTML = '';
    elements.selectedFiles.classList.remove('has-files');
    elements.transfersSection.classList.remove('has-transfers');
    elements.receivedSection.classList.remove('has-files');
}

function updateConnectionStatus(status) {
    const statusEl = elements.connectionStatus;
    const textEl = statusEl.querySelector('.status-text');

    statusEl.classList.remove('connected');

    switch (status) {
        case 'connected':
            statusEl.classList.add('connected');
            textEl.textContent = 'Connected';
            break;
        case 'connecting':
            textEl.textContent = 'Connecting...';
            break;
        case 'disconnected':
        case 'failed':
            textEl.textContent = 'Disconnected';
            break;
        default:
            textEl.textContent = 'Waiting for peer...';
    }
}

function updateSelectedFilesUI() {
    const hasFiles = state.selectedFiles.length > 0;
    elements.selectedFiles.classList.toggle('has-files', hasFiles);
    elements.btnSendFiles.disabled = !hasFiles || !state.dataChannel || state.dataChannel.readyState !== 'open';

    elements.filesList.innerHTML = state.selectedFiles.map((file, index) => `
        <div class="file-item" data-index="${index}">
            <div class="file-icon">${getFileIcon()}</div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="file-remove" data-index="${index}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        </div>
    `).join('');

    // Add remove handlers
    elements.filesList.querySelectorAll('.file-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            state.selectedFiles.splice(index, 1);
            updateSelectedFilesUI();
        });
    });
}

function addTransferItem(id, name, size, direction) {
    elements.transfersSection.classList.add('has-transfers');

    const item = document.createElement('div');
    item.className = 'transfer-item';
    item.id = `transfer-${id}`;

    const dirIcon = direction === 'upload'
        ? '<path d="M12 19V5m-7 7 7-7 7 7"/>'
        : '<path d="M12 5v14m7-7-7 7-7-7"/>';

    item.innerHTML = `
        <div class="transfer-header">
            <div class="transfer-direction ${direction}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${dirIcon}
                </svg>
            </div>
            <div class="transfer-info">
                <div class="transfer-name">${name}</div>
                <div class="transfer-stats">
                    <span class="transfer-size">${formatFileSize(size)}</span>
                    <span class="transfer-speed">0 B/s</span>
                </div>
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
        </div>
    `;

    elements.transfersList.appendChild(item);
}

function updateTransferProgress(id, progress, speed) {
    const item = document.getElementById(`transfer-${id}`);
    if (!item) return;

    const fill = item.querySelector('.progress-fill');
    const speedEl = item.querySelector('.transfer-speed');

    fill.style.width = `${progress}%`;
    speedEl.textContent = formatSpeed(speed);
}

function completeTransfer(id) {
    const item = document.getElementById(`transfer-${id}`);
    if (!item) return;

    item.classList.add('completed');
    const fill = item.querySelector('.progress-fill');
    fill.style.width = '100%';
}

function addReceivedFile(id, name, size, url) {
    elements.receivedSection.classList.add('has-files');

    const item = document.createElement('div');
    item.className = 'received-item';

    item.innerHTML = `
        <div class="file-icon">${getFileIcon()}</div>
        <div class="file-info">
            <div class="file-name">${name}</div>
            <div class="file-size">${formatFileSize(size)}</div>
        </div>
        <a href="${url}" download="${name}" class="btn btn-primary btn-download">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
        </a>
    `;

    elements.receivedList.appendChild(item);
}

// ============================================
// Event Listeners
// ============================================

elements.btnCreateRoom.addEventListener('click', createRoom);
elements.btnJoinRoom.addEventListener('click', joinRoom);
elements.btnLeaveRoom.addEventListener('click', leaveRoom);

elements.btnCopyCode.addEventListener('click', () => {
    navigator.clipboard.writeText(state.roomCode);
    showToast('Room code copied!', 'success');
});

elements.roomCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinRoom();
    }
});

// File Drop Zone
elements.dropZone.addEventListener('click', () => elements.fileInput.click());

elements.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.dropZone.classList.add('dragover');
});

elements.dropZone.addEventListener('dragleave', () => {
    elements.dropZone.classList.remove('dragover');
});

elements.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.dropZone.classList.remove('dragover');

    const files = Array.from(e.dataTransfer.files);
    state.selectedFiles.push(...files);
    updateSelectedFilesUI();
});

elements.fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    state.selectedFiles.push(...files);
    updateSelectedFilesUI();
    e.target.value = '';
});

elements.btnClearFiles.addEventListener('click', () => {
    state.selectedFiles = [];
    updateSelectedFilesUI();
});

elements.btnSendFiles.addEventListener('click', sendFiles);

// ============================================
// Initialize
// ============================================

console.log('🚀 SendIt initialized - Privacy-first P2P file transfer');
