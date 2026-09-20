'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Sparkles,
  Gamepad2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { CATEGORY_LABELS } from '@/lib/constants';
import { formatCurrencyVND } from '@/lib/utils';
import { CheckoutModal } from '@/components/checkout-modal';
import { IProduct, ProductCategory } from '@tudongnro/shared-types';

export default function ToolsCatalogPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');
  const [sortBy, setSortBy] = React.useState<'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC'>('POPULAR');
  const [selectedProductForBuy, setSelectedProductForBuy] = React.useState<IProduct | null>(null);

  // Filter & Sort Logic
  const filteredProducts = React.useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'ALL' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'POPULAR') return b.salesCount - a.salesCount;
      const priceA = Math.min(...a.plans.map((p) => p.price));
      const priceB = Math.min(...b.plans.map((p) => p.price));
      if (sortBy === 'PRICE_ASC') return priceA - priceB;
      if (sortBy === 'PRICE_DESC') return priceB - priceA;
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen py-10 bg-[#080B12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="space-y-2">
          <Badge variant="default">CỬA HÀNG TOOL GAME NRO</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            DANH SÁCH TOOL GAME NRO ONLINE
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Tất cả bản quyền phần mềm được phát triển riêng, hỗ trợ cấu hình đa tab mượt mà, không chiếm chuột bàn phím và tự động hóa toàn bộ thao tác trong game.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Tìm kiếm tool theo tên, tính năng (ví dụ: Boss, Úp đệ, Đập đồ)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 justify-end">
              <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-semibold text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="POPULAR">Sắp xếp: Phổ biến nhất</option>
                <option value="PRICE_ASC">Giá: Từ thấp đến cao</option>
                <option value="PRICE_DESC">Giá: Từ cao xuống thấp</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-500 font-bold uppercase shrink-0 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Danh mục:
            </span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Tất Cả ({MOCK_PRODUCTS.length})
            </button>
            {Object.keys(CATEGORY_LABELS).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const lowestPrice = Math.min(...product.plans.map((p) => p.price));
              return (
                <div
                  key={product.id}
                  className="gaming-card flex flex-col justify-between rounded-2xl overflow-hidden group"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
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
                        <span className="rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 backdrop-blur-md border border-slate-700">
                          {product.salesCount} đã mua
                        </span>
                      </div>
                    </div>

                    {/* Body Info */}
                    <div className="p-5 space-y-3">
                      <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                        {CATEGORY_LABELS[product.category] || product.category}
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        <Link href={`/tools/${product.slug}`}>{product.name}</Link>
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {product.tagline}
                      </p>

                      {/* Feature Pills */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        {product.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate">{feat.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Footer */}
                  <div className="p-5 pt-0 border-t border-slate-800/60 mt-4 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Giá chỉ từ:</span>
                      <div className="text-right">
                        <span className="text-lg font-black text-cyan-400">
                          {formatCurrencyVND(lowestPrice)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">/gói thời hạn</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/tools/${product.slug}`} className="w-full">
                        <Button variant="secondary" size="sm" className="w-full text-xs">
                          Xem Chi Tiết
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
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-slate-800 bg-[#0F1523] p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400">
              <Gamepad2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Không tìm thấy tool phù hợp</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Không có sản phẩm nào khớp với từ khóa tìm kiếm hoặc bộ lọc danh mục đã chọn.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </div>
        )}
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
