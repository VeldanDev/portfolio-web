'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, GitBranch, Boxes, ShieldHalf, Cpu } from 'lucide-react';

/* ── Spectral palette (local, self-contained) ───────────────────────────── */
const C = {
  bg: '#0a0b0e',
  panel: '#101218',
  panel2: '#0d0f14',
  line: '#1c2029',
  line2: '#242a35',
  text: '#eaecef',
  muted: '#8a9099',
  dim: '#565c66',
  violet: '#8b7cff',
  cyan: '#45e0d0',
  live: '#3ee6a0',
  wip: '#f5a524',
};
const SPECTRAL = 'linear-gradient(90deg,#8b7cff 0%,#6ea8ff 45%,#45e0d0 100%)';

/* ── Name decode: rAF writes textContent (no per-frame React state) ──────── */
const GLYPHS = '01<>/\\{}#$%&*+=ABCDEF';

function DecodeName({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { node.textContent = text; return; }

    const DURATION = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      const revealed = Math.floor(p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') { out += ' '; continue; }
        out += i < revealed ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      node.textContent = out;
      if (p < 1) raf = requestAnimationFrame(tick);
      else node.textContent = text;
    };
    raf = requestAnimationFrame(tick);
    const safety = setTimeout(() => { node.textContent = text; }, DURATION + 250);
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
  }, [text]);

  return <span ref={ref} aria-label={text}>{text}</span>;
}

/* ── Cycling role ────────────────────────────────────────────────────────── */
const ROLES = ['AI Engineer', 'Cybersecurity Engineer', 'Software Developer', 'Security-tool Builder'];

function CyclingRole() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [mode, setMode] = useState<'type' | 'hold' | 'erase'>('type');
  const word = ROLES[i];

  useEffect(() => {
    let tm: ReturnType<typeof setTimeout>;
    if (mode === 'type') {
      if (n < word.length) tm = setTimeout(() => setN(n + 1), 55);
      else tm = setTimeout(() => setMode('hold'), 60);
    } else if (mode === 'hold') {
      tm = setTimeout(() => setMode('erase'), 2200);
    } else {
      if (n > 0) tm = setTimeout(() => setN(n - 1), 28);
      else { setI((i + 1) % ROLES.length); setMode('type'); }
    }
    return () => clearTimeout(tm);
  }, [mode, n, word, i]);

  return (
    <span>
      <span
        style={{
          backgroundImage: SPECTRAL,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 600,
        }}
      >
        {word.slice(0, n)}
      </span>
      <span className="spec-caret" style={{ background: C.cyan }} />
    </span>
  );
}

