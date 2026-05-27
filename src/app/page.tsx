'use client';

import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, ExternalLink, GitBranch, ArrowRight,
  Activity, Globe, LayoutDashboard,
} from 'lucide-react';

// ─── Cycling typer ────────────────────────────────────────────────────────────

const ROLES = [
  'Computer Engineering Student',
  'Embedded Systems Developer',
  'Web Developer',
  'IoT Enthusiast',
];

type Phase = 'typing' | 'pausing' | 'erasing';

function CyclingTyper() {
  const [idx, setIdx]         = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase]     = useState<Phase>('typing');

  const phrase    = ROLES[idx];
  const displayed = phrase.slice(0, charIdx);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    switch (phase) {
      case 'typing':
        if (charIdx < phrase.length) {
          timer = setTimeout(() => setCharIdx((c) => c + 1), 58);
        } else {
          timer = setTimeout(() => setPhase('pausing'), 80);
        }
        break;
      case 'pausing':
        timer = setTimeout(() => setPhase('erasing'), 2400);
        break;
      case 'erasing':
        if (charIdx > 0) {
          timer = setTimeout(() => setCharIdx((c) => c - 1), 32);
        } else {
          setIdx((i) => (i + 1) % ROLES.length);
          setPhase('typing');
        }
        break;
    }
    return () => clearTimeout(timer);
  }, [phase, charIdx, phrase]);

  return (
    <span>
      {displayed}
      <span className="inline-block w-[2px] h-[0.85em] align-middle ml-[3px] bg-[#4ade80] animate-pulse" />
    </span>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref      = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const node = ref.current;
    const ctrl = animate(0, to, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate(v) { node.textContent = Math.round(v) + suffix; },
    });
    return () => ctrl.stop();
  }, [isInView, to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

// ─── Terminal card ────────────────────────────────────────────────────────────

const TERM_LINES = [
  { cmd: true,  text: 'whoami'                        },
  { cmd: false, text: 'aditya@polmed'                 },
  { cmd: true,  text: 'status'                        },
  { cmd: false, text: '[ ONLINE ]',  green: true      },
  { cmd: true,  text: 'focus'                         },
  { cmd: false, text: 'embedded + web + networking'   },
] as const;

function TerminalCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.55, ease: 'easeOut' }}
      className="rounded-lg border border-[#1f1f1f] bg-[#0d0d0d] overflow-hidden"
    >
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-[#1f1f1f] bg-[#111111]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-auto text-[10px] text-[#3d3d3d] tracking-wider">terminal</span>
      </div>
      {/* Body */}
      <div className="px-4 py-3 flex flex-col gap-0.5">
        {TERM_LINES.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 + i * 0.18 }}
            className="text-[12px] leading-5"
            style={{
              color: line.green ? '#4ade80' : line.cmd ? '#f1f1f1' : '#6b7280',
              paddingLeft: line.cmd ? 0 : '0.75rem',
            }}
          >
            {line.cmd && <span className="text-[#4ade80] mr-1.5 select-none">›</span>}
            {line.text}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILLS = ['Python', 'C/C++', 'Next.js', 'Networking', 'IoT', 'Linux'];

const MINI_STATS = [
  { label: 'Repos',        value: 18, suffix: '',  icon: GitBranch      },
  { label: 'Contributions',value: 10, suffix: '',  icon: Activity       },
  { label: 'Live Project', value: 1,  suffix: '',  icon: Globe          },
] as const;

// TODO: replace with real project data fetched from GitHub API once lib is wired up
const FEATURED_PROJECTS = [
  {
    id: 'shift-drives',
    title: 'Shift Drives',
    description:
      'Full-stack digital agency platform built with Next.js. Offers web dev, mobile apps, cybersecurity, IoT solutions, AI chatbots, and N8N automation services. Features 132+ templates and a WhatsApp-integrated consultation flow.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    status: 'active' as const,
    featured: true,
    githubUrl: '#',
    demoUrl: 'https://shift-drives.vercel.app',
  },
  {
    id: 'iot-dashboard',
    title: 'IoT Sensor Dashboard',
    description:
      'Real-time monitoring dashboard for embedded sensor networks. Displays telemetry from multiple ESP32 nodes over MQTT with live chart updates.',
    techStack: ['Next.js', 'MQTT', 'C/C++', 'PostgreSQL'],
    status: 'wip' as const,
    featured: false,
    githubUrl: '#',
    demoUrl: null,
  },
  {
    id: 'network-visualizer',
    title: 'Network Topology Visualizer',
    description:
      'Web-based tool for mapping and analysing network topologies with live packet inspection powered by Scapy and D3.',
    techStack: ['Python', 'React', 'Scapy', 'D3.js'],
    status: 'wip' as const,
    featured: false,
    githubUrl: '#',
    demoUrl: null,
  },
];

const STATUS_META = {
  active:    { color: '#4ade80', label: 'active'      },
  completed: { color: '#38bdf8', label: 'completed'   },
  wip:       { color: '#f59e0b', label: 'in progress' },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
};

