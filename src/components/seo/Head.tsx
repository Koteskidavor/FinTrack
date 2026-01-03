import { Helmet } from 'react-helmet-async';

interface HeadProps {
    title?: string;
    description?: string;
}

export function Head({ title = 'FinTrack', description = 'Personal Finance & Budgeting App' }: HeadProps) {
    return (
        <Helmet>
            <title>{title} | FinTrack</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={`${title} | FinTrack`} />
            <meta property="og:description" content={description} />
            <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
            <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        </Helmet>
    );
}
