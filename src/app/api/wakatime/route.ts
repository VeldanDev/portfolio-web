import { NextResponse } from 'next/server';
import { getWakaTimeStats, wakatimeFallback } from '@/lib/stats/wakatime';

export const revalidate = 3600;

export async function GET() {
  try {
    return NextResponse.json(await getWakaTimeStats());
  } catch (err) {
    console.error('[wakatime/route] fetch failed:', err);
    return NextResponse.json(
      { ...wakatimeFallback(), error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
