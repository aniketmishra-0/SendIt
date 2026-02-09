# 🚀 SendIt - Ultra-Speed P2P File Transfer

<div align="center">

![SendIt Logo](https://img.shields.io/badge/SendIt-v1.0.0-gradient?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNIDYyIDI4IEMgMzUgMjggMzUgNDQgNTAgNTAgQyA2NSA1NiA2NSA3MiAzOCA3MiIgc3Ryb2tlPSIjRjU5RTBCIiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=&labelColor=1a1a2e&color=F59E0B)

![Platform](https://img.shields.io/badge/Platform-Web%20|%20Android%20|%20iOS-a855f7?style=for-the-badge&logo=react&labelColor=1a1a2e)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge&logo=opensourceinitiative&labelColor=1a1a2e)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-00d4ff?style=for-the-badge&logo=github&labelColor=1a1a2e)

**A privacy-first, cross-platform file sharing application with end-to-end encryption and peer-to-peer transfer technology.**

[🌐 Live Demo](https://your-demo-url.com) • [📱 Download App](https://your-app-url.com) • [📖 Documentation](#documentation) • [🤝 Contributing](CONTRIBUTING.md)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🚀 Ultra-Fast Transfer
Direct P2P file transfer for maximum speed without server bottlenecks

### 🔒 End-to-End Encryption
AES-256 encryption ensures only you and your peer can see the files

### 🌐 Cross-Platform
Works seamlessly on Web, Android, iOS, Windows, and Mac

</td>
<td width="50%">

### 🔐 Privacy First
No data collection, no file storage on servers - your data is yours

### 📱 Room-Based Connection
Easy pairing with simple 6-digit room codes

### 📊 Real-Time Progress
See transfer speed and progress in real-time

</td>
</tr>
</table>

---

## 📂 Project Structure

This repository contains two applications:

```
SendIt/
├── 🌐 Web Application (Root)
│   ├── index.html          # Web app entry point
│   ├── app.js              # P2P and WebRTC logic
│   ├── styles.css          # Glassmorphism dark theme
│   └── assets/             # Icons and images
│
└── 📱 FlashShare/ (Mobile App)
    ├── App.tsx             # React Native entry
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── screens/        # App screens
    │   ├── services/       # P2P and signaling services
    │   └── utils/          # Utilities and theme
    └── package.json        # Dependencies
```

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Web Framework** | Vanilla JS with WebRTC |
| **Mobile Framework** | React Native (Expo) |
| **Language** | TypeScript / JavaScript |
| **P2P Protocol** | WebRTC Data Channels |
| **Encryption** | AES-256 End-to-End |
| **UI Theme** | Custom Glassmorphism Dark |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- For mobile: **Android Studio** / **Xcode**

### 🌐 Run Web Application

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/SendIt.git
cd SendIt

# Install dependencies
npm install

# Start the web server
npm start
```

The web app will be available at `http://localhost:5000`

### 📱 Run Mobile Application

```bash
# Navigate to mobile app
cd FlashShare

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on specific platform
npm run android    # Android
npm run ios        # iOS (Mac only)
npm run web        # Web browser
```

---

## 📱 Building for Production

### Android APK

```bash
cd FlashShare

# Using EAS Build (Recommended)
npm install -g eas-cli
eas login
npm run build:android

# Local build (requires Android Studio)
npx expo run:android --variant release
```

### iOS Build

```bash
# Using EAS Build (requires Apple Developer account)
npm run build:ios
```

### Web Build

```bash
# Export for static hosting
npm run build:web
# Deploy 'dist' folder to Vercel, Netlify, etc.
```

---

## 🔒 Security & Privacy

SendIt is built with **privacy at its core**:

| Feature | Description |
|---------|-------------|
| 🚫 **No Server Storage** | Files transferred directly between devices |
| 🔐 **E2E Encryption** | AES-256 encryption for all transfers |
| 📵 **No Analytics** | Zero tracking or data collection |
| 👤 **No Accounts** | Use immediately without sign-up |
| 🔓 **Open Source** | Fully auditable code |

---

## 🌐 How P2P Works

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

1. **Room Creation** - Generate a unique 6-digit code
2. **Signaling** - Exchange connection info via signaling server
3. **P2P Connection** - Establish direct WebRTC connection
4. **File Transfer** - Send files directly between devices
5. **Encryption** - All data is encrypted end-to-end

---

## 🤝 Contributing

We love contributions! See our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Links

- 📋 [Code of Conduct](CODE_OF_CONDUCT.md)
- 🐛 [Report a Bug](https://github.com/YOUR_USERNAME/SendIt/issues/new?template=bug_report.md)
- 💡 [Request a Feature](https://github.com/YOUR_USERNAME/SendIt/issues/new?template=feature_request.md)
- 📖 [Development Setup](CONTRIBUTING.md#development-setup)

### Contributors

<a href="https://github.com/YOUR_USERNAME/SendIt/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=YOUR_USERNAME/SendIt" />
</a>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## ⭐ Support

If you find this project useful, please consider:

- ⭐ **Starring** this repository
- 🐛 **Reporting bugs** you find
- 💡 **Suggesting features** you'd like
- 🤝 **Contributing** code or documentation
- 📢 **Sharing** with friends and colleagues

---

<div align="center">

**Made with ❤️ for privacy-conscious users**

[⬆ Back to Top](#-sendit---ultra-speed-p2p-file-transfer)

</div>
