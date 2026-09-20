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
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { formatCurrencyVND } from '@/lib/utils';
import { CheckoutModal } from '@/components/checkout-modal';
import { IProduct } from '@tudongnro/shared-types';

export default function HomePage() {
  const [selectedProductForBuy, setSelectedProductForBuy] = React.useState<IProduct | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
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
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-8 h-12">
                Bảng So Sánh Gói Giá
              </Button>
            </Link>
          </div>

          {/* Key Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="rounded-xl border border-slate-800 bg-[#0F1523]/80 p-4">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">15.000+</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Users className="h-3.5 w-3.5" /> Game thủ tin cậy
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#0F1523]/80 p-4">
              <div className="text-2xl sm:text-3xl font-black text-purple-400">99.9%</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Tỉ lệ bảo vệ nick
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#0F1523]/80 p-4">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">5 Giây</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Zap className="h-3.5 w-3.5" /> Cấp key tự động
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#0F1523]/80 p-4">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">24/7</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Hỗ trợ kỹ thuật
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.map((product) => {
              const lowestPrice = Math.min(...product.plans.map((p) => p.price));
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
                          {product.salesCount} lượt mua
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
                        {product.features.slice(0, 2).map((feat, idx) => (
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
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedProductForBuy(product)}
                        className="w-full text-xs"
                      >
                        Mua Ngay
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. KEY ADVANTAGES / FEATURES */}
      <section className="py-16 md:py-24 border-b border-slate-800/60 bg-[#080B12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div>
            <Badge variant="purple" className="mb-2">CÔNG NGHỆ BẢO MẬT ĐỘC QUYỀN</Badge>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              TẠI SAO HÀNG NGÀN GAME THỦ CHỌN TUDONGNROTT?
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
              Không chỉ là tool tự động hóa thông thường, chúng tôi phát triển hệ sinh thái an toàn, bảo vệ tài sản và nhân vật của bạn 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 text-left space-y-3 hover:border-cyan-500/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cơ Chế Chống Ban 3 Lớp</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mô phỏng thao tác bấm phím ngẫu nhiên của con người (Humanized Input), gửi packet hợp lệ và ẩn chữ ký tiến trình khỏi cơ chế quét của NRO.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 text-left space-y-3 hover:border-purple-500/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Siêu Tối Ưu RAM Multi-Tab</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Can thiệp sâu vào engine render, chỉ tốn 30-40MB RAM trên mỗi tab. Giúp bạn treo 50-100 tài khoản dễ dàng trên máy tính phổ thông hoặc VPS.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 text-left space-y-3 hover:border-emerald-500/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cấp Phép Bản Quyền Tức Thì</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống kết nối trực tiếp cổng thanh toán ngân hàng qua VietQR. Ngay khi chuyển khoản thành công, License Key được tạo lập tức trên tài khoản.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (3 STEPS) */}
      <section className="py-16 md:py-24 border-b border-slate-800/60 bg-[#0A0E18]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div>
            <Badge variant="default" className="mb-2">QUY TRÌNH ĐƠN GIẢN</Badge>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              BẮT ĐẦU SỬ DỤNG CHỈ VỚI 3 BƯỚC
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-black text-xl shadow-lg shadow-cyan-500/10">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Chọn Tool & Gói Dịch Vụ</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Lựa chọn phần mềm phù hợp (Auto Đệ, Săn Boss, Tiện ích) và thời hạn mong muốn (7 ngày, 30 ngày hoặc Vĩnh viễn).
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 font-black text-xl shadow-lg shadow-purple-500/10">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Quét Mã VietQR 24/7</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Quét mã QR bằng App Ngân Hàng bất kỳ. Hệ thống bảo mật tự động xác nhận đơn hàng không cần đợi admin duyệt tay.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-black text-xl shadow-lg shadow-emerald-500/10">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Nhận Key & Kích Hoạt</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Mã License xuất hiện ngay trong trang quản lý. Nhập vào phần mềm và bắt đầu trải nghiệm tính năng đỉnh cao.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-16 md:py-24 border-b border-slate-800/60 bg-[#080B12]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-2">GIẢI ĐÁP THẮC MẮC</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              CÂU HỎI THƯỜNG GẶP (FAQ)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-cyan-400" /> Sử dụng tool có bị khóa tài khoản NRO không?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Các bản tool tại TUDONGNROTT.com được trang bị hệ thống Humanized Input mô phỏng tương tác người dùng thật và packet mã hóa độc quyền, giúp giảm thiểu rủi ro khóa nick xuống mức thấp nhất (tỉ lệ an toàn 99.9%).
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-cyan-400" /> Tôi có thể đổi sang máy tính khác khi nâng cấp máy không?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Có. Mỗi bản quyền cho phép liên kết với 01 thiết bị phần cứng (HWID). Khi đổi máy hoặc cài lại Win, bạn có thể vào mục <strong>Quản lý License</strong> trên website để Reset HWID miễn phí 1 lần/tháng.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0F1523] p-5 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-cyan-400" /> Game cập nhật bản mới thì tool có còn hoạt động không?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Đội ngũ phát triển của chúng tôi luôn theo sát và cập nhật bản vá tool chỉ sau 15-30 phút kể từ khi nhà phát hành game tung ra bảo trì. Mọi cập nhật đều hoàn toàn miễn phí trong suốt thời hạn gói bạn đã mua.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <section className="py-16 bg-gradient-to-b from-[#0F1523] to-[#080B12]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-900/60 p-8 sm:p-12 shadow-2xl shadow-cyan-500/10 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            SẴN SÀNG TRẢI NGHIỆM ĐỈNH CAO TỰ ĐỘNG HÓA NRO?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Hàng ngàn game thủ đã tiết kiệm hàng trăm giờ cày cuốc mỗi tuần. Đăng ký ngay để nhận ưu đãi gói trải nghiệm hấp dẫn!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/tools">
              <Button size="lg" className="btn-gaming-primary px-8">
                Khám Phá Toàn Bộ Tool Ngay
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="lg" className="px-8">
                Tạo Tài Khoản Mới
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Buy Modal */}
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
