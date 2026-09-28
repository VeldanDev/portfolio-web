// Single source for every project shown on /projects and /projects/[id].
// caseStudy is optional -- only the projects with a real, verifiable write-up
// get one. A project with no caseStudy just doesn't render a "Read more"
// link; nothing is invented to fill the gap.

export type Cat = 'ai' | 'security' | 'web' | 'mobile';
export type St = 'live' | 'wip' | 'done';

export interface CaseStudy {
  problem: string;
  approach: string;
  architecture: { label: string; detail: string }[];
  screenshot?: string; // path under /public, real asset only
  screenshotAlt?: string;
  terminalOutput?: string; // real captured stdout from actually running the tool
  metrics?: { label: string; value: string }[];
}

export interface Project {
  id: string;
  title: string;
  cat: Cat;
  catLabel: string;
  status: St;
  desc: string;
  stack: string[];
  github: string | null;
  demo: string | null;
  featured?: boolean;
  image?: string;
  caseStudy?: CaseStudy;
}

export const CAT_COLOR: Record<Cat, string> = {
  ai: '#8b7cff', security: '#45e0d0', web: '#6ea8ff', mobile: '#f5a524',
};
export const ST_META: Record<St, { c: string; l: string }> = {
  live: { c: '#3ee6a0', l: 'live' }, wip: { c: '#f5a524', l: 'in progress' }, done: { c: '#6ea8ff', l: 'shipped' },
};

