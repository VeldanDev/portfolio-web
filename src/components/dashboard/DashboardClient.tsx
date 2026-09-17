'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Activity, GitBranch, Star, Users, Clock, Zap, Timer, Keyboard, BarChart2 } from 'lucide-react';
import type { GitHubStats, WakaTimeStats, GitHubContributionWeek } from '@/types/index';

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
};

const view = { once: true, margin: '-40px' as const };
const t    = (delay = 0) => ({ duration: 0.35, ease: 'easeOut' as const, delay });

// ─── Utility ──────────────────────────────────────────────────────────────────

function relativeTime(iso?: string): string {
  if (!iso) return 'unknown';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  // Fixed locale + options so server and client render the same string (no hydration mismatch).
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmt(n?: number): string {
  return (n ?? 0).toLocaleString('en-US');
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ sub, title }: { sub: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-1">{sub}</p>
      <h2 className="text-lg font-semibold text-[#f1f1f1] tracking-tight">{title}</h2>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  delay,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={view}
      transition={t(delay)}
      className="flex flex-col gap-2 p-4 rounded-lg border border-[#1f1f1f] bg-[#111111]"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d]">{label}</p>
        <Icon size={13} strokeWidth={1.5} className="text-[#3d3d3d]" />
      </div>
      <p
        className="text-2xl font-semibold tracking-tight tabular-nums"
        style={{ color: accent ?? '#f1f1f1' }}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-[#3d3d3d] mt-auto">{sub}</p>}
    </motion.div>
  );
}

