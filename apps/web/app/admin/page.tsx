'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  RefreshCw,
  Headphones,
  BellRing,
  Send,
  Lock,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
  Clock,
  UserCheck,
  CreditCard,
  FileText,
  Activity,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Card } from '@/components/ui/card';
import { formatCurrencyVND, formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import {
  adminApi,
  productsApi,
  ticketsApi,
  licensesApi,
} from '@/lib/api-client';
import {
  OrderStatus,
  LicenseStatus,
  ProductStatus,
  IProduct,
  ILicense,
  IOrder,
  IUser,
  IAdminOverviewStats,
  IUserDetails,
  ISupportTicket,
  UserRole,
} from '@tudongnro/shared-types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const isAdmin = user?.role === UserRole.ADMIN;

  const [activeTab, setActiveTab] = React.useState<
    'OVERVIEW' | 'PRODUCTS' | 'ORDERS' | 'LICENSES' | 'CUSTOMERS' | 'TICKETS' | 'AUDIT_LOGS' | 'ANNOUNCEMENTS'
  >('OVERVIEW');

  // Stats State
  const [statsRange, setStatsRange] = React.useState<'today' | 'week' | 'month' | 'all'>('all');
  const [stats, setStats] = React.useState<IAdminOverviewStats | null>(null);
  const [statsLoading, setStatsLoading] = React.useState(true);

  // Live Data lists
  const [productsList, setProductsList] = React.useState<IProduct[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(false);

  const [ordersList, setOrdersList] = React.useState<IOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = React.useState(false);

  const [licensesList, setLicensesList] = React.useState<ILicense[]>([]);
  const [licensesLoading, setLicensesLoading] = React.useState(false);

  const [usersList, setUsersList] = React.useState<IUser[]>([]);
  const [usersLoading, setUsersLoading] = React.useState(false);

  const [supportTickets, setSupportTickets] = React.useState<ISupportTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = React.useState(false);

  const [auditLogs, setAuditLogs] = React.useState<any[]>([]);
  const [auditLogsLoading, setAuditLogsLoading] = React.useState(false);

  // Search & Filter queries
  const [productSearch, setProductSearch] = React.useState('');
  const [orderSearch, setOrderSearch] = React.useState('');
  const [orderStatusFilter, setOrderStatusFilter] = React.useState('ALL');
  const [licenseSearch, setLicenseSearch] = React.useState('');
  const [userSearch, setUserSearch] = React.useState('');
  const [ticketSearch, setTicketSearch] = React.useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = React.useState('ALL');

  // Modals state
  const [revokeModalLicense, setRevokeModalLicense] = React.useState<ILicense | null>(null);
  const [revokeReason, setRevokeReason] = React.useState('');
  const [confirmText, setConfirmText] = React.useState('');

  const [selectedCustomerDetails, setSelectedCustomerDetails] = React.useState<IUserDetails | null>(null);
  const [customerDetailsLoading, setCustomerDetailsLoading] = React.useState(false);

  const [selectedOrderDetails, setSelectedOrderDetails] = React.useState<IOrder | null>(null);

  const [selectedTicket, setSelectedTicket] = React.useState<ISupportTicket | null>(null);
  const [ticketReplyText, setTicketReplyText] = React.useState('');
  const [isSendingReply, setIsSendingReply] = React.useState(false);

  // Announcements state
  const [maintenanceBanner, setMaintenanceBanner] = React.useState(false);
  const [bannerNoticeText, setBannerNoticeText] = React.useState(
    'Thông báo: Hệ thống cấp key tự động qua mã VietQR đang hoạt động 24/7 bình thường.'
  );

  // Initial stats fetch
  const fetchOverviewStats = React.useCallback(async (range = statsRange) => {
    setStatsLoading(true);
    try {
      const res = await adminApi.getOverview(range);
      setStats(res.data);
    } catch (err: any) {
      toast.showToast({
        type: 'ERROR',
        title: 'Lỗi tải thống kê',
        message: err.message || 'Không thể lấy số liệu thực tế từ máy chủ',
      });
    } finally {
      setStatsLoading(false);
    }
  }, [statsRange, toast]);

  const fetchProducts = React.useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await productsApi.getAllAdmin();
      setProductsList(res.data || []);
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi tải sản phẩm', message: err.message });
    } finally {
      setProductsLoading(false);
    }
  }, [toast]);

  const fetchOrders = React.useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await adminApi.getAllOrders();
      setOrdersList(res.data || []);
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi tải đơn hàng', message: err.message });
    } finally {
      setOrdersLoading(false);
    }
  }, [toast]);

  const fetchLicenses = React.useCallback(async () => {
    setLicensesLoading(true);
    try {
      const res = await adminApi.getAllLicenses();
      setLicensesList(res.data || []);
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi tải license', message: err.message });
    } finally {
      setLicensesLoading(false);
    }
  }, [toast]);

  const fetchUsers = React.useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsersList(res.data || []);
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi tải danh sách khách hàng', message: err.message });
    } finally {
      setUsersLoading(false);
    }
  }, [toast]);

  const fetchTickets = React.useCallback(async () => {
    setTicketsLoading(true);
    try {
      const res = await ticketsApi.getAllAdmin();
      setSupportTickets(res.data || []);
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi tải ticket', message: err.message });
    } finally {
      setTicketsLoading(false);
    }
  }, [toast]);

  const fetchAuditLogs = React.useCallback(async () => {
    setAuditLogsLoading(true);
    try {
      const res = await adminApi.getAuditLogs();
      setAuditLogs(res.data || []);
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi tải audit log', message: err.message });
    } finally {
      setAuditLogsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    if (!isAdmin) return;
    fetchOverviewStats();
    fetchTickets();
  }, [isAdmin, fetchOverviewStats, fetchTickets]);

  React.useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'PRODUCTS') fetchProducts();
    if (activeTab === 'ORDERS') fetchOrders();
    if (activeTab === 'LICENSES') fetchLicenses();
    if (activeTab === 'CUSTOMERS') fetchUsers();
    if (activeTab === 'TICKETS') fetchTickets();
    if (activeTab === 'AUDIT_LOGS') fetchAuditLogs();
  }, [isAdmin, activeTab, fetchProducts, fetchOrders, fetchLicenses, fetchUsers, fetchTickets, fetchAuditLogs]);

  // Auto-refresh tickets when on TICKETS tab or when ticket modal is open
  React.useEffect(() => {
    if (!isAdmin) return;
    if (activeTab !== 'TICKETS' && !selectedTicket) return;

    const interval = setInterval(async () => {
      fetchTickets();
      if (selectedTicket) {
        const ticketId = selectedTicket.id || (selectedTicket as any)._id;
        if (ticketId) {
          try {
            const res = await ticketsApi.getById(ticketId);
            if (res.data) {
              setSelectedTicket(res.data);
            }
          } catch {}
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAdmin, activeTab, selectedTicket, fetchTickets]);

  // Actions
  const handleApproveOrder = async (orderId: string) => {
    try {
      await adminApi.approveOrder(orderId);
      toast.showToast({
        type: 'SUCCESS',
        title: 'Kích hoạt thành công',
        message: 'Đơn hàng đã được xác nhận và cấp key tự động.',
      });
      fetchOrders();
      fetchOverviewStats();
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Không thể duyệt đơn', message: err.message });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await adminApi.cancelOrder(orderId, 'Admin hủy đơn');
      toast.showToast({
        type: 'INFO',
        title: 'Đã hủy đơn hàng',
        message: 'Trạng thái đơn đã chuyển sang CANCELLED.',
      });
      fetchOrders();
      fetchOverviewStats();
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi hủy đơn', message: err.message });
    }
  };

  const handleRevokeLicense = async () => {
    if (!revokeModalLicense) return;
    if (confirmText !== 'XAC NHAN') {
      toast.showToast({
        type: 'ERROR',
        title: 'Xác nhận an toàn',
        message: 'Vui lòng gõ chính xác chữ "XAC NHAN" để tiếp tục.',
      });
      return;
    }

    try {
      await adminApi.revokeLicense(revokeModalLicense.id, revokeReason || 'Admin thu hồi');
      toast.showToast({
        type: 'SUCCESS',
        title: 'Thu hồi thành công',
        message: `Đã vô hiệu hóa key ${revokeModalLicense.licenseKey}.`,
      });
      setRevokeModalLicense(null);
      setRevokeReason('');
      setConfirmText('');
      fetchLicenses();
      fetchOverviewStats();
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi thu hồi', message: err.message });
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const res = await adminApi.toggleUserStatus(userId);
      toast.showToast({
        type: 'SUCCESS',
        title: 'Đã cập nhật trạng thái',
        message: res.data?.message || 'Thành công',
      });
      fetchUsers();
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi khóa tài khoản', message: err.message });
    }
  };

  const handleViewCustomerDetails = async (userId: string) => {
    setCustomerDetailsLoading(true);
    try {
      const res = await adminApi.getUserDetails(userId);
      setSelectedCustomerDetails(res.data);
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi tải chi tiết', message: err.message });
    } finally {
      setCustomerDetailsLoading(false);
    }
  };

  const handleSendTicketReply = async () => {
    if (!selectedTicket || !ticketReplyText.trim()) return;
    const ticketId = selectedTicket.id || (selectedTicket as any)._id;
    if (!ticketId) return;
    setIsSendingReply(true);
    try {
      const res = await ticketsApi.adminReply(ticketId, ticketReplyText.trim());
      setSelectedTicket(res.data);
      setTicketReplyText('');
      toast.showToast({
        type: 'SUCCESS',
        title: 'Đã gửi phản hồi',
        message: 'Khách hàng sẽ nhận được thông báo hỗ trợ.',
      });
      fetchTickets();
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi gửi tin nhắn', message: err.message });
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      await ticketsApi.updateStatus(ticketId, newStatus);
      toast.showToast({ type: 'SUCCESS', title: 'Cập nhật trạng thái ticket', message: 'Thành công' });
      fetchTickets();
      if (selectedTicket && (selectedTicket.id === ticketId || (selectedTicket as any)._id === ticketId)) {
        setSelectedTicket({ ...selectedTicket, status: newStatus as any });
      }
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi cập nhật', message: err.message });
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn sản phẩm "${productName}" khỏi hệ thống?`)) {
      return;
    }
    try {
      await productsApi.remove(productId);
      toast.showToast({ type: 'SUCCESS', title: 'Đã xóa sản phẩm', message: productName });
      fetchProducts();
      fetchOverviewStats();
    } catch (err: any) {
      toast.showToast({ type: 'ERROR', title: 'Lỗi xóa sản phẩm', message: err.message });
    }
  };

  // Filtered lists
  const filteredProducts = React.useMemo(() => {
    return productsList.filter((p) => {
      return (
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.slug.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()))
      );
    });
  }, [productsList, productSearch]);

  const filteredOrders = React.useMemo(() => {
    return ordersList.filter((o) => {
      const matchSearch =
        o.orderCode.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.userEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o.productSnapshot?.name && o.productSnapshot.name.toLowerCase().includes(orderSearch.toLowerCase()));
      const matchStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [ordersList, orderSearch, orderStatusFilter]);

  const filteredLicenses = React.useMemo(() => {
    return licensesList.filter((l) => {
      return (
        l.licenseKey.toLowerCase().includes(licenseSearch.toLowerCase()) ||
        (l.productName && l.productName.toLowerCase().includes(licenseSearch.toLowerCase()))
      );
    });
  }, [licensesList, licenseSearch]);

  const filteredUsers = React.useMemo(() => {
    return usersList.filter((u) => {
      return (
        u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
      );
    });
  }, [usersList, userSearch]);

  const filteredTickets = React.useMemo(() => {
    return supportTickets.filter((t) => {
      const matchSearch =
        t.ticketCode.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.customerName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.customerEmail.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.subject.toLowerCase().includes(ticketSearch.toLowerCase());
      const matchStatus = ticketStatusFilter === 'ALL' || t.status === ticketStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [supportTickets, ticketSearch, ticketStatusFilter]);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Banner if maintenance enabled */}
        {maintenanceBanner && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>{bannerNoticeText}</span>
            </div>
            <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">
              Đang Phát Banner
            </Badge>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                Hệ Thống Quản Trị Trung Tâm
                <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 text-[11px]">
                  Real MongoDB
                </Badge>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Toàn bộ số liệu doanh thu, người dùng, đơn hàng và license được cập nhật thời gian thực 100% từ Database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/products/new">
              <Button size="sm" className="btn-gaming-primary text-xs font-bold">
                <Plus className="h-4 w-4 mr-1.5" /> Tạo Sản Phẩm Mới
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchOverviewStats();
                if (activeTab === 'PRODUCTS') fetchProducts();
                if (activeTab === 'ORDERS') fetchOrders();
                if (activeTab === 'LICENSES') fetchLicenses();
                if (activeTab === 'CUSTOMERS') fetchUsers();
                if (activeTab === 'TICKETS') fetchTickets();
              }}
              className="border-slate-700 bg-slate-900 text-xs font-medium"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1 text-slate-400" /> Làm Mới
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'OVERVIEW', label: 'Tổng Quan & Doanh Thu', icon: TrendingUp },
            { id: 'PRODUCTS', label: `Sản Phẩm Tool (${productsList.length})`, icon: Package },
            { id: 'ORDERS', label: `Đơn Hàng (${ordersList.length})`, icon: DollarSign },
            { id: 'LICENSES', label: `Bản Quyền Key (${licensesList.length})`, icon: KeyRound },
            { id: 'CUSTOMERS', label: `Khách Hàng (${usersList.length})`, icon: Users },
            { id: 'TICKETS', label: `Hỗ Trợ Khách Hàng (${supportTickets.length})`, icon: Headphones },
            { id: 'AUDIT_LOGS', label: 'Lịch Sử Kiểm Toán (Audit)', icon: Activity },
            { id: 'ANNOUNCEMENTS', label: 'Banner & Thông Báo', icon: BellRing },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                <span>Khoảng thời gian thống kê doanh thu thực tế:</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'today', label: 'Hôm Nay' },
                  { id: 'week', label: '7 Ngày Qua' },
                  { id: 'month', label: 'Tháng Này' },
                  { id: 'all', label: 'Toàn Thời Gian' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setStatsRange(item.id as any);
                      fetchOverviewStats(item.id as any);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      statsRange === item.id
                        ? 'bg-cyan-500 text-black shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-slate-800 bg-[#0C1019] p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Doanh Thu Thực Tế (PAID)</span>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {statsLoading ? '...' : formatCurrencyVND(stats?.totalRevenue || 0)}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>Theo bộ lọc đã chọn:</span>
                  <span className="text-emerald-400 font-bold">
                    {statsLoading ? '...' : formatCurrencyVND(stats?.rangeRevenue || 0)}
                  </span>
                </div>
              </Card>

              <Card className="border-slate-800 bg-[#0C1019] p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Đơn Hàng Thực Tế</span>
                  <CreditCard className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {statsLoading ? '...' : stats?.totalOrders || 0}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-emerald-400 font-medium">
                    {stats?.paidOrdersCount || 0} đã trả
                  </span>
                  <span className="text-amber-400 font-medium">
                    {stats?.pendingOrdersCount || 0} chờ
                  </span>
                  <span className="text-red-400 font-medium">
                    {stats?.cancelledOrdersCount || 0} hủy
                  </span>
                </div>
              </Card>

              <Card className="border-slate-800 bg-[#0C1019] p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>License Đang Hoạt Động</span>
                  <KeyRound className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {statsLoading ? '...' : stats?.activeLicenses || 0}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>Tổng key trong DB:</span>
                  <span className="text-white font-bold">{stats?.totalLicenses || 0}</span>
                </div>
              </Card>

              <Card className="border-slate-800 bg-[#0C1019] p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Tổng Khách Hàng Thực</span>
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {statsLoading ? '...' : stats?.totalUsers || 0}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>Tỷ lệ hoàn tất đơn:</span>
                  <span className="text-cyan-400 font-bold">{stats?.conversionRate || 0}%</span>
                </div>
              </Card>
            </div>

            {/* Top Products Table & Database Notice */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-slate-800 bg-[#0C1019] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Sản Phẩm Bán Chạy Nhất (Dữ Liệu Thật)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tính toán từ các đơn hàng đã thanh toán thành công (PAID)
                    </p>
                  </div>
                </div>

                {stats?.topProducts && stats.topProducts.length > 0 ? (
                  <div className="divide-y divide-slate-800">
                    {stats.topProducts.map((p, idx) => (
                      <div key={p.productId || idx} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-xs font-bold text-slate-300">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-white">{p.productName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{p.slug}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-400">
                            {formatCurrencyVND(p.revenue)}
                          </div>
                          <div className="text-[11px] text-slate-400">{p.salesCount} lượt mua</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center space-y-2">
                    <Package className="h-8 w-8 text-slate-600 mx-auto" />
                    <div className="text-xs font-bold text-slate-300">Chưa có dữ liệu giao dịch</div>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Khi có người dùng đặt mua và thanh toán đơn hàng thành công, số liệu bán chạy sẽ được tổng hợp tự động tại đây.
                    </p>
                  </div>
                )}
              </Card>

              {/* Server Info Card */}
              <Card className="border-slate-800 bg-[#0C1019] p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-400" /> Trạng Thái Máy Chủ Backend
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Cổng API:</span>
                    <span className="font-mono text-cyan-400 font-bold">:4000 NestJS</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Cơ sở dữ liệu:</span>
                    <span className="font-mono text-emerald-400 font-bold">MongoDB Atlas</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Thời gian cập nhật:</span>
                    <span className="text-slate-300">
                      {stats?.updatedAt ? formatDate(stats.updatedAt) : 'Vừa xong'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Tìm kiếm tool theo tên, slug, SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-9 bg-slate-900 border-slate-800 text-xs"
                />
              </div>
              <Link href="/admin/products/new">
                <Button size="sm" className="btn-gaming-primary text-xs font-bold">
                  <Plus className="h-4 w-4 mr-1.5" /> Tạo Sản Phẩm Mới
                </Button>
              </Link>
            </div>

            <Card className="border-slate-800 bg-[#0C1019] overflow-hidden">
              {filteredProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="border-b border-slate-800 bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="p-3.5">Sản Phẩm</th>
                        <th className="p-3.5">SKU</th>
                        <th className="p-3.5">Danh Mục</th>
                        <th className="p-3.5">Phiên Bản</th>
                        <th className="p-3.5">Gói Giá</th>
                        <th className="p-3.5">Lượt Bán</th>
                        <th className="p-3.5">Trạng Thái</th>
                        <th className="p-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={prod.thumbnailUrl}
                                  alt={prod.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-white line-clamp-1">{prod.name}</div>
                                <div className="text-[11px] text-slate-500 font-mono">/{prod.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-400">
                            {prod.sku || '---'}
                          </td>
                          <td className="p-3.5">
                            <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/30">
                              {prod.category}
                            </Badge>
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">{prod.currentVersion}</td>
                          <td className="p-3.5 font-semibold text-white">
                            {prod.plans?.length || 0} gói
                          </td>
                          <td className="p-3.5 font-bold text-emerald-400">
                            {prod.salesCount > 0 ? `${prod.salesCount} lượt` : 'Chưa có'}
                          </td>
                          <td className="p-3.5">
                            <Badge
                              className={`text-[10px] ${
                                prod.status === ProductStatus.ACTIVE
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : prod.status === ProductStatus.DRAFT
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                  : 'bg-red-500/20 text-red-300 border-red-500/30'
                              }`}
                            >
                              {prod.status}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link href={`/tools/${prod.slug}`} target="_blank">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-white">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center space-y-2">
                  <Package className="h-8 w-8 text-slate-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-300">Chưa có sản phẩm nào</div>
                  <p className="text-[11px] text-slate-500">
                    Bấm "Tạo Sản Phẩm Mới" để thêm tool game đầu tiên vào hệ thống.
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Tìm theo mã đơn NRO-..., email, tên tool..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-9 bg-slate-900 border-slate-800 text-xs"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value={OrderStatus.PAID}>Đã thanh toán (PAID)</option>
                  <option value={OrderStatus.PENDING}>Chờ thanh toán (PENDING)</option>
                  <option value={OrderStatus.CANCELLED}>Đã hủy (CANCELLED)</option>
                </select>
              </div>
            </div>

            <Card className="border-slate-800 bg-[#0C1019] overflow-hidden">
              {filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="border-b border-slate-800 bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="p-3.5">Mã Đơn</th>
                        <th className="p-3.5">Khách Hàng</th>
                        <th className="p-3.5">Sản Phẩm & Gói</th>
                        <th className="p-3.5">Số Tiền</th>
                        <th className="p-3.5">Cổng TT</th>
                        <th className="p-3.5">Thời Gian</th>
                        <th className="p-3.5">Trạng Thái</th>
                        <th className="p-3.5 text-right">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-cyan-400">
                            {ord.orderCode}
                          </td>
                          <td className="p-3.5">
                            <div className="text-white font-medium">{ord.userEmail}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="text-white font-medium">{ord.productSnapshot?.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {ord.planSnapshot?.name} ({ord.planSnapshot?.durationDays === 0 ? 'Vĩnh viễn' : `${ord.planSnapshot?.durationDays} ngày`})
                            </div>
                          </td>
                          <td className="p-3.5 font-bold text-emerald-400">
                            {formatCurrencyVND(ord.amount)}
                          </td>
                          <td className="p-3.5">
                            <Badge variant="outline" className="text-[10px] text-slate-300 border-slate-700">
                              {ord.paymentMethod}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-[11px] text-slate-400">
                            {formatDate(ord.createdAt)}
                          </td>
                          <td className="p-3.5">
                            <Badge
                              className={`text-[10px] ${
                                ord.status === OrderStatus.PAID
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : ord.status === OrderStatus.PENDING
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                  : 'bg-red-500/20 text-red-300 border-red-500/30'
                              }`}
                            >
                              {ord.status}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {ord.status === OrderStatus.PENDING && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveOrder(ord.id)}
                                    className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-[11px] font-bold text-white"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Duyệt
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelOrder(ord.id)}
                                    className="h-7 px-2 border-slate-700 text-[11px] text-red-400 hover:bg-red-950/30"
                                  >
                                    Hủy
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrderDetails(ord)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-white"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center space-y-2">
                  <CreditCard className="h-8 w-8 text-slate-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-300">Chưa có đơn hàng nào</div>
                  <p className="text-[11px] text-slate-500">
                    Đơn hàng mới từ người dùng sẽ tự động hiển thị tại đây kèm mã QR VietQR.
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 4: LICENSES MANAGEMENT */}
        {activeTab === 'LICENSES' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Tìm kiếm key license..."
                  value={licenseSearch}
                  onChange={(e) => setLicenseSearch(e.target.value)}
                  className="pl-9 bg-slate-900 border-slate-800 text-xs"
                />
              </div>
            </div>

            <Card className="border-slate-800 bg-[#0C1019] overflow-hidden">
              {filteredLicenses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="border-b border-slate-800 bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="p-3.5">Mã Bản Quyền (License Key)</th>
                        <th className="p-3.5">Tool Sản Phẩm</th>
                        <th className="p-3.5">Thiết Bị (HWID)</th>
                        <th className="p-3.5">Ngày Kích Hoạt</th>
                        <th className="p-3.5">Hết Hạn</th>
                        <th className="p-3.5">Trạng Thái</th>
                        <th className="p-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredLicenses.map((lic) => (
                        <tr key={lic.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-cyan-400">
                            {lic.licenseKey}
                          </td>
                          <td className="p-3.5 font-medium text-white">{lic.productName}</td>
                          <td className="p-3.5 text-slate-400">
                            {lic.boundDevices && lic.boundDevices.length > 0
                              ? `${lic.boundDevices.length}/${lic.maxDevices} máy`
                              : 'Chưa gắn máy'}
                          </td>
                          <td className="p-3.5 text-[11px] text-slate-400">{formatDate(lic.startDate)}</td>
                          <td className="p-3.5 text-[11px]">
                            {lic.expiresDate ? (
                              <span className="text-slate-300">{formatDate(lic.expiresDate)}</span>
                            ) : (
                              <span className="text-emerald-400 font-bold">Vĩnh Viễn</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <Badge
                              className={`text-[10px] ${
                                lic.status === LicenseStatus.ACTIVE
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-red-500/20 text-red-300 border-red-500/30'
                              }`}
                            >
                              {lic.status}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-right">
                            {lic.status === LicenseStatus.ACTIVE && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setRevokeModalLicense(lic)}
                                className="h-7 px-2 border-red-500/30 text-[11px] text-red-400 hover:bg-red-950/30"
                              >
                                <Ban className="h-3 w-3 mr-1" /> Thu Hồi
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center space-y-2">
                  <KeyRound className="h-8 w-8 text-slate-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-300">Chưa có License nào được cấp</div>
                  <p className="text-[11px] text-slate-500">
                    Khi đơn hàng thanh toán thành công, hệ thống sẽ tự động sinh mã license key tại đây.
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 5: CUSTOMERS MANAGEMENT */}
        {activeTab === 'CUSTOMERS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Tìm khách hàng theo họ tên, email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 bg-slate-900 border-slate-800 text-xs"
                />
              </div>
            </div>

            <Card className="border-slate-800 bg-[#0C1019] overflow-hidden">
              {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="border-b border-slate-800 bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="p-3.5">Khách Hàng</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Vai Trò</th>
                        <th className="p-3.5">Ngày Tạo</th>
                        <th className="p-3.5">Trạng Thái</th>
                        <th className="p-3.5 text-right">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredUsers.map((usr) => (
                        <tr key={usr.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3.5 font-bold text-white">{usr.fullName}</td>
                          <td className="p-3.5 text-slate-400">{usr.email}</td>
                          <td className="p-3.5">
                            <Badge
                              className={`text-[10px] ${
                                usr.role === UserRole.ADMIN
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {usr.role}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-[11px] text-slate-500">{formatDate(usr.createdAt)}</td>
                          <td className="p-3.5">
                            <Badge
                              className={`text-[10px] ${
                                usr.status === 'ACTIVE'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {usr.status}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewCustomerDetails(usr.id)}
                                className="h-7 px-2 text-[11px] text-cyan-400 hover:bg-cyan-950/30"
                              >
                                Xem hồ sơ
                              </Button>
                              {usr.role !== UserRole.ADMIN && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleUserStatus(usr.id)}
                                  className={`h-7 px-2 text-[11px] ${
                                    usr.status === 'ACTIVE'
                                      ? 'border-red-500/30 text-red-400 hover:bg-red-950/20'
                                      : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/20'
                                  }`}
                                >
                                  {usr.status === 'ACTIVE' ? 'Khóa' : 'Mở Khóa'}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center space-y-2">
                  <Users className="h-8 w-8 text-slate-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-300">Chưa có khách hàng</div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 6: SUPPORT TICKETS */}
        {activeTab === 'TICKETS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Tìm mã ticket TK-..., khách hàng, tiêu đề..."
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    className="pl-9 bg-slate-900 border-slate-800 text-xs"
                  />
                </div>
                <select
                  value={ticketStatusFilter}
                  onChange={(e) => setTicketStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="OPEN">Chưa xử lý (OPEN)</option>
                  <option value="IN_PROGRESS">Đang xử lý (IN_PROGRESS)</option>
                  <option value="RESOLVED">Đã giải quyết (RESOLVED)</option>
                  <option value="CLOSED">Đã đóng (CLOSED)</option>
                </select>
              </div>
            </div>

            <Card className="border-slate-800 bg-[#0C1019] overflow-hidden">
              {filteredTickets.length > 0 ? (
                <div className="divide-y divide-slate-800">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-cyan-400">
                            {ticket.ticketCode}
                          </span>
                          <Badge
                            className={`text-[10px] ${
                              ticket.status === 'OPEN'
                                ? 'bg-amber-500/20 text-amber-300'
                                : ticket.status === 'IN_PROGRESS'
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {ticket.status}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-800">
                            {ticket.category}
                          </Badge>
                        </div>
                        <div className="text-xs font-bold text-white">{ticket.subject}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-3">
                          <span>Khách: {ticket.customerName} ({ticket.customerEmail})</span>
                          {ticket.orderCode && (
                            <span className="text-cyan-400 font-mono">Đơn: {ticket.orderCode}</span>
                          )}
                          <span>{formatDate(ticket.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedTicket(ticket)}
                          className="h-8 px-3 btn-gaming-primary text-xs font-bold"
                        >
                          <Headphones className="h-3.5 w-3.5 mr-1" /> Trả Lời ({ticket.messages?.length || 0})
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <Headphones className="h-8 w-8 text-slate-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-300">
                    Chưa có ticket hỗ trợ nào từ khách hàng
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
                    Khi khách hàng gửi tin nhắn từ khung <strong>Live Chat</strong> (góc dưới cùng bên phải) hoặc bấm nút <strong>Báo Lỗi</strong>, từng cuộc hội thoại sẽ hiển thị tại đây kèm theo nút xanh <strong className="text-cyan-400">&quot;Trả Lời&quot;</strong> ở bên phải mỗi dòng.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-support-widget'));
                    }}
                    className="btn-gaming-primary text-xs font-bold"
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Mở Live Chat Để Gửi Tin Nhắn Thử Nghiệm
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 7: AUDIT LOGS */}
        {activeTab === 'AUDIT_LOGS' && (
          <div className="space-y-4">
            <Card className="border-slate-800 bg-[#0C1019] p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" /> Nhật Ký Kiểm Toán Hoạt Động (Audit Trail)
              </h3>
              <p className="text-xs text-slate-400">
                Ghi nhận mọi thao tác quản trị: Duyệt đơn thủ công, thu hồi bản quyền, khóa tài khoản khách hàng.
              </p>

              {auditLogs.length > 0 ? (
                <div className="divide-y divide-slate-800">
                  {auditLogs.map((log, idx) => (
                    <div key={log._id || idx} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span className="font-mono text-cyan-400">{log.action}</span>
                          <span className="text-slate-400">bởi {log.adminEmail}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Đối tượng: {log.targetEntity} (#{log.targetId})
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500">{formatDate(log.createdAt)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">Chưa có lịch sử audit log</div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 8: ANNOUNCEMENTS */}
        {activeTab === 'ANNOUNCEMENTS' && (
          <Card className="border-slate-800 bg-[#0C1019] p-6 space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BellRing className="h-4 w-4 text-cyan-400" /> Quản Lý Banner Thông Báo Toàn Website
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Nội dung thông báo khẩn</label>
              <textarea
                rows={3}
                value={bannerNoticeText}
                onChange={(e) => setBannerNoticeText(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="maintenanceToggle"
                checked={maintenanceBanner}
                onChange={(e) => setMaintenanceBanner(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
              <label htmlFor="maintenanceToggle" className="text-xs font-medium text-slate-300 cursor-pointer">
                Bật thanh thông báo khẩn ở đầu trang cho toàn bộ khách truy cập
              </label>
            </div>
          </Card>
        )}

        {/* Revoke license confirmation modal */}
        <Modal
          isOpen={!!revokeModalLicense}
          onClose={() => setRevokeModalLicense(null)}
          title="Thu Hồi Bản Quyền Key"
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3.5 text-xs text-red-300">
              Cảnh báo: Hành động này sẽ vô hiệu hóa vĩnh viễn key <strong className="font-mono text-white">{revokeModalLicense?.licenseKey}</strong>. Người dùng sẽ bị ngắt kết nối khỏi phần mềm ngay lập tức.
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Lý do thu hồi</label>
              <Input
                placeholder="Ví dụ: Gian lận chia sẻ key công khai..."
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="bg-slate-900 border-slate-800 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Gõ chính xác <code className="text-red-400 font-bold font-mono">XAC NHAN</code> để thực hiện:
              </label>
              <Input
                placeholder="XAC NHAN"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="bg-slate-900 border-slate-800 text-xs font-mono uppercase"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevokeModalLicense(null)}
                className="border-slate-700 bg-slate-900 text-xs"
              >
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handleRevokeLicense}
                className="bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
              >
                Xác Nhận Thu Hồi
              </Button>
            </div>
          </div>
        </Modal>

        {/* Customer details modal */}
        <Modal
          isOpen={!!selectedCustomerDetails}
          onClose={() => setSelectedCustomerDetails(null)}
          title="Hồ Sơ Khách Hàng Thực Tế"
        >
          {selectedCustomerDetails && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    {selectedCustomerDetails.user.fullName}
                  </span>
                  <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/30">
                    {selectedCustomerDetails.user.role}
                  </Badge>
                </div>
                <div className="text-slate-400">{selectedCustomerDetails.user.email}</div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span>Tổng tiền đã thanh toán (PAID):</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {formatCurrencyVND(selectedCustomerDetails.totalSpent)}
                  </span>
                </div>
              </div>

              <div>
                <div className="font-bold text-white mb-2">
                  Lịch Sử Đơn Hàng ({selectedCustomerDetails.orders.length}):
                </div>
                {selectedCustomerDetails.orders.length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {selectedCustomerDetails.orders.map((o) => (
                      <div key={o.id} className="p-2 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-mono text-cyan-400 font-bold">{o.orderCode}</span> - {o.productSnapshot?.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">{formatCurrencyVND(o.amount)}</span>
                          <Badge className="text-[9px]">{o.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 text-[11px]">Chưa có đơn hàng nào</div>
                )}
              </div>

              <div>
                <div className="font-bold text-white mb-2">
                  Bản Quyền Đã Cấp ({selectedCustomerDetails.licenses.length}):
                </div>
                {selectedCustomerDetails.licenses.length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {selectedCustomerDetails.licenses.map((l) => (
                      <div key={l.id} className="p-2 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between text-[11px]">
                        <div>
                          <div className="font-mono text-cyan-400 font-bold">{l.licenseKey}</div>
                          <div className="text-slate-500">{l.productName}</div>
                        </div>
                        <Badge className="text-[9px]">{l.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 text-[11px]">Chưa có license nào</div>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Ticket Reply Modal */}
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Hội Thoại Hỗ Trợ [${selectedTicket?.ticketCode}]`}
        >
          {selectedTicket && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1 text-slate-400">
                <div className="font-bold text-white">{selectedTicket.subject}</div>
                <div>Khách: {selectedTicket.customerName} ({selectedTicket.customerEmail})</div>
                {selectedTicket.orderCode && (
                  <div>Mã đơn hàng: <span className="font-mono text-cyan-400">{selectedTicket.orderCode}</span></div>
                )}
                <div className="pt-2 flex items-center gap-2">
                  <span>Trạng thái:</span>
                  {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateTicketStatus(selectedTicket.id || (selectedTicket as any)._id, st)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedTicket.status === st
                          ? 'bg-cyan-500 text-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat timeline */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto p-2 rounded-xl bg-slate-950 border border-slate-800">
                {selectedTicket.messages?.map((msg, idx) => {
                  const isAdminMsg = msg.sender === 'ADMIN';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-slate-500 mb-0.5">
                        {msg.senderName} ({isAdminMsg ? 'Admin Hỗ Trợ' : 'Khách'}) - {formatDate(msg.createdAt)}
                      </div>
                      <div
                        className={`max-w-[85%] rounded-xl p-2.5 text-xs leading-relaxed ${
                          isAdminMsg
                            ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/30 rounded-tr-none'
                            : 'bg-slate-800 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply form */}
              <div className="space-y-2">
                <textarea
                  rows={2}
                  placeholder="Nhập nội dung phản hồi cho khách hàng..."
                  value={ticketReplyText}
                  onChange={(e) => setTicketReplyText(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={isSendingReply || !ticketReplyText.trim()}
                    onClick={handleSendTicketReply}
                    className="btn-gaming-primary text-xs font-bold"
                  >
                    <Send className="h-3.5 w-3.5 mr-1" /> {isSendingReply ? 'Đang gửi...' : 'Gửi Phản Hồi'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Order Details Modal */}
        <Modal
          isOpen={!!selectedOrderDetails}
          onClose={() => setSelectedOrderDetails(null)}
          title={`Chi Tiết Đơn Hàng [${selectedOrderDetails?.orderCode}]`}
        >
          {selectedOrderDetails && (
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mã đơn hàng:</span>
                  <span className="font-mono font-bold text-cyan-400">{selectedOrderDetails.orderCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Khách hàng:</span>
                  <span className="text-white font-medium">{selectedOrderDetails.userEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sản phẩm:</span>
                  <span className="text-white font-medium">{selectedOrderDetails.productSnapshot?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Gói thời hạn:</span>
                  <span className="text-white">{selectedOrderDetails.planSnapshot?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Số tiền:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {formatCurrencyVND(selectedOrderDetails.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Trạng thái:</span>
                  <Badge>{selectedOrderDetails.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Thời gian tạo:</span>
                  <span className="text-slate-300">{formatDate(selectedOrderDetails.createdAt)}</span>
                </div>
                {selectedOrderDetails.paidAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Thời gian thanh toán:</span>
                    <span className="text-emerald-400 font-mono">{formatDate(selectedOrderDetails.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
