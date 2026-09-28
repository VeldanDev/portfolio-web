import HomeClient from '@/components/home/HomeClient';
import type { GitHubStats, WakaTimeStats } from '@/types/index';

// Home now also carries what used to live at /dashboard -- real GitHub and
// WakaTime numbers fetched server-side, same pattern as the old dashboard
// page had (parallel fetches, 1h revalidate, honest null on failure).

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return 'http://localhost:3000';
}

async function fetchGitHub(): Promise<GitHubStats | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/github`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<GitHubStats>;
  } catch {
    return null;
  }
}

async function fetchWakaTime(): Promise<WakaTimeStats | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/wakatime`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<WakaTimeStats>;
  } catch {
    return null;
  }
}

export default async function Home() {
  const [github, wakatime] = await Promise.allSettled([fetchGitHub(), fetchWakaTime()]);
  return (
    <HomeClient
      github={github.status === 'fulfilled' ? github.value : null}
      wakatime={wakatime.status === 'fulfilled' ? wakatime.value : null}
    />
  );
}
