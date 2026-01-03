import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, PieChart, GraduationCap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/theme-toggle';
import { ToastProvider } from '../ui/toast';

export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { href: '/', label: 'Overview', icon: LayoutDashboard },
        { href: '/transactions', label: 'Transactions', icon: Wallet },
        { href: '/budget', label: 'Budget', icon: PieChart },
        { href: '/insights', label: 'AI Insights', icon: GraduationCap },
    ];

    return (
        <ToastProvider>
            <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#0B1220]">
                <header className="md:hidden bg-white dark:bg-[#141B2B] border-b border-slate-200 dark:border-[#1E293B]/60 p-4 sticky top-0 z-10 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold text-primary-600 flex items-center gap-2">
                        <Wallet className="w-6 h-6" />
                        FinTrack
                    </Link>
                    <ThemeToggle />
                </header>

                <aside
                    className={cn(
                        "bg-white dark:bg-[#141B2B] border-r border-slate-200 dark:border-[#1E293B]/60 hidden md:flex flex-col sticky top-0 h-screen transition-all duration-300",
                        isSidebarOpen ? "w-64" : "w-16"
                    )}
                >
                    <div className="p-4 flex items-center justify-between overflow-hidden">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="flex items-center gap-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none"
                        >
                            <Wallet className="w-8 h-8 shrink-0" />
                            <span className={cn("transition-opacity duration-300 whitespace-nowrap", isSidebarOpen ? "opacity-100" : "opacity-0 w-0")}>
                                FinTrack
                            </span>
                        </button>
                    </div>
                    <nav className="flex-1 px-2 space-y-1 mt-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group border border-transparent",
                                        isActive
                                            ? "bg-primary-50 dark:bg-[#1A2332] text-primary-700 dark:text-[#22D3EE] border-primary-100 dark:border-[#22D3EE]/20"
                                            : "text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1A2332]/50 hover:text-slate-900 dark:hover:text-[#F1F5F9]",
                                        !isSidebarOpen && "justify-center"
                                    )}
                                    title={!isSidebarOpen ? item.label : undefined}
                                >
                                    <Icon className="w-5 h-5 shrink-0" />
                                    <span className={cn("transition-all duration-300 overflow-hidden whitespace-nowrap", isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0")}>
                                        {item.label}
                                    </span>

                                    {!isSidebarOpen && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100 dark:border-[#1E293B]/60 flex flex-col gap-4">
                        <div className={cn("flex items-center gap-3", isSidebarOpen ? "justify-start px-2" : "justify-center")}>
                            <ThemeToggle />
                            <span className={cn("text-sm font-medium text-slate-600 dark:text-[#94A3B8] transition-opacity duration-300 whitespace-nowrap", isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>
                                {isSidebarOpen && "Dark Mode"}
                            </span>
                        </div>

                        {isSidebarOpen && (
                            <div className="text-xs text-slate-400 dark:text-[#64748B] transition-opacity duration-300">
                                Local-first & Secure
                            </div>
                        )}
                    </div>
                </aside>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto mb-16 md:mb-0">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>

                { }
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#141B2B] border-t border-slate-200 dark:border-[#1E293B]/60 p-2 flex justify-around z-20 pb-safe">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-2 rounded-md text-xs font-medium transition-colors",
                                    isActive
                                        ? "text-primary-600 dark:text-primary-400"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </ToastProvider>
    );
}
