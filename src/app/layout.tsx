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
    <html lang="en" className="dark antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('contractshield-theme');
                  if (t === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <footer className="text-center py-6 text-sm text-muted-foreground bg-transparent shrink-0">
            <p>⚖️ ContractShield — Not legal advice. Consult an attorney for legal decisions.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
