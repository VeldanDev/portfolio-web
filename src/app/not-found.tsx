'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, FolderGit2, Mail, ArrowUpRight } from 'lucide-react';
import Magnetic from '@/components/interactive/Magnetic';

const C = {
  bg: '#0a0b0e', panel: '#101218', panel2: '#0d0f14', line: '#1c2029', line2: '#242a35',
  text: '#eaecef', muted: '#8a9099', dim: '#565c66', violet: '#8b7cff', cyan: '#45e0d0', lost: '#f5a524',
};
const SPECTRAL = 'linear-gradient(90deg,#8b7cff 0%,#6ea8ff 45%,#45e0d0 100%)';
const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export default function NotFound() {
  // Same 22-bar equalizer as the homepage signal panel, but flatlined: this
  // page is that panel's "offline" state, not a new visual invented for 404.
  const bars = Array.from({ length: 22 });

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100dvh' }}>
      <div
        className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center"
        style={{ fontFamily: 'var(--font-sans-body)' }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5, ease }}
          className="w-full max-w-sm rounded-xl border p-6 mb-8"
          style={{ borderColor: C.line, background: C.panel }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>
              signal / lost
            </span>
            <span className="flex items-center gap-1.5 text-[10px]" style={{ color: C.lost }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.lost }} />
              404
            </span>
          </div>

          {/* flatlined equalizer */}
          <div className="flex items-end gap-[3px] h-20 mb-5" aria-hidden>
            {bars.map((_, k) => (
              <span
                key={k}
                className="flex-1 rounded-full"
                style={{ height: '3px', background: C.line2 }}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2.5 font-mono text-[12px]" style={{ fontFamily: 'var(--font-plex-mono)' }}>
            <div className="flex items-center gap-3">
              <span style={{ color: C.dim }} className="w-16 shrink-0 text-left">route</span>
              <span style={{ color: C.text }} className="text-left">not found</span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: C.dim }} className="w-16 shrink-0 text-left">status</span>
              <span style={{ color: C.text }} className="text-left">no response</span>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.05, duration: 0.5, ease }}
          className="text-5xl sm:text-6xl font-bold tracking-tight mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          This page went dark
        </motion.h1>
        <motion.p
          initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1, duration: 0.5, ease }}
          className="text-sm max-w-sm mb-9" style={{ color: C.muted }}
        >
          Whatever you were looking for isn&apos;t at this address. It may have moved, or never existed.
        </motion.p>

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.15, duration: 0.5, ease }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Magnetic>
            <Link
              href="/"
              className="spec-btn group inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium"
              style={{ color: '#07080a', background: SPECTRAL }}
            >
              Back to home
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Magnetic>
          {LINKS.slice(1).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm border transition-colors duration-200"
              style={{ borderColor: C.line2, color: C.text, background: C.panel2 }}
            >
              <Icon size={15} strokeWidth={1.7} />
              {label}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
