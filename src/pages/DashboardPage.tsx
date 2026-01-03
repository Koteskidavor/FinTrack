import { useEffect, lazy, Suspense } from 'react';
import { Head } from '../components/seo/Head';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { fetchTransactions, selectTotals, selectBalance } from '../features/transactions/transactionSlice';
import { formatCurrency } from '../lib/formatters';

const SpendingTrendChart = lazy(() => import('../features/analytics/SpendingTrendChart'));
const CategoryPieChart = lazy(() => import('../features/analytics/CategoryPieChart'));

const ChartPlaceholder = () => (
    <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
            <div className="h-32 w-48 bg-slate-50 dark:bg-slate-900 rounded-lg"></div>
        </div>
    </div>
);

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { items: transactions, status } = useAppSelector((state) => state.transactions);
    const { income: totalIncome, expense: totalExpense } = useAppSelector(selectTotals);
    const balance = useAppSelector(selectBalance);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTransactions());
        }
    }, [dispatch, status]);

    return (
        <div className="space-y-6">
            <Head title="Dashboard" description="Overview of your financial health" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary-700 to-primary-500 dark:from-[#22D3EE] dark:to-[#06B6D4] bg-clip-text text-transparent">Dashboard</h1>

            {}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary-500 dark:border-l-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 dark:text-[#64748B]">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${balance >= 0 ? 'text-slate-900 dark:text-[#F1F5F9]' : 'text-red-600 dark:text-[#FB7185]'}`}>
                            {formatCurrency(balance)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-500 dark:border-l-[#34D399]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 dark:text-[#64748B]">Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-[#34D399]">{formatCurrency(totalIncome)}</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-red-500 dark:border-l-[#FB7185]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 dark:text-[#64748B]">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-[#FB7185]">{formatCurrency(totalExpense)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Spending Trend (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<ChartPlaceholder />}>
                            <SpendingTrendChart transactions={transactions} />
                        </Suspense>
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Expenses by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<ChartPlaceholder />}>
                            <CategoryPieChart transactions={transactions} />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