function LanguageBar({
  name,
  percentage,
  color,
  delay,
}: {
  name: string;
  percentage: number;
  color?: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={view}
      transition={t(delay)}
      className="flex items-center gap-3"
    >
      <span className="w-24 shrink-0 text-xs text-[#6b7280] truncate">{name}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[#1a1a1a] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color ?? '#4ade80' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={view}
          transition={{ duration: 0.7, delay: delay + 0.1, ease: 'easeOut' }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-[11px] text-[#6b7280] tabular-nums">
        {percentage.toFixed(1)}%
      </span>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-xs text-[#3d3d3d] py-4 text-center">{message}</p>
  );
}

function ComingSoonCard({
  title,
  description,
  icon: Icon,
  delay,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={view}
      transition={t(delay)}
      className="flex flex-col gap-3 p-5 rounded-lg border border-dashed border-[#1f1f1f]
                 bg-[#111111] opacity-60"
    >
      <div className="flex items-center gap-2">
        <Icon size={14} strokeWidth={1.5} className="text-[#3d3d3d]" />
        <p className="text-xs font-medium text-[#3d3d3d] uppercase tracking-widest">{title}</p>
      </div>
      <p className="text-sm text-[#3d3d3d]">{description}</p>
      <span className="self-start mt-1 px-2 py-0.5 text-[10px] rounded border border-[#1f1f1f]
                       text-[#3d3d3d] tracking-widest uppercase">
        coming soon
      </span>
    </motion.div>
  );
}

// ─── Contribution heatmap ─────────────────────────────────────────────────────

const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: '#1a1a1a',
  1: '#0e4429',
  2: '#006d32',
  3: '#26a641',
  4: '#39d353',
};

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS  = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// cell 11px + gap 2px = 13px per step
const CELL = 11;
const GAP  = 2;
const STEP = CELL + GAP;

// 52-week skeleton for when data is absent
const SKELETON_WEEKS: GitHubContributionWeek[] = Array.from({ length: 52 }, () => ({
  days: Array.from({ length: 7 }, () => ({ date: '', count: 0, level: 0 as const })),
}));

function fmtDay(dateStr: string): string {
  // Append noon time to prevent UTC→local date shift
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

interface HoveredDay { date: string; count: number }

function ContributionHeatmap({ weeks }: { weeks?: GitHubContributionWeek[] }) {
  const [hovered, setHovered] = useState<HoveredDay | null>(null);

  const isEmpty = !weeks || weeks.length === 0;
  const data    = isEmpty ? SKELETON_WEEKS : weeks;

  // Build month label positions from first-day-of-week dates
  const monthLabels: { left: number; label: string }[] = [];
  let prevMonth = -1;
  data.forEach((week, wi) => {
    if (week.days.length > 0 && week.days[0].date) {
      const m = new Date(week.days[0].date + 'T12:00:00').getMonth();
      if (m !== prevMonth) {
        monthLabels.push({ left: wi * STEP, label: MONTH_NAMES[m] });
        prevMonth = m;
      }
    }
  });

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={view}
      transition={t(0.15)}
      className="p-5 rounded-lg border border-[#1f1f1f] bg-[#111111]"
    >
      <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-4">
        contribution calendar
      </p>

      <div className={isEmpty ? 'animate-pulse opacity-25' : undefined}>
        <div className="flex gap-2">

          {/* Day labels — offset top by 20px (month row height) */}
          <div className="flex flex-col shrink-0" style={{ gap: GAP, marginTop: 20 }}>
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                style={{ height: CELL, width: 30 }}
                className="flex items-center justify-end"
              >
                {label && (
                  <span className="text-[9px] leading-none text-[#3d3d3d]">{label}</span>
                )}
              </div>
            ))}
          </div>

          {/* Month labels + week grid (scrollable) */}
          <div className="overflow-x-auto">
            {/* Month label row */}
            <div className="relative h-5">
              {monthLabels.map(({ left, label }) => (
                <span
                  key={label + left}
                  className="absolute text-[9px] text-[#3d3d3d]"
                  style={{ left }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Week columns */}
            <div className="flex" style={{ gap: GAP }}>
              {data.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                  {week.days.map((day, di) => (
                    <div
                      key={di}
                      style={{
                        width: CELL,
                        height: CELL,
                        flexShrink: 0,
                        borderRadius: 2,
                        backgroundColor: LEVEL_COLORS[day.level ?? 0],
                        cursor: day.date ? 'crosshair' : 'default',
                        transition: 'opacity 0.1s',
                      }}
                      onMouseEnter={() => day.date && setHovered({ date: day.date, count: day.count })}
                      onMouseLeave={() => setHovered(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar: tooltip text + legend */}
      <div className="mt-3 pt-3 border-t border-[#1f1f1f] flex items-center justify-between gap-4">
        <span className="text-[11px] text-[#3d3d3d] truncate">
          {hovered
            ? `${fmtDay(hovered.date)}: ${hovered.count} contribution${hovered.count !== 1 ? 's' : ''}`
            : 'Hover a day to see details'}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px] text-[#3d3d3d]">Less</span>
          {([0, 1, 2, 3, 4] as const).map((lvl) => (
            <div
              key={lvl}
              style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: LEVEL_COLORS[lvl] }}
            />
          ))}
          <span className="text-[9px] text-[#3d3d3d]">More</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  github:   GitHubStats   | null;
  wakatime: WakaTimeStats | null;
}

export default function DashboardClient({ github, wakatime }: Props) {
  const updatedAt =
    github?.fetchedAt ?? wakatime?.fetchedAt;

  return (
    <div className="min-h-screen px-6 py-14 md:py-20 max-w-4xl mx-auto">

      {/* ── Page header ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={t()}
        className="mb-14"
      >
        <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-2">/ dashboard</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#f1f1f1] mb-3">
          Dashboard
        </h1>
        <p className="text-sm text-[#6b7280] mb-4">Real-time proof of work.</p>

        {/* Last updated badge */}
        <div className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse shrink-0" />
          <span className="text-[11px] text-[#3d3d3d] tracking-wide" suppressHydrationWarning>
            Updated {relativeTime(updatedAt)}
          </span>
        </div>
      </motion.div>

      {/* ══ GitHub Section ══════════════════════════════════════════════════════ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={view}
        transition={t()}
        className="mb-14"
      >
        <SectionLabel sub="version control" title="GitHub Activity" />

        {github ? (
          <>
            {/* Stat grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <StatCard
                label="Contributions"
                value={fmt(github.totalContributions)}
                sub="last year"
                icon={Activity}
                accent="#4ade80"
                delay={0}
              />
              <StatCard
                label="Repositories"
                value={fmt(github.publicRepos)}
                sub="public repos"
                icon={GitBranch}
                delay={0.06}
              />
              <StatCard
                label="Total Stars"
                value={fmt(github.totalStars)}
                sub="across all repos"
                icon={Star}
                delay={0.12}
              />
              <StatCard
                label="Followers"
                value={fmt(github.followers)}
                sub="on GitHub"
                icon={Users}
                delay={0.18}
              />
            </div>

            {/* Streak row */}
            {(github.currentStreak || github.longestStreak) ? (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <StatCard
                  label="Current Streak"
                  value={`${github.currentStreak ?? 0}d`}
                  sub="consecutive days"
                  icon={Zap}
                  accent="#f59e0b"
                  delay={0.24}
                />
                <StatCard
                  label="Longest Streak"
                  value={`${github.longestStreak ?? 0}d`}
                  sub="all time"
                  icon={Zap}
                  delay={0.28}
                />
              </div>
            ) : null}

            {/* Language bars */}
            {github.topLanguages.length > 0 ? (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={view}
                transition={t(0.1)}
                className="p-5 rounded-lg border border-[#1f1f1f] bg-[#111111]"
              >
                <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-4">
                  top languages
                </p>
                <div className="flex flex-col gap-3">
                  {github.topLanguages.map((lang, i) => (
                    <LanguageBar
                      key={lang.name}
                      name={lang.name}
                      percentage={lang.percentage}
                      color={lang.color}
                      delay={i * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            ) : null}

            {/* Contribution heatmap */}
            <ContributionHeatmap weeks={github.contributionCalendar} />
          </>
        ) : (
          <EmptyState message="GitHub data unavailable. Check the GITHUB_TOKEN env var." />
        )}
      </motion.section>

      {/* ══ WakaTime Section ════════════════════════════════════════════════════ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={view}
        transition={t()}
        className="mb-14"
      >
        <SectionLabel sub="coding activity" title="WakaTime Stats" />

        {wakatime ? (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={view}
                transition={t(0)}
                className="flex flex-col gap-2 p-5 rounded-lg border border-[#1f1f1f] bg-[#111111]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d]">
                    Total Coding Time
                  </p>
                  <Clock size={13} strokeWidth={1.5} className="text-[#3d3d3d]" />
                </div>
                <p className="text-3xl font-semibold tracking-tight text-[#4ade80] mt-1">
                  {wakatime.totalText}
                </p>
                <div className="flex items-center gap-1.5 mt-auto">
                  <span className="px-2 py-0.5 text-[10px] rounded border border-[#1f1f1f]
                                   bg-[#0a0a0a] text-[#3d3d3d] tracking-wider uppercase">
                    last {wakatime.rangeDays} days
                  </span>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={view}
                transition={t(0.08)}
                className="flex flex-col gap-2 p-5 rounded-lg border border-[#1f1f1f] bg-[#111111]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d]">
                    Daily Average
                  </p>
                  <Timer size={13} strokeWidth={1.5} className="text-[#3d3d3d]" />
                </div>
                <p className="text-3xl font-semibold tracking-tight text-[#38bdf8] mt-1">
                  {wakatime.dailyAverageText}
                </p>
                <p className="text-[11px] text-[#3d3d3d] mt-auto">per day average</p>
              </motion.div>
            </div>

            {/* Language bars */}
            {wakatime.topLanguages.length > 0 ? (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={view}
                transition={t(0.1)}
                className="p-5 rounded-lg border border-[#1f1f1f] bg-[#111111] mb-4"
              >
                <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-4">
                  languages
                </p>
                <div className="flex flex-col gap-3">
                  {wakatime.topLanguages.map((lang, i) => (
                    <LanguageBar
                      key={lang.name}
                      name={lang.name}
                      percentage={lang.percentage}
                      color={lang.color}
                      delay={i * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            ) : null}

            {/* Editors + OS side by side (if available) */}
            {(wakatime.topEditors?.length || wakatime.topOS?.length) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wakatime.topEditors && wakatime.topEditors.length > 0 && (
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={view}
                    transition={t(0.12)}
                    className="p-5 rounded-lg border border-[#1f1f1f] bg-[#111111]"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-4">
                      editors
                    </p>
                    <div className="flex flex-col gap-3">
                      {wakatime.topEditors.map((e, i) => (
                        <LanguageBar
                          key={e.name}
                          name={e.name}
                          percentage={e.percentage}
                          color="#f59e0b"
                          delay={i * 0.05}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                {wakatime.topOS && wakatime.topOS.length > 0 && (
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={view}
                    transition={t(0.16)}
                    className="p-5 rounded-lg border border-[#1f1f1f] bg-[#111111]"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-4">
                      operating systems
                    </p>
                    <div className="flex flex-col gap-3">
                      {wakatime.topOS.map((os, i) => (
                        <LanguageBar
                          key={os.name}
                          name={os.name}
                          percentage={os.percentage}
                          color="#a78bfa"
                          delay={i * 0.05}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ) : null}
          </>
        ) : (
          <EmptyState message="WakaTime data unavailable. Check the WAKATIME_API_KEY env var." />
        )}
      </motion.section>

      {/* ══ Coming Soon ═════════════════════════════════════════════════════════ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={view}
        transition={t()}
      >
        <SectionLabel sub="more stats" title="Coming Soon" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ComingSoonCard
            title="Monkeytype"
            description="Typing speed, accuracy, and personal bests by mode."
            icon={Keyboard}
            delay={0}
          />
          <ComingSoonCard
            title="Umami Analytics"
            description="Pageviews, unique visitors, and top countries."
            icon={BarChart2}
            delay={0.08}
          />
        </div>
      </motion.section>
    </div>
  );
}
