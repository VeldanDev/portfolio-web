'use client';

import { motion, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Terminal, BookOpen, Cpu, Network, Globe, Shield } from 'lucide-react';

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
};

const view = { once: true, margin: '-50px' as const };

const t = (delay = 0) => ({ duration: 0.35, ease: 'easeOut' as const, delay });

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_STATS = [
  { label: 'Years Coding',   value: 2,  suffix: '+', color: '#4ade80' },
  { label: 'Repositories',  value: 18, suffix: '',  color: '#38bdf8' },
  { label: 'Technologies',  value: 5,  suffix: '+', color: '#f59e0b' },
  { label: 'Live Product',  value: 1,  suffix: '',  color: '#a78bfa' },
] as const;

const FOCUS_AREAS = [
  {
    icon: Cpu,
    label: 'Embedded Systems',
    color: '#a78bfa',
    desc: 'Low-level programming, microcontrollers, ESP32, Arduino, sensor integration and real-time firmware.',
  },
  {
    icon: Network,
    label: 'Networking',
    color: '#38bdf8',
    desc: 'Protocol analysis, LAN design, Wireshark packet inspection, and network topology planning.',
  },
  {
    icon: Globe,
    label: 'Web Development',
    color: '#4ade80',
    desc: 'Full-stack with Next.js and FastAPI — REST APIs, server components, and Vercel deployments.',
  },
  {
    icon: Shield,
    label: 'Cybersecurity',
    color: '#fb7185',
    desc: 'Security fundamentals, penetration testing mindset, CTF learning, and vulnerability research.',
  },
] as const;

const TECH_STACK = [
  {
    category: 'Languages',
    icon: Terminal,
    color: '#4ade80',
    items: ['Python', 'C/C++', 'TypeScript', 'Bash'],
  },
  {
    category: 'Frameworks',
    icon: BookOpen,
    color: '#38bdf8',
    items: ['Next.js', 'React', 'FastAPI'],
  },
  {
    category: 'Tools',
    icon: Terminal,
    color: '#f59e0b',
    items: ['Linux', 'Git', 'Docker', 'VS Code', 'Wireshark', 'Tinkercad'],
  },
  {
    category: 'Hardware',
    icon: Cpu,
    color: '#a78bfa',
    items: ['ESP32', 'Raspberry Pi', 'Arduino'],
  },
] as const;

const CURRENTLY_LEARNING = [
  {
    name: 'Rust',
    description: 'Systems programming for safe, concurrent, performant low-level code.',
    color: '#f59e0b',
    pct: 38,
  },
  {
    name: 'Kubernetes',
    description: 'Container orchestration for deploying and scaling distributed systems.',
    color: '#38bdf8',
    pct: 25,
  },
  {
    name: 'Reverse Engineering',
    description: 'Binary analysis, disassembly, and understanding compiled software internals.',
    color: '#fb7185',
    pct: 20,
  },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-1">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-[#f1f1f1] tracking-tight mb-6">
      {children}
    </h2>
  );
}

