'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Headphones,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, calculateDaysLeft, formatCurrencyVND } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { licensesApi, ordersApi } from '@/lib/api-client';
import { LicenseStatus, OrderStatus, ILicense, IOrder } from '@tudongnro/shared-types';

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const toast = useToast();

  const [activeLicenses, setActiveLicenses] = React.useState<ILicense[]>([]);
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [userTickets, setUserTickets] = React.useState<any[]>([]);
  const [loadingData, setLoadingData] = React.useState(true);

  React.useEffect(() => {
    async function loadUserData() {
      if (!isAuthenticated) {
        setLoadingData(false);
        return;
      }
      setLoadingData(true);
      try {
        const [licRes, ordRes] = await Promise.allSettled([
          licensesApi.getMyLicenses(),
          ordersApi.getMyOrders(),
        ]);
        if (licRes.status === 'fulfilled' && licRes.value?.data) {
          setActiveLicenses(licRes.value.data);
        }
        if (ordRes.status === 'fulfilled' && ordRes.value?.data) {
          setOrders(ordRes.value.data);
        }
      } catch {
        // Handled gracefully
      } finally {
        setLoadingData(false);
      }
    }
    loadUserData();
  }, [isAuthenticated]);

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Đã sao chép License Key vào bộ nhớ tạm!');
  };

  const totalSpent = orders
    .filter((o) => o.status === OrderStatus.PAID)
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-slate-900/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" /> Bảng Điều Khiển: {user?.fullName || 'Khách Hàng'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Chào mừng bạn trở lại! Xem và quản lý các bản quyền tool NRO đang kích hoạt.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/tools">
            <Button size="sm" className="btn-gaming-primary gap-1.5 shrink-0 text-xs font-bold">
              Mua Thêm Tool <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Bản Quyền Đang Dùng</span>
            <KeyRound className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeLicenses.length}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Đang hoạt động bình thường
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tổng Đơn Hàng</span>
            <Package className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{orders.length}</div>
          <div className="text-[11px] text-slate-400">
            {orders.filter((o) => o.status === OrderStatus.PAID).length} đơn đã hoàn tất
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tổng Chi Tiêu</span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            {formatCurrencyVND(totalSpent)}
          </div>
          <div className="text-[11px] text-slate-400">Tích lũy trọn đời</div>
        </div>
      </div>

      {/* Active Licenses List */}
      <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-cyan-400" /> Bản Quyền Đang Hoạt Động
          </h2>
          <Link
            href="/dashboard/licenses"
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            Quản lý tất cả <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {activeLicenses.length > 0 ? (
          <div className="space-y-3">
            {activeLicenses.slice(0, 3).map((license: any, idx) => {
              const expDate = license.expiresDate || license.expiresAt;
              const daysLeft = calculateDaysLeft(expDate);
              return (
                <div
                  key={license.id || license._id || idx}
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
                        variant="ghost"
                        onClick={() => copyKey(license.licenseKey)}
                        className="h-7 text-xs text-slate-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <div className="text-slate-400 text-[11px]">Hạn sử dụng:</div>
                      <div className="font-bold text-white">
                        {expDate ? formatDate(expDate) : 'Vĩnh viễn'}
                      </div>
                      {daysLeft !== null && (
                        <span className="text-[10px] text-amber-400 font-semibold">
                          (Còn {daysLeft} ngày)
                        </span>
                      )}
                    </div>

                    <Link href="/dashboard/licenses">
                      <Button variant="secondary" size="sm" className="gap-1 text-xs">
                        Quản Lý Key
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
            <KeyRound className="h-8 w-8 text-slate-600 mx-auto" />
            <div className="text-xs font-bold text-slate-300">Chưa có bản quyền tool nào</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Bạn chưa kích hoạt bản quyền key nào. Khám phá kho công cụ để nâng tầm trải nghiệm game!
            </p>
            <Link href="/tools">
              <Button size="sm" className="btn-gaming-primary text-xs">
                Khám Phá Tool Ngay
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* User Support Requests Hub */}
      {userTickets.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Headphones className="h-4 w-4 text-cyan-400" /> Yêu Cầu Hỗ Trợ Đang Xử Lý ({userTickets.length})
            </h2>
            <button
              onClick={() => {
                const event = new CustomEvent('open-support-widget');
                window.dispatchEvent(event);
              }}
              className="text-xs text-cyan-400 hover:underline"
            >
              Tạo ticket mới →
            </button>
          </div>

          <div className="space-y-2">
            {userTickets.slice(0, 3).map((tk: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400">{tk.id}</span>
                    <span className="font-semibold text-white truncate max-w-xs">{tk.subject}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Phân loại: {tk.category} • Ngày tạo: {formatDate(tk.createdAt)}
                  </div>
                </div>
                <Badge variant={tk.status === 'RESOLVED' ? 'success' : 'warning'}>
                  {tk.status === 'RESOLVED' ? 'Đã Xử Lý' : 'Đang Xử Lý'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

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

        {orders.length > 0 ? (
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
                {orders.slice(0, 4).map((order: any, idx: number) => (
                  <tr key={order._id || order.id || idx} className="hover:bg-slate-800/30">
                    <td className="py-3 font-mono font-bold text-white">{order.orderCode}</td>
                    <td className="py-3 text-slate-200">
                      {order.productName || order.productSnapshot?.name}
                    </td>
                    <td className="py-3 text-slate-400">
                      {order.planName || order.planSnapshot?.name}
                    </td>
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
        ) : (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <Package className="h-8 w-8 text-slate-600 mx-auto" />
            <div className="text-xs font-bold text-slate-300">Chưa có đơn hàng nào</div>
            <p className="text-[11px] text-slate-500">
              Lịch sử giao dịch mua key của bạn sẽ hiển thị tại đây sau khi thanh toán.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
