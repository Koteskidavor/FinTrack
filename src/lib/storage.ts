import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import { encryptData, decryptData } from './crypto';

import type { Transaction } from '../types';

interface PersonalFinanceDB extends DBSchema {
    transactions: {
        key: string; 
        value: {
            id: string;
            data: { iv: string; content: string }; 
            createdAt: string;
            monthYear: string; 
        };
        indexes: { 'by-month': string };
    };
    budgets: {
        key: string;
        value: {
            category: string;
            data: { iv: string; content: string };
        };
    };
}

const DB_NAME = 'pf_app_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<PersonalFinanceDB>>;

export const getDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<PersonalFinanceDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
                txStore.createIndex('by-month', 'monthYear');

                db.createObjectStore('budgets', { keyPath: 'category' });
            },
        });
    }
    return dbPromise;
};



export const saveTransaction = async (tx: Transaction) => {
    const db = await getDB();
    const encrypted = await encryptData(tx);

    
    const monthYear = tx.date.substring(0, 7);

    await db.put('transactions', {
        id: tx.id,
        data: encrypted,
        createdAt: new Date().toISOString(),
        monthYear,
    });
};

export const getTransactionsByMonth = async (monthYear: string): Promise<Transaction[]> => {
    const db = await getDB();
    const results = await db.getAllFromIndex('transactions', 'by-month', monthYear);

    const decrypted = await Promise.all(
        results.map(async (row) => {
            try {
                return await decryptData(row.data);
            } catch (e) {
                console.error('Failed to decrypt transaction', row.id, e);
                return null;
            }
        })
    );

    return decrypted.filter(Boolean) as Transaction[];
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
    const db = await getDB();
    const results = await db.getAll('transactions');

    const decrypted = await Promise.all(
        results.map(async (row) => {
            try {
                return await decryptData(row.data);
            } catch (e) {
                console.error('Failed to decrypt transaction', row.id, e);
                return null;
            }
        })
    );
    return decrypted.filter(Boolean) as Transaction[];
};

export const deleteTransaction = async (id: string) => {
    const db = await getDB();
    await db.delete('transactions', id);
};
