import * as React from 'react';
import Link from 'next/link';
import { Gamepad2, ShieldCheck, Zap, Headphones, ExternalLink, Activity, FileText } from 'lucide-react';
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
                <Link href="/policy" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-cyan-400" /> Chính Sách & Bảo Hành 1 Đổi 1
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-emerald-400" /> Trạng Thái Hệ Thống (Uptime)
                </Link>
              </li>
              <li>
                <a
                  href="https://t.me/tudongnrott_support"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-400 transition-colors text-cyan-400"
                >
                  <Headphones className="h-3.5 w-3.5" /> Telegram Kỹ Thuật <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1BFtijXXpU/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-blue-400 transition-colors text-slate-300"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-blue-400" /> Facebook Hỗ Trợ 24/7
                </a>
              </li>
              <li>
                <a
                  href="https://zalo.me/0983542830"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition-colors text-slate-400"
                >
                  Hotline/Zalo: <span className="text-white font-medium">0983.542.830</span>
                </a>
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
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400 space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Hệ Thống Trực Tuyến 24/7
              </div>
              <div>Cấp key tự động sau 3 giây quét mã VietQR.</div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {SITE_CONFIG.name}. Tất cả quyền được bảo lưu.</p>
          <p className="text-[11px]">Nền tảng thương mại điện tử Tool Game NRO Online chuyên nghiệp.</p>
        </div>
      </div>
    </footer>
  );
}
