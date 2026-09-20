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
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyVND } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import { IProduct, IProductPlan } from '@tudongnro/shared-types';

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
  const [selectedPlan, setSelectedPlan] = React.useState<IProductPlan>(
    initialPlan || product.plans.find((p) => p.isPopular) || product.plans[0]
  );
  const [paymentMethod, setPaymentMethod] = React.useState<'VIETQR' | 'MOMO'>('VIETQR');
  const [email, setEmail] = React.useState('khachhang@gmail.com');
  const [step, setStep] = React.useState<'SELECT' | 'PAYMENT' | 'SUCCESS'>('SELECT');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  // Generate a mock order code for the session
  const orderCode = React.useMemo(
    () => `NRO-${Math.floor(10000 + Math.random() * 90000)}`,
    [isOpen]
  );

  React.useEffect(() => {
    if (initialPlan) {
      setSelectedPlan(initialPlan);
    }
  }, [initialPlan]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateOrder = () => {
    setStep('PAYMENT');
  };

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    // Simulate webhook instant verification in 2 seconds
    setTimeout(() => {
      setIsVerifying(false);
      setStep('SUCCESS');
    }, 2000);
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
          ? 'Chọn gói thời hạn phù hợp với nhu cầu của bạn'
          : step === 'PAYMENT'
          ? 'Hệ thống tự động kích hoạt license ngay sau khi nhận được tiền'
          : 'Bản quyền đã được thêm vào tài khoản của bạn'
      }
      maxWidth="max-w-xl"
    >
      {step === 'SELECT' && (
        <div className="space-y-5">
          {/* Plan selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Chọn Gói Thời Hạn
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
                        ? 'border-cyan-400 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-2 right-2 rounded-full bg-cyan-400 px-2 py-0.5 text-[9px] font-black text-slate-950 uppercase">
                        Khuyên dùng
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white">{plan.name}</div>
                      <div className="text-xs font-mono font-bold text-cyan-400">
                        {formatCurrencyVND(plan.price)}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{plan.durationDays > 0 ? `${plan.durationDays} ngày sử dụng` : 'Vĩnh viễn'}</span>
                      {plan.originalPrice > plan.price && (
                        <span className="line-through text-slate-500">
                          {formatCurrencyVND(plan.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email receiver */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Email Nhận Thông Báo Bản Quyền
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
              placeholder="nhap-email@gmail.com"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Phương Thức Thanh Toán
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('VIETQR')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  paymentMethod === 'VIETQR'
                    ? 'border-cyan-400 bg-cyan-950/30 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <QrCode className="h-5 w-5 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold">Chuyển Khoản VietQR</div>
                  <div className="text-[10px] text-slate-400">Xác nhận tự động 24/7</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('MOMO')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  paymentMethod === 'MOMO'
                    ? 'border-pink-500 bg-pink-950/30 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="h-5 w-5 text-pink-400" />
                <div>
                  <div className="text-xs font-bold">Ví Điện Tử MoMo</div>
                  <div className="text-[10px] text-slate-400">Quét mã tiện lợi</div>
                </div>
              </button>
            </div>
          </div>

          {/* Total & Checkout button */}
          <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Tổng thanh toán:</div>
              <div className="text-xl font-black text-cyan-400">
                {formatCurrencyVND(selectedPlan.price)}
              </div>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={handleCreateOrder}
              className="gap-2"
            >
              Tiếp Tục Thanh Toán <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 'PAYMENT' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-cyan-300 flex items-start gap-2">
            <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-cyan-400" />
            <span>
              Mở App Ngân Hàng bất kỳ quét mã QR bên dưới. Số tiền và nội dung chuyển khoản đã được điền tự động chính xác!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* VietQR Box */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700 bg-white p-3 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageUrl}
                alt="Mã QR Thanh toán VietQR"
                className="w-48 h-48 object-contain"
              />
              <div className="mt-2 text-center text-[11px] font-bold text-slate-800">
                Quét mã bằng App Ngân Hàng
              </div>
            </div>

            {/* Bank details */}
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/80">
                <div className="text-slate-400 text-[11px]">Ngân hàng nhận:</div>
                <div className="font-bold text-white">{SITE_CONFIG.vietqrConfig.bankName}</div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/80 flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-[11px]">Số tài khoản:</div>
                  <div className="font-mono font-bold text-cyan-400 text-sm">
                    {SITE_CONFIG.vietqrConfig.accountNumber}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(SITE_CONFIG.vietqrConfig.accountNumber, 'acc')
                  }
                  className="h-7 text-xs"
                >
                  <Copy className="h-3 w-3" /> {copiedField === 'acc' ? 'Đã chép' : 'Chép'}
                </Button>
              </div>

              <div className="p-2.5 rounded-lg border border-cyan-500/40 bg-cyan-950/20 flex items-center justify-between">
                <div>
                  <div className="text-cyan-300 text-[11px] font-bold">Nội dung chuyển khoản (Bắt buộc):</div>
                  <div className="font-mono font-black text-cyan-400 text-sm tracking-wider">
                    {orderCode}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => copyToClipboard(orderCode, 'code')}
                  className="h-7 text-xs"
                >
                  <Copy className="h-3 w-3" /> {copiedField === 'code' ? 'Đã chép' : 'Chép'}
                </Button>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/80">
                <div className="text-slate-400 text-[11px]">Số tiền cần thanh toán:</div>
                <div className="font-black text-white text-base">
                  {formatCurrencyVND(selectedPlan.price)}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('SELECT')}
              className="text-slate-400 hover:text-white"
            >
              Quay lại chọn gói
            </Button>
            <Button
              variant="default"
              size="lg"
              isLoading={isVerifying}
              onClick={handleSimulatePayment}
              className="w-full sm:w-auto"
            >
              Tôi Đã Chuyển Tiền (Kiểm Tra Ngay)
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

          <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Mã đơn hàng:</span>
              <span className="font-mono font-bold text-white">{orderCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mã License:</span>
              <span className="font-mono font-black text-emerald-400">NRO-AUTO-9921-2026-PRO</span>
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
              variant="default"
              size="lg"
              onClick={() => {
                onClose();
                router.push('/dashboard/licenses');
              }}
            >
              Vào Trang Quản Lý License
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                onClose();
                router.push('/dashboard/orders');
              }}
            >
              Xem Hóa Đơn Chi Tiết
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
