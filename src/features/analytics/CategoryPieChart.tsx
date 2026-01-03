import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { Transaction } from '../../types';
import { formatCurrency } from '../../lib/formatters';


ChartJS.register(ArcElement, Tooltip, Legend);


const COLORS = ['#22D3EE', '#34D399', '#FB7185', '#FBBF24', '#A78BFA', '#F472B6', '#64748B'];

export default function CategoryPieChart({ transactions }: { transactions: Transaction[] }) {
    const dataMap = transactions.reduce((acc, tx) => {
        if (tx.type === 'expense') {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        }
        return acc;
    }, {} as Record<string, number>);

    const sortedData = Object.entries(dataMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const totalExpenses = sortedData.reduce((sum, item) => sum + item.value, 0);

    if (sortedData.length === 0) {
        return <div className="h-64 flex items-center justify-center text-slate-400 dark:text-[#64748B]">No data available</div>;
    }

    const chartData = {
        labels: sortedData.map(d => d.name),
        datasets: [
            {
                data: sortedData.map(d => d.value),
                backgroundColor: COLORS,
                borderColor: 'transparent',
                borderWidth: 0,
                cutout: '75%',
                hoverOffset: 4
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    color: '#94A3B8', 
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return ` ${label}: ${formatCurrency(value)}`;
                    }
                },
                backgroundColor: '#1E293B', 
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 13
                },
                bodyFont: {
                    size: 13
                }
            }
        },
    };

    return (
        <div className="h-64 w-full min-w-0 relative" style={{ minHeight: '280px' }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0" style={{ paddingBottom: '40px' }}>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#64748B] font-semibold">Total Spent</div>
                <div className="text-xl font-bold text-slate-900 dark:text-[#F1F5F9]">{formatCurrency(totalExpenses)}</div>
            </div>

            <div className="h-full w-full relative z-10">
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
}
