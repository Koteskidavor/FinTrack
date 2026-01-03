const API_URL = import.meta.env.DEV ? '/v1/chat/completions' : 'https://router.huggingface.co/v1/chat/completions';

export const getHuggingFaceToken = (): string | null => {
    return (import.meta.env.VITE_HF_API_TOKEN as string) || null;
};

export const chatCompletion = async (model: string, messages: { role: string; content: string }[], max_tokens: number = 500) => {
    const token = getHuggingFaceToken();
    if (!token) {
        throw new Error("Hugging Face API token is missing. Please set it in your .env file.");
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages,
            max_tokens,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    return response.json();
};
