import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { AccessibilityProvider } from '../context/AccessibilityContext';
import { StadiumProvider } from '../context/StadiumContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'StadiumIQ AI - FIFA World Cup 2026 Operations Console',
  description: 'AI-Powered Smart Stadium and Tournament Operations Platform for the FIFA World Cup 2026.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans antialiased h-full bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-900`}>
        <AuthProvider>
          <AccessibilityProvider>
            <StadiumProvider>
              {children}
            </StadiumProvider>
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
