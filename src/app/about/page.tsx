'use client';

import { motion } from 'framer-motion';
import { Cpu, ShieldHalf, Boxes, Workflow } from 'lucide-react';
import CountUp from '@/components/CountUp';

const C = {
  bg: '#0a0b0e', panel: '#101218', panel2: '#0d0f14', line: '#1c2029', line2: '#242a35',
  text: '#eaecef', muted: '#8a9099', dim: '#565c66', violet: '#8b7cff', cyan: '#45e0d0', blue: '#6ea8ff',
};
const SPECTRAL = 'linear-gradient(90deg,#8b7cff 0%,#6ea8ff 45%,#45e0d0 100%)';
const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const view = { once: true, margin: '-60px' } as const;

const STATS = [
  { label: 'Years building', num: 3, suffix: '+', color: C.violet },
  { label: 'Public repos', num: 25, suffix: '', color: C.cyan },
  { label: 'On npm', num: 2, suffix: '', color: C.blue },
  { label: 'Live products', num: 3, suffix: '', color: '#3ee6a0' },
];

const FOCUS = [
  { icon: Cpu, label: 'AI Engineering', color: C.violet, desc: 'Autonomous agents, tool-use and orchestration, retrieval, and LLM-driven automation that does real work.' },
  { icon: ShieldHalf, label: 'Cybersecurity', color: C.cyan, desc: 'Offensive tooling: OSINT and recon frameworks, web vulnerability scanning, and thinking like an attacker.' },
  { icon: Boxes, label: 'Software', color: C.blue, desc: 'Full-stack products with Next.js and Python, from database and auth to a shipped, running interface.' },
  { icon: Workflow, label: 'Automation', color: '#3ee6a0', desc: 'Pipelines and bots that run on their own: scheduled jobs, scraping, and workflows wired end to end.' },
];

const STACK = [
  { group: 'Languages', color: C.violet, items: ['Python', 'TypeScript', 'JavaScript', 'PHP', 'C / C++', 'Bash', 'SQL'] },
  { group: 'AI / ML', color: C.cyan, items: ['LLM agents', 'TensorFlow', 'MCP', 'Vercel AI SDK', 'RAG'] },
  { group: 'Security', color: C.blue, items: ['OSINT', 'Recon', 'OWASP', 'Nmap', 'Burp / PortSwigger'] },
  { group: 'Web / Infra', color: '#3ee6a0', items: ['Next.js', 'React', 'Node', 'Prisma', 'Supabase', 'Linux', 'Docker'] },
];

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>{children}</p>;
}

export default function AboutPage() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100dvh', fontFamily: 'var(--font-sans-body)' }}>
      <div className="px-6 md:px-10 py-16 md:py-20 max-w-4xl mx-auto">

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, ease }} className="mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>/ about</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3" style={{ fontFamily: 'var(--font-display)' }}>The engineer behind the tools</h1>
          <p className="text-sm" style={{ color: C.muted }}>Who I am, what I build, and the stack I build it with.</p>
        </motion.div>

        {/* stats */}
        <section className="mb-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((s, k) => (
              <motion.div key={s.label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
                transition={{ delay: k * 0.06, duration: 0.5, ease }}
                className="rounded-xl border p-5" style={{ borderColor: C.line, background: C.panel }}>
                <div className="text-3xl font-bold tracking-tight" style={{ color: s.color, fontFamily: 'var(--font-display)' }}><CountUp to={s.num} suffix={s.suffix} /></div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* story */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={view} transition={{ duration: 0.5, ease }} className="mb-14">
          <Label>background</Label>
          <div className="space-y-4 text-[15px] leading-[1.9]" style={{ color: C.muted }}>
            <p>
              I&apos;m <span style={{ color: C.text }}>Aditya Surya Putra</span>, an AI and security engineer
              based in Medan, Indonesia. I build things that run on their own: autonomous agents, security
              tools, and full-stack software. My favorite kind of project is one that keeps working after
              I close the laptop.
            </p>
            <p>
              I taught myself most of this by shipping. I published{' '}
              <span style={{ color: C.text }}>Scepter</span> to npm, a CLI that vets MCP servers before an
              agent trusts them. I built <span style={{ color: C.text }}>SpencerWeb</span>, a web
              vulnerability scanner mapped to the OWASP Top 10, as my final project. And I run a self-hosted
              AI agent with 18 tools that handles real day-to-day work over Telegram.
            </p>
            <p>
              I&apos;m a Computer Engineering student at Politeknik Negeri Medan, which gave me the low-level
              grounding: how networks, systems, and hardware actually work underneath the code. I also run{' '}
              <span style={{ color: C.text }}>@veldorable</span> on TikTok, where I explain technical ideas
              in plain language. Teaching keeps me honest: if I can&apos;t explain it simply, I don&apos;t
              understand it well enough yet.
            </p>
          </div>
        </motion.section>

        {/* focus */}
        <section className="mb-14">
          <Label>what I do</Label>
          <div className="grid sm:grid-cols-2 gap-4">
            {FOCUS.map(({ icon: Icon, label, color, desc }, k) => (
              <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
                transition={{ delay: k * 0.06, duration: 0.5, ease }}
                className="spec-card group relative rounded-xl border p-6 overflow-hidden" style={{ borderColor: C.line, background: C.panel }}>
                <span className="flex items-center justify-center w-10 h-10 rounded-lg border mb-4" style={{ borderColor: C.line2, background: C.panel2, color }}>
                  <Icon size={18} strokeWidth={1.6} />
                </span>
                <h3 className="text-base font-semibold mb-1.5" style={{ color: C.text }}>{label}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: C.muted }}>{desc}</p>
                <span className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-500" style={{ background: SPECTRAL }} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* stack */}
        <section>
          <Label>toolbox</Label>
          <div className="grid sm:grid-cols-2 gap-4">
            {STACK.map(({ group, color, items }, k) => (
              <motion.div key={group} variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
                transition={{ delay: k * 0.06, duration: 0.5, ease }}
                className="rounded-xl border p-6" style={{ borderColor: C.line, background: C.panel }}>
                <span className="text-xs font-semibold tracking-wide uppercase" style={{ color, fontFamily: 'var(--font-plex-mono)' }}>{group}</span>
                <div className="flex flex-wrap gap-2 mt-4">
                  {items.map((it) => (
                    <span key={it} className="px-3 py-1.5 text-xs rounded-md border" style={{ borderColor: C.line, background: C.panel2, color: C.muted }}>{it}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
