'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Gamepad2, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { UserRole } from '@tudongnro/shared-types';

export default function LoginPage() {
  const router = useRouter();
  const { login, setDemoUser } = useAuth();
  const toast = useToast();

  const [email, setEmail] = React.useState('khachhang@gmail.com');
  const [password, setPassword] = React.useState('Password123@');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      const isAdmin = email.toLowerCase().includes('admin');
      toast.success(
        `Đăng nhập thành công với vai trò ${isAdmin ? 'Quản Trị Viên' : 'Thành Viên'}!`
      );
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setErrorMsg(result.error || 'Email hoặc mật khẩu không chính xác');
      toast.error('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,240,255,0.1),rgba(8,11,18,1))]">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0F1523] p-8 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#080B12]">
              <Gamepad2 className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Đăng Nhập Tài Khoản</h1>
          <p className="text-xs text-slate-400">
            Quản lý mã bản quyền và gia hạn tool game NRO Online
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Mật khẩu</label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            className="btn-gaming-primary w-full h-11 text-xs font-bold gap-2 mt-2"
          >
            Đăng Nhập Vào Hệ Thống <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-cyan-400 font-bold hover:underline">
            Đăng ký tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
}
