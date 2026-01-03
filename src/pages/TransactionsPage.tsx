import { useState, useCallback } from 'react';
import { Button } from "../components/ui/button";
import { TransactionList } from '../features/transactions/TransactionList';
import { TransactionForm } from '../features/transactions/TransactionForm';
import { Plus, X } from 'lucide-react';
import type { Transaction } from '../types';

export default function TransactionsPage() {
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const handleEdit = useCallback((tx: Transaction) => {
        setEditingTransaction(tx);
        setShowForm(true);
    }, []);

    const handleCloseForm = useCallback(() => {
        setShowForm(false);
        setEditingTransaction(null);
    }, []);

    const handleToggleForm = useCallback(() => {
        if (showForm) {
            handleCloseForm();
        } else {
            setEditingTransaction(null);
            setShowForm(true);
        }
    }, [showForm, handleCloseForm]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Transactions</h1>
                <div><Button onClick={handleToggleForm}>
                    {showForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Add Transaction</>}
                </Button></div>
            </div>

            {showForm && (
                <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <TransactionForm
                        onClose={handleCloseForm}
                        editingTransaction={editingTransaction}
                    />
                </div>
            )}

            <TransactionList onEdit={handleEdit} />
        </div>
    );
}
