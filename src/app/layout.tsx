import type { Metadata } from 'next';
import './globals.css';
import { SileoToaster } from '@/components/SileoToaster';
import { Analytics } from '@vercel/analytics/next';

const SITE_URL = 'https://biref.xyz';
const TITLE = 'Biref Explorer: Database scanner UI';
const DESCRIPTION =
  'Scan any database, inspect relationships in both directions, and build typed queries with @biref/scanner.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: [
    'database',
    'introspection',
    'schema',
    'typescript',
    'codegen',
    'postgres',
    'mysql',
    'query builder',
    'biref',
  ],
  authors: [{ name: 'RunCore Operations' }],
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Biref Explorer',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <Analytics />
      </body>
    </html>
  );
}