const view = { once: true, margin: '-50px' as const };
const t    = (d = 0) => ({ duration: 0.35, ease: 'easeOut' as const, delay: d });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-14 md:py-20 max-w-5xl mx-auto">

      {/* ══ Hero ══════════════════════════════════════════════════════════════ */}
      <section className="mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-14 items-start">

          {/* ── Left column ── */}
          <div>
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t()}
              className="inline-flex items-center gap-2 mb-7"
            >
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse shrink-0" />
              <span className="text-xs tracking-[0.22em] text-[#4ade80] font-medium">
                [ AVAILABLE FOR INTERNSHIP ]
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.08)}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight
                         text-[#f1f1f1] leading-[1.1] mb-5"
            >
              Aditya Surya Putra
            </motion.h1>

            {/* Cycling role */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.16)}
              className="text-lg md:text-xl text-[#4ade80] font-medium mb-4 min-h-[1.75rem]"
            >
              <CyclingTyper />
            </motion.div>

            {/* University */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.22)}
              className="flex items-center gap-1.5 text-sm text-[#6b7280] mb-7"
            >
              <MapPin size={13} strokeWidth={1.5} className="shrink-0 text-[#4ade80]" />
              <span>Politeknik Negeri Medan</span>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.28)}
              className="text-[#6b7280] text-sm leading-[1.95] max-w-lg mb-8"
            >
              I build things at the intersection of hardware and software — from{' '}
              <span className="text-[#f1f1f1]">embedded systems</span> and{' '}
              <span className="text-[#f1f1f1]">networking protocols</span> to{' '}
              <span className="text-[#f1f1f1]">full-stack web applications</span>.
              Currently studying at Politeknik Negeri Medan, driven by IoT,
              Linux infrastructure, and modern web development.
            </motion.p>

            {/* Skill badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.34)}
              className="flex flex-wrap gap-2 mb-9"
            >
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-md border border-[#1f1f1f] bg-[#111111]
                             text-[#6b7280] hover:border-[#4ade80]/40 hover:text-[#f1f1f1]
                             transition-colors duration-150 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.4)}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm
                           font-medium bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80]
                           hover:bg-[#4ade80]/20 hover:border-[#4ade80]/50
                           transition-all duration-150"
              >
                <GitBranch size={14} strokeWidth={1.5} />
                View Projects
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm
                           font-medium border border-[#1f1f1f] bg-[#111111] text-[#6b7280]
                           hover:text-[#f1f1f1] hover:border-[#2a2a2a]
                           transition-all duration-150"
              >
                <LayoutDashboard size={14} strokeWidth={1.5} />
                View Dashboard
              </Link>
            </motion.div>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-4">

            {/* Profile photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
              className="relative mx-auto lg:mx-0 w-[200px]"
            >
              {/* Glow halo */}
              <div className="absolute -inset-4 rounded-2xl bg-[#4ade80]/8 blur-2xl pointer-events-none" />
              {/* Border frame */}
              <div className="relative rounded-xl border border-[#4ade80]/25 overflow-hidden
                              shadow-[0_0_32px_rgba(74,222,128,0.08)]">
                <Image
                  src="/avatar.jpg"
                  alt="Aditya Surya Putra"
                  width={200}
                  height={200}
                  className="w-full h-auto object-cover grayscale hover:grayscale-0
                             transition-all duration-500"
                  priority
                />
              </div>
            </motion.div>

            {/* Mini stat cards */}
            <div className="grid grid-cols-3 gap-2">
              {MINI_STATS.map(({ label, value, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={t(0.35 + i * 0.07)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg
                             border border-[#1f1f1f] bg-[#111111] text-center"
                >
                  <Icon size={13} strokeWidth={1.5} className="text-[#4ade80]" />
                  <span className="text-lg font-semibold text-[#f1f1f1] tabular-nums leading-none">
                    <AnimatedCounter to={value} />
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#3d3d3d] leading-tight">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Terminal card */}
            <TerminalCard />
          </div>
        </div>
      </section>

      {/* ══ Featured Projects ═════════════════════════════════════════════════ */}
      <section>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={view}
          transition={t()}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-1.5">
              selected work
            </p>
            <h2 className="text-2xl font-semibold text-[#f1f1f1] tracking-tight">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#4ade80]
                       transition-colors duration-150"
          >
            View all <ArrowRight size={11} className="mt-px" />
          </Link>
        </motion.div>

        {/* TODO: swap FEATURED_PROJECTS with real data once GitHub API lib is wired up */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PROJECTS.map((project, i) => {
            const meta = STATUS_META[project.status];
            return (
              <motion.article
                key={project.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={view}
                transition={t(i * 0.09)}
                className="group relative flex flex-col gap-4 p-6 rounded-xl border border-[#1f1f1f]
                           bg-[#111111] hover:border-[#2a2a2a]
                           hover:shadow-[0_0_24px_rgba(74,222,128,0.04)]
                           transition-all duration-300"
              >
                {/* Featured badge */}
                {project.featured && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 text-[9px] uppercase
                                   tracking-widest rounded border border-[#4ade80]/20
                                   bg-[#4ade80]/8 text-[#4ade80]">
                    featured
                  </span>
                )}

                {/* Header */}
                <div className="flex items-start gap-3 pr-14">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <h3 className="text-base font-semibold text-[#f1f1f1] leading-snug
                                 group-hover:text-[#4ade80] transition-colors duration-200">
                    {project.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-[#6b7280] leading-[1.8] flex-1">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[10px] rounded-md border border-[#1f1f1f]
                                 bg-[#0a0a0a] text-[#6b7280]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 pt-3 border-t border-[#1f1f1f]">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      className="flex items-center gap-1.5 text-xs text-[#6b7280]
                                 hover:text-[#4ade80] transition-colors duration-150"
                    >
                      <GitBranch size={12} strokeWidth={1.5} />
                      Code
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#6b7280]
                                 hover:text-[#38bdf8] transition-colors duration-150"
                    >
                      <ExternalLink size={12} strokeWidth={1.5} />
                      Live demo
                    </a>
                  )}
                  <span
                    className="ml-auto text-[10px] tracking-wide"
                    style={{ color: meta.color }}
                  >
                    {meta.label}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
