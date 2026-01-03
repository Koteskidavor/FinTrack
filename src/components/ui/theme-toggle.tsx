import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem('theme') as 'light' | 'dark' || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative h-8 w-14 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle Dark Mode"
        >
            <div
                className={`absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                    }`}
            >
                {theme === 'dark' ? (
                    <Moon className="h-3.5 w-3.5 text-slate-700" />
                ) : (
                    <Sun className="h-3.5 w-3.5 text-yellow-500" />
                )}
            </div>
        </button>
    );
}
