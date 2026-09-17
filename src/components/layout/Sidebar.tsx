'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, User, Trophy, FolderGit2, LayoutDashboard, Mail, Bot, GitBranch, ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',             label: 'Home',         icon: Home },
  { href: '/about',        label: 'About',        icon: User },
  { href: '/projects',     label: 'Projects',     icon: FolderGit2 },
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/smart-talk',   label: 'Smart Talk',   icon: Bot },
  { href: '/contact',      label: 'Contact',      icon: Mail },
] as const;

const SOCIALS = [
  { href: 'https://github.com/VeldanDev',       label: 'GitHub',  icon: GitBranch },
  { href: 'https://www.tiktok.com/@veldorable', label: 'TikTok',  icon: ExternalLink },
] as const;

const SPECTRAL = 'linear-gradient(90deg,#8b7cff,#45e0d0)';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-screen w-[240px] flex-col z-40 border-r"
      style={{ background: '#0d0f14', borderColor: '#1c2029', fontFamily: 'var(--font-sans-body)' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: '#1c2029' }}>
        <Link href="/" className="inline-flex items-baseline gap-1">
          <span
            className="font-bold text-lg tracking-tight"
            style={{ fontFamily: 'var(--font-display)', backgroundImage: SPECTRAL, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
          >
            aditya
          </span>
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)', color: '#eaecef' }}>.dev</span>
        </Link>
        <p className="mt-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: '#565c66', fontFamily: 'var(--font-plex-mono)' }}>
          ai · security · software
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.2em]" style={{ color: '#565c66', fontFamily: 'var(--font-plex-mono)' }}>
          Navigate
        </p>
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200"
                  style={active
                    ? { background: 'rgba(139,124,255,0.12)', color: '#c7c0ff' }
                    : { color: '#8a9099' }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#eaecef'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = '#8a9099'; }}
                >
                  <Icon size={16} strokeWidth={active ? 2 : 1.6} />
                  <span className="flex-1">{label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: SPECTRAL }} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Socials */}
      <div className="px-3 py-4 border-t" style={{ borderColor: '#1c2029' }}>
        <div className="flex flex-col gap-0.5">
          {SOCIALS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200"
              style={{ color: '#8a9099' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#eaecef'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#8a9099'; }}
            >
              <Icon size={15} strokeWidth={1.6} />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
