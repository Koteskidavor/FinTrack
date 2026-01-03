import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './transactionSlice';
import { TransactionForm } from './TransactionForm';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../lib/storage', () => ({
    saveTransaction: vi.fn(),
    getAllTransactions: vi.fn().mockResolvedValue([]),
}));

const createTestStore = () => configureStore({
    reducer: {
        transactions: transactionReducer
    }
});

describe('TransactionForm', () => {
    it('renders form and submits transaction', async () => {
        const store = createTestStore();
        const onClose = vi.fn();

        render(
            <Provider store={store}>
                <TransactionForm onClose={onClose} />
            </Provider>
        );

        expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50.00' } });
        fireEvent.change(screen.getByPlaceholderText('What was this for?'), { target: { value: 'Groceries' } });

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Food' } });

        fireEvent.click(screen.getByRole('button', { name: /Add Transaction/i }));

        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
        });

        expect(store.getState().transactions.items).toHaveLength(1);
        expect(store.getState().transactions.items[0].amount).toBe(50);
    });
});
