import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { fetchBudgets, selectBudgetProgress, deleteBudget } from './budgetSlice';
import { formatCurrency } from '../../lib/formatters';
import { cn } from '../../lib/utils';
import { fetchTransactions } from '../transactions/transactionSlice';
import { Button } from '../../components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import type { Budget } from '../../types';

interface BudgetOverviewProps {
    onEdit?: (budget: Budget) => void;
}

export function BudgetOverview({ onEdit }: BudgetOverviewProps) {
    const dispatch = useAppDispatch();
    const budgets = useAppSelector(selectBudgetProgress);
    const budgetStatus = useAppSelector((state) => state.budget.status);
    const transactionStatus = useAppSelector((state) => state.transactions.status);

    useEffect(() => {
        if (budgetStatus === 'idle') {
            dispatch(fetchBudgets());
        }
        if (transactionStatus === 'idle') {
            dispatch(fetchTransactions());
        }
    }, [dispatch, budgetStatus, transactionStatus]);

    const handleDelete = (category: string) => {
        dispatch(deleteBudget(category));
    };

    if (budgetStatus === 'loading') return <div>Loading budgets...</div>;

    if (budgets.length === 0) {
        return <div className="text-slate-500 dark:text-slate-400">No budgets set. Create one to track your spending.</div>;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((b) => (
                <div key={b.category} className="bg-white p-4 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                            <h3 className="font-medium text-slate-900 dark:text-slate-100">{b.category}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {formatCurrency(b.spent)} of {formatCurrency(b.limit)}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit?.(b)}
                                className="h-8 w-8 p-0"
                                title="Edit budget"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(b.category)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                title="Delete budget"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className={cn(
                            "text-sm font-bold text-right mb-1",
                            b.percent > 100 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                        )}>
                            {Math.round(b.percent)}%
                        </div>

                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    b.percent > 100 ? "bg-red-500" : "bg-green-500"
                                )}
                                style={{ width: `${Math.min(b.percent, 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 dark:text-slate-500">
                        {b.remaining < 0
                            ? `Over by ${formatCurrency(Math.abs(b.remaining))}`
                            : `${formatCurrency(b.remaining)} remaining`}
                    </div>
                </div>
            ))}
        </div>
    );
}
