import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../hooks/store';
import { selectBudgetProgress } from './budgetSlice';
import { useToast } from '../../components/ui/toast';
import { formatCurrency } from '../../lib/formatters';

export function BudgetObserver() {
    const budgets = useAppSelector(selectBudgetProgress);
    const { showToast } = useToast();

    
    
    const notifiedRef = useRef<Record<string, string>>({});

    useEffect(() => {
        const currentMonth = new Date().toISOString().substring(0, 7);

        budgets.forEach(budget => {
            const cacheKey = `${budget.category}-${currentMonth}`;

            
            if (budget.percent >= 100 && notifiedRef.current[cacheKey] !== 'exceeded') {
                showToast(
                    'Budget Exceeded!',
                    `You have spent ${formatCurrency(budget.spent)} on "${budget.category}", which is over your ${formatCurrency(budget.limit)} limit.`,
                    'warning'
                );
                notifiedRef.current[cacheKey] = 'exceeded';
            }
            
            else if (budget.percent >= 90 && budget.percent < 100 && notifiedRef.current[cacheKey] !== 'warning' && notifiedRef.current[cacheKey] !== 'exceeded') {
                showToast(
                    'Budget Warning',
                    `You have reached ${Math.round(budget.percent)}% of your "${budget.category}" budget (${formatCurrency(budget.spent)} / ${formatCurrency(budget.limit)}).`,
                    'info'
                );
                notifiedRef.current[cacheKey] = 'warning';
            }
        });
    }, [budgets, showToast]);

    return null; 
}
