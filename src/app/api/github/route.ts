import { NextResponse } from 'next/server';
import { getGitHubStats, githubFallback } from '@/lib/stats/github';

export const revalidate = 3600;

export async function GET() {
  try {
    return NextResponse.json(await getGitHubStats());
  } catch (err) {
    console.error('[github/route] fetch failed:', err);
    return NextResponse.json(
      { ...githubFallback(), error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
