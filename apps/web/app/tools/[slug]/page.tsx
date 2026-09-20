'use client';

import * as React from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Clock,
  DownloadCloud,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  History,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { formatCurrencyVND } from '@/lib/utils';
import { CATEGORY_LABELS } from '@/lib/constants';
import { CheckoutModal } from '@/components/checkout-modal';
import { IProductPlan } from '@tudongnro/shared-types';

export default function ToolDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const [selectedPlan, setSelectedPlan] = React.useState<IProductPlan>(
    product.plans.find((p) => p.isPopular) || product.plans[0]
  );
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

  return (
    <div className="min-h-screen py-10 bg-[#080B12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-cyan-400">Trang chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/tools" className="hover:text-cyan-400">Cửa hàng Tool</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-200 font-medium truncate">{product.name}</span>
        </div>

        {/* Top Product Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Image & Media Gallery */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.thumbnailUrl}
                alt={product.name}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="success" className="bg-emerald-950/90 backdrop-blur-md">
                  Phiên bản {product.currentVersion}
                </Badge>
                <Badge variant="default" className="bg-cyan-950/90 backdrop-blur-md">
                  {CATEGORY_LABELS[product.category] || product.category}
                </Badge>
              </div>
            </div>

            {/* Product description & long copy */}
            <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" /> Mô Tả Chi Tiết Sản Phẩm
              </h2>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
                {product.description}
              </div>

              {/* Feature Highlights */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white">Tính Năng Cốt Lõi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2"
                    >
                      <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                        <span>{feat.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Changelog */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="h-4 w-4 text-purple-400" /> Lịch Sử Cập Nhật Phiên Bản (Changelog)
                </h3>
                <div className="space-y-3">
                  {product.changelog.map((log, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-cyan-400">{log.version}</span>
                        <span className="text-slate-500 font-mono">{log.releaseDate}</span>
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                        {log.notes.map((note, nIdx) => (
                          <li key={nIdx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Requirements & Terms */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-cyan-400" /> Yêu Cầu Cấu Hình Máy
                  </div>
                  <p className="text-slate-400">Hệ điều hành: {product.systemRequirements.os}</p>
                  <p className="text-slate-400">Bộ nhớ: {product.systemRequirements.ram}</p>
                  {product.systemRequirements.notes && (
                    <p className="text-slate-500 italic">{product.systemRequirements.notes}</p>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-400" /> Chính Sách & Bản Quyền
                  </div>
                  <p className="text-slate-400">{product.terms}</p>
                  <p className="text-emerald-400">Bảo hành hỗ trợ cập nhật trong suốt hạn dùng.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Purchase Card (Sticky) */}
          <div className="lg:col-span-1 sticky top-24 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 shadow-2xl space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white">{product.name}</h1>
                <p className="text-xs text-slate-400 mt-1">{product.tagline}</p>
              </div>

              {/* Plan Choice */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Chọn Gói Bản Quyền:
                </label>
                <div className="space-y-2.5">
                  {product.plans.map((plan) => {
                    const isSelected = selectedPlan.planId === plan.planId;
                    return (
                      <div
                        key={plan.planId}
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/20 shadow-md shadow-cyan-500/15'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        {plan.isPopular && (
                          <span className="absolute -top-2 right-2 rounded-full bg-cyan-400 px-2 py-0.5 text-[9px] font-black text-slate-950 uppercase">
                            Phổ biến
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-white">{plan.name}</div>
                          <div className="text-sm font-mono font-bold text-cyan-400">
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

              {/* Price summary */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Gói đã chọn:</span>
                  <span className="font-semibold text-white">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Thời lượng:</span>
                  <span className="font-semibold text-white">
                    {selectedPlan.durationDays > 0 ? `${selectedPlan.durationDays} ngày` : 'Trọn đời'}
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-white">Thành tiền:</span>
                  <span className="text-2xl font-black text-cyan-400">
                    {formatCurrencyVND(selectedPlan.price)}
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <Button
                size="lg"
                onClick={() => setIsCheckoutOpen(true)}
                className="btn-gaming-primary w-full h-12 text-base gap-2"
              >
                Mua Bản Quyền Ngay <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="space-y-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Cấp License tự động qua mã VietQR</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Hỗ trợ kỹ thuật cài đặt qua Telegram / Zalo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          product={product}
          initialPlan={selectedPlan}
        />
      )}
    </div>
  );
}
