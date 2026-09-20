'use client';

import * as React from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { MOCK_LICENSES, MOCK_PRODUCTS } from '@/lib/mock-data';
import { formatDate, calculateDaysLeft } from '@/lib/utils';
import { ILicense, LicenseStatus } from '@tudongnro/shared-types';

export default function DashboardLicensesPage() {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<'ALL' | 'ACTIVE' | 'EXPIRED'>('ALL');
  const [resetHwidModalLicense, setResetHwidModalLicense] = React.useState<ILicense | null>(null);
  const [isResetting, setIsResetting] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredLicenses = MOCK_LICENSES.filter((license) => {
    if (filterStatus === 'ACTIVE') return license.status === LicenseStatus.ACTIVE;
    if (filterStatus === 'EXPIRED') return license.status === LicenseStatus.EXPIRED;
    return true;
  });

  const handleConfirmResetHwid = () => {
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        setResetHwidModalLicense(null);
      }, 1500);
    }, 1000);
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
          <Button variant="default" size="sm">
            Mua Thêm Bản Quyền
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
          Tất Cả ({MOCK_LICENSES.length})
        </button>
        <button
          onClick={() => setFilterStatus('ACTIVE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            filterStatus === 'ACTIVE'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Đang Hoạt Động ({MOCK_LICENSES.filter((l) => l.status === LicenseStatus.ACTIVE).length})
        </button>
        <button
          onClick={() => setFilterStatus('EXPIRED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            filterStatus === 'EXPIRED'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Đã Hết Hạn ({MOCK_LICENSES.filter((l) => l.status === LicenseStatus.EXPIRED).length})
        </button>
      </div>

      {/* Licenses List Cards */}
      <div className="space-y-4">
        {filteredLicenses.map((license) => {
          const daysLeft = calculateDaysLeft(license.expiresDate);
          const isActive = license.status === LicenseStatus.ACTIVE;
          const boundDevice = license.boundDevices[0];

          return (
            <div
              key={license.id}
              className={`rounded-2xl border p-5 space-y-4 transition-all ${
                isActive
                  ? 'border-slate-800 bg-[#0F1523] hover:border-cyan-500/40'
                  : 'border-slate-800/60 bg-[#0A0D16] opacity-75'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">
                      {license.productName}
                    </span>
                    {isActive ? (
                      <Badge variant="success">Hoạt Động</Badge>
                    ) : (
                      <Badge variant="danger">Hết Hạn</Badge>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-4">
                    <span>Kích hoạt: {formatDate(license.startDate)}</span>
                    <span>Hết hạn: {formatDate(license.expiresDate)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  {isActive && daysLeft !== null && (
                    <span className="text-xs font-bold text-amber-400 bg-amber-950/30 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                      Còn {daysLeft} ngày
                    </span>
                  )}
                  {isActive && daysLeft === null && (
                    <span className="text-xs font-bold text-purple-400 bg-purple-950/30 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                      Trọn Đời (Lifetime)
                    </span>
                  )}
                </div>
              </div>

              {/* License Key & Hardware Lock */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                {/* Key Block */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold text-[11px]">MÃ BẢN QUYỀN (KEY):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={license.licenseKey}
                      className="w-full font-mono text-xs font-bold text-cyan-300 bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyKey(license.licenseKey)}
                      className="shrink-0 h-9"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copiedKey === license.licenseKey ? 'Đã chép' : 'Sao chép'}
                    </Button>
                  </div>
                </div>

                {/* HWID Device Block */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold text-[11px]">THIẾT BỊ LIÊN KẾT (HWID):</label>
                  <div className="flex items-center justify-between p-2 rounded-lg border border-slate-800 bg-slate-900/60">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-cyan-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-200">
                          {boundDevice ? boundDevice.deviceName : 'Chưa có máy liên kết'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                          {boundDevice ? boundDevice.hwid : 'Mở tool trên máy để tự động khóa'}
                        </div>
                      </div>
                    </div>

                    {boundDevice && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setResetHwidModalLicense(license)}
                        className="text-cyan-400 hover:text-cyan-300 text-[11px] h-7"
                      >
                        <RefreshCw className="h-3 w-3" /> Đổi máy
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions strip */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <Link href={`/tools/${license.productSlug}`}>
                  <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                    <DownloadCloud className="h-3.5 w-3.5" /> Tải Bộ Tool
                  </Button>
                </Link>
                {!isActive && (
                  <Link href={`/tools/${license.productSlug}`}>
                    <Button variant="default" size="sm" className="text-xs">
                      Gia Hạn Ngay
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset HWID Confirmation Modal */}
      {resetHwidModalLicense && (
        <Modal
          isOpen={!!resetHwidModalLicense}
          onClose={() => setResetHwidModalLicense(null)}
          title="Xác Nhận Đổi Máy Tính (Reset HWID)"
          description="Hệ thống cho phép gỡ liên kết máy tính cũ để chuyển sang máy tính mới"
        >
          <div className="space-y-4 text-xs text-slate-300">
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-amber-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Mỗi bản quyền chỉ được Reset HWID miễn phí <strong>1 lần/tháng</strong> để chống lạm dụng chia sẻ key công khai.
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900 space-y-1">
              <div>Sản phẩm: <strong className="text-white">{resetHwidModalLicense.productName}</strong></div>
              <div>Mã Key: <span className="font-mono text-cyan-400">{resetHwidModalLicense.licenseKey}</span></div>
            </div>

            {resetSuccess ? (
              <div className="py-4 text-center text-emerald-400 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Đã reset thiết bị thành công! Mở tool trên máy mới để kích hoạt.
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setResetHwidModalLicense(null)}
                >
                  Hủy Bỏ
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  isLoading={isResetting}
                  onClick={handleConfirmResetHwid}
                >
                  Xác Nhận Reset HWID
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
