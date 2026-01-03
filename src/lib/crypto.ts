const ALGORITHM = 'AES-GCM';
const KEY_STORAGE_NAME = 'pf_app_key';

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
};

export const getEncryptionKey = async (): Promise<CryptoKey> => {
    const jwk = localStorage.getItem(KEY_STORAGE_NAME);

    if (!jwk) {
        const key = await window.crypto.subtle.generateKey(
            { name: ALGORITHM, length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
        const exported = await window.crypto.subtle.exportKey('jwk', key);
        localStorage.setItem(KEY_STORAGE_NAME, JSON.stringify(exported));
        return key;
    }

    return window.crypto.subtle.importKey(
        'jwk',
        JSON.parse(jwk),
        { name: ALGORITHM },
        true,
        ['encrypt', 'decrypt']
    );
};

export const encryptData = async (data: unknown): Promise<{ iv: string; content: string }> => {
    const key = await getEncryptionKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(data));

    const encryptedContent = await window.crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        key,
        encodedData
    );

    return {
        iv: arrayBufferToBase64(iv.buffer),
        content: arrayBufferToBase64(encryptedContent),
    };
};

export const decryptData = async (encrypted: { iv: string; content: string }): Promise<unknown> => {
    const key = await getEncryptionKey();
    const iv = base64ToArrayBuffer(encrypted.iv);
    const data = base64ToArrayBuffer(encrypted.content);

    const decrypted = await window.crypto.subtle.decrypt(
        { name: ALGORITHM, iv },
        key,
        data
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
};
