import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

import type { Transaction } from '../../types';
import * as storage from '../../lib/storage';
import type { RootState } from '../../store';

interface TransactionState {
    items: Transaction[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TransactionState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTxs',
    async () => {
        const txs = await storage.getAllTransactions();
        return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
);

export const addTransaction = createAsyncThunk(
    'transactions/addTx',
    async (tx: Transaction) => {
        await storage.saveTransaction(tx);
        return tx;
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/updateTx',
    async (tx: Transaction) => {
        await storage.saveTransaction(tx);
        return tx;
    }
);

export const removeTransaction = createAsyncThunk(
    'transactions/removeTx',
    async (id: string) => {
        await storage.deleteTransaction(id);
        return id;
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch transactions';
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.items.unshift(action.payload); 
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index >= 0) {
                    state.items[index] = action.payload;
                    
                    state.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                }
            })
            .addCase(removeTransaction.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    },
});


export const selectTransactions = (state: RootState) => state.transactions.items;

export const selectFinancialOverview = createSelector(
    [selectTransactions],
    (transactions) => {
        const totals = transactions.reduce((acc, tx) => {
            if (tx.type === 'income') {
                acc.totalIncome += tx.amount;
            } else {
                acc.totalExpenses += tx.amount;
            }
            return acc;
        }, { totalIncome: 0, totalExpenses: 0 });

        const totalBalance = totals.totalIncome - totals.totalExpenses;
        const savingsRate = totals.totalIncome > 0
            ? Math.round(((totals.totalIncome - totals.totalExpenses) / totals.totalIncome) * 100)
            : 0;

        return {
            ...totals,
            totalBalance,
            savingsRate
        };
    }
);


export const selectTotals = createSelector(
    [selectFinancialOverview],
    (overview) => ({ income: overview.totalIncome, expense: overview.totalExpenses })
);

export const selectBalance = createSelector(
    [selectFinancialOverview],
    (overview) => overview.totalBalance
);

export default transactionSlice.reducer;
