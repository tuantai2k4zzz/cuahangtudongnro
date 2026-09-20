'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatCurrencyVND } from '@/lib/utils';
import { CheckoutModal } from '@/components/checkout-modal';
import { productsApi } from '@/lib/api-client';
import { IProduct } from '@tudongnro/shared-types';

export default function PricingPage() {
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [selectedProductForBuy, setSelectedProductForBuy] = React.useState<IProduct | null>(null);

  React.useEffect(() => {
    async function loadProducts() {
      try {
        const res = await productsApi.getAll();
        setProducts(res.data || []);
      } catch {
        setProducts([]);
      }
    }
    loadProducts();
  }, []);

  const tiers = [
    {
      name: 'Gói Trải Nghiệm',
      duration: '7 Ngày Sử Dụng',
      price: 50000,
      description: 'Thích hợp cho anh em muốn test thử độ mượt và tính năng trước khi mua dài hạn.',
      features: [
        { text: 'Truy cập đầy đủ tính năng của Tool', included: true },
        { text: 'Chống ban nick 3 lớp độc quyền', included: true },
        { text: 'Tối ưu Multi-tab không lag', included: true },
        { text: 'Đổi máy (HWID): Tối đa 1 lần', included: true },
        { text: 'Cập nhật bản mới miễn phí', included: true },
        { text: 'Hỗ trợ kỹ thuật ưu tiên 1-1', included: false },
        { text: 'Bảo hành vĩnh viễn', included: false },
      ],
      isPopular: false,
    },
    {
      name: 'Gói Tiêu Chuẩn VIP',
      duration: '30 Ngày Sử Dụng',
      price: 150000,
      description: 'Lựa chọn được 75% game thủ tin dùng, chi phí hợp lý cho việc cày cuốc hàng tháng.',
      features: [
        { text: 'Truy cập đầy đủ tính năng của Tool', included: true },
        { text: 'Chống ban nick 3 lớp độc quyền', included: true },
        { text: 'Tối ưu Multi-tab không lag', included: true },
        { text: 'Đổi máy (HWID): 2 lần/tháng', included: true },
        { text: 'Cập nhật bản mới miễn phí', included: true },
        { text: 'Hỗ trợ kỹ thuật ưu tiên 1-1', included: true },
        { text: 'Bảo hành vĩnh viễn', included: false },
      ],
      isPopular: true,
    },
    {
      name: 'Gói Tiết Kiệm',
      duration: '90 Ngày Sử Dụng',
      price: 380000,
      description: 'Tiết kiệm tới 30% so với gia hạn theo tháng. Dành cho các tay cày chuyên nghiệp.',
      features: [
        { text: 'Truy cập đầy đủ tính năng của Tool', included: true },
        { text: 'Chống ban nick 3 lớp độc quyền', included: true },
        { text: 'Tối ưu Multi-tab không lag', included: true },
        { text: 'Đổi máy (HWID): 5 lần', included: true },
        { text: 'Cập nhật bản mới miễn phí', included: true },
        { text: 'Hỗ trợ kỹ thuật ưu tiên 1-1', included: true },
        { text: 'Bảo hành vĩnh viễn', included: false },
      ],
      isPopular: false,
    },
    {
      name: 'Gói Trọn Đời (Lifetime)',
      duration: 'Sử Dụng Vĩnh Viễn',
      price: 850000,
      description: 'Mua 1 lần dùng mãi mãi. Tự động nhận tất cả các bản nâng cấp lớn nhỏ trong tương lai.',
      features: [
        { text: 'Truy cập đầy đủ tính năng của Tool', included: true },
        { text: 'Chống ban nick 3 lớp độc quyền', included: true },
        { text: 'Tối ưu Multi-tab không lag', included: true },
        { text: 'Đổi máy (HWID): Không giới hạn (hợp lệ)', included: true },
        { text: 'Cập nhật bản mới trọn đời', included: true },
        { text: 'Hỗ trợ kỹ thuật ưu tiên VIP 24/7', included: true },
        { text: 'Huy hiệu thành viên VIP trên website', included: true },
      ],
      isPopular: false,
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-[#080B12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <Badge variant="default">BẢNG GIÁ MINH BẠCH</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            CÁC GÓI BẢN QUYỀN LINH HOẠT
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Không phát sinh chi phí ẩn. Cấp mã License tự động 24/7 qua VietQR ngay sau khi thanh toán.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                tier.isPopular
                  ? 'border-cyan-400 bg-[#0F1523] shadow-2xl shadow-cyan-500/20 ring-1 ring-cyan-400'
                  : 'border-slate-800 bg-[#0F1523]/70 hover:border-slate-700'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-cyan-400 px-3 py-0.5 text-xs font-black text-slate-950 uppercase tracking-wide">
                  Được Mua Nhiều Nhất
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  <div className="text-xs text-slate-400 font-medium mt-1">{tier.duration}</div>
                </div>

                <div className="py-2 border-y border-slate-800">
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400">
                    {formatCurrencyVND(tier.price)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{tier.description}</div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Quyền Lợi Bao Gồm:
                  </div>
                  <ul className="space-y-2">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs">
                        {feat.included ? (
                          <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                        )}
                        <span className={feat.included ? 'text-slate-300' : 'text-slate-500'}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800">
                <Button
                  variant={tier.isPopular ? 'default' : 'secondary'}
                  size="lg"
                  onClick={() => setSelectedProductForBuy(products[0] || null)}
                  className="w-full text-xs font-bold"
                >
                  Chọn Mua Gói Này
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Cam Kết Chất Lượng & Hoàn Tiền</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Nếu tool phát sinh lỗi không thể tương thích với máy của bạn trong vòng 24 giờ đầu tiên kể từ khi kích hoạt, chúng tôi cam kết hoàn 100% tiền qua tài khoản ngân hàng.
              </p>
            </div>
          </div>
          <Link href="/tools">
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              Xem chi tiết từng tool <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedProductForBuy && (
        <CheckoutModal
          isOpen={!!selectedProductForBuy}
          onClose={() => setSelectedProductForBuy(null)}
          product={selectedProductForBuy}
        />
      )}
    </div>
  );
}
