import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import CommandPalette from '@/components/CommandPalette';
import Cursor from '@/components/interactive/Cursor';

const display = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const sans = IBM_Plex_Sans({
  variable: '--font-sans-body',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const mono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

// No production domain until this deploys to Vercel — falls back to
// localhost rather than guessing a URL that doesn't exist yet. Set
// NEXT_PUBLIC_APP_URL (or VERCEL_URL, which Vercel sets automatically)
// once it's live.
const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3002');
const TITLE = 'Aditya Surya Putra · AI & Security Engineer';
const DESCRIPTION =
  'AI Engineer, Cybersecurity Engineer, and Software Developer. I build autonomous AI agents, offensive security tooling, and production software.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Aditya Surya Putra',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#0a0b0e]">
        <Cursor />
        <Sidebar />
        <MobileNav />
        <CommandPalette />
        <main className="md:ml-[240px] pb-[60px] md:pb-0">
          {children}
        </main>
      </body>
    </html>
  );
}
