'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  ShieldCheck,
  Zap,
  Sparkles,
  Cpu,
  ChevronRight,
  Star,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  HelpCircle,
  KeyRound,
  DownloadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrencyVND } from '@/lib/utils';
import { CheckoutModal } from '@/components/checkout-modal';
import { productsApi } from '@/lib/api-client';
import { IProduct } from '@tudongnro/shared-types';

export default function HomePage() {
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProductForBuy, setSelectedProductForBuy] = React.useState<IProduct | null>(null);

  React.useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await productsApi.getAll();
        setProducts(res.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#07090E]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/60 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,240,255,0.15),rgba(255,255,255,0))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Nền tảng Tự Động Hóa Game Ngọc Rồng Thế Hệ Mới 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            NÂNG TẦM CHIẾN LỰC <br />
            <span className="gradient-title">TỰ ĐỘNG HÓA NRO ĐỈNH CAO</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Bản quyền Tool Auto NRO tối tân: Tự động úp đệ, săn Boss mili-giây, đập đồ an toàn chống xịt, tối ưu mở 100 tab không lo giật lag. Kích hoạt VietQR tự động chỉ sau 5 giây.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/tools">
              <Button size="lg" className="btn-gaming-primary w-full sm:w-auto text-base px-8 h-12 gap-2">
                <Gamepad2 className="h-5 w-5" /> Xem Danh Sách Tool <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-8 h-12 border-slate-700 bg-slate-900/80">
                Bảng So Sánh Gói Giá
              </Button>
            </Link>
          </div>

          {/* Key Metrics Strip (Real Standards) */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="rounded-xl border border-slate-800 bg-[#0F1523]/80 p-4">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Zap className="h-3.5 w-3.5 text-cyan-400" /> Cấp key tự động VietQR
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#0F1523]/80 p-4">
              <div className="text-2xl sm:text-3xl font-black text-purple-400">99.9%</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Tỉ lệ bảo vệ nick
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#0F1523]/80 p-4">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">1 Đổi 1</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Bảo hành cam kết
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#0F1523]/80 p-4">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">24/7</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-400" /> Hỗ trợ kỹ thuật
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED TOOLS */}
      <section className="py-16 md:py-24 border-b border-slate-800/60 bg-[#0A0E18]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="default" className="mb-2">SẢN PHẨM HÀNG ĐẦU</Badge>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                BỘ TOOL GAME NGỌC RỒNG CHUYÊN NGHIỆP
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Được lập trình bằng mã nguồn riêng, cập nhật ngay khi NRO Online update phiên bản mới.
              </p>
            </div>
            <Link href="/tools">
              <Button variant="outline" size="sm" className="gap-1.5 self-start">
                Tất cả sản phẩm <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-2xl border border-slate-800 bg-[#0C1019] p-4 space-y-3 animate-pulse">
                  <div className="h-40 bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-800 rounded w-2/3" />
                  <div className="h-8 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => {
                const lowestPrice =
                  product.plans && product.plans.length > 0
                    ? Math.min(...product.plans.map((p) => p.price))
                    : 0;
                return (
                  <div
                    key={product.id}
                    className="gaming-card flex flex-col justify-between rounded-2xl overflow-hidden group"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.thumbnailUrl}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="success" className="bg-emerald-950/80 backdrop-blur-md">
                            {product.currentVersion}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-mono text-cyan-300 backdrop-blur-md border border-slate-700">
                            {product.salesCount && product.salesCount > 0
                              ? `${product.salesCount} lượt mua`
                              : 'Chưa có lượt bán'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                          <Link href={`/tools/${product.slug}`}>{product.name}</Link>
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {product.tagline}
                        </p>

                        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                          {product.features?.slice(0, 2).map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                              <span className="truncate">{feat.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer & Pricing */}
                    <div className="p-5 pt-0 border-t border-slate-800/60 mt-4 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-400">Giá chỉ từ:</span>
                        <span className="text-base font-black text-cyan-400">
                          {formatCurrencyVND(lowestPrice)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link href={`/tools/${product.slug}`} className="w-full">
                          <Button variant="secondary" size="sm" className="w-full text-xs">
                            Chi Tiết
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => setSelectedProductForBuy(product)}
                          className="btn-gaming-primary w-full text-xs font-bold"
                        >
                          Mua Ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 rounded-xl border border-slate-800 bg-[#0C1019]">
              Chưa có sản phẩm nào được xuất bản.
            </div>
          )}
        </div>
      </section>

      {/* 3. CORE BENEFITS */}
      <section className="py-16 md:py-24 border-b border-slate-800/60 bg-[#06080E]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">LỢI THẾ CÔNG NGHỆ VƯỢT TRỘI</Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              TẠI SAO 100% GAME THỦ TIN DÙNG CHÚNG TÔI?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-800 bg-[#0C1019] p-7 space-y-4 hover:border-cyan-500/40 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                Chống Khóa Acc Tuyệt Đối
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mã nguồn độc quyền mô phỏng hành vi người dùng, delay ngẫu nhiên milli-giây, vượt qua mọi lớp quét tự động của server NRO.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0C1019] p-7 space-y-4 hover:border-purple-500/40 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                Tối Ưu Multi-Tab Siêu Mượt
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Giảm tải tài nguyên CPU/RAM xuống dưới 5% mỗi tab. Treo 50 - 100 tab thoải mái trên máy tính văn phòng hoặc VPS giá rẻ.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0C1019] p-7 space-y-4 hover:border-emerald-500/40 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Cấp Key & Kích Hoạt Tức Thì
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Thanh toán quét mã VietQR tự động 24/7. Hệ thống đối soát sao kê ngân hàng và trả license key trực tiếp ngay lập tức.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick checkout modal */}
      {selectedProductForBuy && (
        <CheckoutModal
          isOpen={!!selectedProductForBuy}
          onClose={() => setSelectedProductForBuy(null)}
          product={selectedProductForBuy}
          initialPlan={
            selectedProductForBuy.plans?.find((p) => p.isPopular) ||
            selectedProductForBuy.plans?.[0]
          }
        />
      )}
    </div>
  );
}
