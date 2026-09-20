'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Package,
  KeyRound,
  DollarSign,
  Search,
  Plus,
  Edit2,
  Trash2,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import {
  MOCK_ADMIN_STATS,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_LICENSES,
} from '@/lib/mock-data';
import { formatCurrencyVND, formatDate } from '@/lib/utils';
import {
  OrderStatus,
  LicenseStatus,
  ProductStatus,
  IProduct,
  ILicense,
  IOrder,
} from '@tudongnro/shared-types';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<
    'OVERVIEW' | 'PRODUCTS' | 'ORDERS' | 'LICENSES' | 'SETTINGS'
  >('OVERVIEW');

  // Product management state
  const [productsList, setProductsList] = React.useState(MOCK_PRODUCTS);
  const [ordersList, setOrdersList] = React.useState(MOCK_ORDERS);
  const [licensesList, setLicensesList] = React.useState(MOCK_LICENSES);

  // Revoke modal state
  const [revokeModalLicense, setRevokeModalLicense] = React.useState<ILicense | null>(null);
  const [revokeReason, setRevokeReason] = React.useState('');
  const [toastMessage, setToastMessage] = React.useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRevokeLicense = () => {
    if (!revokeModalLicense) return;
    setLicensesList((prev) =>
      prev.map((lic) =>
        lic.id === revokeModalLicense.id
          ? { ...lic, status: LicenseStatus.REVOKED, revokedReason: revokeReason }
          : lic
      )
    );
    showToast(`Đã thu hồi license ${revokeModalLicense.licenseKey} thành công`);
    setRevokeModalLicense(null);
    setRevokeReason('');
  };

  const handleApproveOrder = (orderId: string) => {
    setOrdersList((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: OrderStatus.PAID, paidAt: new Date().toISOString() } : ord
      )
    );
    showToast('Đã duyệt đơn hàng thủ công thành công!');
  };

  return (
    <div className="min-h-screen bg-[#080B12] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Toast alert */}
        {toastMessage && (
          <div className="fixed top-20 right-8 z-50 rounded-xl border border-emerald-500/40 bg-emerald-950/90 p-4 text-emerald-300 shadow-2xl animate-in fade-in slide-in-from-top-4 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {toastMessage}
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                Trung Tâm Quản Trị Hệ Thống <Badge variant="purple">Admin RBAC</Badge>
              </h1>
              <p className="text-xs text-slate-400">
                Toàn quyền kiểm soát sản phẩm, doanh thu, đơn hàng và bảo mật license TUDONGNROTT.com
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { key: 'OVERVIEW', label: 'Tổng Quan Doanh Thu', icon: TrendingUp },
            { key: 'PRODUCTS', label: 'Quản Lý Sản Phẩm', icon: Package },
            { key: 'ORDERS', label: 'Quản Lý Đơn Hàng', icon: DollarSign },
            { key: 'LICENSES', label: 'Quản Lý Bản Quyền', icon: KeyRound },
            { key: 'SETTINGS', label: 'Cấu Hình Hệ Thống', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Tổng Doanh Thu</span>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  {formatCurrencyVND(MOCK_ADMIN_STATS.totalRevenue)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Tháng này: <span className="text-white font-bold">{formatCurrencyVND(MOCK_ADMIN_STATS.monthlyRevenue)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Hôm Nay</span>
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-cyan-400">
                  {formatCurrencyVND(MOCK_ADMIN_STATS.todayRevenue)}
                </div>
                <div className="text-[11px] text-cyan-300">
                  +{MOCK_ADMIN_STATS.newUsersToday} khách đăng ký mới
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>License Đang Hoạt Động</span>
                  <KeyRound className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-purple-400">
                  {MOCK_ADMIN_STATS.activeLicenses}
                </div>
                <div className="text-[11px] text-slate-400">Trên toàn hệ thống</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Tổng Khách Hàng</span>
                  <Users className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {MOCK_ADMIN_STATS.totalUsers}
                </div>
                <div className="text-[11px] text-amber-400">
                  {MOCK_ADMIN_STATS.pendingOrders} đơn chờ thanh toán
                </div>
              </div>
            </div>

            {/* Quick action grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Orders Overview */}
              <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Đơn Hàng Vừa Phát Sinh</h3>
                  <button
                    onClick={() => setActiveTab('ORDERS')}
                    className="text-xs text-purple-400 hover:underline"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  {ordersList.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-white mr-2">{ord.orderCode}</span>
                        <span className="text-slate-400">{ord.productSnapshot.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-cyan-400">
                          {formatCurrencyVND(ord.amount)}
                        </span>
                        {ord.status === OrderStatus.PAID ? (
                          <Badge variant="success">PAID</Badge>
                        ) : (
                          <Badge variant="warning">PENDING</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Audit Notice */}
              <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-4">
                <h3 className="text-sm font-bold text-white">Trạng Thái An Ninh Hệ Thống</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Cổng Webhook VietQR hoạt động bình thường, không có lỗi xử lý trùng.</span>
                  </div>
                  <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-cyan-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Hệ thống License Engine tự động khóa khi phát hiện 2 máy cùng dùng 1 HWID.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'PRODUCTS' && (
          <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Quản Lý Danh Sách Tool NRO</h2>
                <p className="text-xs text-slate-400">Cấu hình giá, phiên bản và trạng thái bảo trì</p>
              </div>
              <Button variant="gaming" size="sm" className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" /> Thêm Tool Mới
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="pb-3">Tên Tool</th>
                    <th className="pb-3">Phiên Bản</th>
                    <th className="pb-3">Danh Mục</th>
                    <th className="pb-3">Số Gói Giá</th>
                    <th className="pb-3">Lượt Mua</th>
                    <th className="pb-3">Trạng Thái</th>
                    <th className="pb-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {productsList.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-800/30">
                      <td className="py-3 font-bold text-white">{prod.name}</td>
                      <td className="py-3 font-mono text-cyan-400">{prod.currentVersion}</td>
                      <td className="py-3 text-slate-300">{prod.category}</td>
                      <td className="py-3 text-slate-400">{prod.plans.length} gói</td>
                      <td className="py-3 font-mono text-slate-300">{prod.salesCount}</td>
                      <td className="py-3">
                        <Badge variant="success">ACTIVE</Badge>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-cyan-400">
                          <Edit2 className="h-3 w-3" /> Sửa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'ORDERS' && (
          <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Quản Lý Đơn Hàng Toàn Sàn</h2>
                <p className="text-xs text-slate-400">Kiểm tra trạng thái thanh toán và duyệt đơn thủ công</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="pb-3">Mã Đơn</th>
                    <th className="pb-3">Khách Hàng</th>
                    <th className="pb-3">Tool</th>
                    <th className="pb-3">Gói</th>
                    <th className="pb-3">Số Tiền</th>
                    <th className="pb-3">Trạng Thái</th>
                    <th className="pb-3">Ngày Tạo</th>
                    <th className="pb-3 text-right">Duyệt Tay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ordersList.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/30">
                      <td className="py-3 font-mono font-bold text-white">{ord.orderCode}</td>
                      <td className="py-3 text-slate-300">{ord.userEmail}</td>
                      <td className="py-3 text-slate-200">{ord.productSnapshot.name}</td>
                      <td className="py-3 text-slate-400">{ord.planSnapshot.name}</td>
                      <td className="py-3 font-mono font-bold text-cyan-400">
                        {formatCurrencyVND(ord.amount)}
                      </td>
                      <td className="py-3">
                        {ord.status === OrderStatus.PAID ? (
                          <Badge variant="success">PAID</Badge>
                        ) : (
                          <Badge variant="warning">PENDING</Badge>
                        )}
                      </td>
                      <td className="py-3 text-slate-400">{formatDate(ord.createdAt)}</td>
                      <td className="py-3 text-right">
                        {ord.status === OrderStatus.PENDING && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveOrder(ord.id)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500"
                          >
                            Xác nhận đã trả
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: LICENSES MANAGEMENT */}
        {activeTab === 'LICENSES' && (
          <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Quản Lý Bản Quyền Tool (Licenses)</h2>
                <p className="text-xs text-slate-400">Giám sát key, thiết bị liên kết và thu hồi key vi phạm</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="pb-3">Mã License (Key)</th>
                    <th className="pb-3">Sản Phẩm</th>
                    <th className="pb-3">Thiết Bị HWID</th>
                    <th className="pb-3">Hạn Sử Dụng</th>
                    <th className="pb-3">Trạng Thái</th>
                    <th className="pb-3 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {licensesList.map((lic) => (
                    <tr key={lic.id} className="hover:bg-slate-800/30">
                      <td className="py-3 font-mono font-bold text-cyan-400">{lic.licenseKey}</td>
                      <td className="py-3 text-slate-200">{lic.productName}</td>
                      <td className="py-3 text-slate-400 font-mono text-[11px]">
                        {lic.boundDevices[0]?.deviceName || 'Chưa liên kết'}
                      </td>
                      <td className="py-3 text-slate-300">
                        {lic.expiresDate ? formatDate(lic.expiresDate) : 'Vĩnh viễn'}
                      </td>
                      <td className="py-3">
                        {lic.status === LicenseStatus.ACTIVE ? (
                          <Badge variant="success">ACTIVE</Badge>
                        ) : lic.status === LicenseStatus.REVOKED ? (
                          <Badge variant="danger">REVOKED</Badge>
                        ) : (
                          <Badge variant="secondary">EXPIRED</Badge>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {lic.status === LicenseStatus.ACTIVE && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setRevokeModalLicense(lic)}
                            className="h-7 text-xs"
                          >
                            <Ban className="h-3 w-3" /> Thu Hồi
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-6 max-w-2xl">
            <h2 className="text-lg font-bold text-white">Cấu Hình Cổng Thanh Toán & Hệ Thống</h2>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Tên Ngân Hàng Nhận (VietQR)</label>
                <Input defaultValue="MB - Ngân Hàng Quân Đội" />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Số Tài Khoản</label>
                <Input defaultValue="999988886666" />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Tên Chủ Tài Khoản</label>
                <Input defaultValue="NGUYEN VAN ADMIN" />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Webhook Secret Key (HMAC SHA256)</label>
                <Input type="password" defaultValue="secret_webhook_hmac_2026_tudongnro" />
              </div>

              <div className="pt-2">
                <Button
                  variant="gaming"
                  size="sm"
                  onClick={() => showToast('Đã lưu cấu hình hệ thống!')}
                >
                  Lưu Cấu Hình
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Revoke License Confirmation Modal */}
      {revokeModalLicense && (
        <Modal
          isOpen={!!revokeModalLicense}
          onClose={() => setRevokeModalLicense(null)}
          title="Thu Hồi Bản Quyền (Revoke License)"
          description="Hành động này sẽ hủy kích hoạt key ngay lập tức trên máy khách"
        >
          <div className="space-y-4 text-xs text-slate-300">
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-rose-400 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Cảnh báo: License sẽ bị khóa vĩnh viễn và không thể khôi phục tự động.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Lý do thu hồi bản quyền:</label>
              <Input
                placeholder="Ví dụ: Gian lận chia sẻ key công khai, vi phạm quy định..."
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRevokeModalLicense(null)}
              >
                Hủy Bỏ
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRevokeLicense}
              >
                Xác Nhận Khóa Key
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
