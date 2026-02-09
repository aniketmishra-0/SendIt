# 🚀 SendIt - Ultra-Speed P2P File Transfer

A privacy-first, cross-platform file sharing application with end-to-end encryption and peer-to-peer transfer technology.

![SendIt](https://img.shields.io/badge/SendIt-v1.0.0-00d4ff?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Android%20|%20iOS%20|%20Windows%20|%20Mac%20|%20Web-a855f7?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

## ✨ Features

- 🚀 **Ultra-Fast Transfer** - Direct P2P file transfer for maximum speed
- 🔒 **End-to-End Encryption** - All transfers are encrypted, only you and your peer can see the files
- 🌐 **Cross-Platform** - Works on Android, iOS, Windows, Mac, and Web browsers
- 🔐 **Privacy First** - No data collection, no file storage on servers
- 📱 **Room-Based Connection** - Easy pairing with simple 6-digit room codes
- 📦 **Multi-File Transfer** - Send multiple files at once
- 📊 **Real-Time Progress** - See transfer speed and progress in real-time

## 🛠️ Technology Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **P2P**: WebRTC-based peer-to-peer connections
- **UI**: Custom glassmorphism dark theme

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- For Android builds: Android Studio with SDK
- For iOS builds: Mac with Xcode (optional)

### Setup

```bash
# Navigate to the SendIt directory
cd SendIt

# Install dependencies
npm install

# Start development server
npm start
```

## 🚀 Running the App

### Development Mode

```bash
# Start Expo development server
npm start

# Run on Android device/emulator
npm run android

# Run on iOS simulator (Mac only)
npm run ios

# Run in web browser
npm run web
```

### QR Code Scanning

1. Run `npm start`
2. Download **Expo Go** app on your phone
3. Scan the QR code displayed in terminal
4. App will load on your device!

## 📱 Building for Production

### Android APK

To build an APK file for Android:

```bash
# Option 1: Using EAS Build (Recommended - builds in cloud)
npm install -g eas-cli
eas login
npm run build:android

# Option 2: Local build (requires Android Studio)
npx expo run:android --variant release
```

The APK will be available for download from the EAS dashboard or in `android/app/build/outputs/apk/`.

### iOS Build

```bash
# Using EAS Build (requires Apple Developer account)
npm run build:ios

# Local build (Mac with Xcode only)
npx expo run:ios --configuration Release
```

### Web Build

```bash
# Export for web deployment
npm run build:web

# Files will be in 'dist' folder
# Deploy to any static hosting (Vercel, Netlify, etc.)
```

### Windows & Mac Desktop

For desktop builds, we use Electron:

```bash
# Coming soon - Electron wrapper
# Will package the web version as native desktop app
```

## 🔧 Configuration

### app.json

Main configuration for the app including:
- App name and bundle identifier
- Icons and splash screens
- Platform-specific permissions

### eas.json

Build profiles for:
- `development` - Debug builds with dev client
- `preview` - Internal testing builds (APK)
- `production` - Release builds for stores

## 📂 Project Structure

```
FlashShare/
├── App.tsx                 # Main app entry
├── app.json               # Expo configuration
├── eas.json               # EAS Build configuration
├── package.json           # Dependencies
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # App screens
│   │   ├── HomeScreen.tsx
│   │   └── RoomScreen.tsx
│   ├── services/          # P2P and signaling services
│   │   └── P2PService.ts
│   ├── utils/             # Utility functions
│   │   └── theme.ts
│   └── context/           # React context providers
└── assets/                # Images, fonts, icons
```

## 🔒 Security & Privacy

FlashShare is built with privacy at its core:

1. **No Server Storage** - Files are transferred directly between devices
2. **End-to-End Encryption** - Using AES-256 encryption
3. **No Analytics** - We don't track or collect any user data
4. **No Accounts Required** - Use immediately without sign-up
5. **Open Source** - Fully auditable code

## 🌐 How P2P Works

1. **Room Creation** - Generate a unique 6-digit code
2. **Signaling** - Exchange connection info via signaling server
3. **P2P Connection** - Establish direct WebRTC connection
4. **File Transfer** - Send files directly between devices
5. **Encryption** - All data is encrypted end-to-end

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

MIT License - feel free to use this project for any purpose.

---

**Made with ❤️ for privacy-conscious users**