/* ── Spectrum "signal" panel (CSS keyframes, GPU scaleY) ─────────────────── */
function SignalPanel() {
  const bars = Array.from({ length: 28 });
  return (
    <div
      className="relative overflow-hidden rounded-xl border p-5"
      style={{ borderColor: C.line, background: C.panel }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: C.dim }}>
          signal / live
        </span>
        <span className="flex items-center gap-1.5 text-[10px]" style={{ color: C.live }}>
          <span className="spec-pulse w-1.5 h-1.5 rounded-full" style={{ background: C.live }} />
          online
        </span>
      </div>

      {/* Equalizer */}
      <div className="flex items-end gap-[3px] h-20 mb-5" aria-hidden>
        {bars.map((_, k) => (
          <span
            key={k}
            className="spec-bar flex-1 rounded-full"
            style={{
              background: SPECTRAL,
              animationDelay: `${(k % 14) * 90}ms`,
              transformOrigin: 'bottom',
              opacity: 0.55 + (k % 5) * 0.09,
            }}
          />
        ))}
      </div>

      {/* Signature rows */}
      <div className="flex flex-col gap-2.5 font-mono text-[12px]" style={{ fontFamily: 'var(--font-plex-mono)' }}>
        {[
          ['role', 'ai · security · software'],
          ['based', 'Medan, Indonesia'],
          ['shipping', 'agents · tools · web'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center gap-3">
            <span style={{ color: C.dim }} className="w-16 shrink-0">{k}</span>
            <span style={{ color: C.text }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const STACK = ['Python', 'TypeScript', 'Next.js', 'AI Agents / LLM', 'OSINT · Recon', 'Linux'];

const DOMAINS = [
  { icon: Cpu, label: 'AI Engineering', desc: 'Autonomous agents, tool-use, retrieval, automation.', color: C.violet },
  { icon: ShieldHalf, label: 'Cybersecurity', desc: 'OSINT, recon, vulnerability scanning, tooling.', color: C.cyan },
  { icon: Boxes, label: 'Software', desc: 'Full-stack products with Next.js and Python.', color: '#6ea8ff' },
];

const FEATURED = [
  {
    id: 'scepter',
    title: 'Scepter',
    tag: 'AI tooling',
    tagColor: C.violet,
    description:
      'Zero-dependency CLI that checks whether an MCP server is alive, maintained, and safe before you wire it into an agent. Published on npm as scepter-mcp.',
    stack: ['TypeScript', 'Node', 'MCP'],
    status: 'live' as const,
    github: 'https://github.com/VeldanDev/scepter',
    demo: 'https://www.npmjs.com/package/scepter-mcp',
  },
  {
    id: 'spencerweb',
    title: 'SpencerWeb',
    tag: 'Security',
    tagColor: C.cyan,
    description:
      'Web vulnerability scanner covering SQLi, XSS, CSRF, SSL and exposed files, mapped to the OWASP Top 10, with a live dashboard and auto-generated PDF reports.',
    stack: ['Python', 'OWASP', 'Express'],
    status: 'live' as const,
    github: 'https://github.com/VeldanDev/SpencerWeb',
    demo: null,
  },
  {
    id: 'agent',
    title: 'Autonomous AI Agent',
    tag: 'AI systems',
    tagColor: C.violet,
    description:
      'Self-hosted agent with 18 tools across voice, vision, and automation. Runs scheduled jobs, answers on Telegram, and drives real workflows end to end.',
    stack: ['Python', 'LLM', 'Agents'],
    status: 'wip' as const,
    github: null,
    demo: null,
  },
  {
    id: 'specter',
    title: 'Specter 2.0',
    tag: 'Security',
    tagColor: C.cyan,
    description:
      'CLI OSINT and reconnaissance framework for information gathering, built lean enough to run on a Raspberry Pi Zero.',
    stack: ['Python', 'OSINT', 'CLI'],
    status: 'live' as const,
    github: 'https://github.com/VeldanDev/specter-2.0',
    demo: null,
  },
];

const fadeUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } };
const view = { once: true, margin: '-60px' } as const;
const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function Home() {
  const glowRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Cursor-follow spectral glow — rAF + transform, pointer-fine only.
  useEffect(() => {
    const glow = glowRef.current, hero = heroRef.current;
    if (!glow || !hero) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, tx = 0, ty = 0;
    const move = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${tx - 260}px, ${ty - 260}px, 0)`;
        raf = 0;
      });
    };
    hero.addEventListener('pointermove', move);
    return () => { hero.removeEventListener('pointermove', move); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div style={{ background: C.bg, color: C.text }}>
      {/* ═══ HERO ═══ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden px-6 md:px-10 pt-16 md:pt-24 pb-20"
        style={{ fontFamily: 'var(--font-sans-body)' }}
      >
        {/* cursor glow */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute left-0 top-0 w-[520px] h-[520px] rounded-full opacity-40 hidden md:block"
          style={{
            background: 'radial-gradient(circle, rgba(139,124,255,0.16), rgba(69,224,208,0.06) 40%, transparent 70%)',
            willChange: 'transform',
          }}
          aria-hidden
        />
        {/* faint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              `linear-gradient(${C.line} 1px,transparent 1px),linear-gradient(90deg,${C.line} 1px,transparent 1px)`,
            backgroundSize: '46px 46px',
            maskImage: 'radial-gradient(circle at 30% 20%, black, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(circle at 30% 20%, black, transparent 75%)',
          }}
          aria-hidden
        />

        <div className="relative max-w-5xl mx-auto grid lg:grid-cols-[1fr_300px] gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border"
              style={{ borderColor: C.line2, background: C.panel2 }}
            >
              <span className="spec-pulse w-1.5 h-1.5 rounded-full" style={{ background: C.live }} />
              <span className="text-[11px] tracking-[0.18em]" style={{ color: C.muted }}>
                AVAILABLE FOR WORK
              </span>
            </motion.div>

            <h1
              className="font-bold leading-[0.95] tracking-[-0.03em] mb-5 text-[15vw] sm:text-6xl lg:text-[4.6rem]"
              style={{ fontFamily: 'var(--font-display)', color: C.text }}
            >
              <DecodeName text="Aditya" />
              <br />
              <span style={{ color: C.dim }}><DecodeName text="Surya Putra" /></span>
            </h1>

            {/* spectral prism sweep */}
            <div className="relative h-px w-full max-w-sm mb-7 overflow-hidden" style={{ background: C.line }}>
              <div className="spec-sweep absolute inset-y-0 w-1/3" style={{ background: SPECTRAL }} />
            </div>

            <div className="text-lg md:text-xl mb-6 h-8" style={{ fontFamily: 'var(--font-plex-mono)' }}>
              <CyclingRole />
            </div>

            <p
              className="max-w-lg text-[15px] leading-[1.85] mb-8" style={{ color: C.muted }}
            >
              I build at the edge of intelligence and security. My work spans{' '}
              <span style={{ color: C.text }}>autonomous AI agents</span>,{' '}
              <span style={{ color: C.text }}>offensive security tools</span> (OSINT, recon,
              vulnerability scanning), and{' '}
              <span style={{ color: C.text }}>production software</span>. I ship real tools that
              people actually run, not just demos.
            </p>

            <div className="flex flex-wrap gap-2 mb-9">
              {STACK.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 text-xs rounded-md border"
                  style={{ borderColor: C.line, background: C.panel2, color: C.muted, fontFamily: 'var(--font-plex-mono)' }}
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="spec-btn group inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium"
                style={{ color: '#07080a', background: SPECTRAL }}
              >
                View Projects
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm border transition-colors duration-200"
                style={{ borderColor: C.line2, color: C.text, background: C.panel2 }}
              >
                Live Dashboard
              </Link>
            </div>
          </div>

          {/* photo + signal panel */}
          <div className="flex flex-col gap-4">
            {/* spectral-framed portrait */}
            <div className="group relative mx-auto lg:mx-0 w-full max-w-[260px]">
              <div className="rounded-2xl p-[1.5px]" style={{ background: SPECTRAL }}>
                <div className="relative rounded-2xl overflow-hidden" style={{ background: C.panel2 }}>
                  <Image
                    src="/avatar.jpg"
                    alt="Aditya Surya Putra"
                    width={260}
                    height={300}
                    priority
                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-500"
                  />
                  {/* spectral wash */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30 group-hover:opacity-0 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(200deg, transparent 40%, rgba(10,11,14,0.55))' }}
                  />
                </div>
              </div>
            </div>
            <SignalPanel />
          </div>
        </div>
      </section>

      {/* ═══ DOMAINS ═══ */}
      <section className="px-6 md:px-10 pb-20" style={{ fontFamily: 'var(--font-sans-body)' }}>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-4">
          {DOMAINS.map(({ icon: Icon, label, desc, color }, k) => (
            <motion.div
              key={label}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
              transition={{ delay: k * 0.08, duration: 0.5, ease }}
              className="spec-card group relative rounded-xl border p-6 overflow-hidden"
              style={{ borderColor: C.line, background: C.panel }}
            >
              <span
                className="flex items-center justify-center w-10 h-10 rounded-lg border mb-4 transition-colors duration-300"
                style={{ borderColor: C.line2, background: C.panel2, color }}
              >
                <Icon size={18} strokeWidth={1.6} />
              </span>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: C.text }}>{label}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: C.muted }}>{desc}</p>
              <span
                className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: SPECTRAL }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURED ═══ */}
      <section className="px-6 md:px-10 pb-28" style={{ fontFamily: 'var(--font-sans-body)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
            transition={{ duration: 0.5, ease }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>
                selected work
              </p>
              <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: C.text }}>
                Things I&apos;ve shipped
              </h2>
            </div>
            <Link href="/projects" className="text-sm flex items-center gap-1 transition-colors duration-200" style={{ color: C.muted }}>
              All projects <ArrowUpRight size={14} />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURED.map((p, k) => (
              <motion.article
                key={p.id}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
                transition={{ delay: k * 0.07, duration: 0.5, ease }}
                className="spec-card group relative flex flex-col rounded-xl border p-6 overflow-hidden"
                style={{ borderColor: C.line, background: C.panel }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase rounded-md border"
                    style={{ color: p.tagColor, borderColor: `${p.tagColor}44`, background: `${p.tagColor}12` }}
                  >
                    {p.tag}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px]" style={{ color: p.status === 'live' ? C.live : C.wip }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.status === 'live' ? C.live : C.wip }} />
                    {p.status === 'live' ? 'live' : 'in progress'}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: C.text }}>
                  {p.title}
                </h3>
                <p className="text-[13px] leading-relaxed mb-5 flex-1" style={{ color: C.muted }}>
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.stack.map((s) => (
                    <span key={s} className="px-2 py-0.5 text-[10px] rounded border" style={{ borderColor: C.line, background: C.panel2, color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: C.line }}>
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-colors duration-200" style={{ color: C.muted }}>
                      <GitBranch size={13} /> Source
                    </a>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-colors duration-200" style={{ color: C.muted }}>
                      <ArrowUpRight size={13} /> Live
                    </a>
                  )}
                </div>
                <span className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-500" style={{ background: SPECTRAL }} />
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
