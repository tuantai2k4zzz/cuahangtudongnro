'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#080B12]">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0F1523] p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white">Khôi Phục Mật Khẩu</h1>
          <p className="text-xs text-slate-400">
            Nhập email tài khoản của bạn để nhận liên kết khôi phục mật khẩu.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="text-xs text-slate-300">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <strong>{email}</strong>. Vui lòng kiểm tra hộp thư của bạn.
            </p>
            <div className="pt-2">
              <Link href="/reset-password">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Đi đến trang Đặt lại mật khẩu (Demo)
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email đăng ký</label>
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

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="btn-gaming-primary w-full h-11 text-xs font-bold gap-2"
            >
              Gửi Liên Kết Xác Thực <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-800">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Quay lại trang Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
