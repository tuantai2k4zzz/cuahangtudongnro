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
  Heart,
  ChevronDown,
  Sparkles,
  Wallet,
  Coins,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/contexts/auth-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { UserRole } from '@tudongnro/shared-types';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080B12]/90 backdrop-blur-md">
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

        {/* Desktop Navigation Links */}
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

        {/* Right Actions: Notifications, Wishlist, User Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Wishlist quick link */}
          <Link
            href="/tools?tab=wishlist"
            aria-label="Sản phẩm yêu thích"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-slate-800 transition-all"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[9px] font-black text-slate-950 shadow-md shadow-cyan-500/50">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* System Notification Bell */}
          <NotificationBell />

          {/* Wallet Balance Pill */}
          {isAuthenticated && (
            <Link
              href="/dashboard/deposit"
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1.5 text-xs text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/50 transition-all cursor-pointer shadow-sm shadow-cyan-950/40"
              title="Nạp thêm Coin vào ví"
            >
              <Coins className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-mono font-bold">
                {(user?.balance || 0).toLocaleString('vi-VN')}
              </span>
              <span className="text-[10px] text-cyan-400 font-black bg-cyan-500/20 px-1 rounded">+</span>
            </Link>
          )}

          {/* Auth State Component */}
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-1.5 transition-all cursor-pointer ${
                  isAdmin
                    ? 'border-purple-500/40 bg-purple-950/20 hover:border-purple-400 hover:bg-purple-950/30'
                    : 'border-slate-700/80 bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-800'
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs ${
                    isAdmin
                      ? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30'
                      : 'bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                  }`}
                >
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                    {user.fullName}
                  </div>
                  <div className="flex items-center gap-1">
                    {isAdmin ? (
                      <span className="text-[10px] text-purple-400 font-bold flex items-center gap-0.5">
                        <ShieldCheck className="h-2.5 w-2.5" /> Quản Trị Viên
                      </span>
                    ) : (
                      <span className="text-[10px] text-cyan-400 font-medium">
                        Thành Viên
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-700/80 bg-[#0F1523] p-1.5 shadow-2xl shadow-black/90 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2.5 border-b border-slate-800 text-xs">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      {user.fullName}
                      {isAdmin && (
                        <span className="rounded bg-purple-500/20 px-1.5 py-0.2 text-[9px] font-bold text-purple-400 border border-purple-500/30">
                          ADMIN
                        </span>
                      )}
                    </p>
                    <p className="text-slate-400 truncate text-[11px] mt-0.5">{user.email}</p>
                  </div>

                  <div className="py-1 space-y-0.5">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-700/40 hover:bg-purple-900/60 transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4 text-purple-400" /> Trang Quản Trị Admin
                      </Link>
                    )}

                    <Link
                      href="/dashboard/deposit"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/20 border border-cyan-500/20 hover:bg-cyan-950/40 hover:border-cyan-500/40 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-cyan-400" /> Nạp tiền vào ví
                      </span>
                      <span className="font-mono text-[11px] font-bold text-cyan-400">
                        {(user.balance || 0).toLocaleString('vi-VN')} Coin
                      </span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Tổng quan tài khoản
                    </Link>
                    <Link
                      href="/dashboard/licenses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                    >
                      <KeyRound className="h-4 w-4" /> Bản quyền của tôi
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                    >
                      <Package className="h-4 w-4" /> Lịch sử đơn hàng
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                    >
                      <User className="h-4 w-4" /> Cài đặt & Đổi mật khẩu
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-300 hover:text-white">
                  Đăng Nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="btn-gaming-primary gap-1.5 text-xs font-bold shadow-lg shadow-cyan-500/20">
                  <Zap className="h-3.5 w-3.5" /> Đăng Ký
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu triggers */}
        <div className="flex md:hidden items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-slate-800 p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0A0F1D] px-4 py-4 space-y-4 animate-in slide-in-from-top-2">
          {/* Navigation Links */}
          <div className="space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Section in Mobile Drawer */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2 py-1">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-sm ${
                      isAdmin
                        ? 'bg-purple-600 text-white'
                        : 'bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950'
                    }`}
                  >
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{user.fullName}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-700/40"
                    >
                      <ShieldCheck className="h-4 w-4" /> Bảng Quản Trị Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard/deposit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/30 border border-cyan-500/30"
                  >
                    <span className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-cyan-400" /> Nạp Tiền Vào Ví
                    </span>
                    <span className="font-mono text-cyan-400">
                      {(user.balance || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800"
                  >
                    <LayoutDashboard className="h-4 w-4 text-cyan-400" /> Bảng Điều Khiển
                  </Link>
                  <Link
                    href="/dashboard/licenses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800"
                  >
                    <KeyRound className="h-4 w-4 text-amber-400" /> Quản Lý Bản Quyền
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Đăng Xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs font-bold">
                    Đăng Nhập
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="btn-gaming-primary w-full text-xs font-bold">
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
