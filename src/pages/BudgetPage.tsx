import { useState } from 'react';
import { Button } from "../components/ui/button";
import { BudgetOverview } from '../features/budget/BudgetOverview';
import { BudgetForm } from '../features/budget/BudgetForm';
import { Plus, X } from 'lucide-react';
import type { Budget } from '../types';
import { useAppDispatch } from '../hooks/store';
import { clearError } from '../features/budget/budgetSlice';

export default function BudgetPage() {
    const dispatch = useAppDispatch();
    const [showForm, setShowForm] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

    const handleEdit = (budget: Budget) => {
        setEditingBudget(budget);
        setShowForm(true);
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingBudget(null);
        
        dispatch(clearError());
    };

    const handleToggleForm = () => {
        if (showForm) {
            handleClose();
        } else {
            setShowForm(true);
            setEditingBudget(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Monthly Budget</h1>
                <Button
                    onClick={handleToggleForm}
                    className="h-12 px-6 text-base font-semibold shadow-sm hover:shadow-md transition-all sm:h-11 sm:px-5 sm:text-sm"
                >
                    {showForm ? <><X className="w-5 h-5 mr-2" /> Cancel</> : <><Plus className="w-5 h-5 mr-2" /> Set Monthly Budget</>}
                </Button>
            </div>

            {showForm && (
                <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <BudgetForm onClose={handleClose} editingBudget={editingBudget} />
                </div>
            )}

            <BudgetOverview onEdit={handleEdit} />
        </div>
    );
}
