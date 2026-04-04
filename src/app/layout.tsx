import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ContractShield - Understand Before You Sign',
  description:
    'AI-powered contract analysis that highlights red flags, negotiation points, and gives you a trust score.',
  keywords: ['contract analysis', 'legal tech', 'AI contract review'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className={inter.className}>
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <footer className="text-center py-8 text-sm text-gray-500 dark:text-gray-400 bg-transparent shrink-0">
            <p>⚖️ ContractShield - Not legal advice. Consult an attorney for legal decisions.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
