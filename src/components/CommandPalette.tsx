'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Command as CmdIcon, Home, User, FolderGit2, LayoutDashboard, Trophy, Mail, Bot,
  GitBranch, Package, Copy, ArrowUpRight, Search, CornerDownLeft,
} from 'lucide-react';

const SPECTRAL = 'linear-gradient(90deg,#8b7cff,#45e0d0)';
const C = { panel: '#101218', panel2: '#0d0f14', line: '#1c2029', line2: '#242a35', text: '#eaecef', muted: '#8a9099', dim: '#565c66', violet: '#8b7cff' };

type Item = {
  id: string; label: string; hint?: string; group: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  run: (r: ReturnType<typeof useRouter>) => void; keywords?: string;
};

const EMAIL = 'yasurtraadityasuryaputra09@gmail.com';

const ITEMS: Item[] = [
  { id: 'home', label: 'Home', group: 'Navigate', icon: Home, run: (r) => r.push('/') },
  { id: 'about', label: 'About', group: 'Navigate', icon: User, run: (r) => r.push('/about') },
  { id: 'projects', label: 'Projects', group: 'Navigate', icon: FolderGit2, run: (r) => r.push('/projects') },
  { id: 'dashboard', label: 'Live Dashboard', group: 'Navigate', icon: LayoutDashboard, run: (r) => r.push('/dashboard'), keywords: 'stats github wakatime' },
  { id: 'achievements', label: 'Achievements', group: 'Navigate', icon: Trophy, run: (r) => r.push('/achievements') },
  { id: 'smart-talk', label: 'Smart Talk', group: 'Navigate', icon: Bot, run: (r) => r.push('/smart-talk'), keywords: 'ai chat assistant' },
  { id: 'contact', label: 'Contact', group: 'Navigate', icon: Mail, run: (r) => r.push('/contact') },

  { id: 'github', label: 'Open GitHub', hint: 'VeldanDev', group: 'Actions', icon: GitBranch, run: () => window.open('https://github.com/VeldanDev', '_blank') },
  { id: 'npm', label: 'View Scepter on npm', hint: 'scepter-mcp', group: 'Actions', icon: Package, run: () => window.open('https://www.npmjs.com/package/scepter-mcp', '_blank') },
  { id: 'email', label: 'Copy email', hint: EMAIL, group: 'Actions', icon: Copy, keywords: 'contact mail', run: () => { navigator.clipboard?.writeText(EMAIL); } },

  { id: 'p-scepter', label: 'Scepter', hint: 'AI tooling · CLI', group: 'Projects', icon: ArrowUpRight, keywords: 'mcp npm', run: () => window.open('https://github.com/VeldanDev/scepter', '_blank') },
  { id: 'p-spencer', label: 'SpencerWeb', hint: 'Security · scanner', group: 'Projects', icon: ArrowUpRight, keywords: 'owasp vuln', run: () => window.open('https://github.com/VeldanDev/SpencerWeb', '_blank') },
  { id: 'p-specter', label: 'Specter 2.0', hint: 'OSINT · recon', group: 'Projects', icon: ArrowUpRight, keywords: 'osint', run: () => window.open('https://github.com/VeldanDev/specter-2.0', '_blank') },
  { id: 'p-shift', label: 'Shift Drives', hint: 'Web · live', group: 'Projects', icon: ArrowUpRight, run: () => window.open('https://shift-drives.vercel.app', '_blank') },
];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ITEMS;
    return ITEMS.filter((it) =>
      (it.label + ' ' + (it.hint ?? '') + ' ' + (it.keywords ?? '') + ' ' + it.group).toLowerCase().includes(s),
    );
  }, [q]);

  const close = useCallback(() => { setOpen(false); setQ(''); setActive(0); }, []);

  const choose = useCallback((it: Item) => {
    it.run(router);
    if (it.id === 'email') { setCopied(true); setTimeout(() => setCopied(false), 1400); return; }
    close();
  }, [router, close]);

  // global shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !open && !/input|textarea/i.test((e.target as HTMLElement)?.tagName))) {
        e.preventDefault(); setOpen((o) => !o);
      } else if (e.key === 'Escape') { close(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 20); }, [open]);
  useEffect(() => { setActive(0); }, [q]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[active]) choose(results[active]); }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  // group in order
  const groups = ['Navigate', 'Actions', 'Projects'];

  return (
    <>
      {/* discovery trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="fixed z-50 bottom-5 right-5 md:bottom-6 md:right-6 flex items-center gap-2 px-3.5 py-2.5 rounded-full border text-xs shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
        style={{ borderColor: C.line2, background: C.panel, color: C.muted }}
      >
        <CmdIcon size={13} strokeWidth={1.8} />
        <span className="hidden sm:inline" style={{ fontFamily: 'var(--font-plex-mono)' }}>K to explore</span>
      </button>

      {!open ? null : (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
          style={{ background: 'rgba(5,6,9,0.72)' }}
          onClick={close}
        >
          <div
            className="w-full max-w-[560px] rounded-2xl border overflow-hidden spec-cmdk"
            style={{ borderColor: C.line2, background: C.panel, boxShadow: '0 24px 80px -24px rgba(0,0,0,0.8)' }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onListKey}
          >
            {/* search */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: C.line }}>
              <Search size={16} style={{ color: C.dim }} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pages, actions, projects…"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: C.text }}
              />
              <kbd className="px-1.5 py-0.5 text-[10px] rounded border" style={{ borderColor: C.line2, color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>esc</kbd>
            </div>

            {/* results */}
            <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
              {results.length === 0 && (
                <p className="px-4 py-6 text-sm text-center" style={{ color: C.dim }}>No matches.</p>
              )}
              {groups.map((g) => {
                const items = results.filter((r) => r.group === g);
                if (!items.length) return null;
                return (
                  <div key={g} className="mb-1">
                    <p className="px-4 py-1.5 text-[10px] uppercase tracking-[0.2em]" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>{g}</p>
                    {items.map((it) => {
                      const idx = results.indexOf(it);
                      const on = idx === active;
                      const Icon = it.icon;
                      return (
                        <button
                          key={it.id}
                          data-idx={idx}
                          onMouseMove={() => setActive(idx)}
                          onClick={() => choose(it)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                          style={{ background: on ? 'rgba(139,124,255,0.12)' : 'transparent', color: on ? C.text : C.muted }}
                        >
                          <Icon size={15} strokeWidth={1.7} />
                          <span className="flex-1 text-sm">{it.label}</span>
                          {it.id === 'email' && copied && <span className="text-[11px]" style={{ color: '#3ee6a0' }}>copied</span>}
                          {it.hint && !(it.id === 'email' && copied) && (
                            <span className="text-[11px] truncate max-w-[180px]" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>{it.hint}</span>
                          )}
                          {on && <CornerDownLeft size={13} style={{ color: C.violet }} />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* footer */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t text-[10px]" style={{ borderColor: C.line, color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>
              <span className="flex items-center gap-1"><kbd className="px-1 rounded border" style={{ borderColor: C.line2 }}>↑↓</kbd> navigate</span>
              <span className="flex items-center gap-1"><kbd className="px-1 rounded border" style={{ borderColor: C.line2 }}>↵</kbd> open</span>
              <span className="ml-auto h-3 w-8 rounded-full" style={{ background: SPECTRAL }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
