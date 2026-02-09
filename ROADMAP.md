# 🗺️ Product Roadmap

This document outlines the high-level goals and planned features for SendIt. We welcome contributions for any of these items!

---

## ✅ Phase 1: Core Foundation — *Completed*
- [x] Basic P2P file transfer via WebRTC
- [x] Room-based connection system (6-digit codes)
- [x] End-to-end AES-256 encryption
- [x] Cross-platform support (Web + React Native mobile)
- [x] Dark / Light theme support
- [x] QR code scanning & display for room joining

## ✅ Phase 1.5: Speed & Infrastructure — *Completed (v2.0)*
- [x] **Python FastAPI signaling server** — WebSocket-based, sub-10ms latency
- [x] **Go high-performance server** — Lock-free signaling, zero-copy relay, goroutine-based
- [x] **v2 Transfer Engine** — Adaptive chunks (64KB–4MB), 3 parallel data channels
- [x] **LZ4 compression** for relay transfers (Python + Go)
- [x] **Relay fallback** — Auto server-relay when P2P fails, chunked upload/download
- [x] **Docker deployment** — `docker-compose.yml`, multi-stage Dockerfile, Nginx reverse proxy
- [x] **Responsive web design** — 7-layer CSS breakpoints (320px → 1440px+), touch targets, safe area
- [x] **Responsive mobile design** — `responsive.ts` utility (`wp`, `hp`, `fs`, `ms`), adaptive layouts
- [x] **Launcher scripts** — `start-servers.bat` (Windows) and `start-servers.sh` (Linux/Mac)
- [x] **Reusable SVG Logo component** for React Native (`Logo.tsx`)

## 🌟 Phase 2: Enhanced User Experience — *Next*
- [ ] **Resume Interrupted Transfers** — Ability to resume transfer if connection drops
- [ ] **File Preview** — Preview images, videos, and PDFs before downloading
- [ ] **Transfer History** — View history of sent/received files with timestamps
- [ ] **Clipboard Sharing** — Universal clipboard sync between connected devices
- [ ] **Drag & Drop** — Enhanced drag & drop support on mobile (split screen)
- [ ] **Notification Support** — Push notifications for incoming transfer requests
- [ ] **Contact / Favorites** — Save frequent transfer partners

## 🔧 Phase 3: Advanced Features
- [ ] **Offline Mode** — Transfer over local Wi-Fi hotspot without internet
- [ ] **Group Transfer** — Send to multiple peers simultaneously (mesh topology)
- [ ] **Desktop Apps** — Native Electron apps for Windows / Mac / Linux
- [ ] **Folder Transfer** — Support for transferring entire folder structures with hierarchy
- [ ] **Streaming Mode** — Stream media files while transferring
- [ ] **Transfer Scheduling** — Queue and schedule large transfers

## 🛠️ Phase 4: Technical Improvements
- [ ] **Unit Tests** — Comprehensive test coverage for core logic (Jest, pytest, Go test)
- [ ] **E2E Testing** — Automated end-to-end testing with Playwright/Detox
- [ ] **Performance Benchmarks** — Automated speed benchmarks in CI
- [ ] **Localization** — Multi-language support (i18n)
- [ ] **TURN Server Integration** — Self-hosted TURN relay for restrictive networks
- [ ] **Plugin System** — Extensible architecture for custom transfer protocols
- [ ] **Monitoring Dashboard** — Real-time server metrics and health monitoring

---

## 📊 Progress Overview

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: Core Foundation | ✅ Done | 100% |
| Phase 1.5: Speed & Infra | ✅ Done | 100% |
| Phase 2: Enhanced UX | 🔜 Next | 0% |
| Phase 3: Advanced Features | 📋 Planned | 0% |
| Phase 4: Technical | 📋 Planned | 0% |

---

## 💡 Have an idea?

Feel free to open a [Feature Request](https://github.com/aniketmishra-0/SendIt/issues/new?template=feature_request.md) if you have an idea that's not listed here!

Want to help build any of these? Check our [Contributing Guide](CONTRIBUTING.md) to get started.
