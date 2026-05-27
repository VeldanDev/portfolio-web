import { NextResponse } from 'next/server';
import type {
  WakaTimeStats,
  WakaTimeLanguage,
  WakaTimeEditor,
  WakaTimeOS,
  WakaTimeProject,
} from '@/types/index';

export const revalidate = 3600;

// ─── Constants ────────────────────────────────────────────────────────────────

const WAKA_API = 'https://wakatime.com/api/v1';

// ─── Raw WakaTime API types ───────────────────────────────────────────────────

interface RawEntry {
  name: string;
  total_seconds: number;
  percent: number;
  /** Only present on language entries */
  color?: string | null;
  /** Pre-formatted text from WakaTime (e.g. "3 hrs 12 mins") */
  text?: string;
}

interface RawStats {
  total_seconds: number;
  total_seconds_including_other_language: number;
  daily_average_including_other_language: number;
  daily_average: number;
  range: string;        // e.g. "last_30_days"
  human_readable_range: string;
  languages:        RawEntry[];
  editors:          RawEntry[];
  operating_systems:RawEntry[];
  projects:         RawEntry[];
  is_coding_activity_visible: boolean;
  is_other_usage_visible:     boolean;
}

interface RawResponse {
  data: RawStats;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a raw second count to a human-readable string.
 * Examples: 45240 → "12 hrs 34 mins", 300 → "5 mins", 3600 → "1 hr"
 */
function secondsToText(seconds: number): string {
  if (seconds <= 0) return '0 mins';

  const hrs  = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs === 0)  return `${mins} min${mins !== 1 ? 's' : ''}`;
  if (mins === 0) return `${hrs} hr${hrs !== 1 ? 's' : ''}`;
  return `${hrs} hr${hrs !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
}

function mapLanguages(raw: RawEntry[]): WakaTimeLanguage[] {
  return raw
    .filter((e) => e.total_seconds > 0)
    .map((e) => ({
      name:         e.name,
      totalSeconds: e.total_seconds,
      totalText:    e.text ?? secondsToText(e.total_seconds),
      percentage:   Math.round(e.percent * 10) / 10,
      color:        e.color ?? undefined,
    }))
    .slice(0, 10);
}

function mapEditors(raw: RawEntry[]): WakaTimeEditor[] {
  return raw
    .filter((e) => e.total_seconds > 0)
    .map((e) => ({
      name:         e.name,
      totalSeconds: e.total_seconds,
      totalText:    e.text ?? secondsToText(e.total_seconds),
      percentage:   Math.round(e.percent * 10) / 10,
    }));
}

function mapOS(raw: RawEntry[]): WakaTimeOS[] {
  return raw
    .filter((e) => e.total_seconds > 0)
    .map((e) => ({
      name:         e.name,
      totalSeconds: e.total_seconds,
      totalText:    e.text ?? secondsToText(e.total_seconds),
      percentage:   Math.round(e.percent * 10) / 10,
    }));
}

function mapProjects(raw: RawEntry[]): WakaTimeProject[] {
  return raw
    .filter((e) => e.total_seconds > 0)
    .map((e) => ({
      name:         e.name,
      totalSeconds: e.total_seconds,
      totalText:    e.text ?? secondsToText(e.total_seconds),
      percentage:   Math.round(e.percent * 10) / 10,
    }))
    .slice(0, 10);
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

function fallback(): WakaTimeStats {
  return {
    totalText:           '0 mins',
    totalSeconds:        0,
    dailyAverageText:    '0 mins',
    dailyAverageSeconds: 0,
    rangeDays:           30,
    topLanguages:        [],
    topEditors:          [],
    topOS:               [],
    topProjects:         [],
    isCodingActivityVisible: false,
    fetchedAt:           new Date().toISOString(),
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET() {
  const apiKey = process.env.WAKATIME_API_KEY;

  if (!apiKey) {
    console.warn('[wakatime/route] WAKATIME_API_KEY not set — returning fallback');
    return NextResponse.json(fallback());
  }

  // WakaTime v1 accepts the API key as a Basic auth credential (base64-encoded)
  const encoded = Buffer.from(apiKey).toString('base64');

  try {
    const res = await fetch(
      `${WAKA_API}/users/current/stats/last_30_days`,
      {
        headers: {
          Authorization: `Basic ${encoded}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 },
      },
    );

    if (res.status === 403 || res.status === 401) {
      throw new Error(`WakaTime auth failed (${res.status}) — check WAKATIME_API_KEY`);
    }

    if (!res.ok) {
      throw new Error(`WakaTime HTTP ${res.status}: ${await res.text()}`);
    }

    const json: RawResponse = await res.json();
    const d = json.data;

    // Prefer the "including other language" total so it accounts for 100% of time
    const totalSeconds  = d.total_seconds_including_other_language || d.total_seconds;
    const dailyAvgSecs  = d.daily_average_including_other_language || d.daily_average;

    // Extract number of days from range string, e.g. "last_30_days" → 30
    const rangeDays = parseInt(d.range?.match(/\d+/)?.[0] ?? '30', 10);

    const stats: WakaTimeStats = {
      totalText:           secondsToText(totalSeconds),
      totalSeconds,
      dailyAverageText:    secondsToText(dailyAvgSecs),
      dailyAverageSeconds: dailyAvgSecs,
      rangeDays,
      topLanguages:        mapLanguages(d.languages        ?? []),
      topEditors:          mapEditors(d.editors            ?? []),
      topOS:               mapOS(d.operating_systems       ?? []),
      topProjects:         mapProjects(d.projects          ?? []),
      isCodingActivityVisible: d.is_coding_activity_visible ?? true,
      fetchedAt:           new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (err) {
    console.error('[wakatime/route] fetch failed:', err);
    return NextResponse.json(
      { ...fallback(), error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
