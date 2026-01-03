import { format } from 'date-fns';

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount);
};

export const formatDate = (dateString: string): string => {
    try {
        return format(new Date(dateString), 'd. MMM, yyyy');
    } catch {
        return 'Invalid Date';
    }
};
