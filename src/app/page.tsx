import HomeClient from '@/components/home/HomeClient';
import { getGitHubStats } from '@/lib/stats/github';
import { getWakaTimeStats } from '@/lib/stats/wakatime';
import type { GitHubStats, WakaTimeStats } from '@/types/index';

// Home now also carries what used to live at /dashboard -- real GitHub and
// WakaTime numbers, fetched by calling the same functions the API routes
// use directly (not by fetching this app's own /api/* routes over HTTP,
// which can fail silently during build/ISR since the route may not be
// reachable yet at that point).

async function fetchGitHub(): Promise<GitHubStats | null> {
  try {
    return await getGitHubStats();
  } catch (err) {
    console.error('[page:/] GitHub stats failed:', err);
    return null;
  }
}

async function fetchWakaTime(): Promise<WakaTimeStats | null> {
  try {
    return await getWakaTimeStats();
  } catch (err) {
    console.error('[page:/] WakaTime stats failed:', err);
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
