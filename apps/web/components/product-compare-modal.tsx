'use client';

import * as React from 'react';
import { Check, X, ShieldCheck, Zap, Sparkles, HelpCircle } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyVND } from '@/lib/utils';
import { IProduct } from '@tudongnro/shared-types';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: IProduct;
  onSelectPlan?: (planId: string) => void;
}

export function ProductCompareModal({
  isOpen,
  onClose,
  product,
  onSelectPlan,
}: ProductCompareModalProps) {
  const plans = product?.plans || [
    { planId: 'p_1d', name: 'Gói 1 Ngày', durationDays: 1, price: 10000, originalPrice: 15000 },
    { planId: 'p_7d', name: 'Gói 7 Ngày', durationDays: 7, price: 50000, originalPrice: 70000 },
    { planId: 'p_30d', name: 'Gói 30 Ngày', durationDays: 30, price: 150000, originalPrice: 200000, isPopular: true },
    { planId: 'p_perm', name: 'Gói Vĩnh Viễn', durationDays: 0, price: 500000, originalPrice: 700000 },
  ];

  const featuresList = [
    {
      title: 'Tự động săn Boss & Làm nhiệm vụ',
      p1: true,
      p7: true,
      p30: true,
      pperm: true,
    },
    {
      title: 'Mô phỏng phím ảo không chiếm chuột',
      p1: true,
      p7: true,
      p30: true,
      pperm: true,
    },
    {
      title: 'Hỗ trợ mở đa tab song song (Multi-tab)',
      p1: 'Tối đa 3 tab',
      p7: 'Tối đa 8 tab',
      p30: 'Không giới hạn',
      pperm: 'Không giới hạn',
    },
    {
      title: 'Hỗ trợ đổi máy / Reset HWID',
      p1: '1 lần/tháng',
      p7: '2 lần/tháng',
      p30: '3 lần/tháng',
      pperm: 'Không giới hạn',
    },
    {
      title: 'Cập nhật miễn phí khi game bảo trì',
      p1: true,
      p7: true,
      p30: true,
      pperm: true,
    },
    {
      title: 'Hỗ trợ kỹ thuật qua Ultraview/Anydesk',
      p1: false,
      p7: false,
      p30: true,
      pperm: true,
    },
    {
      title: 'Quyền truy cập Group VIP Zalo/Tele',
      p1: false,
      p7: false,
      p30: false,
      pperm: true,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bảng So Sánh Chi Tiết Các Gói Bản Quyền" maxWidth="max-w-4xl">
      <div className="space-y-6 pt-2">
        <p className="text-xs text-slate-400">
          Chọn gói bản quyền phù hợp với nhu cầu cày cuốc của bạn. Tất cả các gói đều cam kết tự động cấp mã bản quyền ngay sau khi thanh toán.
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0A0E1A]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="p-3.5 font-bold text-slate-300 w-1/3">Tính Năng / Đặc Quyền</th>
                {plans.map((p) => (
                  <th key={p.planId} className="p-3.5 text-center">
                    {p.isPopular && (
                      <Badge variant="default" className="mb-1 text-[9px] py-0">
                        PHỔ BIẾN NHẤT
                      </Badge>
                    )}
                    <div className="font-bold text-white text-sm">{p.name}</div>
                    <div className="text-cyan-400 font-extrabold text-sm mt-0.5">
                      {formatCurrencyVND(p.price)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {featuresList.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-medium text-slate-300">{f.title}</td>
                  {[f.p1, f.p7, f.p30, f.pperm].map((val, colIdx) => (
                    <td key={colIdx} className="p-3.5 text-center">
                      {typeof val === 'boolean' ? (
                        val ? (
                          <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-slate-600 mx-auto" />
                        )
                      ) : (
                        <span className="font-semibold text-slate-200 text-[11px]">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-800 bg-slate-900/60">
                <td className="p-3.5 font-bold text-slate-400">Chọn Gói Ngay</td>
                {plans.map((p) => (
                  <td key={p.planId} className="p-3.5 text-center">
                    <Button
                      size="sm"
                      variant={p.isPopular ? 'default' : 'outline'}
                      onClick={() => {
                        onSelectPlan?.(p.planId);
                        onClose();
                      }}
                      className="w-full text-xs font-bold"
                    >
                      Mua Gói
                    </Button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Modal>
  );
}
