import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import { BudgetObserver } from './features/budget/BudgetObserver';


const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const BudgetPage = lazy(() => import('./pages/BudgetPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <BudgetObserver />
        <Suspense fallback={
          <div className="flex items-center justify-center h-full min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}

export default App
