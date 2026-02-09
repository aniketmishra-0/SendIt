# Contributing to SendIt

First off, thank you for considering contributing to SendIt! 🎉

It's people like you that make SendIt such a great tool for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Architecture Overview](#architecture-overview)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, browser, device, app version)
- **Include server logs** if the issue involves the Python/Go backend

### 💡 Suggesting Features

Feature suggestions are welcome! Please:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this feature would be useful**
- **Include mockups or examples if possible**
- Check our [Roadmap](ROADMAP.md) to see if it's already planned

### 🔧 Code Contributions

1. Look for issues labeled `good first issue` or `help wanted`
2. Comment on the issue to let others know you're working on it
3. Fork the repository and create your branch
4. Make your changes and submit a pull request

## Getting Started

### Prerequisites

| Tool | Version | Required For |
|------|---------|-------------|
| **Node.js** | 18+ | Web app, Mobile app |
| **Python** | 3.10+ | Python signaling server |
| **Go** | 1.22+ | Go server (optional) |
| **Docker** | 20+ | Containerized development (optional) |
| **Git** | 2.x+ | Version control |
| **Android Studio** | Latest | Android builds (optional) |
| **Xcode** | Latest | iOS builds (macOS only, optional) |

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SendIt.git
   cd SendIt
   ```

3. **Create a branch for your feature/fix**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

#### 🌐 Web App Development

```bash
# From project root
npm start
# Opens http://localhost:5000
# Edit index.html, app.js, engine.js, styles.css — changes are live
```

#### 🐍 Python Server Development

```bash
cd server/python

# Create virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server with auto-reload
uvicorn main:app --host 0.0.0.0 --port 8765 --reload

# Server runs on http://localhost:8765
# API docs at http://localhost:8765/docs (FastAPI auto-generated)
```

#### 🔷 Go Server Development

```bash
cd server/go

# Download dependencies
go mod download

# Run with auto-rebuild (install air: go install github.com/air-verse/air@latest)
air
# Or run directly
go run main.go

# Server runs on http://localhost:8766
```

#### 📱 Mobile App Development

```bash
cd app

# Install dependencies
npm install

# Start Expo dev server
npm start

# Press 'a' for Android, 'i' for iOS, 'w' for web
# Or scan QR code with Expo Go app on your phone
```

#### 🐳 Docker Development

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f python-server
docker-compose logs -f go-server

# Rebuild after changes
docker-compose up -d --build python-server

# Stop
docker-compose down
```

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add tests** for new features if applicable
3. **Ensure all services start** without errors
4. **Follow the commit message conventions**
5. **Fill out the pull request template** completely
6. **Request review** from maintainers

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
```

**Types:**

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD changes |
| `chore` | Maintenance tasks |

**Examples:**
```
feat(engine): add parallel data channels for faster transfer
fix(qr): resolve scanning issue on Android 14
docs(readme): update server architecture diagram
perf(go-server): implement zero-copy file relay
build(docker): add multi-stage build for Go server
```

## Style Guidelines

### TypeScript / JavaScript

- Use TypeScript for all new mobile app code
- Vanilla JS is fine for web files (`app.js`, `engine.js`)
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for exported classes and functions
- Keep functions small and focused

### Python

- Follow PEP 8 conventions
- Use type hints for function signatures
- Use `async`/`await` for all I/O operations
- Keep FastAPI route handlers thin — business logic in manager classes
- Use `orjson` for JSON serialization (faster than stdlib)

### Go

- Follow standard `gofmt` formatting
- Use `sync.Map` and atomics over mutexes where possible
- Pool buffers to reduce GC pressure
- Keep handlers small — delegate to manager structs
- Use meaningful error messages

### React Native

- Use functional components with hooks
- Follow the existing component structure
- Keep styles in the same file or use the theme system
- Use the `responsive.ts` utilities (`wp()`, `hp()`, `fs()`) for sizing
- Use `react-native-svg` for vector graphics
- Use proper typing for props and state

### CSS

- Follow the existing responsive breakpoint structure
- Mobile-first approach — base styles for small screens
- Use CSS custom properties for theme values
- Maintain the 7-layer breakpoint system (320px → 1440px+)
- Ensure touch targets are at least 44px on touch devices

## Architecture Overview

```
src/
├── components/     # Reusable UI components (Logo, QRScanner, etc.)
├── screens/        # Screen components (HomeScreen, RoomScreen)
├── services/       # Business logic (P2PService, WiFiTransferService)
├── context/        # React Context providers (ThemeContext)
└── utils/          # Utilities (theme.ts, responsive.ts)

server/
├── python/         # FastAPI server (signaling + relay)
└── go/             # Go server (high-performance alternative)

Root Web Files:
├── app.js          # Web P2P logic + WebRTC
├── engine.js       # v2 speed engine (parallel, adaptive, relay)
├── styles.css      # Full responsive CSS (7 breakpoints)
└── index.html      # Single-page web application
```

## 🙏 Recognition

Contributors will be recognized in:
- The project README
- Release notes when their contribution is included
- GitHub's contributor graph

## ❓ Questions?

- Open an issue with the `question` label
- Check [existing discussions](https://github.com/aniketmishra-0/SendIt/issues)
- Read the [Roadmap](ROADMAP.md) to see what's planned

---

Thank you for contributing to SendIt! 🚀
