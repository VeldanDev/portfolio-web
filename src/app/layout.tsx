import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aditya Surya Putra | Portfolio',
  description: 'Proof-of-work portfolio — Computer Engineering Student',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#0a0a0a]">
        <Sidebar />
        <MobileNav />
        {/* Offset right of sidebar on md+, add bottom padding on mobile for MobileNav */}
        <main className="md:ml-[240px] pb-[60px] md:pb-0">
          {children}
        </main>
      </body>
    </html>
  );
}
