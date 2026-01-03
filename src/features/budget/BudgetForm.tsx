import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { saveBudget } from './budgetSlice';
import { EXPENSE_CATEGORIES } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import type { Budget } from '../../types';

interface BudgetFormProps {
    onClose?: () => void;
    editingBudget?: Budget | null;
}

export function BudgetForm({ onClose, editingBudget }: BudgetFormProps) {
    const dispatch = useAppDispatch();
    const error = useAppSelector((state) => state.budget.error);
    const [category, setCategory] = useState(editingBudget?.category || EXPENSE_CATEGORIES[0]);
    const [limit, setLimit] = useState(editingBudget?.limit.toString() || '');

    
    useEffect(() => {
        if (!editingBudget) {
            setCategory(EXPENSE_CATEGORIES[0]);
            setLimit('');
            return;
        }
        setCategory(editingBudget.category);
        setLimit(editingBudget.limit.toString());
    }, [editingBudget]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!limit) return;

        const result = await dispatch(saveBudget({
            category,
            limit: parseFloat(limit),
            spent: 0,
            isEditing: !!editingBudget
        }));

        if (saveBudget.fulfilled.match(result)) {
            setLimit('');
            setCategory(EXPENSE_CATEGORIES[0]);
            onClose?.();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4 dark:bg-[#141B2B] dark:border-[#1E293B]/60">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                {editingBudget ? 'Edit Budget' : 'Set Monthly Budget'}
            </h3>

            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={!!editingBudget}
                >
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
                {editingBudget && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Category cannot be changed when editing
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Monthly Limit ($)</label>
                <Input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="500"
                    required
                />
            </div>

            <Button type="submit" className="w-full">
                {editingBudget ? 'Update Budget' : 'Save Budget'}
            </Button>
        </form>
    );
}
