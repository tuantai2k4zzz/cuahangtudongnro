'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  QrCode,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { MOCK_ORDERS } from '@/lib/mock-data';
import { formatDate, formatCurrencyVND } from '@/lib/utils';
import { IOrder, OrderStatus } from '@tudongnro/shared-types';

export default function DashboardOrdersPage() {
  const [selectedOrder, setSelectedOrder] = React.useState<IOrder | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Lịch Sử Đơn Hàng</h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi tình trạng thanh toán và hóa đơn giao dịch của bạn
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="pb-3">Mã Đơn Hàng</th>
                <th className="pb-3">Tool Game</th>
                <th className="pb-3">Gói Dịch Vụ</th>
                <th className="pb-3">Số Tiền</th>
                <th className="pb-3">Cổng Thanh Toán</th>
                <th className="pb-3">Trạng Thái</th>
                <th className="pb-3">Thời Gian</th>
                <th className="pb-3 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 font-mono font-bold text-white">{order.orderCode}</td>
                  <td className="py-3.5 text-slate-200 font-semibold">
                    {order.productSnapshot.name}
                  </td>
                  <td className="py-3.5 text-slate-400">{order.planSnapshot.name}</td>
                  <td className="py-3.5 font-mono font-bold text-cyan-400">
                    {formatCurrencyVND(order.amount)}
                  </td>
                  <td className="py-3.5 text-slate-300 font-medium">
                    {order.paymentMethod}
                  </td>
                  <td className="py-3.5">
                    {order.status === OrderStatus.PAID ? (
                      <Badge variant="success">Đã Thanh Toán</Badge>
                    ) : order.status === OrderStatus.PENDING ? (
                      <Badge variant="warning">Chờ Thanh Toán</Badge>
                    ) : (
                      <Badge variant="danger">Đã Hủy</Badge>
                    )}
                  </td>
                  <td className="py-3.5 text-slate-400">{formatDate(order.createdAt)}</td>
                  <td className="py-3.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="h-7 text-xs"
                    >
                      <FileText className="h-3 w-3" /> Hóa đơn
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Hóa Đơn Đơn Hàng: ${selectedOrder.orderCode}`}
          description="Thông tin chi tiết giao dịch tài chính tại TUDONGNROTT.com"
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-4 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-white">{selectedOrder.orderCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Khách hàng:</span>
                <span className="text-white">{selectedOrder.userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sản phẩm:</span>
                <span className="font-semibold text-cyan-300">
                  {selectedOrder.productSnapshot.name} ({selectedOrder.productSnapshot.version})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gói thời hạn:</span>
                <span className="text-white">{selectedOrder.planSnapshot.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hình thức thanh toán:</span>
                <span className="text-white">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trạng thái:</span>
                <span className="font-bold text-emerald-400">{selectedOrder.status}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                <span className="text-slate-200 font-bold">Tổng thanh toán:</span>
                <span className="text-lg font-black text-cyan-400">
                  {formatCurrencyVND(selectedOrder.amount)}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
