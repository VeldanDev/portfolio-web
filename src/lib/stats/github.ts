import type {
  GitHubStats,
  GitHubLanguage,
  GitHubContributionWeek,
  GitHubContributionDay,
} from '@/types/index';

// Core GitHub stats fetch, called directly by both app/api/github/route.ts
// and the Home page's server component -- never over HTTP to itself. A
// server component fetching its own API route by absolute URL is a known
// footgun: it can fail silently during build/ISR since the route may not
// be reachable yet, and the failure gets swallowed by the caller's
// try/catch with no visible error. Calling this function directly removes
// that whole failure class.

const GH_GRAPHQL = 'https://api.github.com/graphql';
const GH_REST    = 'https://api.github.com';

const LEVEL_MAP: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE:             0,
  FIRST_QUARTILE:   1,
  SECOND_QUARTILE:  2,
  THIRD_QUARTILE:   3,
  FOURTH_QUARTILE:  4,
};

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

// Markup / styling / config / doc languages inflate byte counts (a single generated
// CSS or HTML file dwarfs real code) and bury the programming languages that actually
// signal skill. Excluded from the fallback aggregator so Top Languages reflects the
// work, not file size, if the curated CODE_STACK below is ever emptied out.
const NON_CODE = new Set([
  'css', 'scss', 'sass', 'less', 'stylus', 'postcss',
  'html', 'xml', 'xslt', 'svg',
  'blade', 'handlebars', 'mustache', 'ejs', 'pug', 'jade', 'haml', 'liquid', 'twig',
  'markdown', 'mdx', 'tex', 'roff', 'rich text format',
  'dockerfile', 'makefile', 'cmake', 'batchfile', 'procfile',
  'jupyter notebook', 'vim script', 'vim snippet', 'hcl', 'nix',
  'json', 'yaml', 'toml', 'ini', 'dotenv', 'editorconfig', 'gitignore',
]);

// Curated primary stack — reflects ALL projects (public, private, and local), which
// public-repo byte counts cannot: the byte view is dominated by generated CSS/HTML and
// misses private TS apps (prime-property, hl-finance, shift-drives) and local Python
// tools. Ordered by real emphasis across the whole body of work. Colors are GitHub's.
const CODE_STACK: GitHubLanguage[] = [
  { name: 'Python',     percentage: 28, bytes: 28000, color: '#3572A5' },
  { name: 'TypeScript', percentage: 26, bytes: 26000, color: '#3178c6' },
  { name: 'JavaScript', percentage: 15, bytes: 15000, color: '#f1e05a' },
  { name: 'PHP',        percentage: 12, bytes: 12000, color: '#4F5D95' },
  { name: 'C / C++',    percentage: 8,  bytes: 8000,  color: '#f34b7d' },
  { name: 'Bash',       percentage: 6,  bytes: 6000,  color: '#89e051' },
  { name: 'SQL',        percentage: 5,  bytes: 5000,  color: '#e38c00' },
];

function aggregateLanguages(repos: RawRepo[]): GitHubLanguage[] {
  const totals = new Map<string, { bytes: number; color: string | null }>();

  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      if (NON_CODE.has(edge.node.name.toLowerCase())) continue;
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
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
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

function computeStreaks(calendar: GitHubContributionWeek[]): { current: number; longest: number } {
  const days = calendar
    .flatMap((w) => w.days)
    .sort((a, b) => a.date.localeCompare(b.date));

  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.count > 0) { run++; longest = Math.max(longest, run); }
    else              { run = 0; }
  }

  const today = new Date().toISOString().slice(0, 10);
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if (d.date === today && d.count === 0) continue;
    if (d.count > 0) current++;
    else             break;
  }

  return { current, longest };
}

export function githubFallback(): GitHubStats {
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

/** Fetches and aggregates real GitHub stats. Throws on failure -- callers decide the fallback. */
export async function getGitHubStats(): Promise<GitHubStats> {
  const token    = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (!token || !username) {
    console.warn('[stats/github] GITHUB_TOKEN or GITHUB_USERNAME not set — returning fallback');
    return githubFallback();
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

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

  let restUser: RawRestUser | null = null;
  try {
    const restRes = await fetch(`${GH_REST}/users/${username}`, {
      headers: authHeaders,
      next:    { revalidate: 3600 },
    });
    if (restRes.ok) restUser = (await restRes.json()) as RawRestUser;
  } catch (err) {
    console.warn('[stats/github] REST fetch failed, continuing without followers:', err);
  }

  const repos    = user.repositories.nodes;
  const calendar = mapCalendar(user.contributionsCollection.contributionCalendar.weeks);
  const { current, longest } = computeStreaks(calendar);

  const totalStars = repos.reduce((s, r) => s + r.stargazerCount, 0);
  const totalForks = repos.reduce((s, r) => s + r.forkCount,      0);

  return {
    totalRepos:           user.repositories.totalCount,
    publicRepos:          restUser?.public_repos ?? user.repositories.totalCount,
    totalStars,
    totalForks,
    followers:            restUser?.followers,
    following:            restUser?.following,
    totalContributions:   user.contributionsCollection.contributionCalendar.totalContributions,
    currentStreak:        current,
    longestStreak:        longest,
    topLanguages:         CODE_STACK.length ? CODE_STACK : aggregateLanguages(repos),
    contributionCalendar: calendar,
    fetchedAt:            new Date().toISOString(),
  };
}
