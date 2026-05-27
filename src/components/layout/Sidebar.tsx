'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  Trophy,
  FolderGit2,
  LayoutDashboard,
  Mail,
  Bot,
  GitBranch,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',              label: 'Home',         icon: Home           },
  { href: '/about',         label: 'About',        icon: User           },
  { href: '/achievements',  label: 'Achievements', icon: Trophy         },
  { href: '/projects',      label: 'Projects',     icon: FolderGit2     },
  { href: '/dashboard',     label: 'Dashboard',    icon: LayoutDashboard},
  { href: '/contact',       label: 'Contact',      icon: Mail           },
  { href: '/smart-talk',    label: 'Smart Talk',   icon: Bot            },
] as const;

const SOCIAL_LINKS = [
  { href: 'https://github.com/VeldanDev', label: 'GitHub',   icon: GitBranch    },
  { href: 'https://linkedin.com',          label: 'LinkedIn', icon: ExternalLink },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[240px] flex-col bg-[#111111] border-r border-[#1f1f1f] z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#1f1f1f]">
        <Link
          href="/"
          className="text-[#4ade80] font-semibold text-base tracking-[0.15em] hover:opacity-80 transition-opacity"
        >
          ADITYA.DEV
        </Link>
        <p className="mt-0.5 text-[10px] tracking-widest text-[#3d3d3d] uppercase">
          portfolio
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] uppercase tracking-widest text-[#3d3d3d]">
          Navigate
        </p>
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150',
                    active
                      ? 'bg-[#4ade80]/10 text-[#4ade80]'
                      : 'text-[#6b7280] hover:text-[#f1f1f1] hover:bg-[#1a1a1a]',
                  ].join(' ')}
                >
                  <Icon size={15} strokeWidth={active ? 2 : 1.5} />
                  <span className="flex-1">{label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shrink-0" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Social links */}
      <div className="px-3 py-4 border-t border-[#1f1f1f]">
        <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-[#3d3d3d]">
          Socials
        </p>
        <div className="flex flex-col gap-0.5">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#6b7280] hover:text-[#f1f1f1] hover:bg-[#1a1a1a] transition-colors duration-150"
            >
              <Icon size={15} strokeWidth={1.5} />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
