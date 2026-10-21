'use client';

// ==============================================================================
// PALATE: Native Mobile Bottom Navigation Bar
// Perfectly symmetrical 4-tab thumb navigation.
// Equal widths (25% each), unified brand color (#0F5132), crisp baselines.
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, Compass, PlusCircle, Shield } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isExplore = pathname === '/explore' || pathname.startsWith('/explore');
  const isCheckin = pathname === '/checkin' || pathname.startsWith('/checkin');
  const isPassport = pathname === '/passport' || pathname.startsWith('/passport');

  const tabs = [
    {
      name: 'Battles',
      href: '/',
      active: isHome,
      icon: Swords,
    },
    {
      name: 'Explore',
      href: '/explore',
      active: isExplore,
      icon: Compass,
    },
    {
      name: 'Check In',
      href: '/checkin',
      active: isCheckin,
      icon: PlusCircle,
    },
    {
      name: 'Passport',
      href: '/passport',
      active: isPassport,
      icon: Shield,
    },
  ];

  return (
    <nav className="w-full bg-white border-t border-gray-200/80 select-none shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div className="grid grid-cols-4 w-full h-[58px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center h-full transition-all active:scale-95 ${
                tab.active
                  ? 'text-[#0F5132]'
                  : 'text-[#64748B] hover:text-[#0F5132]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    tab.active ? 'stroke-[2.5] scale-105' : 'stroke-[1.8]'
                  }`}
                />
              </div>

              <span
                className={`text-[11px] leading-none mt-1 tracking-tight ${
                  tab.active ? 'font-black' : 'font-semibold'
                }`}
              >
                {tab.name}
              </span>

              {/* Active Dot Indicator */}
              <div className="h-1 flex items-center justify-center mt-0.5">
                {tab.active && (
                  <span className="h-1 w-1 rounded-full bg-[#0F5132]" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
