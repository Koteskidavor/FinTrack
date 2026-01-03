import { useState, lazy, Suspense } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { useAppSelector } from '../hooks/store';
import { selectBudgets } from '../features/budget/budgetSlice';
import { selectFinancialOverview } from '../features/transactions/transactionSlice';
import { aggregateData, generateAIInsights } from '../lib/budget-tutor';
import { Bot, Sparkles, RefreshCw, BrainCircuit } from 'lucide-react';

const ReactMarkdown = lazy(() => import('react-markdown'));

const FadeIn = ({ children }: { children: React.ReactNode }) => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out fill-mode-forwards">
        {children}
    </div>
);

export default function InsightsPage() {
    const transactions = useAppSelector((state) => state.transactions.items);
    const budgets = useAppSelector(selectBudgets);
    const overview = useAppSelector(selectFinancialOverview);
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setInsight(null);
        setError(null);
        try {
            const summary = aggregateData(transactions, budgets, {
                totalIncome: overview.totalIncome,
                totalExpenses: overview.totalExpenses,
                savingsRate: overview.savingsRate
            });
            const result = await generateAIInsights(summary);
            setInsight(result);
        } catch (e) {
            const err = e as Error;
            console.error(err);
            setError(err.message || "Failed to generate insights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <BrainCircuit className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    Budget Tutor
                </h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="dark:bg-[#141B2B] dark:border-[#1E293B]/60 shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-2 pb-4 border-b border-slate-200 dark:border-[#1E293B]/60">
                            <Sparkles className="w-5 h-5 text-primary-600 dark:text-[#22D3EE]" />
                            <CardTitle className="text-slate-900 dark:text-[#F1F5F9] font-semibold">About Budget Tutor</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Our Budget Tutor analyzes your aggregated patterns to provide <strong>personalized</strong> growth tips and financial strategies.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-100 dark:border-blue-900/30 text-xs text-blue-700 dark:text-blue-300">
                                <strong>Privacy First:</strong> Your individual transactions stay on your device. Only category totals are analyzed by the Budget Tutor.
                            </div>
                            <Button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Analyze My Spending
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    {loading ? (
                        <Card className="min-h-[400px] flex flex-col items-center justify-center border-dashed dark:bg-[#141B2B] dark:border-[#1E293B]/60">
                            <div className="flex flex-col items-center space-y-4 animate-pulse">
                                <div className="relative">
                                    <Bot className="w-16 h-16 text-primary-300 dark:text-primary-800" />
                                    <RefreshCw className="w-6 h-6 text-primary-500 absolute -top-1 -right-1 animate-spin" />
                                </div>
                                <div className="text-slate-400 font-medium text-lg">FinTrack Bot is crunching the numbers...</div>
                                <p className="text-sm text-slate-500">This usually takes a few seconds.</p>
                            </div>
                        </Card>
                    ) : insight ? (
                        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-primary-200 dark:border-primary-900/40 shadow-md overflow-hidden relative dark:bg-[#141B2B]">
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary-700 dark:from-primary-500 dark:to-primary-700" />
                            <CardHeader className="flex flex-row items-center gap-2 pb-4 border-b border-slate-100 dark:border-[#1E293B]/60 bg-slate-50/50 dark:bg-slate-900/50">
                                <Bot className="w-6 h-6 text-primary-600 dark:text-[#22D3EE]" />
                                <CardTitle className="text-lg text-slate-800 dark:text-slate-200 font-bold">Analysis from FinTrack Bot</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <FadeIn>
                                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-[#F1F5F9] prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-primary-700 dark:prose-strong:text-[#22D3EE] prose-li:text-slate-700 dark:prose-li:text-slate-300">
                                        <Suspense fallback={<div className="h-20 animate-pulse bg-slate-100 dark:bg-slate-800 rounded" />}>
                                            <ReactMarkdown>{insight}</ReactMarkdown>
                                        </Suspense>
                                    </div>
                                </FadeIn>
                                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-[#1E293B]/60 text-[10px] text-slate-400 dark:text-[#64748B] flex justify-between items-center">
                                    <span>Disclaimer: This content is generated by AI for educational purposes.</span>
                                    <Button variant="ghost" size="sm" onClick={handleAnalyze} className="text-xs h-8 text-primary-600 dark:text-[#22D3EE] hover:text-primary-700 dark:hover:text-[#F1F5F9] hover:bg-primary-50 dark:hover:bg-[#1A2332]/50">
                                        <RefreshCw className="w-3 h-3 mr-1" /> Regenerate
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400 dark:text-[#64748B] border-2 border-dashed border-slate-200 dark:border-[#1E293B]/60 rounded-lg bg-slate-50/50 dark:bg-slate-900/30">
                            <Bot className="w-16 h-16 mb-4 opacity-10" />
                            <h3 className="text-lg font-medium mb-1">Ready to analyze</h3>
                            <p className="text-sm max-w-xs text-center">
                                Click 'Analyze My Spending' to get insights from your financial tutor.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
