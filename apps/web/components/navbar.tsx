'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gamepad2,
  Menu,
  X,
  User,
  ShieldCheck,
  Zap,
  KeyRound,
  Package,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { MOCK_USER, MOCK_ADMIN } from '@/lib/mock-data';
import { UserRole } from '@tudongnro/shared-types';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  
  // Demo switch: Guest, Customer, Admin for testing without full backend
  const [currentRole, setCurrentRole] = React.useState<'GUEST' | 'CUSTOMER' | 'ADMIN'>('CUSTOMER');

  const currentUser = currentRole === 'ADMIN' ? MOCK_ADMIN : currentRole === 'CUSTOMER' ? MOCK_USER : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080B12]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#080B12]">
              <Gamepad2 className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider text-white flex items-center gap-1">
              TUDONG<span className="text-cyan-400">NRO</span>
              <span className="rounded bg-cyan-500/20 px-1 py-0.2 text-[10px] font-bold text-cyan-400 border border-cyan-500/40">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight -mt-1">
              Tự Động Hóa NRO Online
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions / Role Switcher for preview */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Demo Switcher */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/90 p-0.5 text-xs">
            <button
              onClick={() => setCurrentRole('GUEST')}
              className={`px-2 py-1 rounded transition-colors ${
                currentRole === 'GUEST' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Khách
            </button>
            <button
              onClick={() => setCurrentRole('CUSTOMER')}
              className={`px-2 py-1 rounded transition-colors ${
                currentRole === 'CUSTOMER' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Member
            </button>
            <button
              onClick={() => setCurrentRole('ADMIN')}
              className={`px-2 py-1 rounded transition-colors ${
                currentRole === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 font-bold border border-purple-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 hover:border-cyan-500/50 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    {currentUser.role}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700/80 bg-[#0F1523] p-1.5 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 text-xs">
                    <p className="font-semibold text-white">{currentUser.fullName}</p>
                    <p className="text-slate-400 truncate">{currentUser.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-400"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Tổng quan tài khoản
                    </Link>
                    <Link
                      href="/dashboard/licenses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-400"
                    >
                      <KeyRound className="h-4 w-4" /> Quản lý License
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-400"
                    >
                      <Package className="h-4 w-4" /> Lịch sử đơn hàng
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-400"
                    >
                      <User className="h-4 w-4" /> Cài đặt & Đổi mật khẩu
                    </Link>

                    {currentUser.role === UserRole.ADMIN && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/60 my-1"
                      >
                        <ShieldCheck className="h-4 w-4 text-purple-400" /> Quản Trị Hệ Thống
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setCurrentRole('GUEST');
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" /> Đăng Xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Đăng Nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="default" size="sm" className="gap-1.5">
                  <Zap className="h-3.5 w-3.5" /> Đăng Ký
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0F1523] px-4 py-4 space-y-3">
          <div className="space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between py-1 text-xs text-slate-400">
              <span>Chế độ xem demo:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentRole('GUEST')}
                  className={`px-2 py-0.5 rounded text-xs ${currentRole === 'GUEST' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800'}`}
                >
                  Khách
                </button>
                <button
                  onClick={() => setCurrentRole('CUSTOMER')}
                  className={`px-2 py-0.5 rounded text-xs ${currentRole === 'CUSTOMER' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800'}`}
                >
                  Member
                </button>
                <button
                  onClick={() => setCurrentRole('ADMIN')}
                  className={`px-2 py-0.5 rounded text-xs ${currentRole === 'ADMIN' ? 'bg-purple-500 text-white font-bold' : 'bg-slate-800'}`}
                >
                  Admin
                </button>
              </div>
            </div>

            {currentUser ? (
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-cyan-400 bg-cyan-950/30"
                >
                  Dashboard Người Dùng
                </Link>
                {currentUser.role === UserRole.ADMIN && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-purple-300 bg-purple-950/40"
                  >
                    Trang Quản Trị (Admin)
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    Đăng Nhập
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full">
                    Đăng Ký
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
