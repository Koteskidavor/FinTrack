import type { Transaction, Budget } from '../types';

interface AggregatedContext {
    totalIncome: number;
    totalExpenses: number;
    savingsRate: number;
}

export interface FinancialSummary extends AggregatedContext {
    topCategories: { category: string; amount: number }[];
    budgetStatus: { category: string; percent: number }[];
}

export const aggregateData = (
    transactions: Transaction[],
    budgets: Budget[],
    overview: AggregatedContext
): FinancialSummary => {
    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    const topCategories = Object.entries(expensesByCategory)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    const budgetStatus = budgets.map(b => {
        const spent = expensesByCategory[b.category] || 0;
        return {
            category: b.category,
            percent: (spent / b.limit) * 100
        };
    });

    return {
        ...overview,
        topCategories,
        budgetStatus
    };
};

import { chatCompletion, getHuggingFaceToken } from './huggingface';

export const generateAIInsights = async (summary: FinancialSummary): Promise<string> => {
    const token = getHuggingFaceToken();
    if (!token) {
        throw new Error("Hugging Face API token is missing. Please set it in your .env file.");
    }

    const { totalIncome, totalExpenses, savingsRate, topCategories, budgetStatus } = summary;

    const topCatStr = topCategories.map((c: any) => `${c.category}: €${c.amount}`).join(', ');
    const budgetStr = budgetStatus.map((b: any) => `${Math.round(b.percent)}% of limit used`).join(', ');

    const systemPrompt = `You are a friendly, encouraging, and educational Personal Finance Tutor called "Budget Tutor".
Your goal is to analyze the user's financial summary and provide actionable, supportive advice.
Vibe: Friendly, professional, uses emojis, emphasizes educational growth.

FORMATTING RULES:
1. Use clear, bold Markdown headers (##).
2. Use plenty of whitespace (double line breaks) between sections to avoid "walls of text".
3. Use bullet points for lists to make them scannable.
4. Bold key terms or numbers for emphasis.
5. Use Euro (€) for currency.

STRUCTURE:
## 👋 Introduction
A warm, brief greeting.

## 📊 Financial Snapshot
2-3 scannable bullet points about their current performance (income vs. expenses).

## 💡 Growth Tip
Explain one financial concept (e.g., the 50/30/20 rule, emergency funds, or inflation) clearly and simply.

## 🎯 Challenge of the Week
A specific, actionable small task they can do right now.

## ✨ Encouragement
A short, inspiring sign-off.

Keep the tone encouraging even if they are overspending. Do not mention specific transaction IDs.`;

    const userPrompt = `User's Financial Summary:
- Total Income: €${totalIncome}
- Total Expenses: €${totalExpenses}
- Savings Rate: ${savingsRate}%
- Top Spending Categories: ${topCatStr}
- Budget Status per Category: ${budgetStr}`;

    try {
        const response = await chatCompletion(
            'meta-llama/Llama-3.2-3B-Instruct',
            [{ role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }],
            600
        );

        return response.choices[0].message.content || 'I processed your data but couldn\'t generate a specific insight. Try again?';
    } catch (error) {
        const err = error as Error;
        console.error("HF API Error Detail:", err);

        
        if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
            throw new Error("API Token is invalid or missing. Please check your .env file.");
        }

        if (err.message?.includes("400")) {
            throw new Error("The AI model is currently unavailable on your current provider quota. Please try again soon.");
        }

        throw new Error("Oops! The Budget Tutor is having trouble connecting to the AI brain. Please try again in a moment.");
    }
};
