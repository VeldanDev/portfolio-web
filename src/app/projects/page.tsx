'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, GitBranch, Lock, ArrowRight, Monitor } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'web' | 'iot' | 'tools';
type Status   = 'active' | 'completed' | 'wip';
type Filter   = 'all' | Category;

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  status: Status;
  category: Category;
  featured?: boolean;
  githubUrl: string | null;
  demoUrl:   string | null;
  previewUrl?: string;
  previewTags?: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    id: 'shift-drives',
    title: 'Shift Drives',
    description:
      'Full-stack digital agency platform built with Next.js. Offers web development, mobile apps, cybersecurity, IoT solutions, chatbot/AI, N8N workflow automation, and academic project services. Features 132+ templates, a tiered pricing system, and a WhatsApp-integrated consultation flow.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    status: 'active',
    category: 'web',
    featured: true,
    githubUrl: '#', // TODO: replace with real GitHub URL
    demoUrl: 'https://shift-drives.vercel.app',
    previewUrl: 'shift-drives.vercel.app',
    previewTags: ['Web Dev', 'Mobile', 'IoT', 'AI/LLM'],
  },
  {
    id: 'spencerweb',
    title: 'SpencerWeb',
    description:
      'Python-based web vulnerability scanner built for UMKM. Scans for SQLi, XSS, CSRF, SSL issues, open ports, sensitive files, and more. Features a real-time web dashboard, automated PDF reports in Bahasa Indonesia, and OWASP Top 10 framework. Built as Final Project (Tugas Akhir) at Politeknik Negeri Medan.',
    techStack: ['Python', 'Node.js', 'Express', 'ReportLab', 'BeautifulSoup'],
    status: 'active',
    category: 'tools',
    githubUrl: 'https://github.com/VeldanDev/SpencerWeb',
    demoUrl: null,
  },
  {
    id: 'placeholder-iot',
    title: 'IoT Dashboard',
    description: 'Real-time sensor monitoring dashboard for ESP32-based devices. MQTT, live charts, and alerting.',
    techStack: ['ESP32', 'MQTT', 'Next.js', 'FastAPI'],
    status: 'wip',
    category: 'iot',
    githubUrl: null,
    demoUrl: null,
  },
];

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',   label: 'All'   },
  { value: 'web',   label: 'Web'   },
  { value: 'iot',   label: 'IoT'   },
  { value: 'tools', label: 'Tools' },
];

const STATUS_META: Record<Status, { color: string; label: string }> = {
  active:    { color: '#4ade80', label: 'live'        },
  completed: { color: '#38bdf8', label: 'completed'   },
  wip:       { color: '#f59e0b', label: 'in progress' },
};

const CATEGORY_META: Record<Category, { color: string; label: string }> = {
  web:   { color: '#38bdf8', label: 'web'   },
  iot:   { color: '#4ade80', label: 'iot'   },
  tools: { color: '#f59e0b', label: 'tools' },
};

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0,  scale: 1    },
  exit:    { opacity: 0, y: -8, scale: 0.98 },
};

