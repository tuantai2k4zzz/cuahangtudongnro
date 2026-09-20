'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Copy,
  QrCode,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Loader2,
  CreditCard,
  ShieldCheck,
  Zap,
  Wallet,
  Coins,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyVND } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { ordersApi } from '@/lib/api-client';
import { IProduct, IProductPlan, LicenseStatus, OrderStatus, PaymentMethod } from '@tudongnro/shared-types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct;
  initialPlan?: IProductPlan;
}

export function CheckoutModal({
  isOpen,
  onClose,
  product,
  initialPlan,
}: CheckoutModalProps) {
  const router = useRouter();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const toast = useToast();

  const [selectedPlan, setSelectedPlan] = React.useState<IProductPlan>(
    initialPlan || product.plans.find((p) => p.isPopular) || product.plans[0]
  );
  const [paymentMethod, setPaymentMethod] = React.useState<'WALLET' | 'VIETQR'>('WALLET');
  const [email, setEmail] = React.useState('khachhang@gmail.com');
  const [step, setStep] = React.useState<'SELECT' | 'PAYMENT' | 'SUCCESS'>('SELECT');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isPayingWithWallet, setIsPayingWithWallet] = React.useState(false);
  const [generatedKey, setGeneratedKey] = React.useState('');
  const [confirmedOrderCode, setConfirmedOrderCode] = React.useState('');

  // Generate a mock order code for the session
  const fallbackOrderCode = React.useMemo(
    () => `NRO-${Math.floor(10000 + Math.random() * 90000)}`,
    [isOpen]
  );
  const orderCode = confirmedOrderCode || fallbackOrderCode;

  React.useEffect(() => {
    if (initialPlan) {
      setSelectedPlan(initialPlan);
    }
  }, [initialPlan]);

  React.useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label} vào bộ nhớ tạm!`);
  };

  const handleCreateOrder = () => {
    setStep('PAYMENT');
  };

  const handlePayWithWallet = async () => {
    if (!isAuthenticated) {
      toast.showToast({
        type: 'WARNING',
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để thanh toán bằng số dư ví tài khoản.',
      });
      router.push('/login');
      return;
    }

    const currentBalance = user?.balance || 0;
    if (currentBalance < selectedPlan.price) {
      toast.showToast({
        type: 'ERROR',
        title: 'Số dư không đủ',
        message: `Bạn đang có ${currentBalance.toLocaleString('vi-VN')} Coin, cần ${selectedPlan.price.toLocaleString('vi-VN')} Coin để thanh toán.`,
      });
      return;
    }

    setIsPayingWithWallet(true);
    try {
      const prodId = product.id || (product as any)._id;
      const res = await ordersApi.create({
        productId: prodId,
        planId: selectedPlan.planId,
        paymentMethod: PaymentMethod.WALLET,
      });

      if (res.data) {
        const orderData = res.data;
        const issuedKey =
          orderData.license?.licenseKey ||
          `NRO-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`;

        setConfirmedOrderCode(orderData.orderCode);
        setGeneratedKey(issuedKey);

        // Refresh user balance in context
        await refreshUser();

        toast.showToast({
          type: 'SUCCESS',
          title: 'Thanh toán thành công!',
          message: 'Đã trừ số dư ví và cấp mã bản quyền vào tài khoản của bạn.',
        });

        setStep('SUCCESS');
      }
    } catch (err: any) {
      toast.showToast({
        type: 'ERROR',
        title: 'Lỗi thanh toán',
        message: err.message || 'Không thể thực hiện giao dịch bằng ví.',
      });
    } finally {
      setIsPayingWithWallet(false);
    }
  };

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    // Simulate webhook instant verification in 1.8 seconds
    setTimeout(() => {
      setIsVerifying(false);
      const newKey = `NRO-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`;
      setGeneratedKey(newKey);

      // Save to localStorage for Customer Dashboard
      try {
        const orderData = {
          _id: `ord_${Date.now()}`,
          orderCode,
          productName: product.name,
          planName: selectedPlan.name,
          amount: selectedPlan.price,
          status: OrderStatus.PAID,
          createdAt: new Date().toISOString(),
          customerEmail: email,
        };
        const storedOrders = localStorage.getItem('tudongnro_orders_history');
        const orders = storedOrders ? JSON.parse(storedOrders) : [];
        orders.unshift(orderData);
        localStorage.setItem('tudongnro_orders_history', JSON.stringify(orders));

        const licenseData = {
          _id: `lic_${Date.now()}`,
          licenseKey: newKey,
          productName: product.name,
          planName: selectedPlan.name,
          status: LicenseStatus.ACTIVE,
          expiresAt:
            selectedPlan.durationDays > 0
              ? new Date(Date.now() + selectedPlan.durationDays * 86400000).toISOString()
              : '2099-12-31T23:59:59.000Z',
          hwid: null,
          hwidResetCount: 0,
        };
        const storedLic = localStorage.getItem('tudongnro_purchased_licenses');
        const licenses = storedLic ? JSON.parse(storedLic) : [];
        licenses.unshift(licenseData);
        localStorage.setItem('tudongnro_purchased_licenses', JSON.stringify(licenses));
      } catch {}

      toast.success('Hệ thống đã nhận thanh toán và tự động cấp License Key!');
      setStep('SUCCESS');
    }, 1800);
  };

  const qrImageUrl = `https://api.vietqr.io/image/${SITE_CONFIG.vietqrConfig.bankCode}-${SITE_CONFIG.vietqrConfig.accountNumber}-compact2.png?amount=${selectedPlan.price}&addInfo=${orderCode}&accountName=${encodeURIComponent(SITE_CONFIG.vietqrConfig.accountHolder)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setStep('SELECT');
        onClose();
      }}
      title={
        step === 'SELECT'
          ? `Mua Bản Quyền: ${product.name}`
          : step === 'PAYMENT'
          ? 'Quét Mã Thanh Toán VietQR'
          : 'Thanh Toán Thành Công!'
      }
      description={
        step === 'SELECT'
          ? 'Chọn gói thời hạn và hình thức thanh toán thuận tiện nhất'
          : step === 'PAYMENT'
          ? 'Quét mã VietQR bằng ứng dụng ngân hàng bất kỳ để nhận key trong 3 giây'
          : 'Mã bản quyền đã được kích hoạt và lưu vào tài khoản của bạn'
      }
      maxWidth="max-w-xl"
    >
      {step === 'SELECT' && (
        <div className="space-y-5">
          {/* Instant delivery badge */}
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-2 text-xs text-emerald-400">
            <Zap className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>
              <strong>Cấp key tự động 24/7</strong>: Nhận License Key ngay trên màn hình sau 3-10 giây chuyển khoản.
            </span>
          </div>

          {/* Plan selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              1. Chọn Gói Thời Hạn
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.plans.map((plan) => {
                const isSelected = selectedPlan.planId === plan.planId;
                return (
                  <div
                    key={plan.planId}
                    onClick={() => setSelectedPlan(plan)}
                    className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-500/20'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-2 right-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2 py-0.5 text-[9px] font-black text-slate-950">
                        PHỔ BIẾN
                      </span>
                    )}
                    <div className="text-xs font-bold text-white">{plan.name}</div>
                    <div className="text-base font-black text-cyan-400 mt-1">
                      {formatCurrencyVND(plan.price)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {plan.durationDays > 0 ? `${plan.durationDays} ngày sử dụng` : 'Sử dụng trọn đời'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              2. Email Nhận License Key
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            {isAuthenticated ? (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Đã tự động điền email từ tài khoản của bạn.
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                Key bản quyền sẽ gửi về email này và lưu tại đơn hàng.
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              3. Phương Thức Thanh Toán
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Wallet Balance */}
              <div
                onClick={() => setPaymentMethod('WALLET')}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'WALLET'
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                  <Coins className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Số Dư Ví Coin</span>
                    <span className="text-[10px] font-bold text-cyan-400 font-mono">
                      {(user?.balance || 0).toLocaleString('vi-VN')} Coin
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {!isAuthenticated ? (
                      <span className="text-amber-400">Đăng nhập để sử dụng ví</span>
                    ) : (user?.balance || 0) >= selectedPlan.price ? (
                      <span className="text-emerald-400 font-semibold">Đủ số dư • Nhận key tức thì 1s</span>
                    ) : (
                      <span className="text-rose-400 font-medium">
                        Thiếu {(selectedPlan.price - (user?.balance || 0)).toLocaleString('vi-VN')} Coin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Option 2: Direct VietQR (Mua ngay) */}
              <div
                onClick={() => setPaymentMethod('VIETQR')}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'VIETQR'
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                  <QrCode className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white">Mua Ngay (VietQR)</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Quét mã trừ thẳng, không qua ví
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Button */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-slate-400">Tổng thanh toán:</div>
              <div className="text-xl font-black text-cyan-400 font-mono">
                {formatCurrencyVND(selectedPlan.price)}
              </div>
            </div>

            {paymentMethod === 'WALLET' ? (
              !isAuthenticated ? (
                <Button
                  size="lg"
                  className="btn-gaming-primary gap-2 text-xs font-bold w-full sm:w-auto"
                  onClick={() => router.push('/login')}
                >
                  Đăng Nhập Để Dùng Ví <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (user?.balance || 0) < selectedPlan.price ? (
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-black gap-2 text-xs font-bold w-full sm:w-auto cursor-pointer"
                  onClick={() => {
                    onClose();
                    router.push('/dashboard/deposit');
                  }}
                >
                  <Coins className="h-4 w-4" /> Nạp Thêm Coin Vào Ví <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  disabled={isPayingWithWallet}
                  className="btn-gaming-primary gap-2 text-xs font-bold w-full sm:w-auto cursor-pointer shadow-lg shadow-cyan-500/30"
                  onClick={handlePayWithWallet}
                >
                  <Zap className="h-4 w-4" /> Thanh Toán Bằng Số Dư ({formatCurrencyVND(selectedPlan.price)})
                </Button>
              )
            ) : (
              <Button
                size="lg"
                className="btn-gaming-primary gap-2 text-xs font-bold w-full sm:w-auto cursor-pointer"
                onClick={handleCreateOrder}
              >
                Tiến Hành Quét Mã VietQR <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {step === 'PAYMENT' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* QR Image Box */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-cyan-500/30 bg-[#0C1220] space-y-2">
              <div className="p-2 rounded-xl bg-white shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageUrl}
                  alt="VietQR Payment"
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                />
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">
                Mở app ngân hàng quét mã để thanh toán tự động
              </span>
            </div>

            {/* Bank details info */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ngân hàng:</span>
                  <span className="font-bold text-white">{SITE_CONFIG.vietqrConfig.bankCode} (MBBank)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <span className="font-bold text-white uppercase">{SITE_CONFIG.vietqrConfig.accountHolder}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-cyan-400">{SITE_CONFIG.vietqrConfig.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(SITE_CONFIG.vietqrConfig.accountNumber, 'Số tài khoản')}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Số tiền:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-emerald-400">{formatCurrencyVND(selectedPlan.price)}</span>
                    <button
                      onClick={() => copyToClipboard(selectedPlan.price.toString(), 'Số tiền')}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-amber-400">{orderCode}</span>
                    <button
                      onClick={() => copyToClipboard(orderCode, 'Nội dung chuyển khoản')}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-2.5 text-[11px] text-amber-300 flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>Lưu ý quan trọng</strong>: Vui lòng giữ nguyên nội dung chuyển khoản là <strong>{orderCode}</strong> để hệ thống tự động cộng key.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('SELECT')}
              className="text-slate-400 hover:text-white"
            >
              ← Quay lại chọn gói
            </Button>
            <Button
              size="lg"
              isLoading={isVerifying}
              onClick={handleSimulatePayment}
              className="btn-gaming-primary w-full sm:w-auto text-xs font-bold gap-2"
            >
              <Zap className="h-4 w-4" /> Tôi Đã Chuyển Tiền (Xác Nhận Ngay)
            </Button>
          </div>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="py-6 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>

          <div>
            <h3 className="text-xl font-black text-white">Giao Dịch Thành Công!</h3>
            <p className="text-xs text-slate-400 mt-1">
              Hệ thống đã tự động kích hoạt License cho sản phẩm{' '}
              <strong className="text-cyan-400">{product.name}</strong> ({selectedPlan.name}).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-4 text-left space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Mã đơn hàng:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-white">{orderCode}</span>
                <button
                  onClick={() => copyToClipboard(orderCode, 'Mã đơn hàng')}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Mã License:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black text-emerald-400">{generatedKey}</span>
                <button
                  onClick={() => copyToClipboard(generatedKey, 'Mã License')}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Thời hạn sử dụng:</span>
              <span className="font-bold text-white">
                {selectedPlan.durationDays > 0 ? `${selectedPlan.durationDays} Ngày` : 'Vĩnh Viễn'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              className="btn-gaming-primary text-xs font-bold"
              size="lg"
              onClick={() => {
                onClose();
                router.push('/dashboard/licenses');
              }}
            >
              Vào Kho Quản Lý License →
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="text-xs font-bold"
              onClick={() => {
                onClose();
                router.push('/dashboard/orders');
              }}
            >
              Xem Lịch Sử Hóa Đơn
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
