'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Lock, ArrowLeft, Home, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@tudongnro/shared-types';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [redirecting, setRedirecting] = React.useState(false);

  const isAdmin = isAuthenticated && user?.role === UserRole.ADMIN;

  React.useEffect(() => {
    if (!isLoading && !isAdmin) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        if (!isAuthenticated) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        } else {
          router.replace('/');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAdmin, isAuthenticated, pathname, router]);

  // Loading state while verifying auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center space-y-4 text-slate-400">
        <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
        <p className="text-xs font-mono tracking-wider text-slate-300">
          Đang xác thực quyền truy cập Quản trị viên...
        </p>
      </div>
    );
  }

  // Unauthorized access barrier (403 Forbidden)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-[#0F1422] p-6 sm:p-8 text-center space-y-5 shadow-2xl shadow-red-950/20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold text-red-400 uppercase tracking-wider border border-red-500/30">
              403 - Quyền Truy Cập Bị Từ Chối
            </span>
            <h1 className="text-xl font-black text-white">
              Khu Vực Quản Trị Hệ Thống
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bạn không có quyền truy cập vào đường dẫn này. Chỉ tài khoản Quản trị viên (Admin) mới có thể vào trung tâm điều khiển.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 text-[11px] text-slate-400 font-mono flex items-center justify-center gap-2">
            <Lock className="h-3.5 w-3.5 text-red-400" />
            <span>Tài khoản hiện tại: {user ? `${user.email} (${user.role})` : 'Chưa đăng nhập'}</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs border-slate-700 bg-slate-900">
                <Home className="h-3.5 w-3.5 mr-1.5" /> Về Trang Chủ
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                <Button size="sm" className="w-full sm:w-auto text-xs btn-gaming-primary">
                  Đăng Nhập Admin
                </Button>
              </Link>
            )}
          </div>

          {redirecting && (
            <p className="text-[10px] text-slate-500 italic">
              Đang tự động chuyển hướng trong giây lát...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Admin authenticated -> render admin dashboard
  return <>{children}</>;
}
