'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Activity, GitBranch, Zap, Clock } from 'lucide-react';
import CountUp from '@/components/CountUp';
import type { GitHubStats, WakaTimeStats, GitHubContributionWeek } from '@/types/index';

const C = {
  bg: '#0a0b0e', panel: '#101218', panel2: '#0d0f14', line: '#1c2029', line2: '#242a35',
  text: '#eaecef', muted: '#8a9099', dim: '#565c66', violet: '#8b7cff', cyan: '#45e0d0', live: '#3ee6a0',
};
const SPECTRAL = 'linear-gradient(90deg,#8b7cff 0%,#6ea8ff 45%,#45e0d0 100%)';
const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const view = { once: true, margin: '-60px' } as const;

function fmt(n?: number) {
  return (n ?? 0).toLocaleString('en-US');
}

function StatTile({ label, value, icon: Icon, color, delay }: { label: string; value: string | number; icon: React.ElementType; color: string; delay: number }) {
  return (
    <motion.div
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
      transition={{ delay, duration: 0.5, ease }}
      className="rounded-xl border p-5" style={{ borderColor: C.line, background: C.panel }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>{label}</span>
        <Icon size={14} strokeWidth={1.6} style={{ color: C.dim }} />
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color, fontFamily: 'var(--font-display)' }}>
        {typeof value === 'number' ? <CountUp to={value} /> : value}
      </div>
    </motion.div>
  );
}

function LangBar({ name, percentage, color, delay }: { name: string; percentage: number; color?: string; delay: number }) {
  return (
    <motion.div
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
      transition={{ delay, duration: 0.4, ease }}
      className="flex items-center gap-3"
    >
      <span className="w-20 shrink-0 text-xs truncate" style={{ color: C.muted }}>{name}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: C.panel2 }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color ?? SPECTRAL }}
          initial={{ width: 0 }} whileInView={{ width: `${percentage}%` }} viewport={view}
          transition={{ duration: 0.7, delay: delay + 0.1, ease: 'easeOut' }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-[11px] tabular-nums" style={{ color: C.dim }}>{percentage.toFixed(1)}%</span>
    </motion.div>
  );
}

/* ── Contribution heatmap, restyled from the old /dashboard page ─────────── */
const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: '#161a20', 1: '#20263f', 2: '#3a4f8f', 3: '#5b8fd0', 4: C.cyan,
};
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const CELL = 10, GAP = 2, STEP = CELL + GAP;

function fmtDay(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function Heatmap({ weeks }: { weeks: GitHubContributionWeek[] }) {
  const [hovered, setHovered] = useState<{ date: string; count: number } | null>(null);
  const monthLabels: { left: number; label: string }[] = [];
  let prevMonth = -1;
  weeks.forEach((week, wi) => {
    if (week.days.length > 0 && week.days[0].date) {
      const m = new Date(week.days[0].date + 'T12:00:00').getMonth();
      if (m !== prevMonth) { monthLabels.push({ left: wi * STEP, label: MONTH_NAMES[m] }); prevMonth = m; }
    }
  });

  return (
    <motion.div
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
      transition={{ duration: 0.5, ease }}
      className="rounded-xl border p-5" style={{ borderColor: C.line, background: C.panel }}
    >
      <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>contribution calendar</p>
      <div className="flex gap-2 overflow-x-auto">
        <div className="flex flex-col shrink-0" style={{ gap: GAP, marginTop: 18 }}>
          {DAY_LABELS.map((label, i) => (
            <div key={i} style={{ height: CELL, width: 26 }} className="flex items-center justify-end">
              {label && <span className="text-[8px] leading-none" style={{ color: C.dim }}>{label}</span>}
            </div>
          ))}
        </div>
        <div>
          <div className="relative h-[18px]">
            {monthLabels.map(({ left, label }) => (
              <span key={label + left} className="absolute text-[8px]" style={{ left, color: C.dim }}>{label}</span>
            ))}
          </div>
          <div className="flex" style={{ gap: GAP }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                {week.days.map((day, di) => (
                  <div
                    key={di}
                    style={{ width: CELL, height: CELL, borderRadius: 2, background: LEVEL_COLORS[day.level ?? 0], cursor: day.date ? 'crosshair' : 'default' }}
                    onMouseEnter={() => day.date && setHovered({ date: day.date, count: day.count })}
                    onMouseLeave={() => setHovered(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t flex items-center justify-between gap-4" style={{ borderColor: C.line }}>
        <span className="text-[11px] truncate" style={{ color: C.dim }}>
          {hovered ? `${fmtDay(hovered.date)}: ${hovered.count} contribution${hovered.count !== 1 ? 's' : ''}` : 'Hover a day to see details'}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px]" style={{ color: C.dim }}>Less</span>
          {([0, 1, 2, 3, 4] as const).map((lvl) => (
            <div key={lvl} style={{ width: 8, height: 8, borderRadius: 2, background: LEVEL_COLORS[lvl] }} />
          ))}
          <span className="text-[9px]" style={{ color: C.dim }}>More</span>
        </div>
      </div>
    </motion.div>
  );
}

interface Props {
  github: GitHubStats | null;
  wakatime: WakaTimeStats | null;
}

export default function StatsSection({ github, wakatime }: Props) {
  if (!github && !wakatime) return null; // no fabricated fallback -- section just doesn't render

  return (
    <section id="stats" className="px-6 md:px-10 pb-24 scroll-mt-20" style={{ fontFamily: 'var(--font-sans-body)' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={view}
          transition={{ duration: 0.5, ease }}
          className="mb-8"
        >
          <p className="text-[11px] tracking-[0.25em] uppercase" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>proof of work</p>
        </motion.div>

        {github && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatTile label="Contributions" value={github.totalContributions} icon={Activity} color={C.violet} delay={0} />
            <StatTile label="Repositories" value={github.publicRepos} icon={GitBranch} color={C.text} delay={0.05} />
            <StatTile label="Current streak" value={`${github.currentStreak ?? 0}d`} icon={Zap} color="#f5a524" delay={0.1} />
            {wakatime && <StatTile label="Coding, 30d" value={wakatime.totalText} icon={Clock} color={C.cyan} delay={0.15} />}
          </div>
        )}

        {github?.contributionCalendar && github.contributionCalendar.length > 0 && (
          <div className="mb-4"><Heatmap weeks={github.contributionCalendar} /></div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {github && github.topLanguages.length > 0 && (
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={view} transition={{ duration: 0.5, ease }}
              className="rounded-xl border p-5" style={{ borderColor: C.line, background: C.panel }}
            >
              <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>top languages · github</p>
              <div className="flex flex-col gap-3">
                {github.topLanguages.slice(0, 5).map((lang, i) => (
                  <LangBar key={lang.name} name={lang.name} percentage={lang.percentage} color={lang.color} delay={i * 0.04} />
                ))}
              </div>
            </motion.div>
          )}
          {wakatime && wakatime.topLanguages.length > 0 && (
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={view} transition={{ duration: 0.5, ease }}
              className="rounded-xl border p-5" style={{ borderColor: C.line, background: C.panel }}
            >
              <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>editor time · wakatime</p>
              <div className="flex flex-col gap-3">
                {wakatime.topLanguages
                  .filter((lang) => lang.name.toLowerCase() !== 'markdown')
                  .slice(0, 5)
                  .map((lang, i) => (
                    <LangBar key={lang.name} name={lang.name} percentage={lang.percentage} color={lang.color ?? C.cyan} delay={i * 0.04} />
                  ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
