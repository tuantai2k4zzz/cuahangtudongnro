'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  KeyRound,
  Package,
  Clock,
  Copy,
  DownloadCloud,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Laptop,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MOCK_LICENSES, MOCK_ORDERS } from '@/lib/mock-data';
import { formatDate, calculateDaysLeft, formatCurrencyVND } from '@/lib/utils';
import { LicenseStatus, OrderStatus } from '@tudongnro/shared-types';

export default function DashboardOverviewPage() {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const activeLicenses = MOCK_LICENSES.filter(
    (l) => l.status === LicenseStatus.ACTIVE
  );

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-slate-900/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" /> Bảng Điều Khiển Tài Khoản
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Chào mừng bạn trở lại! Xem và quản lý các bản quyền tool NRO đang kích hoạt.
          </p>
        </div>
        <Link href="/tools">
          <Button variant="default" size="sm" className="gap-1.5 shrink-0">
            Mua Thêm Tool <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Bản Quyền Đang Dùng</span>
            <KeyRound className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeLicenses.length}</div>
          <div className="text-[11px] text-emerald-400">Đang hoạt động bình thường</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tổng Đơn Hàng</span>
            <Package className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{MOCK_ORDERS.length}</div>
          <div className="text-[11px] text-slate-400">
            {MOCK_ORDERS.filter((o) => o.status === OrderStatus.PAID).length} đơn đã thanh toán
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tổng Chi Tiêu</span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            {formatCurrencyVND(
              MOCK_ORDERS.filter((o) => o.status === OrderStatus.PAID).reduce(
                (sum, o) => sum + o.amount,
                0
              )
            )}
          </div>
          <div className="text-[11px] text-slate-400">Tích lũy trọn đời</div>
        </div>
      </div>

      {/* Active Licenses List */}
      <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-cyan-400" /> Bản Quyền Hoạt Động
          </h2>
          <Link
            href="/dashboard/licenses"
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            Xem tất cả <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {activeLicenses.map((license) => {
            const daysLeft = calculateDaysLeft(license.expiresDate);
            return (
              <div
                key={license.id}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {license.productName}
                    </span>
                    <Badge variant="success">Hoạt Động</Badge>
                  </div>

                  {/* Key Display & Copy */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-mono text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-lg select-all">
                      {license.licenseKey}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyKey(license.licenseKey)}
                      className="h-7 text-xs"
                    >
                      <Copy className="h-3 w-3" />
                      {copiedKey === license.licenseKey ? 'Đã sao chép' : 'Sao chép'}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <div className="text-slate-400 text-[11px]">Hạn sử dụng:</div>
                    <div className="font-bold text-white">
                      {license.expiresDate ? formatDate(license.expiresDate) : 'Vĩnh viễn'}
                    </div>
                    {daysLeft !== null && (
                      <span className="text-[10px] text-amber-400 font-semibold">
                        (Còn {daysLeft} ngày)
                      </span>
                    )}
                  </div>

                  <Link href={`/tools/${license.productSlug}`}>
                    <Button variant="secondary" size="sm" className="gap-1 text-xs">
                      <DownloadCloud className="h-3.5 w-3.5" /> Tải Tool
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="h-4 w-4 text-purple-400" /> Đơn Hàng Gần Đây
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            Lịch sử đầy đủ <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="pb-3">Mã Đơn</th>
                <th className="pb-3">Sản Phẩm</th>
                <th className="pb-3">Gói</th>
                <th className="pb-3">Số Tiền</th>
                <th className="pb-3">Trạng Thái</th>
                <th className="pb-3">Thời Gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_ORDERS.slice(0, 3).map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono font-bold text-white">{order.orderCode}</td>
                  <td className="py-3 text-slate-200">{order.productSnapshot.name}</td>
                  <td className="py-3 text-slate-400">{order.planSnapshot.name}</td>
                  <td className="py-3 font-mono font-bold text-cyan-400">
                    {formatCurrencyVND(order.amount)}
                  </td>
                  <td className="py-3">
                    {order.status === OrderStatus.PAID ? (
                      <Badge variant="success">Đã Thanh Toán</Badge>
                    ) : (
                      <Badge variant="warning">Chờ Thanh Toán</Badge>
                    )}
                  </td>
                  <td className="py-3 text-slate-400">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
