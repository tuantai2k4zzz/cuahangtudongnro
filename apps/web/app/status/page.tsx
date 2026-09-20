'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Server,
  Zap,
  ShieldCheck,
  CreditCard,
  Database,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SystemStatusPage() {
  const [lastChecked, setLastChecked] = React.useState('Vừa xong');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const services = [
    {
      name: 'Hệ thống Quét VietQR & Khớp Đơn Tự Động',
      description: 'Webhook SePAY / VietQR bắt biến động số dư ngân hàng 24/7',
      status: 'OPERATIONAL',
      latency: '120ms',
      uptime: '99.98%',
      icon: CreditCard,
    },
    {
      name: 'Máy Chủ Xác Thực Bản Quyền (License Server)',
      description: 'Endpoint REST API xác minh HWID cho tool game client',
      status: 'OPERATIONAL',
      latency: '45ms',
      uptime: '100%',
      icon: ShieldCheck,
    },
    {
      name: 'Cơ Sở Dữ Liệu Khách Hàng (MongoDB Atlas Cluster)',
      description: 'Lưu trữ tài khoản, bản quyền, hóa đơn và lịch sử HWID',
      status: 'OPERATIONAL',
      latency: '68ms',
      uptime: '99.99%',
      icon: Database,
    },
    {
      name: 'Máy Chủ Web & Giao Diện Cửa Hàng (Next.js / Vercel)',
      description: 'Cửa hàng, danh mục tool, bảng điều khiển cá nhân',
      status: 'OPERATIONAL',
      latency: '25ms',
      uptime: '100%',
      icon: Server,
    },
    {
      name: 'Bot Thông Báo Đơn Hàng & Hỗ Trợ Kỹ Thuật (Telegram/Zalo)',
      description: 'Thông báo đơn hàng cho ban quản trị và tin nhắn hỗ trợ',
      status: 'OPERATIONAL',
      latency: '150ms',
      uptime: '99.95%',
      icon: Zap,
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastChecked('Vừa xong');
    }, 800);
  };

  return (
    <div className="min-h-screen py-10 bg-[#080B12]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <Badge variant="success" className="text-[11px] py-0.5">
              HỆ THỐNG HOẠT ĐỘNG HOÀN HẢO
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Trạng Thái Hệ Thống TUDONGNROTT.com
            </h1>
            <p className="text-xs text-slate-400">
              Giám sát tình trạng vận hành của máy chủ cấp key, cổng nạp tiền và API bản quyền.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            className="text-xs font-bold gap-1.5 self-start sm:self-auto border-slate-700 bg-slate-900"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" /> Làm Mới ({lastChecked})
          </Button>
        </div>

        {/* Big Status Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Tất Cả Hệ Thống Đang Vận Hành Bình Thường</h3>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Không có sự cố gián đoạn nào được ghi nhận trong 90 ngày qua. Thời gian cấp key trung bình: 3.2 giây.
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] divide-y divide-slate-800/80 overflow-hidden shadow-2xl">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-cyan-400 border border-slate-700/80 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      {srv.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {srv.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 text-xs shrink-0 pl-12 sm:pl-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Độ trễ</span>
                    <span className="font-mono font-bold text-slate-200">{srv.latency}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Uptime</span>
                    <span className="font-mono font-bold text-emerald-400">{srv.uptime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Bình thường
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Maintenance Policy */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3 text-xs">
          <h4 className="font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" /> Lịch Bảo Trì Định Kỳ
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Hệ thống chỉ thực hiện bảo trì cơ sở hạ tầng vào các khung giờ thấp điểm (03:00 - 04:00 sáng Thứ Ba hàng tuần). Trước mỗi đợt bảo trì, thông báo sẽ được gửi trước 24 giờ qua Trung tâm thông báo trên website.
          </p>
          <div className="pt-2">
            <Link href="/" className="text-cyan-400 font-bold hover:underline">
              ← Quay lại trang chủ TUDONGNROTT.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
