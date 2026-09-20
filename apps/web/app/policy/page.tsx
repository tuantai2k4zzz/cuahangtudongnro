'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Clock,
  HelpCircle,
  CreditCard,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PolicyPage() {
  return (
    <div className="min-h-screen py-10 bg-[#080B12]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <Badge variant="default" className="text-[11px]">
            MINH BẠCH & BẢO VỆ KHÁCH HÀNG
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Chính Sách Dịch Vụ, Bảo Hành & Xử Lý Giao Dịch
          </h1>
          <p className="text-sm text-slate-400">
            Cam kết quyền lợi rõ ràng, minh bạch cho tất cả khách hàng sử dụng dịch vụ tại TUDONGNROTT.com.
          </p>
        </div>

        {/* Section 1: Warranty Policy */}
        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">1. Chính Sách Bảo Hành Bản Quyền (1 Đổi 1)</h2>
              <span className="text-xs text-emerald-400 font-semibold">Cam kết hỗ trợ suốt thời hạn sử dụng</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed pl-2 sm:pl-13">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Bảo hành 1 đổi 1</strong>: Nếu License Key gặp lỗi kỹ thuật từ phía máy chủ hoặc không thể kích hoạt trên phần mềm game, hệ thống sẽ cấp ngay License Key mới tương đương hoặc bù thêm ngày sử dụng.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Cập nhật miễn phí khi game bảo trì</strong>: Mỗi khi game Ngọc Rồng Online ra mắt bản vá mới, đội ngũ DEV của chúng tôi cam kết update bản sửa lỗi miễn phí trong vòng 15 - 60 phút.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Hỗ trợ đổi máy tính (Reset HWID)</strong>: Mỗi tài khoản được quyền tự bấm Reset HWID tối đa 3 lần/tháng ngay trên trang quản lý cá nhân mà không cần chờ duyệt thủ công.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Payment Troubleshooting */}
        <div className="rounded-2xl border border-cyan-500/30 bg-[#0C1322] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">2. Hướng Dẫn Xử Lý Khi Chuyển Khoản Chậm</h2>
              <span className="text-xs text-cyan-400 font-semibold">Quy trình xử lý tự động & thủ công</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed pl-2 sm:pl-13">
            <p>
              Hệ thống quét biến động VietQR tự động khớp đơn trong <strong>3 đến 10 giây</strong>. Nếu sau 60 giây bạn chưa thấy màn hình cập nhật trạng thái đã thanh toán:
            </p>

            <ol className="list-decimal list-inside space-y-2 text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <li>
                <strong>Kiểm tra lại nội dung chuyển khoản</strong>: Đảm bảo bạn đã điền chính xác mã đơn hàng (Ví dụ: <code className="text-cyan-400 font-mono font-bold">NRO-88219</code>) mà không thêm các ký tự thừa.
              </li>
              <li>
                <strong>Bấm nút "Tôi Đã Chuyển Tiền"</strong> trên giao diện để máy chủ quét lại một lần nữa.
              </li>
              <li>
                <strong>Mở Live Chat, Zalo hoặc Facebook</strong>: Bấm nút "Gửi mã đơn hàng" trong khung chat nổi ở góc màn hình hoặc nhắn trực tiếp Zalo <code className="text-cyan-400 font-mono font-bold">0983.542.830</code> / Facebook. Kỹ thuật viên trực 24/7 sẽ kiểm tra sao kê ngân hàng và kích hoạt đơn hàng thủ công trong 1-3 phút.
              </li>
            </ol>
          </div>
        </div>

        {/* Section 3: Refund Policy */}
        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">3. Điều Kiện Hoàn Tiền (Refund Policy)</h2>
              <span className="text-xs text-purple-400 font-semibold">Bảo vệ quyền lợi người mua sắm</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed pl-2 sm:pl-13">
            <p>
              Chúng tôi hỗ trợ hoàn tiền 100% trong các trường hợp sau:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Tool không hoạt động trên máy tính của bạn và đội ngũ kỹ thuật qua Ultraview không thể khắc phục được trong vòng 24 giờ sau khi mua.</li>
              <li>Bạn chuyển khoản trùng lặp 2 lần cho cùng một mã đơn hàng.</li>
              <li>Hệ thống bảo trì máy chủ kéo dài quá 48 giờ liên tục mà không có thông báo trước.</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Có câu hỏi cần giải đáp thêm? Đội ngũ hỗ trợ luôn sẵn sàng lắng nghe.
          </div>
          <div className="flex gap-3">
            <Button
              className="btn-gaming-primary text-xs font-bold"
              onClick={() => {
                const event = new CustomEvent('open-support-widget');
                window.dispatchEvent(event);
              }}
            >
              Mở Hỗ Trợ Trực Tuyến
            </Button>
            <Link href="/tools">
              <Button variant="outline" className="text-xs font-bold border-slate-700 bg-slate-900">
                Xem Kho Tool
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
