import * as React from 'react';
import Link from 'next/link';
import { Gamepad2, ShieldCheck, Zap, Headphones, ExternalLink } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06080E] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#080B12]">
                  <Gamepad2 className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-black tracking-wider text-white">
                TUDONG<span className="text-cyan-400">NRO</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Hệ thống cung cấp phần mềm tự động hóa game Ngọc Rồng Online an toàn, chống ban 99.9%, vận hành 24/7 với hạ tầng máy chủ ổn định.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> An toàn tuyệt đối
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-cyan-400" /> Kích hoạt tức thì
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Sản Phẩm & Dịch Vụ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tools" className="hover:text-cyan-400 transition-colors">
                  Tất Cả Phần Mềm Tool
                </Link>
              </li>
              <li>
                <Link href="/tools/auto-nro-pro-ultimate" className="hover:text-cyan-400 transition-colors">
                  Auto NRO Pro Ultimate
                </Link>
              </li>
              <li>
                <Link href="/tools/auto-san-boss-vip" className="hover:text-cyan-400 transition-colors">
                  Auto Săn Boss VIP
                </Link>
              </li>
              <li>
                <Link href="/tools/auto-up-de-tu-treo-dau" className="hover:text-cyan-400 transition-colors">
                  Auto Úp Đệ Tử & Treo Đậu
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-cyan-400 transition-colors">
                  Bảng Giá Gói Thời Hạn
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Kích Hoạt & Xem License
                </Link>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.supportTelegram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-400 transition-colors text-cyan-400"
                >
                  <Headphones className="h-3.5 w-3.5" /> Kênh Telegram Hỗ Trợ <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <span className="text-slate-400">Email: {SITE_CONFIG.supportEmail}</span>
              </li>
              <li>
                <span className="text-slate-400">Thời gian hỗ trợ: 08:00 - 23:00 hàng ngày</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Disclaimer & Policy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Chính Sách & Cam Kết
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mỗi bản quyền chỉ sử dụng trên 01 thiết bị duy nhất. Mọi hành vi cố tình bẻ khóa hoặc chia sẻ key công khai sẽ bị hệ thống tự động khóa vĩnh viễn không hoàn tiền.
            </p>
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold">Hệ Thống Trực Tuyến:</span> 100% Tự động cấp key 24/7 ngay sau khi quét mã thanh toán.
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {SITE_CONFIG.name}. Tất cả quyền được bảo lưu.</p>
          <p className="text-[11px]">Designed with Dark Gaming UI Standards & Next.js 16 App Router.</p>
        </div>
      </div>
    </footer>
  );
}
