# Secure Personal Finance App

A local-first, privacy-focused personal finance application built with React, TypeScript, and Vite.
This application runs entirely in the browser, storing data in IndexedDB with client-side AES-GCM encryption.

## 🚀 Features

- **Local-First & Secure**: All data stored locally, encrypted with Web Crypto API.
- **Transactions**: Track income and expenses with categorization.
- **Budgeting**: Set monthly spending limits and track progress.
- **Analytics**: Visualization of spending trends and category breakdown.
- **AI Insights**: Privacy-preserving educational feedback on spending habits (Mocked for Demo).

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (v3/v4 compat) + PostCSS
- **State Management**: Redux Toolkit
- **Storage**: IndexedDB (via `idb`)
- **Encryption**: Web Crypto API (AES-GCM)
- **Data Viz**: Recharts
- **Testing**: Vitest, React Testing Library

## 🏗️ Architecture

- **`src/features/`**: Domain-specific logic (Transactions, Budget, Analytics).
- **`src/lib/`**: Core utilities (Crypto, Storage, AI Service).
- **`src/store/`**: Redux store configuration.
- **`src/components/ui/`**: Reusable atomic components.

### Security Model
- Generates a random AES-GCM key on first load (stored in localStorage for MVP; in production, would derive from user password).
- Encrypts transaction amounts and descriptions before saving to IndexedDB.
- Decrypts on-the-fly when loading into memory.

### Performance
- **Virtualization Ready**: Architecture supports `react-window` for large lists (currently optimized list with `memo`).
- **Efficient State**: Redux Toolkit for predictable updates.
- **Lazy Loading**: (Planned) Chart components can be lazy loaded.

## 📦 Setup & Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

## ⚠️ Limitations (MVP)
- **Key Storage**: Encryption key is currently stored in `localStorage` for convenience. Clearing browser data will lose the key and thus the data.
- **AI Service**: currently returns mock responses to demonstrate the privacy-guard integration without requiring an API key.

## 🤝 Contributing
1. Fork the repo
2. Create feature branch
3. Submit PR