export const PROJECTS: Project[] = [
  {
    id: 'scepter', title: 'Scepter', cat: 'ai', catLabel: 'AI tooling', status: 'live', featured: true,
    desc: 'Zero-dependency CLI that checks whether an MCP server is alive, maintained, and safe before you wire it into an agent. Runs health, wrap, report, and badge commands. Published on npm as scepter-mcp.',
    stack: ['TypeScript', 'Node', 'MCP', 'CLI'],
    github: 'https://github.com/VeldanDev/scepter', demo: 'https://www.npmjs.com/package/scepter-mcp',
    caseStudy: {
      problem:
        'More than half of published MCP servers are already dead or unmaintained, and agent builders wire them into production without any way to check. There was no single command that answered "is this safe to depend on?"',
      approach:
        'Scepter reads registry and repository metadata (npm + GitHub) and scores a server on four signals, with zero runtime dependencies so it stays fast to install via npx. Beyond the static check, a wrap mode sits between an agent and the real MCP server as a transparent proxy: every tool call, its result, timing, and any error gets logged locally, so a developer can see how a server actually behaves in production, not just what its README claims.',
      architecture: [
        { label: 'Health scoring', detail: 'Four signals -- activity (last publish/push), maintained (archived flag, license, releases), provenance (stars, maintainers, issues), and MCP fit -- combined into a single score with a healthy/caution/risky verdict.' },
        { label: 'Proxy wrap', detail: 'scepter wrap sits in the MCP client config in place of the real server, forwards every byte unchanged, and records call-level telemetry to ~/.scepter. Nothing leaves the machine.' },
        { label: 'CI-friendly exit codes', detail: 'Exit code 1 on a risky verdict, so scepter check can gate a CI pipeline before a risky server gets deployed.' },
        { label: 'Badge generation', detail: 'scepter badge prints a copy-paste Markdown health badge for a project README, sourced from the same live score.' },
      ],
      screenshot: '/projects/scepter-demo.gif',
      screenshotAlt: 'Scepter CLI running a health check and printing a healthy/caution/risky verdict in the terminal',
    },
  },
  {
    id: 'spencerweb', title: 'SpencerWeb', cat: 'security', catLabel: 'Security', status: 'live', featured: true,
    desc: 'Web vulnerability scanner covering SQLi, XSS, CSRF, SSL issues, open ports, and exposed files, mapped to the OWASP Top 10. Ships a live dashboard and auto-generated PDF reports. Built as my final project.',
    stack: ['Python', 'Node', 'OWASP', 'ReportLab'],
    github: 'https://github.com/VeldanDev/SpencerWeb', demo: null,
    caseStudy: {
      problem:
        'Small businesses and student projects rarely get a real security audit before going live -- commercial scanners are expensive or built for enterprise teams, and free tools tend to flood a report with false positives instead of ranked, actionable findings.',
      approach:
        'Built as my Computer Engineering final project (TA, Politeknik Negeri Medan), SpencerWeb runs 10 scanning modules end to end: a crawler maps the site and every form first, then passive checks (headers, SSL/TLS, exposed files, CMS/plugin fingerprinting) run alongside active checks (SQL injection with error/boolean/time-based detection, reflected and stored XSS, CSRF token analysis, port reconnaissance). Findings map directly to OWASP Top 10 categories and get scored with CVSS, then compiled into a client-ready PDF.',
      architecture: [
        { label: 'CLI scanner (Python)', detail: '10 modules from deep crawl through active exploitation checks, runnable standalone for CI or headless audits.' },
        { label: 'Web dashboard (Node/Express)', detail: 'Real-time scan progress, historical scan comparison, and a visual report -- the same engine, a UI on top.' },
        { label: 'PDF reporting (ReportLab)', detail: 'Auto-generates a professional, partner-ready report from the same scan data the dashboard shows live.' },
        { label: 'SQL injection module', detail: 'The one module explicitly marked "verified" in its own docs: error-based, boolean-based, and time-based detection, not just pattern matching on response text.' },
      ],
      screenshot: '/projects/spencerweb-demo.png',
      screenshotAlt: 'SpencerWeb dashboard new-scan form: URL target field and Fast/Standard/Deep scan mode selection',
    },
  },
  {
    id: 'tiburon', title: 'Tiburon', cat: 'ai', catLabel: 'AI systems', status: 'wip', featured: true,
    desc: 'Self-hosted AI agent with 18 tools across voice, vision, and automation. Runs on Telegram, executes scheduled cron jobs, and gates any high-impact action (file deletion, sending messages, restarting services) behind an explicit permission step before acting, instead of running unattended.',
    stack: ['Python', 'OpenClaw', 'LLM', 'Agents', 'Automation'],
    github: 'https://github.com/VeldanDev/otak', demo: null,
    caseStudy: {
      problem:
        'Most "AI agent" demos stop at answering questions. Turning that into something that runs unattended and touches real systems (a real Telegram account, a real filesystem, real scheduled jobs) raises a different problem: how do you get the benefit of autonomy without the risk of an agent doing something destructive on its own.',
      approach:
        'Tiburon runs on the OpenClaw gateway framework with a multi-provider model fallback chain, so a single provider outage or rate limit does not take the whole agent down. It answers on Telegram, runs cron-scheduled jobs unattended, and reaches 18 tools spanning voice, vision, and automation -- but every high-impact action (deleting files, sending a message on the owner\'s behalf, restarting a service) stops and asks for explicit permission first, rather than assuming autonomy is always safe.',
      architecture: [
        { label: 'Multi-provider fallback', detail: 'Model calls fall through an ordered chain of providers, so the agent keeps working when one provider is down, rate-limited, or out of credits.' },
        { label: 'Permission gate', detail: 'Actions are classified by impact; anything that could cause real-world harm (deletion, outbound messages, service restarts) requires an explicit yes from the owner before it runs.' },
        { label: 'Telegram front end', detail: 'The primary interface for day-to-day use: questions, approvals, and status all flow through a Telegram bot.' },
        { label: 'Scheduled automation', detail: 'Cron-driven jobs handle recurring work (monitoring, reports, routine checks) without a human kicking each one off.' },
      ],
    },
  },
  {
    id: 'specter', title: 'Specter 2.0', cat: 'security', catLabel: 'OSINT', status: 'live',
    desc: 'CLI OSINT and reconnaissance toolkit -- network scanning, Wi-Fi and Bluetooth analysis, packet sniffing, and threat detection -- built lean enough to run on a Raspberry Pi Zero.',
    stack: ['Python', 'OSINT', 'Recon', 'CLI'],
    github: 'https://github.com/VeldanDev/specter-2.0', demo: null,
    caseStudy: {
      problem:
        'Field recon and OSINT work usually means carrying a laptop and switching between five different single-purpose tools. A lean, single-binary toolkit that runs on hardware as small as a Pi Zero closes that gap for portable, low-footprint recon.',
      approach:
        'Specter boots into a menu-driven terminal UI with a live mini system dashboard (CPU/RAM/disk) before handing off to whichever module is needed: network and Wi-Fi scanning, Bluetooth discovery, packet sniffing, OSINT lookups, and a threat-detection pass, all sharing the same core display and system layer so the toolkit stays small enough for constrained hardware.',
      architecture: [
        { label: 'Modular toolkit', detail: 'Nine independent modules (network_scan, wifi_analysis, bluetooth_scan, packet_sniffer, osint, threat_detect, system_monitor, net_monitor, toolkit) sharing one core.' },
        { label: 'Startup diagnostics', detail: 'boot.py runs system checks and renders a live resource snapshot before the menu loads, so you know the hardware can handle the session before starting one.' },
        { label: 'Constrained-hardware target', detail: 'Built and tuned to run on a Raspberry Pi Zero, not just a full laptop -- every module has to justify its footprint.' },
      ],
      terminalOutput:
`  ███████╗██████╗ ███████╗ ██████╗████████╗██████╗ ███████╗
  ██╔════╝██╔══██╗██╔════╝██╔════╝╚══██╔══╝██╔══██╗██╔════╝
  ███████╗██████╔╝█████╗  ██║        ██║   ██████╔╝█████╗
  ╚════██║██╔═══╝ ██╔══╝  ██║        ██║   ██╔══██╗██╔══╝
  ███████║██║     ███████╗╚██████╗   ██║   ██║  ██║███████╗
  ╚══════╝╚═╝     ╚══════╝ ╚═════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝

  v2.0.0  Portable Network Inspection & Security Toolkit

  ╔════════════════════ System Check ════════════════════╗

  [*] Host: LAPTOP-G6BEAF5A  |  OS: Windows  |  Arch: AMD64
  [+] Python 3.10.11
  [!] Not running as Administrator -- some modules may fail
  [+] nmap found

  All systems nominal. Launching ...

  ╔═════════════════════ Main Menu ══════════════════════╗

  [1]  [✓]  Network Scanning
  [2]  [✓]  WiFi Analysis
  [3]  [~]  Bluetooth Scanning
  [4]  [✓]  OSINT Tools
  [5]  [✓]  System Monitoring
  [6]  [✓]  Network Monitor
  [7]  [✓]  Packet Sniffer
  [8]  [✓]  Threat Detection
  [9]  [✓]  Toolkit

  [H]  [ ]  Help & About
  [L]  [ ]  View Saved Logs
  [R]  [ ]  Generate HTML Report
  [0]       Exit

  Legend: [✓] Available  [~] Limited (this OS)`,
    },
  },
  {
    id: 'agenttrace', title: 'agenttrace', cat: 'ai', catLabel: 'Dev tools', status: 'live',
    desc: 'Observability for AI coding agents. Wires into the run loop to trace tool calls, timing, and failures so you can see what the agent actually did, not just its final answer.',
    stack: ['TypeScript', 'Node', 'CLI'],
    github: 'https://github.com/VeldanDev/agenttrace', demo: null,
    caseStudy: {
      problem:
        'When an AI coding agent does something wrong, the only evidence is usually its final answer -- there\'s no record of which files it touched, how long each step took, or where the run actually went off track.',
      approach:
        'agenttrace wires directly into Claude Code\'s hook system (PreToolUse, PostToolUse, Stop), configured automatically the first time you run it. From then on, every tool call in the project is appended to a local JSONL file, one file per session -- timestamp, tool name, a truncated view of its input, file paths touched, and a rough token estimate. agenttrace replay turns that raw log back into a readable terminal timeline.',
      architecture: [
        { label: 'Hook-based capture', detail: 'Configures Claude Code\'s own hook system in .claude/settings.json -- no manual instrumentation, no wrapper around the agent itself.' },
        { label: 'JSONL session log', detail: 'One line per tool call, one file per session, kept local under .agentlog/ (auto-added to .gitignore). Nothing leaves the machine.' },
        { label: 'Terminal replay', detail: 'Reconstructs a session as a timestamped timeline instead of a raw log dump, so a slow or failing tool call is easy to spot.' },
      ],
      screenshot: '/projects/agenttrace-demo.png',
      screenshotAlt: 'agenttrace replaying a recorded Claude Code session as a terminal timeline',
    },
  },
  {
    id: 'objdetect', title: 'Object Detection', cat: 'ai', catLabel: 'Computer vision', status: 'done',
    desc: 'Real-time object detection built with TensorFlow. Identifies and labels objects from a live camera feed.',
    stack: ['Python', 'TensorFlow', 'OpenCV'],
    github: null, demo: null,
    caseStudy: {
      problem:
        'Most object-detection tutorials stop at running a model against a static image. Getting it to run against a live camera feed without lagging, and keeping the label set correct and scoped, is a different problem.',
      approach:
        'Loads a pretrained SSD MobileNet V2 from TensorFlow Hub once, then runs an OpenCV capture loop: read a frame, convert BGR to RGB, run inference, draw the results, repeat. The label map is deliberately trimmed to a small, correct subset rather than the full 90-class COCO set, since a smaller label set is easier to verify by hand for a class assignment.',
      architecture: [
        { label: 'TensorFlow Hub model', detail: 'SSD MobileNet V2, loaded once at startup and reused across every frame instead of reloading per inference.' },
        { label: 'OpenCV capture loop', detail: 'Reads live frames from a camera device, handles the BGR-to-RGB conversion TensorFlow expects, and runs inference in the same loop.' },
        { label: 'Trimmed label map', detail: 'A small, hand-picked label set instead of the full COCO taxonomy -- kept deliberately narrow and verifiably correct.' },
      ],
    },
  },
  {
    id: 'shift-drives', title: 'Shift Drives', cat: 'web', catLabel: 'Platform', status: 'live',
    desc: 'Full-stack digital agency platform built with Next.js: service catalog, tiered pricing, and a WhatsApp-integrated consultation flow.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    github: null, demo: 'https://shift-drives.vercel.app',
    caseStudy: {
      problem:
        'Freelance and small-agency web work usually has no real storefront -- pricing hidden behind a contact form, no way to browse actual example work before reaching out and starting a conversation.',
      approach:
        'Shift Drives is a live, deployed agency platform: a catalog of 29 curated template designs across 5 categories (each with its own working demo), transparent tiered pricing shown up front, and a WhatsApp-first conversion flow where every call-to-action opens a pre-filled message instead of a contact form.',
      architecture: [
        { label: 'Next.js App Router + Vercel', detail: 'Auto-deploys to production on every push to main; no manual deploy step.' },
        { label: 'Template catalog', detail: '29 curated designs across 5 categories, each backed by a real, clickable demo rather than a static screenshot.' },
        { label: 'WhatsApp-first conversion', detail: 'Every CTA opens a pre-filled WhatsApp message built from a single WA_NUMBER source, removing contact-form friction entirely.' },
      ],
    },
  },
  {
    id: 'prime-property', title: 'Prime Property', cat: 'web', catLabel: 'Web app', status: 'done',
    desc: 'Property management platform with listings, authentication, and an admin dashboard, built on Next.js and Prisma.',
    stack: ['Next.js', 'Prisma', 'PostgreSQL', 'Auth'],
    github: null, demo: null,
    caseStudy: {
      problem:
        'Property management for a small agency or landlord usually ends up scattered across spreadsheets -- no shared listings view, no real access control, no audit trail on who changed what.',
      approach:
        'A full-stack Next.js app backed by Prisma and PostgreSQL for real relational listings data, Radix UI primitives wired directly for accessible dialogs/selects/checkboxes rather than a generic form template, and bcrypt-hashed authentication instead of a bolted-on login screen.',
      architecture: [
        { label: 'Next.js + Prisma + PostgreSQL', detail: 'Real relational data for listings, not a mocked or in-memory dataset.' },
        { label: 'Radix UI primitives', detail: 'Accessible dialog, select, checkbox, and radio components wired directly into the forms, not a generic UI kit dropped in unmodified.' },
        { label: 'bcryptjs auth', detail: 'Passwords hashed properly at rest instead of stored in plaintext or behind a fake auth layer.' },
      ],
    },
  },
  {
    id: 'hl-finance', title: 'HL Internal Finance', cat: 'web', catLabel: 'Web app', status: 'done',
    desc: 'Internal finance management app for tracking budgets, transactions, and reporting inside an organization.',
    stack: ['Next.js', 'TypeScript', 'Prisma'],
    github: null, demo: null,
    caseStudy: {
      problem:
        'Internal budget tracking for a small organization usually lives in a shared spreadsheet: no real audit trail, no PDF exports for stakeholders, and rounding errors from doing money math in plain floating point.',
      approach:
        'A Next.js finance app that uses decimal.js for exact monetary arithmetic instead of native floating-point numbers, @react-pdf/renderer to generate real PDF reports as React components rather than calling out to an external service, and jose-signed JWT sessions backed by a Prisma/Postgres user store.',
      architecture: [
        { label: 'decimal.js for money', detail: 'Every monetary calculation goes through exact decimal arithmetic, sidestepping the classic 0.1 + 0.2 floating-point rounding bug.' },
        { label: '@react-pdf/renderer', detail: 'PDF reports generated server-side as real React components sharing the same data model as the UI, not a separate templating system.' },
        { label: 'jose + Prisma auth', detail: 'Signed JWT sessions backed by a real Postgres-via-Prisma user store, not a hardcoded credential.' },
      ],
    },
  },
  {
    id: 'uptimeguard', title: 'UptimeGuard', cat: 'web', catLabel: 'Service', status: 'wip',
    desc: 'Uptime monitoring service that pings endpoints on a schedule and alerts the moment something goes down.',
    stack: ['Bun', 'Elysia', 'Prisma', 'PostgreSQL'],
    github: null, demo: null,
    caseStudy: {
      problem:
        'Finding out an endpoint is down usually comes from a customer complaint, not a monitor -- cheap uptime tools tend to be either too basic (a single current-status flag) or too expensive for a side project.',
      approach:
        'A Bun + Elysia backend pings every monitored URL on a schedule with a 5-second timeout, then persists each check -- up/down, HTTP status code, latency -- as its own row via Prisma against Postgres, so history is queryable, not just a rolling "currently up" flag.',
      architecture: [
        { label: 'Elysia on Bun', detail: 'A lightweight, TypeScript-native HTTP framework on the Bun runtime instead of a heavier Node/Express stack.' },
        { label: 'Per-check persistence', detail: 'Every check (up/down, status code, latency) is its own Prisma row, so real history and trends are queryable, not just a live flag.' },
        { label: 'Timeout-bounded checks', detail: 'A 5-second AbortSignal.timeout on every fetch, so one slow or hanging endpoint can\'t stall the whole check loop.' },
      ],
    },
  },
  {
    id: 'asistenit', title: 'asistenIT', cat: 'ai', catLabel: 'AI assistant', status: 'wip',
    desc: 'An AI assistant for everyday IT tasks: answering questions, drafting scripts, and automating small chores from one chat interface.',
    stack: ['Python', 'Hugging Face', 'LLM'],
    github: null, demo: null,
    caseStudy: {
      problem:
        'Switching between five different single-purpose CLI tools for everyday IT tasks -- quick scripts, explanations, lookups -- breaks focus. A single chat interface that can actually help across all of them is faster.',
      approach:
        'A lightweight Python chat client against Hugging Face\'s hosted Inference API (Zephyr-7B-beta), with a system prompt explicitly tuned to treat follow-up questions as continuations of the same conversation instead of resetting context on every turn, and to stay on-topic rather than drifting.',
      architecture: [
        { label: 'Hugging Face Inference Client', detail: 'Calls a hosted Zephyr-7B endpoint rather than self-hosting a model, keeping the client itself thin.' },
        { label: 'Context-aware system prompt', detail: 'Explicitly instructed to treat a follow-up as continuing the prior answer\'s context, not a fresh, unrelated question.' },
      ],
    },
  },
  {
    id: 'angkringan', title: 'Angkringan Sedulur', cat: 'web', catLabel: 'Landing page', status: 'live',
    desc: 'Landing page for a local food business, hand-built with clean HTML, CSS, and JavaScript.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/VeldanDev/angkringan-sedulur', demo: null,
    caseStudy: {
      problem:
        'A local food business needs an online presence, but most "quick landing pages" end up as an obviously templated Wix or Carrd page with no real craft behind it.',
      approach:
        'Hand-built with plain HTML, CSS, and JavaScript -- no framework, no build step -- the smallest stack that still loads fast and looks intentional for a business that just needs one good page.',
      architecture: [
        { label: 'Static HTML/CSS/JS', detail: 'No framework or build pipeline for a single-page site that doesn\'t need one.' },
      ],
      screenshot: '/projects/angkringan-demo.png',
      screenshotAlt: 'Angkringan Sedulur landing page hero section',
    },
  },
  {
    id: 'cords', title: 'Cords', cat: 'mobile', catLabel: 'Mobile app', status: 'wip',
    desc: 'Cross-platform mobile app built with Capacitor, packaging a web UI into native Android and iOS.',
    stack: ['Next.js', 'Supabase', 'Capacitor'],
    github: null, demo: null,
    caseStudy: {
      problem:
        'Shipping to both Android and iOS from one codebase usually means committing to React Native\'s ecosystem, or paying the cost of two separate native codebases. Capacitor offers a third path for a team that already has a real web app.',
      approach:
        'The actual application -- UI and business logic -- is a Next.js 15 / React 19 app with Supabase handling auth, Postgres, and real-time subscriptions. Capacitor wraps that same web build into native Android and iOS shells, so the mobile apps ship the same code the web version runs.',
      architecture: [
        { label: 'Next.js 15 + React 19', detail: 'The real app logic and UI, shared across web and both mobile platforms.' },
        { label: 'Supabase', detail: 'Auth, Postgres, and real-time subscriptions without standing up a separate backend service.' },
        { label: 'Capacitor', detail: 'Wraps the web build into native Android/iOS projects; an apk build script is wired directly into package.json.' },
      ],
    },
  },
];

export const FILTERS: { v: 'all' | Cat; l: string }[] = [
  { v: 'all', l: 'All' }, { v: 'ai', l: 'AI' }, { v: 'security', l: 'Security' },
  { v: 'web', l: 'Web' }, { v: 'mobile', l: 'Mobile' },
];
