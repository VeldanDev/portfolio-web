import type {
  WakaTimeStats,
  WakaTimeLanguage,
  WakaTimeEditor,
  WakaTimeOS,
  WakaTimeProject,
} from '@/types/index';

// Same rationale as lib/stats/github.ts: called directly, never fetched by
// the Home page over HTTP from its own /api/wakatime route.

const WAKA_API = 'https://wakatime.com/api/v1';

interface RawEntry {
  name: string;
  total_seconds: number;
  percent: number;
  color?: string | null;
  text?: string;
}

interface RawStats {
  total_seconds: number;
  total_seconds_including_other_language: number;
  daily_average_including_other_language: number;
  daily_average: number;
  range: string;
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

export function wakatimeFallback(): WakaTimeStats {
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

/** Fetches real WakaTime stats. Throws on failure -- callers decide the fallback. */
export async function getWakaTimeStats(): Promise<WakaTimeStats> {
  const apiKey = process.env.WAKATIME_API_KEY;

  if (!apiKey) {
    console.warn('[stats/wakatime] WAKATIME_API_KEY not set — returning fallback');
    return wakatimeFallback();
  }

  const encoded = Buffer.from(apiKey).toString('base64');

  const res = await fetch(`${WAKA_API}/users/current/stats/last_30_days`, {
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 },
  });

  if (res.status === 403 || res.status === 401) {
    throw new Error(`WakaTime auth failed (${res.status}) — check WAKATIME_API_KEY`);
  }
  if (!res.ok) {
    throw new Error(`WakaTime HTTP ${res.status}: ${await res.text()}`);
  }

  const json: RawResponse = await res.json();
  const d = json.data;

  const totalSeconds = d.total_seconds_including_other_language || d.total_seconds;
  const dailyAvgSecs  = d.daily_average_including_other_language || d.daily_average;
  const rangeDays     = parseInt(d.range?.match(/\d+/)?.[0] ?? '30', 10);

  return {
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
}
