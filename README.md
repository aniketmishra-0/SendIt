<div align="center">

# ⚡ SendIt

### Ultra-Speed P2P File Transfer

<img src="https://img.shields.io/badge/Version-1.0.0-F59E0B?style=for-the-badge&labelColor=0a0a0a" alt="Version"/>
<img src="https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge&labelColor=0a0a0a" alt="License"/>
<img src="https://img.shields.io/badge/PRs-Welcome-00d4ff?style=for-the-badge&labelColor=0a0a0a" alt="PRs Welcome"/>

<br/>

**🔐 Privacy-First • 🚀 Ultra-Fast • 🌐 Cross-Platform**

*Share files instantly with end-to-end encryption. No servers storing your files. No accounts required.*

<br/>

[🌐 **Live Demo**](https://aniketmishra-0.github.io/SendIt) &nbsp;•&nbsp; [📱 **Download App**](#-quick-start) &nbsp;•&nbsp; [🤝 **Contribute**](CONTRIBUTING.md)

<br/>

---

</div>

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🚀 Lightning Fast
Direct peer-to-peer transfer at **25-50 MB/s** on local WiFi. No server bottlenecks.

### 🔒 End-to-End Encrypted  
**AES-256** encryption ensures only you and your recipient can see the files.

### 🌐 Cross-Platform
Works on **Android**, **iOS**, **Windows**, **Mac**, and any **Web Browser**.

</td>
<td width="50%" valign="top">

### 📵 No Data Collection
Zero tracking, zero analytics. Your privacy is our priority.

### 🔗 Simple Room Codes
Connect instantly with **6-digit room codes** or **QR codes**.

### 📁 Any File Type
Share photos, videos, documents, music, and even **APK files**.

</td>
</tr>
</table>

---

## 📂 Project Structure

```
SendIt/
│
├── 🌐 Web Application (Root)
│   ├── index.html          # Landing page
│   ├── app.js              # P2P logic & WebRTC
│   ├── styles.css          # Glassmorphism UI
│   └── assets/             # Logos & icons
│
├── 📱 Mobile Application (app/)
│   ├── App.tsx             # React Native entry
│   ├── app.json            # Expo configuration
│   ├── src/
│   │   ├── screens/        # HomeScreen, RoomScreen
│   │   ├── components/     # QRScanner, QRDisplay
│   │   ├── services/       # P2PService
│   │   └── utils/          # Theme system
│   └── package.json
│
├── 📚 Documentation
│   ├── CONTRIBUTING.md     # How to contribute
│   ├── CODE_OF_CONDUCT.md  # Community guidelines
│   ├── ROADMAP.md          # Future plans
│   └── LICENSE             # MIT License
│
└── 🔧 Configuration
    ├── .github/            # Issue/PR templates
    └── .gitignore          # Git ignore rules
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Web App** | Vanilla JavaScript + WebRTC |
| **Mobile App** | React Native (Expo) + TypeScript |
| **P2P Protocol** | WebRTC Data Channels |
| **Encryption** | AES-256 End-to-End |
| **UI Theme** | Custom Glassmorphism Dark |
| **Build System** | EAS Build (Expo) |

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 18+   •   npm or yarn   •   Git
```

### 🌐 Run Web App

```bash
# Clone the repository
git clone https://github.com/aniketmishra-0/SendIt.git
cd SendIt

# Start local server
npm start

# Open http://localhost:5000
```

### 📱 Run Mobile App

```bash
# Navigate to mobile app folder
cd app

# Install dependencies
npm install

# Start Expo
npm start

# Scan QR code with Expo Go app
```

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

---

## 🔒 Security & Privacy

<div align="center">

| Feature | Description |
|---------|-------------|
| 🚫 **No Server Storage** | Files transfer directly between devices |
| 🔐 **E2E Encryption** | AES-256 bit encryption for all transfers |
| 📵 **No Analytics** | Zero tracking or data collection |
| 👤 **No Accounts** | Use immediately without sign-up |
| 🔓 **Open Source** | Fully auditable code |

</div>

---

## 🔄 How P2P Works

```
┌─────────────────┐                           ┌─────────────────┐
│    Device A     │                           │    Device B     │
│                 │                           │                 │
│  1. Create Room │ ──── Room Code ────────▶  │  2. Join Room   │
│                 │                           │                 │
│                 │ ◀─── Signaling ─────────▶ │                 │
│                 │ (Exchange connection info) │                 │
│                 │                           │                 │
│                 │ ◀═══ Direct P2P ════════▶ │                 │
│                 │ (Encrypted file transfer) │                 │
└─────────────────┘                           └─────────────────┘
```

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

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

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
