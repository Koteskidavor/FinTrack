# FinTrack - Secure Personal Finance App

FinTrack is a secure, locally managed personal budgeting application that allows users to manage their income, track transactions, and monitor budgets in one place. The app provides a clear overview of finances using visual charts and **real-time AI insights powered by Hugging Face**, helping users make smarter money management decisions.

## 🌐 Deployment

Check out the live application here: **[https://fintrackcash.netlify.app/](https://fintrackcash.netlify.app/)**

## 🚀 Features

-   **Local-First & Secure**: All data is stored locally in your browser (IndexedDB) and encrypted using the Web Crypto API.
-   **Robust Tracking**:
    -   **Transactions**: Log income and expenses with detailed categorization.
    -   **Budgeting**: Set and monitor monthly spending limits for different categories.
-   **Visual Analytics**: Interactive charts to visualize spending trends and category breakdowns.
-   **AI Insights**: Privacy-preserving educational feedback on spending habits fetched from a **real AI model via Hugging Face**.
-   **Modern UI**: Fully responsive design with **Dark Mode** support and accessible components.

## 🛠️ Tech Stack

### Core
-   **Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Routing**: [React Router v7](https://reactrouter.com/)

### State & Storage
-   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
-   **Local Storage**: [idb](https://github.com/jakearchibald/idb) (IndexedDB wrapper)
-   **Encryption**: Web Crypto API (AES-GCM)

### Styling & UI
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Components**: Custom accessible UI components (DateInput, etc.)
-   **Date Handling**: [date-fns](https://date-fns.org/) + [react-day-picker](https://daypicker.dev/)
-   **Charts**: [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)

### Testing
-   **Unit/Integration**: [Vitest](https://vitest.dev/)
-   **Component Testing**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🏗️ Architecture

The project follows a feature-based architecture locally:

-   **`src/features/`**: Domain-specific logic (Transactions, Budget, Analytics).
-   **`src/lib/`**: Core utilities (Crypto, Storage adapters, AI Service abstractions).
-   **`src/store/`**: Global Redux store configuration and slices.
-   **`src/components/ui/`**: Reusable, atomic UI components (Buttons, Inputs, Modals).

### Security Model
1.  **Key Generation**: Generates a random AES-GCM key on first load.
    -   *Note: Currently stored in `localStorage` for MVP convenience. Clearing browser data will lose the key and data.*
2.  **Encryption**: Encrypts sensitive transaction data (amounts, descriptions) before persisting to IndexedDB.
3.  **Decryption**: Decrypts data on-the-fly when loading into application memory.

## 📦 Setup & Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Dev Server**
    ```bash
    npm run dev
    ```

3.  **Run Tests**
    ```bash
    npm test
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

## ⚠️ Limitations (MVP)

-   **Data Persistence**: If you clear your browser's Local Storage or IndexedDB, **all data will be permanently lost** as the encryption key is destroyed.
-   **Device Sync**: Currently single-device only (no cloud sync).

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
