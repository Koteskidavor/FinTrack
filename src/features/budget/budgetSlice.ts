import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { Budget } from '../../types';
import type { RootState } from '../../store';

interface BudgetState {
    items: Budget[];
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
}

const initialState: BudgetState = {
    items: [],
    status: 'idle',
    error: null,
};

const STORAGE_KEY = 'pf_budgets';

export const fetchBudgets = createAsyncThunk('budget/fetch', async () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
});

export const saveBudget = createAsyncThunk('budget/save', async (budget: Budget & { isEditing?: boolean }) => {

    const data = localStorage.getItem(STORAGE_KEY);
    const items: Budget[] = data ? JSON.parse(data) : [];


    const existingIndex = items.findIndex(b => b.category === budget.category);

    if (existingIndex >= 0 && !budget.isEditing) {
        throw new Error(`Budget for "${budget.category}" already exists. Please edit the existing budget instead.`);
    }

    if (existingIndex >= 0) {
        items[existingIndex] = { category: budget.category, limit: budget.limit, spent: budget.spent };
    } else {
        items.push({ category: budget.category, limit: budget.limit, spent: budget.spent });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items;
});

export const deleteBudget = createAsyncThunk('budget/delete', async (category: string) => {
    const data = localStorage.getItem(STORAGE_KEY);
    const items: Budget[] = data ? JSON.parse(data) : [];

    const filtered = items.filter(b => b.category !== category);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
});

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudgets.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = 'idle';
                state.error = null;
            })
            .addCase(saveBudget.fulfilled, (state, action) => {
                state.items = action.payload;
                state.error = null;
            })
            .addCase(saveBudget.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to save budget';
            })
            .addCase(deleteBudget.fulfilled, (state, action) => {
                state.items = action.payload;
                state.error = null;
            });
    },
});

export const { clearError } = budgetSlice.actions;

export default budgetSlice.reducer;


export const selectBudgets = (state: RootState) => state.budget.items;

export const selectBudgetProgress = createSelector(
    [
        (state: RootState) => state.budget.items,
        (state: RootState) => state.transactions.items
    ],
    (budgets, transactions) => {

        const currentMonth = new Date().toISOString().substring(0, 7);

        const spendingByCategory: Record<string, number> = {};

        transactions.forEach(tx => {
            if (tx.type === 'expense' && tx.date.startsWith(currentMonth)) {
                spendingByCategory[tx.category] = (spendingByCategory[tx.category] || 0) + tx.amount;
            }
        });

        return budgets.map(b => ({
            ...b,
            spent: spendingByCategory[b.category] || 0,
            remaining: b.limit - (spendingByCategory[b.category] || 0),
            percent: Math.min(100, ((spendingByCategory[b.category] || 0) / b.limit) * 100)
        }));
    }
);
