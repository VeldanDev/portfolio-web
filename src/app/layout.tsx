import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import CommandPalette from '@/components/CommandPalette';

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

export const metadata: Metadata = {
  title: 'Aditya Surya Putra — AI & Security Engineer',
  description:
    'AI Engineer, Cybersecurity Engineer, and Software Developer. I build autonomous AI agents, offensive security tooling, and production software.',
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
