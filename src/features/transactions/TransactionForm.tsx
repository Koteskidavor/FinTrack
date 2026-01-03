import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { useAppDispatch } from '../../hooks/store';
import { addTransaction, updateTransaction } from './transactionSlice';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../types';
import type { TransactionType, Transaction } from '../../types';

interface TransactionFormProps {
    onClose?: () => void;
    editingTransaction?: Transaction | null;
}

export function TransactionForm({ onClose, editingTransaction }: TransactionFormProps) {
    const dispatch = useAppDispatch();
    const [amount, setAmount] = useState(editingTransaction?.amount.toString() || '');
    const [description, setDescription] = useState(editingTransaction?.description || '');
    const [type, setType] = useState<TransactionType>(editingTransaction?.type || 'expense');
    const [category, setCategory] = useState(editingTransaction?.category || '');
    const [date, setDate] = useState(editingTransaction?.date || new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    useEffect(() => {
        if (editingTransaction) {
            setAmount(editingTransaction.amount.toString());
            setDescription(editingTransaction.description);
            setType(editingTransaction.type);
            setCategory(editingTransaction.category);
            setDate(editingTransaction.date);
        } else {
            setAmount('');
            setDescription('');
            setType('expense');
            setCategory('');
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, [editingTransaction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category || !date) return;

        setLoading(true);
        try {
            const transactionData = {
                id: editingTransaction?.id || uuidv4(),
                amount: parseFloat(amount),
                description,
                type,
                category,
                date,
            };

            if (editingTransaction) {
                await dispatch(updateTransaction(transactionData)).unwrap();
            } else {
                await dispatch(addTransaction(transactionData)).unwrap();
            }

            setAmount('');
            setDescription('');
            setCategory('');
            onClose?.();
        } catch (err) {
            console.error('Failed to save transaction', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm dark:bg-[#141B2B] dark:border-[#1E293B]/60">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>

            <div className="flex gap-4">
                <label className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                        type="radio"
                        name="type"
                        value="expense"
                        checked={type === 'expense'}
                        onChange={() => { setType('expense'); setCategory(''); }}
                        className="mr-2 accent-primary-600"
                    />
                    Expense
                </label>
                <label className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                        type="radio"
                        name="type"
                        value="income"
                        checked={type === 'income'}
                        onChange={() => { setType('income'); setCategory(''); }}
                        className="mr-2 accent-primary-600"
                    />
                    Income
                </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Amount</label>
                    <Input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Date</label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Category</label>
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="" disabled>Select category</option>
                    {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </Select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Description</label>
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What was this for?"
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? (editingTransaction ? 'Updating...' : 'Adding...') : (editingTransaction ? 'Update Transaction' : 'Add Transaction')}
            </Button>
        </form>
    );
}
