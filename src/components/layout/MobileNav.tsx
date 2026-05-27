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
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',             label: 'Home',         icon: Home            },
  { href: '/about',        label: 'About',        icon: User            },
  { href: '/achievements', label: 'Achievements', icon: Trophy          },
  { href: '/projects',     label: 'Projects',     icon: FolderGit2      },
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/contact',      label: 'Contact',      icon: Mail            },
  { href: '/smart-talk',   label: 'Smart Talk',   icon: Bot             },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111111] border-t border-[#1f1f1f]">
      <ul className="flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                className={[
                  'flex items-center justify-center w-10 h-10 rounded-md transition-colors duration-150',
                  active
                    ? 'text-[#4ade80] bg-[#4ade80]/10'
                    : 'text-[#6b7280] hover:text-[#f1f1f1] hover:bg-[#1a1a1a]',
                ].join(' ')}
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
