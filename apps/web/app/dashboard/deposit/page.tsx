'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Wallet,
  Coins,
  QrCode,
  Copy,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { depositApi } from '@/lib/api-client';
import { IDepositTransaction, DepositStatus } from '@tudongnro/shared-types';
import { formatCurrencyVND, formatDate } from '@/lib/utils';

const PRESET_AMOUNTS = [
  { label: '50.000đ', value: 50000, popular: false },
  { label: '100.000đ', value: 100000, popular: true },
  { label: '200.000đ', value: 200000, popular: false },
  { label: '500.000đ', value: 500000, popular: false },
  { label: '1.000.000đ', value: 1000000, popular: false },
  { label: '2.000.000đ', value: 2000000, popular: false },
];

export default function DepositPage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const [selectedAmount, setSelectedAmount] = React.useState<number>(100000);
  const [customAmount, setCustomAmount] = React.useState<string>('');
  const [isCreating, setIsCreating] = React.useState(false);

  // Active deposit state
  const [activeDeposit, setActiveDeposit] = React.useState<{
    depositId: string;
    depositCode: string;
    amount: number;
    coins: number;
    bankInfo: {
      bankCode: string;
      accountNumber: string;
      accountHolder: string;
    };
    memo: string;
    qrUrl: string;
    expiresAt: string;
  } | null>(null);

  const [depositSuccess, setDepositSuccess] = React.useState(false);
  const [history, setHistory] = React.useState<IDepositTransaction[]>([]);
  const [historyLoading, setHistoryLoading] = React.useState(false);

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  // Fetch deposit history
  const fetchHistory = React.useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await depositApi.getMyDeposits();
      setHistory(res.data || []);
    } catch {
      // Ignored
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Handle deposit creation
  const handleCreateDeposit = async () => {
    if (!finalAmount || finalAmount < 10000) {
      toast.showToast({
        type: 'ERROR',
        title: 'Số tiền không hợp lệ',
        message: 'Số tiền nạp tối thiểu là 10.000 VNĐ.',
      });
      return;
    }

    setIsCreating(true);
    try {
      const res = await depositApi.create(finalAmount);
      if (res.data) {
        setActiveDeposit(res.data);
        setDepositSuccess(false);
        toast.showToast({
          type: 'SUCCESS',
          title: 'Đã tạo mã QR nạp tiền',
          message: `Mã giao dịch: ${res.data.depositCode}. Vui lòng chuyển đúng nội dung.`,
        });
      }
    } catch (err: any) {
      toast.showToast({
        type: 'ERROR',
        title: 'Lỗi tạo nạp tiền',
        message: err.message || 'Không thể tạo mã VietQR.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Real-time polling for active deposit completion
  React.useEffect(() => {
    if (!activeDeposit || depositSuccess) return;

    const interval = setInterval(async () => {
      try {
        const res = await depositApi.checkStatus(activeDeposit.depositCode);
        if (res.data && res.data.status === DepositStatus.SUCCESS) {
          setDepositSuccess(true);
          toast.showToast({
            type: 'SUCCESS',
            title: 'Nạp Tiền Thành Công!',
            message: `Đã cộng +${res.data.coins.toLocaleString('vi-VN')} Coin vào ví của bạn.`,
          });
          // Refresh user profile balance
          refreshUser();
          fetchHistory();
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [activeDeposit, depositSuccess, refreshUser, fetchHistory, toast]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.showToast({
      type: 'INFO',
      title: 'Đã sao chép',
      message: `${label}: ${text}`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header & Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-[#0B132B]/80 to-slate-950 p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Coins className="h-4 w-4" />
              Ví Tài Khoản NRO
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Nạp Coin Tự Động 24/7
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
              Tỷ lệ quy đổi chuẩn: <strong className="text-white font-mono">1 VNĐ = 1 Coin</strong>. Nạp tiền quét mã VietQR tự động qua ngân hàng MB Bank, hệ thống duyệt và cộng Coin trong 3 - 10 giây.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-emerald-400">
                <ShieldCheck className="h-4 w-4" /> Quét mã tự động 100%
              </div>
              <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-cyan-400">
                <Sparkles className="h-4 w-4" /> Mua tool nhận key tức thì
              </div>
            </div>
          </div>
        </div>

        {/* Current Balance Card */}
        <div className="rounded-3xl border border-cyan-500/30 bg-[#0C1222] p-6 sm:p-8 shadow-xl shadow-cyan-950/20 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Số Dư Hiện Có
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
                {(user?.balance || 0).toLocaleString('vi-VN')}
              </span>
              <span className="text-sm font-bold text-cyan-400">Coin</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tương đương {(user?.balance || 0).toLocaleString('vi-VN')} VNĐ
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <Link href="/tools">
              <Button variant="outline" size="sm" className="w-full border-slate-700 hover:border-cyan-500 hover:text-cyan-400 text-xs">
                Xem Kho Tool & Sử Dụng Coin <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Deposit Form & Active VietQR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Amount Selection */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-6 sm:p-7 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="h-4 w-4 text-cyan-400" />
                1. Chọn Số Tiền Cần Nạp
              </h3>
              <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/40 bg-cyan-950/30">1 VNĐ = 1 Coin</Badge>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_AMOUNTS.map((preset) => {
                const isSelected = !customAmount && selectedAmount === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setCustomAmount('');
                      setSelectedAmount(preset.value);
                    }}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 text-white font-bold shadow-lg shadow-cyan-500/20'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    {preset.popular && (
                      <span className="absolute -top-2 right-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow">
                        Phổ biến
                      </span>
                    )}
                    <div className="text-sm font-black font-mono">{preset.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      +{preset.value.toLocaleString('vi-VN')} Coin
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs text-slate-400 font-medium">
                Hoặc nhập số tiền tùy chọn (Tối thiểu 10.000 VNĐ):
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min={10000}
                  step={10000}
                  placeholder="Ví dụ: 150000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="h-11 bg-slate-900 border-slate-700 text-white font-mono text-sm pr-12"
                />
                <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                  VNĐ
                </span>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Số tiền thanh toán:</span>
                <span className="font-bold text-white font-mono">{finalAmount.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Coin thực nhận vào ví:</span>
                <span className="font-bold text-cyan-400 font-mono">+{finalAmount.toLocaleString('vi-VN')} Coin</span>
              </div>
            </div>

            <Button
              onClick={handleCreateDeposit}
              disabled={isCreating || !finalAmount || finalAmount < 10000}
              className="w-full h-12 btn-gaming-primary text-sm font-bold shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Đang khởi tạo mã QR...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Tạo Mã VietQR Nạp {finalAmount.toLocaleString('vi-VN')}đ
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: VietQR Code Box & Payment Status */}
        <div className="lg:col-span-6">
          {!activeDeposit ? (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-[#0B0F19]/40 p-8 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="h-16 w-16 rounded-3xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500 mb-4">
                <QrCode className="h-8 w-8" />
              </div>
              <h4 className="text-base font-bold text-white">Mã VietQR Sẽ Hiển Thị Tại Đây</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                Vui lòng chọn số tiền bên trái và bấm <strong className="text-cyan-400 font-semibold">Tạo Mã VietQR</strong> để hệ thống tạo mã quét thanh toán tự động.
              </p>
            </div>
          ) : depositSuccess ? (
            /* Success State */
            <div className="rounded-3xl border border-emerald-500/50 bg-[#0B1516] p-8 text-center flex flex-col items-center justify-center min-h-[420px] shadow-2xl shadow-emerald-500/20 animate-in zoom-in-95">
              <div className="h-20 w-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/30 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black text-white">Nạp Tiền Thành Công!</h3>
              <p className="text-sm text-slate-300 mt-2 max-w-md">
                Đã cộng <strong className="text-emerald-400 font-mono text-base">+{activeDeposit.coins.toLocaleString('vi-VN')} Coin</strong> vào tài khoản <span className="text-white font-medium">{user?.email}</span>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/tools">
                  <Button className="btn-gaming-primary h-11 px-6 text-xs font-bold">
                    Mua Bản Quyền Tool Ngay <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveDeposit(null);
                    setDepositSuccess(false);
                  }}
                  className="border-slate-700 text-xs"
                >
                  Nạp thêm giao dịch khác
                </Button>
              </div>
            </div>
          ) : (
            /* Active VietQR Payment Card */
            <div className="rounded-3xl border border-cyan-500/50 bg-[#0B0F19] p-6 sm:p-7 shadow-2xl shadow-cyan-950/40 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    Đang Đợi Chuyển Khoản...
                  </span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Mã nạp: <span className="font-mono text-cyan-400 font-bold">{activeDeposit.depositCode}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs font-mono text-cyan-400 border-cyan-500/40 bg-cyan-950/30">
                  {activeDeposit.amount.toLocaleString('vi-VN')} VNĐ
                </Badge>
              </div>

              {/* VietQR Image */}
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="bg-white p-2.5 rounded-2xl shadow-xl shrink-0">
                  <img
                    src={activeDeposit.qrUrl}
                    alt={`VietQR ${activeDeposit.depositCode}`}
                    className="w-44 h-44 object-contain"
                  />
                </div>

                {/* Transfer details to copy */}
                <div className="space-y-2.5 text-xs flex-1 w-full">
                  <div>
                    <div className="text-slate-500 text-[10px]">Ngân hàng:</div>
                    <div className="font-bold text-white">{activeDeposit.bankInfo.bankCode} (Quân Đội)</div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[10px]">Số tài khoản:</div>
                    <div className="flex items-center justify-between gap-2 mt-0.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800">
                      <span className="font-mono font-bold text-white">{activeDeposit.bankInfo.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(activeDeposit.bankInfo.accountNumber, 'Số tài khoản')}
                        className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                        title="Sao chép STK"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[10px]">Chủ tài khoản:</div>
                    <div className="font-bold text-white">{activeDeposit.bankInfo.accountHolder}</div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[10px]">Nội dung chuyển khoản (Bắt buộc đúng):</div>
                    <div className="flex items-center justify-between gap-2 mt-0.5 bg-rose-500/10 px-2.5 py-1.5 rounded-xl border border-rose-500/40">
                      <span className="font-mono font-black text-rose-300 text-sm tracking-wider">
                        {activeDeposit.depositCode}
                      </span>
                      <button
                        onClick={() => copyToClipboard(activeDeposit.depositCode, 'Nội dung CK')}
                        className="text-rose-400 hover:text-rose-300 cursor-pointer"
                        title="Sao chép nội dung"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status polling notice */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-2 text-[11px] text-slate-400">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400 shrink-0" />
                <span>Hệ thống đang tự động kiểm tra giao dịch mỗi 3 giây. Vui lòng giữ nguyên màn hình...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Transaction History */}
      <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-6 sm:p-7 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            Lịch Sử Nạp Tiền Của Bạn
          </h3>
          <button
            onClick={fetchHistory}
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3 w-3 ${historyLoading ? 'animate-spin' : ''}`} /> Làm mới
          </button>
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            Chưa có giao dịch nạp tiền nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                  <th className="pb-3 pl-2">MÃ GIAO DỊCH</th>
                  <th className="pb-3">SỐ TIỀN (VNĐ)</th>
                  <th className="pb-3">COIN NHẬN</th>
                  <th className="pb-3">TRẠNG THÁI</th>
                  <th className="pb-3 pr-2">THỜI GIAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((tx) => (
                  <tr key={tx.id || (tx as any)._id} className="hover:bg-slate-800/30">
                    <td className="py-3 pl-2 font-mono font-bold text-white">
                      {tx.depositCode}
                    </td>
                    <td className="py-3 font-mono text-slate-200">
                      {tx.amount.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3 font-mono font-bold text-cyan-400">
                      +{tx.coins.toLocaleString('vi-VN')} Coin
                    </td>
                    <td className="py-3">
                      <Badge
                        className={`text-[10px] ${
                          tx.status === DepositStatus.SUCCESS
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : tx.status === DepositStatus.PENDING
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {tx.status === DepositStatus.SUCCESS
                          ? 'Thành công'
                          : tx.status === DepositStatus.PENDING
                          ? 'Chờ thanh toán'
                          : 'Đã hủy'}
                      </Badge>
                    </td>
                    <td className="py-3 pr-2 text-slate-400 text-[11px]">
                      {tx.createdAt ? formatDate(tx.createdAt) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
