import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import ThemeModeProvider from '@/theme/ThemeModeProvider';
import TopLoader from '@/components/TopLoader';

// Set data-theme before paint to avoid a flash of the wrong theme.
const themeInitScript = `(function(){try{var m=localStorage.getItem('theme-mode');document.documentElement.setAttribute('data-theme', m==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SiteScore AI - Website Analyzer',
  description: 'Analyze and improve your website performance',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={inter.className}>
        <ThemeModeProvider>
          <TopLoader />
          <AuthProvider>{children}</AuthProvider>
        </ThemeModeProvider>
      </body>
    </html>
  );
}
