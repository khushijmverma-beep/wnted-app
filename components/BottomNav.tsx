'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { DollarSign, Home, Search, User, Users } from 'lucide-react';

type NavLinkItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_LINKS: NavLinkItem[] = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/discover', label: 'Discover', icon: Search },
  { href: '/activity', label: 'Activity', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-around font-clash"
      style={{
        height: '84px',
        paddingBottom: '12px',
        background: 'rgba(38,48,59,0.42)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(250,247,239,0.1)',
      }}
    >
      <div className="flex flex-col items-center justify-center min-w-[56px]">
        <Link
          href="/home"
          className="flex flex-col items-center justify-center gap-1 min-w-[56px]"
        >
          <Home
            size={22}
            className="text-white"
            style={{ opacity: pathname === '/home' ? 1 : 0.6 }}
            strokeWidth={2}
          />
          <span
            className="text-[10px] text-white"
            style={{ opacity: pathname === '/home' ? 1 : 0.6 }}
          >
            Home
          </span>
        </Link>
      </div>

      {NAV_LINKS.slice(1, 2).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 min-w-[56px]"
          >
            <Icon
              size={22}
              className="text-white"
              style={{ opacity: isActive ? 1 : 0.6 }}
              strokeWidth={2}
            />
            <span
              className="text-[10px] text-white"
              style={{ opacity: isActive ? 1 : 0.6 }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}

      <Link
        href="/deposit"
        className="flex flex-col items-center justify-center"
        style={{ marginTop: '-8px' }}
        aria-label="Deposit"
      >
        <span
          className="flex items-center justify-center rounded-full border"
          style={{
            width: '52px',
            height: '52px',
            background: 'rgba(250,247,239,0.16)',
            borderColor: 'rgba(250,247,239,0.24)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow:
              '0 0 18px rgba(255, 255, 255, 0.18), 0 0 36px rgba(250, 247, 239, 0.12), 0 0 56px rgba(255, 255, 255, 0.06)',
          }}
        >
          <DollarSign size={18} className="text-[#FAF7EF]" strokeWidth={2} />
        </span>
      </Link>

      {NAV_LINKS.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 min-w-[56px]"
          >
            <Icon
              size={22}
              className="text-white"
              style={{ opacity: isActive ? 1 : 0.6 }}
              strokeWidth={2}
            />
            <span
              className="text-[10px] text-white"
              style={{ opacity: isActive ? 1 : 0.6 }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
