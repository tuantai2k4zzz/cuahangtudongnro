'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, Heart, Headphones, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useWishlist } from '@/contexts/wishlist-context';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();

  const navItems = [
    {
      href: '/',
      label: 'Trang Chủ',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      href: '/tools',
      label: 'Kho Tool',
      icon: Gamepad2,
      isActive: pathname.startsWith('/tools'),
    },
    {
      href: '/tools?tab=wishlist',
      label: 'Yêu Thích',
      icon: Heart,
      badge: wishlistCount > 0 ? wishlistCount : undefined,
      isActive: pathname.includes('tab=wishlist'),
    },
    {
      href: '#support',
      label: 'Hỗ Trợ',
      icon: Headphones,
      isAction: true,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        const event = new CustomEvent('open-support-widget');
        window.dispatchEvent(event);
      },
    },
    {
      href: isAuthenticated ? (user?.role === 'ADMIN' ? '/admin' : '/dashboard') : '/login',
      label: isAuthenticated ? (user?.role === 'ADMIN' ? 'Admin' : 'Tài Khoản') : 'Đăng Nhập',
      icon: isAuthenticated && user?.role === 'ADMIN' ? ShieldCheck : User,
      isActive: pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname === '/login',
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800/80 bg-[#080B12]/95 backdrop-blur-lg px-2 py-1.5 shadow-2xl">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const activeClass = item.isActive
            ? 'text-cyan-400 scale-105'
            : 'text-slate-400 hover:text-slate-200';

          if (item.isAction) {
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center py-1 gap-1 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer relative"
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 gap-1 transition-all relative ${activeClass}`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
