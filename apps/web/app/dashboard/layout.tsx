'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  KeyRound,
  Package,
  User,
  Wallet,
  Coins,
  ExternalLink,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { SITE_CONFIG } from '@/lib/constants';

const DASHBOARD_NAV = [
  { label: 'Tổng Quan', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Nạp Tiền Vào Ví', href: '/dashboard/deposit', icon: Wallet },
  { label: 'Bản Quyền Của Tôi', href: '/dashboard/licenses', icon: KeyRound },
  { label: 'Lịch Sử Đơn Hàng', href: '/dashboard/orders', icon: Package },
  { label: 'Cài Đặt Tài Khoản', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const displayName = user?.fullName || 'Thành Viên';
  const displayEmail = user?.email || 'member@tudongnro.com';
  const avatarLetter = (displayName.charAt(0) || 'U').toUpperCase();

  return (
    <div className="min-h-screen bg-[#080B12] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1 space-y-6">
            {/* User Profile Summary Card */}
            <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 font-bold text-slate-950 text-base">
                  {avatarLetter}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-white text-sm truncate">
                    {displayName}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {displayEmail}
                  </div>
                  <span className="inline-block rounded bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400 border border-cyan-500/30 mt-1">
                    {user?.role === 'ADMIN' ? 'Quản Trị Viên' : 'Thành Viên Đã Xác Thực'}
                  </span>
                </div>
              </div>

              {/* Wallet Balance Widget */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Coins className="h-3 w-3 text-cyan-400" />
                  <span>Số dư ví:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-cyan-400 text-xs">
                    {(user?.balance || 0).toLocaleString('vi-VN')} Coin
                  </span>
                  <Link
                    href="/dashboard/deposit"
                    className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300 hover:bg-cyan-500/30 transition-colors cursor-pointer"
                  >
                    + Nạp
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="rounded-2xl border border-slate-800 bg-[#0F1523] p-2 space-y-1">
              {DASHBOARD_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Support box */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2 text-xs">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5 text-cyan-400" /> Cần trợ giúp?
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Đội ngũ kỹ thuật trực 24/7 hỗ trợ giải quyết sự cố kích hoạt và cài đặt.
              </p>
              <a
                href={SITE_CONFIG.supportTelegram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-bold hover:underline pt-1"
              >
                Nhắn Telegram Hỗ Trợ <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-3 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