function AnimatedCounter({
  value,
  suffix,
  color,
}: {
  value: number;
  suffix: string;
  color: string;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const ranRef  = useRef(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || ranRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || ranRef.current) return;
        ranRef.current = true;
        observer.disconnect();
        animate(0, value, {
          duration: 1.2,
          ease: 'easeOut',
          onUpdate(v) {
            node.textContent = Math.round(v) + suffix;
          },
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, suffix]);

  return (
    <span
      ref={nodeRef}
      className="text-3xl sm:text-4xl font-bold tracking-tight"
      style={{ color }}
    >
      0{suffix}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-14 md:py-20 max-w-4xl mx-auto">

      {/* ── Page header ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={t()}
        className="mb-12"
      >
        <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-2">
          / about
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#f1f1f1] mb-3">
          About
        </h1>
        <p className="text-sm text-[#6b7280]">The person behind the code.</p>
      </motion.div>

      {/* ── Quick Stats ── */}
      <section className="mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_STATS.map(({ label, value, suffix, color }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={view}
              transition={t(i * 0.06)}
              className="flex flex-col gap-1 p-5 rounded-lg border border-[#1f1f1f] bg-[#111111]"
            >
              <AnimatedCounter value={value} suffix={suffix} color={color} />
              <span className="text-xs text-[#6b7280] leading-tight">{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Story ── */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={view}
        transition={t()}
        className="mb-16"
      >
        <SectionLabel>background</SectionLabel>
        <SectionHeading>Story</SectionHeading>

        <div className="space-y-4 text-sm text-[#6b7280] leading-[1.9]">
          <p>
            I&apos;m <span className="text-[#f1f1f1] font-medium">Aditya Surya Putra</span>, a
            Computer Engineering student at{' '}
            <span className="text-[#f1f1f1] font-medium">Politeknik Negeri Medan</span>,
            Indonesia. I got into engineering because I wanted to understand how things
            actually work — not just at the surface, but at the layer where hardware meets
            software.
          </p>
          <p>
            My interests span a wide range:{' '}
            <span className="text-[#4ade80]">embedded systems</span> and low-level
            programming, <span className="text-[#4ade80]">computer networking</span> and
            protocol analysis, <span className="text-[#4ade80]">cybersecurity</span> and
            the mindset of thinking like an attacker,{' '}
            <span className="text-[#4ade80]">IoT</span> for building real-world connected
            devices, and <span className="text-[#4ade80]">web development</span> for
            creating interfaces that make technical systems approachable.
          </p>
          <p>
            One of the things I&apos;m most proud of is{' '}
            <span className="text-[#f1f1f1] font-medium">Shift Drives</span> — a
            full-stack digital agency platform I built with Next.js. It features 132+
            templates, a tiered pricing system, and a WhatsApp-integrated consultation
            flow. Shipping it as a real live product taught me more about software than any
            course ever has.
          </p>
          <p>
            Outside of code I run{' '}
            <span className="text-[#f1f1f1] font-medium">@veldorable</span> on TikTok,
            where I break down tech concepts for a non-technical audience. Teaching forces
            clarity — if you can&apos;t explain it simply, you don&apos;t understand it
            well enough. I believe the best way to understand any system is to build it
            from scratch, even if it already exists.
          </p>
        </div>
      </motion.section>

      {/* ── Focus Areas ── */}
      <section className="mb-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={view}
          transition={t()}
          className="mb-6"
        >
          <SectionLabel>what I do</SectionLabel>
          <SectionHeading>Focus Areas</SectionHeading>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FOCUS_AREAS.map(({ icon: Icon, label, color, desc }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={view}
              transition={t(i * 0.07)}
              className="group p-5 rounded-lg border border-[#1f1f1f] bg-[#111111]
                         hover:border-[#2a2a2a] transition-colors duration-200"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-md border
                             border-[#1f1f1f] bg-[#0a0a0a] shrink-0
                             group-hover:border-current transition-colors duration-200"
                  style={{ color }}
                >
                  <Icon size={14} strokeWidth={1.5} />
                </span>
                <span className="text-sm font-semibold text-[#f1f1f1]">{label}</span>
              </div>
              <p className="text-xs text-[#6b7280] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="mb-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={view}
          transition={t()}
          className="mb-6"
        >
          <SectionLabel>toolbox</SectionLabel>
          <SectionHeading>Tech Stack</SectionHeading>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TECH_STACK.map(({ category, icon: Icon, color, items }, i) => (
            <motion.div
              key={category}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={view}
              transition={t(i * 0.07)}
              className="p-6 rounded-lg border border-[#1f1f1f] bg-[#111111]"
            >
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-md border
                             border-[#1f1f1f] bg-[#0a0a0a]"
                  style={{ color }}
                >
                  <Icon size={13} strokeWidth={1.5} />
                </span>
                <span
                  className="text-xs font-semibold tracking-wide uppercase"
                  style={{ color }}
                >
                  {category}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 text-xs rounded-md border border-[#1f1f1f]
                               bg-[#0a0a0a] text-[#6b7280] hover:text-[#f1f1f1]
                               hover:border-[#2a2a2a] transition-colors duration-150
                               cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Currently Learning ── */}
      <section>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={view}
          transition={t()}
          className="mb-6"
        >
          <SectionLabel>always growing</SectionLabel>
          <SectionHeading>Currently Learning</SectionHeading>
        </motion.div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#111111] overflow-hidden">
          {/* Terminal chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1f1f1f] bg-[#0d0d0d]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-[10px] tracking-widest text-[#3d3d3d] uppercase">
              learning.log
            </span>
          </div>

          <div className="p-5 flex flex-col gap-6">
            {CURRENTLY_LEARNING.map(({ name, description, color, pct }, i) => (
              <motion.div
                key={name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={view}
                transition={t(i * 0.09)}
              >
                {/* Header row */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[#4ade80] text-xs select-none">›</span>
                  <span className="text-sm font-semibold" style={{ color }}>
                    {name}
                  </span>
                  <span className="ml-auto text-[10px] tracking-widest" style={{ color }}>
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1 rounded-full bg-[#1a1a1a] mb-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={view}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.09 + 0.2 }}
                  />
                </div>

                {/* Description */}
                <p className="text-xs text-[#6b7280] leading-relaxed pl-4">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
