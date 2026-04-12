import type { Metadata } from 'next';
import './globals.css';
import { SileoToaster } from '@/components/SileoToaster';

export const metadata: Metadata = {
  title: 'Biref Explorer: Database scanner UI',
  description:
    'Scan any database, inspect relationships in both directions, and build typed queries with @biref/scanner.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-ink font-sans antialiased">
        {children}
        <SileoToaster />
      </body>
    </html>
  );
}
