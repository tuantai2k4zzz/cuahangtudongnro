'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  KeyRound,
  Copy,
  Laptop,
  RefreshCw,
  Clock,
  ShieldCheck,
  AlertCircle,
  DownloadCloud,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { licensesApi } from '@/lib/api-client';
import { formatDate, calculateDaysLeft } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { ILicense, LicenseStatus } from '@tudongnro/shared-types';

export default function DashboardLicensesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const toast = useToast();

  const [licenses, setLicenses] = React.useState<ILicense[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterStatus, setFilterStatus] = React.useState<'ALL' | 'ACTIVE' | 'EXPIRED'>('ALL');
  const [resetHwidModalLicense, setResetHwidModalLicense] = React.useState<ILicense | null>(null);
  const [isResetting, setIsResetting] = React.useState(false);

  const fetchLicenses = React.useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await licensesApi.getMyLicenses();
      setLicenses(res.data || []);
    } catch {
      setLicenses([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Đã sao chép License Key vào bộ nhớ tạm!');
  };

  const filteredLicenses = licenses.filter((license) => {
    if (filterStatus === 'ACTIVE') return license.status === LicenseStatus.ACTIVE;
    if (filterStatus === 'EXPIRED') return license.status === LicenseStatus.EXPIRED;
    return true;
  });

  const handleConfirmResetHwid = async () => {
    if (!resetHwidModalLicense) return;
    setIsResetting(true);
    try {
      const licId = resetHwidModalLicense.id || (resetHwidModalLicense as any)._id;
      if (licId) {
        await licensesApi.resetHwid(licId);
      }
      toast.success(
        `Đã reset HWID thành công cho key ${resetHwidModalLicense.licenseKey}. Bạn có thể mở tool trên máy tính mới ngay!`
      );
      setResetHwidModalLicense(null);
      fetchLicenses();
    } catch (err: any) {
      toast.showToast({
        type: 'ERROR',
        title: 'Lỗi reset HWID',
        message: err.message || 'Không thể đổi thiết bị lúc này.',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Quản Lý Bản Quyền (License)</h1>
          <p className="text-xs text-slate-400 mt-1">
            Xem danh sách key, thời hạn sử dụng và thiết bị (HWID) đã liên kết
          </p>
        </div>
        <Link href="/tools">
          <Button className="btn-gaming-primary text-xs font-bold" size="sm">
            + Mua Thêm Bản Quyền
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            filterStatus === 'ALL'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Tất Cả ({licenses.length})
        </button>
        <button
          onClick={() => setFilterStatus('ACTIVE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            filterStatus === 'ACTIVE'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Đang Hoạt Động ({licenses.filter((l) => l.status === LicenseStatus.ACTIVE).length})
        </button>
        <button
          onClick={() => setFilterStatus('EXPIRED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            filterStatus === 'EXPIRED'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Đã Hết Hạn ({licenses.filter((l) => l.status === LicenseStatus.EXPIRED).length})
        </button>
      </div>

      {/* Licenses List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center space-y-3 rounded-2xl border border-slate-800 bg-[#0F1523]">
            <div className="h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-xs text-slate-400">Đang tải danh sách bản quyền key...</div>
          </div>
        ) : filteredLicenses.length > 0 ? (
          filteredLicenses.map((license, idx) => {
            const expiresDate = license.expiresDate;
            const daysLeft = calculateDaysLeft(expiresDate);
            const isExpiringSoon = daysLeft !== null && daysLeft <= 3 && daysLeft > 0;
            const isActive = license.status === LicenseStatus.ACTIVE;
            const hwid = license.boundDevices?.[0]?.hwid;

            return (
              <div
                key={license.id || (license as any)._id || idx}
                className={`rounded-2xl border p-5 transition-all ${
                  isExpiringSoon
                    ? 'border-amber-500/50 bg-[#161208]/90'
                    : isActive
                    ? 'border-slate-800 bg-[#0F1523] hover:border-slate-700'
                    : 'border-slate-800/60 bg-[#0C1019]/60 opacity-75'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-white">
                        {license.productName}
                      </h2>
                      <Badge
                        variant={
                          isActive
                            ? 'success'
                            : license.status === LicenseStatus.EXPIRED
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {isActive
                          ? 'Đang Hoạt Động'
                          : license.status === LicenseStatus.EXPIRED
                          ? 'Đã Hết Hạn'
                          : 'Tạm Khóa'}
                      </Badge>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Phiên bản: {(license as any).productVersion || 'Mới nhất'}
                      </span>
                    </div>

                    {/* License key display */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg select-all tracking-wider font-bold">
                        {license.licenseKey}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyKey(license.licenseKey)}
                        className="h-8 text-xs text-slate-400 hover:text-white"
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" /> Sao chép
                      </Button>
                    </div>

                    {/* HWID Device info */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                      <Laptop className="h-3.5 w-3.5 text-slate-500" />
                      <span>Thiết bị liên kết (HWID):</span>
                      <span className="font-mono text-slate-300 font-medium">
                        {hwid ? `${hwid.substring(0, 18)}...` : 'Chưa kích hoạt trên máy nào'}
                      </span>
                    </div>
                  </div>

                  {/* Right actions & status */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div className="text-left lg:text-right text-xs space-y-0.5">
                      <div className="text-slate-400 text-[11px]">Thời hạn bản quyền:</div>
                      <div className="font-bold text-white">
                        {expiresDate ? formatDate(expiresDate) : 'Vĩnh viễn'}
                      </div>
                      {daysLeft !== null && (
                        <div
                          className={`text-[11px] font-bold ${
                            daysLeft <= 3 ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã hết hạn'}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setResetHwidModalLicense(license)}
                          className="h-8 text-xs gap-1.5"
                        >
                          <RefreshCw className="h-3 w-3" /> Đổi Máy (Reset HWID)
                        </Button>
                      )}
                      {!isActive && (
                        <Link href="/pricing">
                          <Button size="sm" className="h-8 text-xs btn-gaming-primary">
                            Gia Hạn Ngay
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center rounded-2xl border border-slate-800 bg-[#0F1523] space-y-3">
            <KeyRound className="h-8 w-8 text-slate-600 mx-auto" />
            <div className="text-xs font-bold text-slate-300">Chưa có bản quyền key nào</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Tài khoản của bạn chưa có key kích hoạt phần mềm. Sau khi mua tool, key sẽ tự động xuất hiện tại đây.
            </p>
            <Link href="/tools">
              <Button size="sm" className="btn-gaming-primary text-xs">
                Khám Phá Tool Game
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Modal Confirm Reset HWID */}
      {resetHwidModalLicense && (
        <Modal
          isOpen={!!resetHwidModalLicense}
          onClose={() => setResetHwidModalLicense(null)}
          title="Xác Nhận Đổi Máy Tính (Reset HWID)"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 pt-2">
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong>Lưu ý quan trọng</strong>: Mỗi tháng tài khoản được hỗ trợ Reset HWID tối đa 3 lần. Sau khi reset, key sẽ ngắt kết nối với máy cũ và sẵn sàng liên kết với máy tính mới.
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Tool:</span>
                <span className="font-bold text-white">{resetHwidModalLicense.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">License Key:</span>
                <span className="font-mono text-cyan-400">{resetHwidModalLicense.licenseKey}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hạn mức đổi máy:</span>
                <span className="font-bold text-white">Tối đa 3 lần/tháng</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResetHwidModalLicense(null)}
                className="text-xs"
              >
                Hủy bỏ
              </Button>
              <Button
                size="sm"
                isLoading={isResetting}
                onClick={handleConfirmResetHwid}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Xác Nhận Reset HWID
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
