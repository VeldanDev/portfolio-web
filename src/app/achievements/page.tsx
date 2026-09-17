'use client';

import { motion } from 'framer-motion';
import { Award, Package, ShieldCheck, GitBranch, GraduationCap, Target, ExternalLink, Trophy } from 'lucide-react';

const C = {
  bg: '#0a0b0e', panel: '#101218', panel2: '#0d0f14', line: '#1c2029', line2: '#242a35',
  text: '#eaecef', muted: '#8a9099', dim: '#565c66', violet: '#8b7cff', cyan: '#45e0d0', live: '#3ee6a0', wip: '#f5a524',
};
const SPECTRAL = 'linear-gradient(90deg,#8b7cff 0%,#6ea8ff 45%,#45e0d0 100%)';
const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const view = { once: true, margin: '-60px' } as const;

/* Real, honest milestones already earned */
const MILESTONES = [
  { icon: Package, title: 'Published Scepter on npm', meta: 'scepter-mcp · open source', color: C.violet, href: 'https://www.npmjs.com/package/scepter-mcp' },
  { icon: ShieldCheck, title: 'SpencerWeb OWASP scanner', meta: 'Final project · web security', color: C.cyan, href: 'https://github.com/VeldanDev/SpencerWeb' },
  { icon: GitBranch, title: '18+ repositories shipped', meta: 'AI, security & software', color: '#6ea8ff', href: 'https://github.com/VeldanDev' },
  { icon: GraduationCap, title: 'Tech educator', meta: '@veldorable · explaining tech', color: C.live, href: 'https://www.tiktok.com/@veldorable' },
];

/* Credentials being pursued — honestly marked, filled with real badges as earned */
const PURSUING = [
  { name: 'Cisco Ethical Hacker', track: 'Security', status: 'in progress', color: C.cyan },
  { name: 'TryHackMe learning path', track: 'Security', status: 'in progress', color: C.cyan },
  { name: 'Kaggle: Intro to Machine Learning', track: 'AI / ML', status: 'planned', color: C.violet },
  { name: 'freeCodeCamp: ML with Python', track: 'AI / ML', status: 'planned', color: C.violet },
  { name: 'Google Cybersecurity Certificate', track: 'Security', status: 'planned', color: C.cyan },
  { name: 'Microsoft Azure Fundamentals', track: 'Cloud', status: 'planned', color: '#6ea8ff' },
];

export default function AchievementsPage() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100dvh', fontFamily: 'var(--font-sans-body)' }}>
      <div className="px-6 md:px-10 py-16 md:py-20 max-w-5xl mx-auto">

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, ease }} className="mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>/ achievements</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3" style={{ fontFamily: 'var(--font-display)' }}>Proof, not promises</h1>
          <p className="text-sm max-w-lg" style={{ color: C.muted }}>Shipped work, credentials, and the badges I&apos;m earning. Everything here links to something you can verify.</p>
        </motion.div>

        {/* Milestones */}
        <section className="mb-14">
          <p className="text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>milestones</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {MILESTONES.map((m, k) => {
              const Icon = m.icon;
              return (
                <motion.a
                  key={m.title} href={m.href} target="_blank" rel="noopener noreferrer"
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
                  transition={{ delay: k * 0.06, duration: 0.5, ease }}
                  className="spec-card group relative flex items-start gap-4 rounded-xl border p-5 overflow-hidden"
                  style={{ borderColor: C.line, background: C.panel }}
                >
                  <span className="flex items-center justify-center w-11 h-11 rounded-lg border shrink-0"
                    style={{ borderColor: C.line2, background: C.panel2, color: m.color }}>
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold mb-1 flex items-center gap-1.5" style={{ color: C.text }}>
                      {m.title}
                      <ExternalLink size={12} style={{ color: C.dim }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs" style={{ color: C.muted }}>{m.meta}</p>
                  </div>
                  <span className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-500" style={{ background: SPECTRAL }} />
                </motion.a>
              );
            })}
          </div>
        </section>

        {/* Pursuing / roadmap */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <Target size={14} style={{ color: C.violet }} />
            <p className="text-[11px] tracking-[0.2em] uppercase" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>certifications in progress</p>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.line, background: C.panel }}>
            {PURSUING.map((p, k) => (
              <motion.div
                key={p.name}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
                transition={{ delay: k * 0.04, duration: 0.4, ease }}
                className="flex items-center gap-3 px-5 py-3.5"
                style={{ borderTop: k ? `1px solid ${C.line}` : 'none' }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.status === 'in progress' ? C.wip : C.dim }} />
                <span className="text-sm flex-1" style={{ color: C.text }}>{p.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded border" style={{ color: p.color, borderColor: `${p.color}33`, background: `${p.color}10`, fontFamily: 'var(--font-plex-mono)' }}>{p.track}</span>
                <span className="text-[11px] w-20 text-right" style={{ color: p.status === 'in progress' ? C.wip : C.dim, fontFamily: 'var(--font-plex-mono)' }}>{p.status}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Badge embed slots */}
        <section>
          <p className="text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>verified badges</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'TryHackMe', note: 'Public profile & rank badge', icon: ShieldCheck, color: C.cyan },
              { name: 'Credly', note: 'Cisco · Microsoft · IBM badges', icon: Award, color: C.violet },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.name} className="rounded-xl border border-dashed p-6 flex flex-col items-center text-center gap-2"
                  style={{ borderColor: C.line2, background: C.panel2 }}>
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: `${b.color}12`, color: b.color }}>
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <span className="text-sm font-semibold" style={{ color: C.text }}>{b.name}</span>
                  <span className="text-xs" style={{ color: C.dim }}>{b.note}</span>
                  <span className="mt-1 text-[10px]" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>connects once you earn your first badge</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs" style={{ color: C.dim }}>
            <Trophy size={13} style={{ color: C.wip }} />
            <span>New certificates and badges appear here automatically as I earn them.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
