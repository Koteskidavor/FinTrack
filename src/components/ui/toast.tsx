import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
    id: string;
    title: string;
    message?: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, title, message, type }]);

        
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "pointer-events-auto w-80 max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right-4",
                            {
                                "bg-white border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100": toast.type === 'info',
                                "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800/50 dark:text-emerald-400": toast.type === 'success',
                                "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-400": toast.type === 'warning',
                                "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-800/50 dark:text-rose-400": toast.type === 'error',
                            }
                        )}
                        role="alert"
                    >
                        <div className="flex gap-3">
                            <div className="shrink-0 mt-0.5">
                                {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                                {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm leading-tight">{toast.title}</p>
                                {toast.message && <p className="mt-1 text-xs opacity-90">{toast.message}</p>}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
