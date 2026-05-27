import DashboardClient from '@/components/dashboard/DashboardClient';
import type { GitHubStats, WakaTimeStats } from '@/types/index';

// ─── Base URL ─────────────────────────────────────────────────────────────────

function getBaseUrl(): string {
  if (process.env.VERCEL_URL)          return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return 'http://localhost:3000';
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchGitHub(): Promise<GitHubStats | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/github`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<GitHubStats>;
  } catch {
    return null;
  }
}

async function fetchWakaTime(): Promise<WakaTimeStats | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/wakatime`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<WakaTimeStats>;
  } catch {
    return null;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  // Kick off both fetches in parallel — neither blocks the other
  const [github, wakatime] = await Promise.allSettled([
    fetchGitHub(),
    fetchWakaTime(),
  ]);

  return (
    <DashboardClient
      github={github.status === 'fulfilled' ? github.value : null}
      wakatime={wakatime.status === 'fulfilled' ? wakatime.value : null}
    />
  );
}
