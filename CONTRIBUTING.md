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

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, device, app version)

### 💡 Suggesting Features

Feature suggestions are welcome! Please:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this feature would be useful**
- **Include mockups or examples if possible**

### 🔧 Code Contributions

1. Look for issues labeled `good first issue` or `help wanted`
2. Comment on the issue to let others know you're working on it
3. Fork the repository and create your branch
4. Make your changes and submit a pull request

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- For mobile development:
  - Android Studio (for Android)
  - Xcode (for iOS, macOS only)

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/aniketmishra-0/SendIt.git
   cd SendIt
   ```

3. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Create a branch for your feature/fix**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add tests** for new features if applicable
3. **Ensure all tests pass** before submitting
4. **Follow the commit message conventions**
5. **Fill out the pull request template** completely
6. **Request review** from maintainers

### Commit Message Format

We follow conventional commits:

```
type(scope): description

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(transfer): add pause/resume functionality
fix(qr): resolve scanning issue on Android 14
docs(readme): update installation instructions
```

## Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### React Native

- Use functional components with hooks
- Follow the existing component structure
- Keep styles in the same file or use the theme system
- Use proper typing for props and state

### File Organization

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── services/       # Business logic and API calls
├── context/        # React Context providers
└── utils/          # Utility functions and helpers
```

## 🙏 Recognition

Contributors will be recognized in:
- The project README
- Release notes when their contribution is included

## ❓ Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

---

Thank you for contributing to SendIt! 🚀
