import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { fetchTransactions, removeTransaction } from './transactionSlice';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Button } from '../../components/ui/button';
import { Trash2, Pencil } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Transaction } from '../../types';


const TransactionItem = React.memo(({
    tx,
    onEdit,
    onDelete
}: {
    tx: Transaction;
    onEdit: (tx: Transaction) => void;
    onDelete: (id: string) => void
}) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <div className="flex flex-col">
                <span className="font-medium text-slate-900 dark:text-slate-100">{tx.description || tx.category}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(tx.date)} • {tx.category}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className={cn(
                    "font-semibold",
                    tx.type === 'income' ? "text-green-600 dark:text-green-400" : "text-slate-900 dark:text-slate-100"
                )}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(tx)}
                    className="text-slate-400 hover:text-primary-600 dark:text-slate-500 dark:hover:text-primary-400 h-8 w-8 p-0"
                    aria-label="Edit transaction"
                    title="Edit transaction"
                >
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(tx.id)}
                    className="text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 h-8 w-8 p-0"
                    aria-label="Delete transaction"
                    title="Delete transaction"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
});

TransactionItem.displayName = "TransactionItem";

export function TransactionList({ onEdit }: { onEdit: (tx: Transaction) => void }) {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.transactions);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTransactions());
        }
    }, [status, dispatch]);

    const handleDelete = React.useCallback((id: string | string[]) => {
        if (Array.isArray(id)) {
            id.forEach(i => dispatch(removeTransaction(i)));
        } else {
            dispatch(removeTransaction(id));
        }
    }, [dispatch]);

    
    const groupedItems = React.useMemo(() => {
        const groups: Record<string, { tx: Transaction; ids: string[] }> = {};

        items.forEach(tx => {
            const key = `${tx.date}_${tx.category}_${tx.type}`;
            if (groups[key]) {
                groups[key].tx = {
                    ...groups[key].tx,
                    amount: groups[key].tx.amount + tx.amount,
                    description: groups[key].tx.description === tx.description ? groups[key].tx.description :
                        (groups[key].tx.description ? `${groups[key].tx.description}, ${tx.description}` : tx.description)
                };
                groups[key].ids.push(tx.id);
            } else {
                groups[key] = { tx: { ...tx }, ids: [tx.id] };
            }
        });

        return Object.values(groups)
            .map(g => ({ ...g.tx, id: g.ids.length > 1 ? (g.ids as any) : g.tx.id }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [items]);

    if (status === 'loading') {
        return <div className="p-8 text-center text-slate-500">Loading transactions...</div>;
    }

    if (status === 'failed') {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    if (groupedItems.length === 0) {
        return <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            No transactions yet. Add one to see it here.
        </div>;
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden dark:bg-[#141B2B] dark:border-[#1E293B]/60">
            {groupedItems.map((tx) => (
                <TransactionItem key={`${tx.date}_${tx.category}_${tx.type}`} tx={tx} onEdit={onEdit} onDelete={handleDelete} />
            ))}
        </div>
    );
}
