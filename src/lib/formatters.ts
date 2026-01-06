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
export const formatDateDisplay = (dateString: string): string => {
    const [year, month, day] = dateString.split("-")
    return `${day}-${month}-${year}`
};

const pad = (n: number) => {
    return n.toString().padStart(2, "0");
}

export function formatDDMMYYYY(date: Date) {
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}


export function parseDDMMYYYY(value: string) {
    const [d, m, y] = value.split("-").map(Number);
    if (!d || !m || !y) return null;
    return new Date(y, m - 1, d);
}

export function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

export function moveDate(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

