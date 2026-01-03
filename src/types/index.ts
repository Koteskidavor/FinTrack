export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    category: string;
    description: string;
    date: string;
}

export interface Budget {
    category: string;
    limit: number;
    spent: number;
}

export interface CategoryStats {
    category: string;
    total: number;
    count: number;
}

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Other'];
export const EXPENSE_CATEGORIES = [
    'Housing', 'Food', 'Transport', 'Utilities',
    'Health', 'Entertainment', 'Shopping', 'Education', 'Other'
];
