import { describe, it, expect, vi, beforeEach } from 'vitest';
import { encryptData, decryptData } from './crypto';


const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});


describe('Encryption Utilities', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('should encrypt and decrypt data correctly', async () => {
        const secret = { secret: 'message', amount: 100 };

        const encrypted = await encryptData(secret);
        expect(encrypted).toHaveProperty('iv');
        expect(encrypted).toHaveProperty('content');
        expect(encrypted.content).not.toBe(JSON.stringify(secret));

        const decrypted = await decryptData(encrypted);
        expect(decrypted).toEqual(secret);
    });
});
