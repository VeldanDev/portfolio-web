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
  },
  {
    id: 'objdetect', title: 'Object Detection', cat: 'ai', catLabel: 'Computer vision', status: 'done',
    desc: 'Real-time object detection built with TensorFlow. Identifies and labels objects from a live camera feed.',
    stack: ['Python', 'TensorFlow', 'OpenCV'],
    github: null, demo: null,
  },
  {
    id: 'shift-drives', title: 'Shift Drives', cat: 'web', catLabel: 'Platform', status: 'live',
    desc: 'Full-stack digital agency platform built with Next.js: service catalog, tiered pricing, and a WhatsApp-integrated consultation flow.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    github: null, demo: 'https://shift-drives.vercel.app',
  },
  {
    id: 'prime-property', title: 'Prime Property', cat: 'web', catLabel: 'Web app', status: 'done',
    desc: 'Property management platform with listings, authentication, and an admin dashboard, built on Next.js and Prisma.',
    stack: ['Next.js', 'Prisma', 'PostgreSQL', 'Auth'],
    github: null, demo: null,
  },
  {
    id: 'hl-finance', title: 'HL Internal Finance', cat: 'web', catLabel: 'Web app', status: 'done',
    desc: 'Internal finance management app for tracking budgets, transactions, and reporting inside an organization.',
    stack: ['Next.js', 'TypeScript', 'Prisma'],
    github: null, demo: null,
  },
  {
    id: 'uptimeguard', title: 'UptimeGuard', cat: 'web', catLabel: 'Service', status: 'wip',
    desc: 'Uptime monitoring service that pings endpoints on a schedule and alerts the moment something goes down.',
    stack: ['Node', 'Express', 'Cron'],
    github: null, demo: null,
  },
  {
    id: 'asistenit', title: 'asistenIT', cat: 'ai', catLabel: 'AI assistant', status: 'wip',
    desc: 'An AI assistant for everyday IT tasks: answering questions, drafting scripts, and automating small chores from one chat interface.',
    stack: ['Python', 'LLM'],
    github: null, demo: null,
  },
  {
    id: 'angkringan', title: 'Angkringan Sedulur', cat: 'web', catLabel: 'Landing page', status: 'live',
    desc: 'Landing page for a local food business, hand-built with clean HTML, CSS, and JavaScript.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/VeldanDev/angkringan-sedulur', demo: null,
  },
  {
    id: 'cords', title: 'Cords', cat: 'mobile', catLabel: 'Mobile app', status: 'wip',
    desc: 'Cross-platform mobile app built with Capacitor, packaging a web UI into native Android and iOS.',
    stack: ['Capacitor', 'TypeScript', 'Mobile'],
    github: null, demo: null,
  },
];

export const FILTERS: { v: 'all' | Cat; l: string }[] = [
  { v: 'all', l: 'All' }, { v: 'ai', l: 'AI' }, { v: 'security', l: 'Security' },
  { v: 'web', l: 'Web' }, { v: 'mobile', l: 'Mobile' },
];
