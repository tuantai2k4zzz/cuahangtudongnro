'use client';

import * as React from 'react';
import {
  User,
  Lock,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Laptop,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { formatDate } from '@/lib/utils';

export default function DashboardProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [fullName, setFullName] = React.useState(user?.fullName || '');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = React.useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = React.useState('');

  React.useEffect(() => {
    if (user?.fullName) {
      setFullName(user.fullName);
    }
  }, [user]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.showToast({
      type: 'SUCCESS',
      title: 'Đã lưu thông tin',
      message: 'Thông tin hồ sơ cá nhân đã được cập nhật.',
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg('');
    setPasswordSuccessMsg('');

    if (!currentPassword || !newPassword) {
      setPasswordErrorMsg('Vui lòng nhập mật khẩu hiện tại và mật khẩu mới');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErrorMsg('Mật khẩu mới phải có từ 6 ký tự trở lên');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPasswordSuccessMsg('Đã cập nhật mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Cài Đặt Tài Khoản & Bảo Mật</h1>
        <p className="text-xs text-slate-400 mt-1">
          Quản lý thông tin cá nhân và thiết lập mật khẩu bảo vệ tài khoản
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Details Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <User className="h-4 w-4 text-cyan-400" /> Thông Tin Cá Nhân
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold">Địa chỉ Email (Không đổi)</label>
              <Input value={user?.email || 'member@tudongnro.com'} disabled className="opacity-70" />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold">Họ và Tên</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold">Vai trò hệ thống</label>
              <div>
                <Badge variant="default">{user?.role || 'CUSTOMER'}</Badge>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold">Ngày tham gia</label>
              <div className="text-slate-300 font-mono">
                {user?.createdAt ? formatDate(user.createdAt) : 'Hôm nay'}
              </div>
            </div>

            <div className="pt-2">
              <Button size="sm" variant="default" className="text-xs" type="submit">
                Lưu Thay Đổi Thông Tin
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Lock className="h-4 w-4 text-purple-400" /> Đổi Mật Khẩu
          </div>

          {passwordSuccessMsg && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{passwordSuccessMsg}</span>
            </div>
          )}

          {passwordErrorMsg && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-400">
              {passwordErrorMsg}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold">Mật khẩu hiện tại</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold">Mật khẩu mới</label>
              <Input
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold">Xác nhận mật khẩu mới</label>
              <Input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              size="sm"
              variant="gaming"
              isLoading={isUpdatingPassword}
              className="w-full text-xs font-bold"
            >
              Cập Nhật Mật Khẩu
            </Button>
          </form>
        </div>
      </div>

      {/* Security & Sessions */}
      <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
          <ShieldCheck className="h-4 w-4 text-emerald-400" /> Phiên Đăng Nhập & Thiết Bị
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Laptop className="h-5 w-5 text-cyan-400" />
            <div>
              <div className="font-bold text-white">Trình Duyệt Hiện Tại (Windows PC)</div>
              <div className="text-[11px] text-emerald-400">Đang hoạt động (IP: 14.162.xxx.xxx)</div>
            </div>
          </div>
          <Badge variant="success">Phiên Hiện Tại</Badge>
        </div>
      </div>
    </div>
  );
}
