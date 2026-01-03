import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    type ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Transaction } from '../../types';
import { formatCurrency } from '../../lib/formatters';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function SpendingTrendChart({ transactions }: { transactions: Transaction[] }) {
    const dataMap = transactions.reduce((acc, tx) => {
        if (tx.type === 'expense') {
            const date = tx.date;
            acc[date] = (acc[date] || 0) + tx.amount;
        }
        return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(dataMap)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30);

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-400">
                No data available
            </div>
        );
    }

    const chartData = {
        labels: data.map(d => {
            const date = new Date(d.date);
            return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
        }),
        datasets: [
            {
                label: 'Spent',
                data: data.map(d => d.amount),
                borderColor: '#6366F1', 
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2.5,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#6366F1',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1E293B',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    title: (context) => {
                        return context[0].label;
                    },
                    label: (context) => {
                        const value = context.parsed.y || 0;
                        return ` Spent: ${formatCurrency(value)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94A3B8',
                    font: {
                        size: 11
                    },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 7
                },
                border: {
                    display: false
                }
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
                ticks: {
                    color: '#94A3B8',
                    font: {
                        size: 11
                    },
                    callback: (value) => `$${value}`
                },
                border: {
                    display: false,
                    dash: [4, 4]
                }
            }
        }
    };

    return (
        <div className="w-full h-64 min-w-0" style={{ minHeight: '250px' }}>
            <Line data={chartData} options={options} />
        </div>
    );
}
