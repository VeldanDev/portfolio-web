// ─── GitHub ───────────────────────────────────────────────────────────────────

export interface GitHubLanguage {
  name: string;
  /** Percentage of usage across repos (0–100) */
  percentage: number;
  color?: string;
  /** Raw byte count reported by GitHub */
  bytes?: number;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  url: string;
  homepageUrl?: string;
  stars: number;
  forks: number;
  watchers?: number;
  isArchived: boolean;
  isFork: boolean;
  primaryLanguage?: string;
  topics?: string[];
  updatedAt: string;
  createdAt?: string;
}

export interface GitHubContributionDay {
  date: string;
  count: number;
  /** 0 = no contributions, 4 = highest intensity */
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionWeek {
  days: GitHubContributionDay[];
}

export interface GitHubStats {
  totalRepos: number;
  publicRepos: number;
  privateRepos?: number;
  totalStars: number;
  totalForks?: number;
  followers?: number;
  following?: number;
  /** Total contributions in the last year */
  totalContributions: number;
  currentStreak?: number;
  longestStreak?: number;
  topLanguages: GitHubLanguage[];
  contributionCalendar?: GitHubContributionWeek[];
  /** ISO timestamp of the last successful fetch */
  fetchedAt?: string;
}

// ─── WakaTime ─────────────────────────────────────────────────────────────────

export interface WakaTimeLanguage {
  name: string;
  /** Human-readable total, e.g. "12 hrs 30 mins" */
  totalText: string;
  totalSeconds: number;
  percentage: number;
  color?: string;
}

export interface WakaTimeEditor {
  name: string;
  totalText: string;
  totalSeconds: number;
  percentage: number;
}

export interface WakaTimeOS {
  name: string;
  totalText: string;
  totalSeconds: number;
  percentage: number;
}

export interface WakaTimeProject {
  name: string;
  totalText: string;
  totalSeconds: number;
  percentage: number;
}

export interface WakaTimeStats {
  /** Human-readable total, e.g. "1,240 hrs 15 mins" */
  totalText: string;
  totalSeconds: number;
  /** Human-readable daily average, e.g. "3 hrs 24 mins" */
  dailyAverageText: string;
  dailyAverageSeconds: number;
  /** Days included in this summary */
  rangeDays: number;
  topLanguages: WakaTimeLanguage[];
  topEditors?: WakaTimeEditor[];
  topOS?: WakaTimeOS[];
  topProjects?: WakaTimeProject[];
  isCodingActivityVisible?: boolean;
  fetchedAt?: string;
}

// ─── Umami ────────────────────────────────────────────────────────────────────

export interface UmamiCountry {
  country: string;
  /** ISO 3166-1 alpha-2 code */
  code: string;
  visits: number;
  percentage?: number;
}

export interface UmamiPageStat {
  path: string;
  pageviews: number;
  uniqueVisitors?: number;
  avgDurationSeconds?: number;
  bounceRate?: number;
}

export interface UmamiReferrer {
  referrer: string;
  visits: number;
  percentage?: number;
}

export interface UmamiStats {
  pageviews: number;
  uniqueVisitors: number;
  visits: number;
  /** Bounce rate as a percentage (0–100) */
  bounceRate?: number;
  /** Average visit duration in seconds */
  avgDurationSeconds?: number;
  topCountries?: UmamiCountry[];
  topPages?: UmamiPageStat[];
  topReferrers?: UmamiReferrer[];
  /** ISO date range start (YYYY-MM-DD) */
  periodStart?: string;
  /** ISO date range end (YYYY-MM-DD) */
  periodEnd?: string;
  fetchedAt?: string;
}

// ─── MonkeyType ───────────────────────────────────────────────────────────────

export type MonkeyTypeMode = '15' | '30' | '60' | '120' | 'words' | 'quote' | 'zen' | 'custom';

export interface MonkeyTypePersonalBest {
  wpm: number;
  rawWpm?: number;
  accuracy: number;
  consistency?: number;
  mode: MonkeyTypeMode;
  timestamp?: number;
}

export interface MonkeyTypeStats {
  /** All-time best WPM across any test */
  bestWpm: number;
  /** Most recent test WPM */
  lastWpm?: number;
  /** Average WPM across all completed tests */
  avgWpm?: number;
  /** Best raw WPM (before error penalty) */
  bestRawWpm?: number;
  /** Best accuracy percentage (0–100) */
  bestAccuracy: number;
  /** Average accuracy across all tests */
  avgAccuracy?: number;
  testsCompleted: number;
  testsStarted?: number;
  /** Total time spent typing in seconds */
  totalTimeTypingSeconds?: number;
  personalBests?: Partial<Record<MonkeyTypeMode, MonkeyTypePersonalBest>>;
  fetchedAt?: string;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export type ProjectStatus = 'active' | 'completed' | 'archived' | 'wip';

export type ProjectCategory =
  | 'fullstack'
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'cli'
  | 'library'
  | 'other';

export interface Project {
  id: string;
  title: string;
  description: string;
  /** One-liner shown in cards/previews */
  shortDescription?: string;
  techStack: string[];
  status: ProjectStatus;
  category?: ProjectCategory;
  featured?: boolean;
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  /** Additional screenshots or demo GIFs */
  gallery?: string[];
  stars?: number;
  /** ISO date string (YYYY-MM-DD) */
  startedAt?: string;
  completedAt?: string;
}

// ─── Shared utility types ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error?: string;
  /** Whether the response was served from cache */
  cached?: boolean;
  fetchedAt?: string;
}
