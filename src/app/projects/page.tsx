'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GitBranch, ArrowUpRight, FileText } from 'lucide-react';
import CountUp from '@/components/CountUp';
import Tilt from '@/components/interactive/Tilt';
import { PROJECTS, FILTERS, CAT_COLOR, ST_META, type Project, type Cat } from '@/lib/projects';

/* ── Spectral palette ────────────────────────────────────────────────────── */
const C = {
  bg: '#0a0b0e', panel: '#101218', panel2: '#0d0f14', line: '#1c2029', line2: '#242a35',
  text: '#eaecef', muted: '#8a9099', dim: '#565c66',
  violet: '#8b7cff', cyan: '#45e0d0', blue: '#6ea8ff', live: '#3ee6a0', wip: '#f5a524', done: '#6ea8ff',
};
const SPECTRAL = 'linear-gradient(90deg,#8b7cff 0%,#6ea8ff 45%,#45e0d0 100%)';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const cardV = { hidden: { opacity: 0, y: 14, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, scale: 0.98 } };
const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

function Card({ p, i }: { p: Project; i: number }) {
  const cat = CAT_COLOR[p.cat];
  const st = ST_META[p.status];
  return (
    <motion.div
      layout variants={cardV} initial="hidden" animate="visible" exit="exit"
      transition={{ delay: i * 0.04, duration: 0.4, ease }}
      className={p.featured ? 'sm:col-span-2' : undefined}
    >
    <Tilt max={4} scale={1.008}>
    <article
      className="spec-card group relative flex flex-col rounded-xl border p-6 overflow-hidden h-full"
      style={{ borderColor: C.line, background: C.panel }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {p.featured && (
            <span className="px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase rounded"
              style={{ color: '#07080a', background: SPECTRAL }}>featured</span>
          )}
          <span className="px-2.5 py-1 text-[10px] tracking-[0.13em] uppercase rounded-md border"
            style={{ color: cat, borderColor: `${cat}44`, background: `${cat}12` }}>{p.catLabel}</span>
        </div>
        <span className="flex items-center gap-1.5 text-[10px]" style={{ color: st.c }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.c }} />{st.l}
        </span>
      </div>

      {p.image && (
        <div className="rounded-lg overflow-hidden border mb-4" style={{ borderColor: C.line }}>
          <Image src={p.image} alt={p.title} width={720} height={360} className="w-full h-auto object-cover" />
        </div>
      )}

      <h3 className={`font-semibold mb-2 ${p.featured ? 'text-2xl' : 'text-lg'}`}
        style={{ fontFamily: 'var(--font-display)', color: C.text }}>{p.title}</h3>
      <p className="text-[13px] leading-relaxed mb-5 flex-1" style={{ color: C.muted }}>{p.desc}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {p.stack.map((s) => (
          <span key={s} className="px-2 py-0.5 text-[10px] rounded border"
            style={{ borderColor: C.line, background: C.panel2, color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>{s}</span>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: C.line }}>
        {p.github && (
          <a href={p.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity" style={{ color: C.muted }}>
            <GitBranch size={13} /> Source
          </a>
        )}
        {p.demo && (
          <a href={p.demo} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity" style={{ color: C.muted }}>
            <ArrowUpRight size={13} /> {p.demo.includes('npm') ? 'npm' : 'Live'}
          </a>
        )}
        {!p.github && !p.demo && (
          <span className="text-xs" style={{ color: C.dim }}>Private / local build</span>
        )}
        {p.caseStudy && (
          <Link href={`/projects/${p.id}`}
            className="ml-auto flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity" style={{ color: C.violet }}>
            <FileText size={13} /> Case study
          </Link>
        )}
      </div>
      <span className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-500" style={{ background: SPECTRAL }} />
    </article>
    </Tilt>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [f, setF] = useState<'all' | Cat>('all');
  const visible = PROJECTS.filter((p) => f === 'all' || p.cat === f);
  const counts = {
    total: PROJECTS.length,
    live: PROJECTS.filter((p) => p.status === 'live').length,
    ai: PROJECTS.filter((p) => p.cat === 'ai').length,
    security: PROJECTS.filter((p) => p.cat === 'security').length,
  };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100dvh', fontFamily: 'var(--font-sans-body)' }}>
      <div className="px-6 md:px-10 py-16 md:py-20 max-w-5xl mx-auto">

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, ease }} className="mb-8">
          <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>/ projects</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3" style={{ fontFamily: 'var(--font-display)' }}>Everything I&apos;ve built</h1>
          <p className="text-sm" style={{ color: C.muted }}>AI systems, security tools, and software, shipped to real repos.</p>
        </motion.div>

        {/* stat bar */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.06, duration: 0.5, ease }}
          className="grid grid-cols-4 rounded-xl border mb-8 overflow-hidden" style={{ borderColor: C.line, background: C.panel }}>
          {[
            { v: counts.total, l: 'Projects', c: C.text },
            { v: counts.live, l: 'Live', c: C.live },
            { v: counts.ai, l: 'AI', c: C.violet },
            { v: counts.security, l: 'Security', c: C.cyan },
          ].map((s, k) => (
            <div key={s.l} className={`px-4 py-4 ${k ? 'border-l' : ''}`} style={{ borderColor: C.line }}>
              <div className="text-2xl font-bold tabular-nums" style={{ color: s.c, fontFamily: 'var(--font-display)' }}><CountUp to={s.v} /></div>
              <div className="text-[11px] mt-0.5" style={{ color: C.dim }}>{s.l}</div>
            </div>
          ))}
        </motion.div>

        {/* filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1, duration: 0.5, ease }}
          className="flex flex-wrap items-center gap-2 mb-8">
          {FILTERS.map(({ v, l }) => {
            const on = f === v;
            return (
              <button key={v} onClick={() => setF(v)}
                className="px-3.5 py-1.5 text-xs rounded-lg border transition-colors duration-200"
                style={on
                  ? { borderColor: 'transparent', background: SPECTRAL, color: '#07080a', fontWeight: 600 }
                  : { borderColor: C.line, background: C.panel2, color: C.muted }}>
                {l}
              </button>
            );
          })}
          <span className="ml-auto text-[11px] tabular-nums" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>
            {visible.length} / {PROJECTS.length}
          </span>
        </motion.div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => <Card key={p.id} p={p} i={i} />)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
