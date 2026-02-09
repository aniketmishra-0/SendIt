<div align="center">

# ⚡ SendIt

### Ultra-Speed P2P File Transfer

<img src="https://img.shields.io/badge/Version-2.0.0-F59E0B?style=for-the-badge&labelColor=0a0a0a" alt="Version"/>
<img src="https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge&labelColor=0a0a0a" alt="License"/>
<img src="https://img.shields.io/badge/PRs-Welcome-00d4ff?style=for-the-badge&labelColor=0a0a0a" alt="PRs Welcome"/>
<img src="https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white&labelColor=0a0a0a" alt="Python"/>
<img src="https://img.shields.io/badge/Go-1.22+-00ADD8?style=for-the-badge&logo=go&logoColor=white&labelColor=0a0a0a" alt="Go"/>
<img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white&labelColor=0a0a0a" alt="Docker"/>

<br/>

**🔐 Privacy-First &nbsp;•&nbsp; 🚀 Ultra-Fast &nbsp;•&nbsp; 🌐 Cross-Platform &nbsp;•&nbsp; 🐳 Docker Ready**

*Share files instantly with end-to-end encryption. No servers storing your files. No accounts required.*

<br/>

[🌐 **Live Demo**](https://aniketmishra-0.github.io/SendIt) &nbsp;•&nbsp; [📱 **Download App**](#-quick-start) &nbsp;•&nbsp; [🤝 **Contribute**](CONTRIBUTING.md) &nbsp;•&nbsp; [🗺️ **Roadmap**](ROADMAP.md)

<br/>

---

</div>

## 🆕 What's New in v2.0

> **SendIt v2** introduces a high-performance server backend and a completely rewritten transfer engine for **2-3x faster** file transfers.

- **Python FastAPI Server** — WebSocket signaling with sub-10ms latency, LZ4 compression, file relay fallback
- **Go Server** — Lock-free signaling, zero-copy relay, memory-pooled buffers for maximum throughput
- **v2 Transfer Engine** — Adaptive chunking (64KB–4MB), parallel data channels, backpressure management
- **Responsive Design** — 7-layer CSS breakpoints (320px–1440px+) and mobile-adaptive React Native components
- **Docker Deployment** — One-command `docker-compose up` to run everything

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🚀 Lightning Fast
Direct peer-to-peer transfer at **50-100+ MB/s** on LAN. Adaptive chunking and parallel channels maximize throughput.

### 🔒 End-to-End Encrypted
**AES-256** encryption ensures only you and your recipient can see the files.

### 🌐 Cross-Platform
Works on **Android**, **iOS**, **Windows**, **Mac**, and any **Web Browser**.

### ⚡ v2 Speed Engine
Parallel data channels, adaptive 64KB–4MB chunks, LZ4 compression, and automatic relay fallback.

</td>
<td width="50%" valign="top">

### 📵 No Data Collection
Zero tracking, zero analytics. Your privacy is our priority.

### 🔗 Simple Room Codes
Connect instantly with **6-digit room codes** or **QR codes**.

### 📁 Any File Type
Share photos, videos, documents, music, APKs — files up to **5GB**.

### 🐳 One-Command Deploy
`docker-compose up` spins up Python server, Go server, and Nginx frontend instantly.

</td>
</tr>
</table>

---

## 📂 Project Structure

```
SendIt/
│
├── 🌐 Web Application
│   ├── index.html              # Landing page & transfer UI
│   ├── app.js                  # P2P logic, WebRTC, room management
│   ├── engine.js               # v2 Speed Engine (parallel, adaptive, relay)
│   ├── styles.css              # Responsive glassmorphism UI (7 breakpoints)
│   └── assets/                 # Logos & icons (SVG)
│
├── 📱 Mobile Application (app/)
│   ├── App.tsx                 # React Native entry
│   ├── src/
│   │   ├── screens/            # HomeScreen, RoomScreen
│   │   ├── components/         # QRScanner, QRDisplay, Logo, TransferProgress
│   │   ├── services/           # P2PService, WiFiTransferService
│   │   ├── context/            # ThemeContext (dark/light)
│   │   └── utils/              # theme.ts, responsive.ts (scaling utilities)
│   └── package.json
│
├── 🖥️ Server (server/)
│   ├── python/                 # FastAPI signaling + relay server
│   │   ├── main.py             # WebSocket signaling, room mgmt, file relay
│   │   ├── requirements.txt    # Python dependencies
│   │   └── Dockerfile          # Python container
│   └── go/                     # High-performance Go server
│       ├── main.go             # Lock-free signaling, zero-copy relay
│       ├── go.mod              # Go module dependencies
│       └── Dockerfile          # Go multi-stage build
│
├── 🐳 Deployment
│   ├── docker-compose.yml      # Full stack orchestration
│   ├── nginx.conf              # Reverse proxy + gzip + caching
│   ├── Dockerfile              # Multi-stage (Python + Go)
│   ├── start-servers.bat       # Windows launcher script
│   └── start-servers.sh        # Linux/Mac launcher script
│
└── 📚 Documentation
    ├── CONTRIBUTING.md          # Contribution guide
    ├── CODE_OF_CONDUCT.md       # Community guidelines
    ├── ROADMAP.md               # Product roadmap
    └── LICENSE                  # MIT License
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Web Frontend** | Vanilla JS + WebRTC | P2P connections & transfer UI |
| **Mobile App** | React Native + Expo + TypeScript | Cross-platform mobile client |
| **v2 Engine** | JavaScript (engine.js) | Adaptive chunks, parallel channels, relay fallback |
| **Python Server** | FastAPI + uvicorn + WebSockets | Signaling, room management, file relay |
| **Go Server** | gorilla/websocket + LZ4 | High-performance signaling & relay |
| **Compression** | LZ4 (Python & Go) | Fast compression for relay transfers |
| **Encryption** | AES-256 E2E | End-to-end file encryption |
| **Containerization** | Docker + docker-compose + Nginx | One-command deployment |
| **UI System** | Glassmorphism + 7-layer responsive CSS | Adaptive across all screen sizes |
| **Build System** | EAS Build (Expo) | Mobile app builds |

---

## 🚀 Quick Start

### Prerequisites

```
Node.js 18+  •  Python 3.10+  •  npm or yarn  •  Git
Optional: Docker, Go 1.22+
```

### ⚡ One-Command (Docker)

```bash
git clone https://github.com/aniketmishra-0/SendIt.git
cd SendIt
docker-compose up -d

# Web App     → http://localhost:5000
# Python API  → http://localhost:8765
# Go API      → http://localhost:8766
```

### 🌐 Run Web App (Manual)

```bash
git clone https://github.com/aniketmishra-0/SendIt.git
cd SendIt

# Option 1: Quick start script (Windows)
start-servers.bat

# Option 2: Manual
npm start                      # Web UI on http://localhost:5000
npm run server:python          # Python server on :8765
npm run server:go              # Go server on :8766 (optional)
```

### 📱 Run Mobile App

```bash
cd app
npm install
npm start
# Scan QR code with Expo Go app
```

---

## 🖥️ Server Architecture

```
                    ┌──────────────────────────────┐
                    │        Nginx (Port 80)       │
                    │   Reverse Proxy + Gzip + CDN │
                    └──────┬───────────┬───────────┘
                           │           │
              ┌────────────▼──┐   ┌────▼───────────┐
              │ Python Server │   │   Go Server    │
              │  (Port 8765)  │   │  (Port 8766)   │
              │               │   │                │
              │ • WebSocket   │   │ • Lock-free WS │
              │ • Room mgmt   │   │ • sync.Map     │
              │ • File relay  │   │ • Zero-copy IO │
              │ • LZ4 compress│   │ • Buffer pools │
              │ • Rate limits │   │ • Goroutines   │
              └───────────────┘   └────────────────┘
```

**v2 Transfer Engine** automatically:
1. Detects the best available server (Go preferred for speed)
2. Establishes WebSocket signaling for WebRTC handshake
3. Opens **3 parallel data channels** for maximum throughput
4. Adapts chunk sizes (64KB → 4MB) based on connection speed
5. Falls back to **server relay** if P2P connection fails

---

## 📱 Build for Production

<details>
<summary><b>🤖 Android APK</b></summary>

```bash
cd app

# Using EAS Build (Cloud - Recommended)
npm install -g eas-cli
eas login
npm run build:android

# Local Build (Requires Android Studio)
npx expo run:android --variant release
```

</details>

<details>
<summary><b>🍎 iOS Build</b></summary>

```bash
cd app

# Requires Apple Developer Account
npm run build:ios
```

</details>

<details>
<summary><b>🌐 Web Build</b></summary>

```bash
cd app
npm run build:web
# Deploy 'dist' folder to Vercel, Netlify, or GitHub Pages
```

</details>

<details>
<summary><b>🐳 Docker Deployment</b></summary>

```bash
# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

</details>

---

## 🔒 Security & Privacy

<div align="center">

| Feature | Description |
|---------|-------------|
| 🚫 **No Server Storage** | Files transfer directly P2P; relay files auto-expire in 1 hour |
| 🔐 **E2E Encryption** | AES-256 bit encryption for all transfers |
| 📵 **No Analytics** | Zero tracking or data collection |
| 👤 **No Accounts** | Use immediately without sign-up |
| 🛡️ **Rate Limiting** | Built-in IP-based rate limits and connection caps |
| 🔓 **Open Source** | Fully auditable code — MIT licensed |

</div>

---

## 🔄 How P2P Works

```
┌─────────────────┐                              ┌─────────────────┐
│    Device A      │                              │    Device B      │
│                  │                              │                  │
│  1. Create Room  │ ──── Room Code ───────────▶  │  2. Join Room    │
│                  │                              │                  │
│                  │ ◀─── WebSocket Signaling ──▶ │                  │
│                  │  (via Python/Go server)       │                  │
│                  │                              │                  │
│                  │ ◀══ 3x Parallel P2P ═══════▶ │                  │
│                  │  (Adaptive chunks + LZ4)      │                  │
│                  │                              │                  │
│  [Fallback]      │ ──── Server Relay ─────────▶ │  [If P2P fails]  │
│                  │  (Compressed, auto-expire)    │                  │
└─────────────────┘                              └─────────────────┘
```

---

## 📊 Performance

| Metric | v1.0 | v2.0 |
|--------|------|------|
| **Signaling** | localStorage polling | WebSocket (< 10ms) |
| **Chunk Size** | Fixed 64KB | Adaptive 64KB–4MB |
| **Channels** | 1 | 3 parallel |
| **LAN Speed** | ~25 MB/s | **50-100+ MB/s** |
| **Compression** | None | LZ4 (text files) |
| **P2P Failure** | Transfer fails | Auto relay fallback |
| **Responsiveness** | Single breakpoint | 7-layer (320px–1440px+) |

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
5. 🔃 **Open** a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📋 Quick Links

| Link | Description |
|------|-------------|
| [📋 Code of Conduct](CODE_OF_CONDUCT.md) | Community guidelines |
| [🐛 Report Bug](https://github.com/aniketmishra-0/SendIt/issues/new?template=bug_report.md) | Found a bug? Let us know |
| [💡 Request Feature](https://github.com/aniketmishra-0/SendIt/issues/new?template=feature_request.md) | Have an idea? Share it |
| [🗺️ Roadmap](ROADMAP.md) | See what's planned |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ Star this repo if you found it useful!

<br/>

**Made with ❤️ by [Aniket Mishra](https://github.com/aniketmishra-0)**

<br/>

*Privacy First • Open Source • Built for Everyone*

<br/>

[⬆ Back to Top](#-sendit)

</div>
