'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  Trophy,
  FolderGit2,
  Mail,
  Bot,
} from 'lucide-react';

const C = { panel: '#0d0f14', line: '#1c2029', muted: '#8a9099', violet: '#8b7cff' };

const NAV_ITEMS = [
  { href: '/',             label: 'Home',         icon: Home       },
  { href: '/about',        label: 'About',        icon: User       },
  { href: '/achievements', label: 'Achievements', icon: Trophy     },
  { href: '/projects',     label: 'Projects',     icon: FolderGit2 },
  { href: '/contact',      label: 'Contact',      icon: Mail       },
  { href: '/smart-talk',   label: 'Smart Talk',   icon: Bot        },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t" style={{ background: C.panel, borderColor: C.line }}>
      <ul className="flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                className="flex items-center justify-center w-10 h-10 rounded-md transition-colors duration-150"
                style={active ? { color: C.violet, background: 'rgba(139,124,255,0.12)' } : { color: C.muted }}
              >
                <Icon size={19} strokeWidth={active ? 2 : 1.5} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
