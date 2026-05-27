import { NextResponse } from 'next/server';
import type {
  GitHubStats,
  GitHubLanguage,
  GitHubContributionWeek,
  GitHubContributionDay,
} from '@/types/index';

export const revalidate = 3600; // re-fetch at most once per hour

// ─── Constants ────────────────────────────────────────────────────────────────

const GH_GRAPHQL = 'https://api.github.com/graphql';
const GH_REST    = 'https://api.github.com';

const LEVEL_MAP: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE:             0,
  FIRST_QUARTILE:   1,
  SECOND_QUARTILE:  2,
  THIRD_QUARTILE:   3,
  FOURTH_QUARTILE:  4,
};

// ─── GraphQL query ────────────────────────────────────────────────────────────

const QUERY = /* graphql */ `
  query ($login: String!) {
    user(login: $login) {
      repositories(
        first: 100
        ownerAffiliations: OWNER
        isFork: false
        privacy: PUBLIC
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        nodes {
          stargazerCount
          forkCount
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

// ─── Raw GraphQL types ────────────────────────────────────────────────────────

interface RawDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

interface RawWeek {
  contributionDays: RawDay[];
}

interface RawLangEdge {
  size: number;
  node: { name: string; color: string | null };
}

interface RawRepo {
  stargazerCount: number;
  forkCount: number;
  languages: { edges: RawLangEdge[] };
}

interface RawGQLUser {
  repositories: { totalCount: number; nodes: RawRepo[] };
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
      weeks: RawWeek[];
    };
  };
}

interface RawGQLResponse {
  data?: { user: RawGQLUser | null };
  errors?: { message: string }[];
}

interface RawRestUser {
  public_repos: number;
  followers: number;
  following: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function aggregateLanguages(repos: RawRepo[]): GitHubLanguage[] {
  const totals = new Map<string, { bytes: number; color: string | null }>();

  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const prev = totals.get(edge.node.name);
      totals.set(edge.node.name, {
        bytes: (prev?.bytes ?? 0) + edge.size,
        color: edge.node.color ?? prev?.color ?? null,
      });
    }
  }

  const totalBytes = [...totals.values()].reduce((sum, v) => sum + v.bytes, 0);
  if (totalBytes === 0) return [];

  return [...totals.entries()]
    .map(([name, { bytes, color }]) => ({
      name,
      bytes,
      color:      color ?? undefined,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10, // 1 decimal
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);
}

function mapCalendar(rawWeeks: RawWeek[]): GitHubContributionWeek[] {
  return rawWeeks.map((week) => ({
    days: week.contributionDays.map((d): GitHubContributionDay => ({
      date:  d.date,
      count: d.contributionCount,
      level: LEVEL_MAP[d.contributionLevel] ?? 0,
    })),
  }));
}

function computeStreaks(calendar: GitHubContributionWeek[]): {
  current: number;
  longest: number;
} {
  const days = calendar
    .flatMap((w) => w.days)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Longest streak — forward pass
  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.count > 0) { run++; longest = Math.max(longest, run); }
    else              { run = 0; }
  }

  // Current streak — walk backwards from most recent day
  const today = new Date().toISOString().slice(0, 10);
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    // Skip today if it has no contributions yet (day isn't over)
    if (d.date === today && d.count === 0) continue;
    if (d.count > 0) current++;
    else             break;
  }

  return { current, longest };
}

// ─── Fallback data ────────────────────────────────────────────────────────────

function fallback(): GitHubStats {
  return {
    totalRepos:          0,
    publicRepos:         0,
    totalStars:          0,
    totalForks:          0,
    followers:           0,
    following:           0,
    totalContributions:  0,
    currentStreak:       0,
    longestStreak:       0,
    topLanguages:        [],
    contributionCalendar:[],
    fetchedAt:           new Date().toISOString(),
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET() {
  const token    = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (!token || !username) {
    console.warn('[github/route] GITHUB_TOKEN or GITHUB_USERNAME not set — returning fallback');
    return NextResponse.json(fallback());
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    // ── GraphQL: contributions + repos + languages ──
    const gqlRes = await fetch(GH_GRAPHQL, {
      method:  'POST',
      headers: authHeaders,
      body:    JSON.stringify({ query: QUERY, variables: { login: username } }),
      next:    { revalidate: 3600 },
    });

    if (!gqlRes.ok) {
      throw new Error(`GraphQL HTTP ${gqlRes.status}: ${await gqlRes.text()}`);
    }

    const gql: RawGQLResponse = await gqlRes.json();

    if (gql.errors?.length) {
      throw new Error(`GraphQL errors: ${gql.errors.map((e) => e.message).join('; ')}`);
    }

    const user = gql.data?.user;
    if (!user) throw new Error('GitHub user not found');

    // ── REST: followers / following ──
    let restUser: RawRestUser | null = null;
    try {
      const restRes = await fetch(`${GH_REST}/users/${username}`, {
        headers: authHeaders,
        next:    { revalidate: 3600 },
      });
      if (restRes.ok) restUser = (await restRes.json()) as RawRestUser;
    } catch (err) {
      console.warn('[github/route] REST fetch failed, continuing without followers:', err);
    }

    // ── Aggregate ──
    const repos    = user.repositories.nodes;
    const calendar = mapCalendar(
      user.contributionsCollection.contributionCalendar.weeks,
    );
    const { current, longest } = computeStreaks(calendar);

    const totalStars = repos.reduce((s, r) => s + r.stargazerCount, 0);
    const totalForks = repos.reduce((s, r) => s + r.forkCount,      0);

    const stats: GitHubStats = {
      totalRepos:           user.repositories.totalCount,
      publicRepos:          restUser?.public_repos ?? user.repositories.totalCount,
      totalStars,
      totalForks,
      followers:            restUser?.followers,
      following:            restUser?.following,
      totalContributions:
        user.contributionsCollection.contributionCalendar.totalContributions,
      currentStreak:        current,
      longestStreak:        longest,
      topLanguages:         aggregateLanguages(repos),
      contributionCalendar: calendar,
      fetchedAt:            new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (err) {
    console.error('[github/route] fetch failed:', err);
    return NextResponse.json(
      { ...fallback(), error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