const t = (delay = 0) => ({ duration: 0.3, ease: 'easeOut' as const, delay });

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeaturedCard({ project }: { project: Project }) {
  const status = STATUS_META[project.status];

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={t(0)}
      className="sm:col-span-2 flex flex-col md:flex-row rounded-xl overflow-hidden
                 border border-[#4ade80]/25 bg-[#111111]
                 shadow-[0_0_40px_-12px_rgba(74,222,128,0.15)]"
    >
      {/* ── Left: text content ── */}
      <div className="flex flex-col gap-5 p-7 flex-1 min-w-0">
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase rounded
                           border border-[#4ade80]/40 bg-[#4ade80]/10 text-[#4ade80]">
            Featured
          </span>
          <span
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] tracking-widest
                       uppercase rounded border"
            style={{
              color: status.color,
              borderColor: `${status.color}40`,
              backgroundColor: `${status.color}0d`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: status.color }} />
            {status.label}
          </span>
          <span
            className="px-2 py-0.5 text-[10px] tracking-widest uppercase rounded border"
            style={{
              color: CATEGORY_META[project.category].color,
              borderColor: `${CATEGORY_META[project.category].color}33`,
              backgroundColor: `${CATEGORY_META[project.category].color}0d`,
            }}
          >
            {CATEGORY_META[project.category].label}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f1f1f1] mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-[#6b7280] leading-relaxed max-w-lg">
            {project.description}
          </p>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs rounded-md border border-[#1f1f1f]
                         bg-[#0a0a0a] text-[#6b7280]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 pt-1 mt-auto">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
                         bg-[#4ade80] text-[#0a0a0a] hover:bg-[#6ee7a0]
                         transition-colors duration-150"
            >
              <ExternalLink size={13} strokeWidth={2} />
              Live Demo
            </a>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-md
                         border border-[#1f1f1f] bg-[#0a0a0a] text-[#6b7280]
                         hover:text-[#f1f1f1] hover:border-[#2a2a2a]
                         transition-colors duration-150"
            >
              <GitBranch size={13} strokeWidth={1.5} />
              Source
            </a>
          )}
        </div>
      </div>

      {/* ── Right: browser preview ── */}
      <div className="md:w-72 lg:w-80 shrink-0 flex flex-col border-t md:border-t-0
                      md:border-l border-[#1f1f1f] bg-[#0d0d0d]">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-[#1f1f1f] bg-[#0a0a0a]">
          <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
          <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <span className="w-2 h-2 rounded-full bg-[#28c840]" />
          <div className="ml-2 flex-1 flex items-center gap-1 bg-[#111111] rounded
                          px-2 py-0.5">
            <Monitor size={8} strokeWidth={1.5} className="text-[#3d3d3d] shrink-0" />
            <span className="text-[9px] text-[#3d3d3d] truncate">
              {project.previewUrl}
            </span>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6
                        bg-gradient-to-b from-[#0d1a0d] to-[#0a0a0a]">
          <div className="text-[#4ade80] text-xl font-bold tracking-tight">
            Shift Drives
          </div>
          <p className="text-[10px] text-[#3d3d3d] text-center leading-relaxed">
            Digital Agency Platform<br />132+ Templates Available
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {project.previewTags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[9px] rounded border border-[#4ade80]/20
                           bg-[#4ade80]/5 text-[#4ade80]"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Decorative grid lines */}
          <div className="absolute inset-0 pointer-events-none opacity-5"
               style={{
                 backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)',
                 backgroundSize: '24px 24px',
               }}
          />
        </div>
      </div>
    </motion.article>
  );
}

function RegularCard({ project, index }: { project: Project; index: number }) {
  const status   = STATUS_META[project.status];
  const category = CATEGORY_META[project.category];

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={t(index * 0.06)}
      className="group flex flex-col gap-4 p-5 rounded-lg border border-[#1f1f1f]
                 bg-[#111111] hover:border-[#2a2a2a] transition-colors duration-200"
    >
      {/* Title + status dot */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#f1f1f1] leading-snug
                       group-hover:text-[#4ade80] transition-colors duration-150">
          {project.title}
        </h3>
        <span
          className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: status.color }}
          title={status.label}
        />
      </div>

      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className="flex items-center gap-1 px-2 py-0.5 text-[10px] tracking-widest
                     uppercase rounded border"
          style={{
            color: status.color,
            borderColor: `${status.color}40`,
            backgroundColor: `${status.color}0d`,
          }}
        >
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: status.color }} />
          {status.label}
        </span>
        <span
          className="px-2 py-0.5 text-[10px] tracking-widest uppercase rounded border"
          style={{
            color: category.color,
            borderColor: `${category.color}33`,
            backgroundColor: `${category.color}0d`,
          }}
        >
          {category.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-[#6b7280] leading-relaxed flex-1">
        {project.description}
      </p>

      {/* Tech stack */}
      {project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] rounded border border-[#1f1f1f]
                         bg-[#0a0a0a] text-[#6b7280]"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Footer links */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#1f1f1f]">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-[#6b7280]
                       hover:text-[#4ade80] transition-colors duration-150"
          >
            <GitBranch size={11} strokeWidth={1.5} />
            Source
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-[#6b7280]
                       hover:text-[#38bdf8] transition-colors duration-150"
          >
            <ExternalLink size={11} strokeWidth={1.5} />
            Live demo
          </a>
        )}
        <span className="ml-auto text-[10px] tracking-wide" style={{ color: status.color }}>
          {status.label}
        </span>
      </div>
    </motion.article>
  );
}

function PlaceholderCard({ project, index }: { project: Project; index: number }) {
  const category = CATEGORY_META[project.category];

  return (
    <motion.article
      layout
      key={project.id}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={t(index * 0.06)}
      className="relative overflow-hidden rounded-lg border border-dashed border-[#1f1f1f]
                 bg-[#111111]"
    >
      {/* COMING SOON overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5
                      bg-[#0a0a0a]/75 backdrop-blur-[1.5px] z-10">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-full border"
          style={{ borderColor: `${category.color}30`, backgroundColor: `${category.color}08` }}
        >
          <Lock size={14} strokeWidth={1.5} style={{ color: category.color, opacity: 0.6 }} />
        </span>
        <div className="text-center">
          <p className="text-[10px] tracking-widest uppercase text-[#6b7280] mb-0.5">
            Coming Soon
          </p>
          <p
            className="text-[10px] tracking-widest uppercase"
            style={{ color: category.color, opacity: 0.7 }}
          >
            {category.label}
          </p>
        </div>
      </div>

      {/* Blurred content behind overlay */}
      <div className="p-5 flex flex-col gap-3 blur-[1.5px] select-none pointer-events-none
                      opacity-40">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#f1f1f1]">{project.title}</h3>
          <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1 shrink-0" />
        </div>
        <p className="text-xs text-[#6b7280] leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] rounded border border-[#1f1f1f]
                         bg-[#0a0a0a] text-[#6b7280]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const LIVE_COUNT     = PROJECTS.filter((p) => p.status === 'active').length;
const WIP_COUNT      = PROJECTS.filter((p) => p.status === 'wip').length;

export default function ProjectsPage() {
  const [active, setActive] = useState<Filter>('all');

  const visible = PROJECTS.filter(
    (p) => active === 'all' || p.category === active,
  );

  return (
    <div className="min-h-screen px-6 py-14 md:py-20 max-w-4xl mx-auto">

      {/* ── Page header ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={t()}
        className="mb-6"
      >
        <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-2">
          / projects
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#f1f1f1] mb-3">
          Projects
        </h1>
        <p className="text-sm text-[#6b7280]">Things I&apos;ve built.</p>
      </motion.div>

      {/* ── Hero stats bar ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={t(0.06)}
        className="flex items-center gap-0 mb-10 rounded-lg border border-[#1f1f1f]
                   bg-[#111111] divide-x divide-[#1f1f1f] overflow-hidden"
      >
        {[
          { value: PROJECTS.length, label: 'Projects',    color: '#f1f1f1' },
          { value: LIVE_COUNT,      label: 'Live',        color: '#4ade80' },
          { value: WIP_COUNT,       label: 'In Progress', color: '#f59e0b' },
        ].map(({ value, label, color }) => (
          <div key={label} className="flex items-center gap-2.5 px-5 py-3.5 flex-1">
            <span className="text-xl font-bold tabular-nums" style={{ color }}>
              {value}
            </span>
            <span className="text-xs text-[#3d3d3d]">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* ── Filter bar ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={t(0.1)}
        className="flex items-center gap-2 mb-8"
      >
        {FILTERS.map(({ value, label }) => {
          const isOn = active === value;
          return (
            <button
              key={value}
              onClick={() => setActive(value)}
              className={[
                'px-3 py-1.5 text-xs rounded-md border transition-colors duration-150',
                isOn
                  ? 'border-[#4ade80]/50 bg-[#4ade80]/10 text-[#4ade80]'
                  : 'border-[#1f1f1f] bg-[#111111] text-[#6b7280] hover:text-[#f1f1f1] hover:border-[#2a2a2a]',
              ].join(' ')}
            >
              {label}
            </button>
          );
        })}

        <span className="ml-auto text-[11px] text-[#3d3d3d] tabular-nums">
          {visible.length} / {PROJECTS.length}
        </span>
      </motion.div>

      {/* ── Project grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => {
            if (project.featured) {
              return <FeaturedCard key={project.id} project={project} />;
            }
            if (project.id.startsWith('placeholder')) {
              return <PlaceholderCard key={project.id} project={project} index={i} />;
            }
            return <RegularCard key={project.id} project={project} index={i} />;
          })}
        </AnimatePresence>
      </div>

      {/* ── Collaboration banner ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        transition={t(0.1)}
        className="mt-12 flex flex-col sm:flex-row items-start sm:items-center
                   justify-between gap-4 p-6 rounded-xl border border-[#1f1f1f]
                   bg-[#111111] hover:border-[#2a2a2a] transition-colors duration-200"
      >
        <div>
          <p className="text-sm font-semibold text-[#f1f1f1] mb-1">
            Open to collaboration
          </p>
          <p className="text-xs text-[#6b7280] leading-relaxed">
            Have an idea or a project that needs a builder? Let&apos;s work on it together.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 text-xs font-medium
                     rounded-md border border-[#4ade80]/30 bg-[#4ade80]/10 text-[#4ade80]
                     hover:bg-[#4ade80]/20 hover:border-[#4ade80]/50
                     transition-colors duration-150 whitespace-nowrap"
        >
          Get in touch
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </motion.div>
    </div>
  );
}
