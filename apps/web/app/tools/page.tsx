'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  Heart,
  Zap,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CATEGORY_LABELS } from '@/lib/constants';
import { formatCurrencyVND } from '@/lib/utils';
import { CheckoutModal } from '@/components/checkout-modal';
import { ProductCompareModal } from '@/components/product-compare-modal';
import { useWishlist } from '@/contexts/wishlist-context';
import { useToast } from '@/contexts/toast-context';
import { productsApi } from '@/lib/api-client';
import { IProduct } from '@tudongnro/shared-types';

const CATEGORY_TABS = ['ALL', 'WISHLIST', ...Object.keys(CATEGORY_LABELS)];

function ToolsCatalogContent() {
  const searchParams = useSearchParams();
  const initialWishlistTab = searchParams.get('tab') === 'wishlist';

  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    initialWishlistTab ? 'WISHLIST' : 'ALL'
  );
  const [sortBy, setSortBy] = React.useState<'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC'>('POPULAR');
  const [selectedProductForBuy, setSelectedProductForBuy] = React.useState<IProduct | null>(null);
  const [compareModalOpen, setCompareModalOpen] = React.useState(false);
  const [productForCompare, setProductForCompare] = React.useState<IProduct | undefined>(undefined);

  const { isInWishlist, toggleWishlist, wishlistCount } = useWishlist();
  const toast = useToast();

  React.useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const res = await productsApi.getAll();
        setProducts(res.data || []);
      } catch {
        // Fallback gracefully
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  React.useEffect(() => {
    if (searchParams.get('tab') === 'wishlist') {
      setSelectedCategory('WISHLIST');
    }
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedCategory === 'WISHLIST') {
        const prodId = (product.id || (product as any)._id)?.toString();
        return matchesSearch && isInWishlist(prodId);
      }

      const matchesCategory =
        selectedCategory === 'ALL' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'POPULAR') return (b.salesCount || 0) - (a.salesCount || 0);
      const priceA = a.plans?.length ? Math.min(...a.plans.map((p) => p.price)) : 0;
      const priceB = b.plans?.length ? Math.min(...b.plans.map((p) => p.price)) : 0;
      if (sortBy === 'PRICE_ASC') return priceA - priceB;
      if (sortBy === 'PRICE_DESC') return priceB - priceA;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, sortBy, isInWishlist]);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 pb-24">
      {/* Header Banner */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(0,240,255,0.1),rgba(255,255,255,0))] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <Badge variant="outline" className="border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs">
            <Sparkles className="h-3 w-3 mr-1" /> Danh Mục Bản Quyền Tool Tự Động Hóa 2026
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            KHO CÔNG CỤ TOOL <span className="text-gradient">NRO ONLINE</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Hệ thống phần mềm hỗ trợ chơi game tự động thế hệ mới. Vận hành ổn định, bảo mật 3 lớp, chống khóa tài khoản 99.9%. Cấp key tự động 100% qua VietQR.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-[#0B0F19] p-4 rounded-2xl border border-slate-800/80 shadow-lg">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tool theo tên, chức năng (auto pk, up đệ, săn boss)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/60 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 whitespace-nowrap">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-slate-700/60 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="POPULAR">Bán chạy nhất</option>
              <option value="PRICE_ASC">Giá tăng dần</option>
              <option value="PRICE_DESC">Giá giảm dần</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'WISHLIST' && (
                  <Heart className={`h-3 w-3 ${selectedCategory === 'WISHLIST' ? 'fill-white' : ''}`} />
                )}
                <span>
                  {cat === 'ALL'
                    ? `Tất Cả (${products.length})`
                    : cat === 'WISHLIST'
                    ? `Yêu Thích (${wishlistCount})`
                    : CATEGORY_LABELS[cat] || cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border border-slate-800 bg-[#0C1019] p-5 space-y-4 animate-pulse">
                <div className="h-44 w-full rounded-xl bg-slate-800" />
                <div className="h-4 w-1/3 bg-slate-800 rounded" />
                <div className="h-6 w-3/4 bg-slate-800 rounded" />
                <div className="h-10 w-full bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Product Cards Grid */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const lowestPrice =
                product.plans && product.plans.length > 0
                  ? Math.min(...product.plans.map((p) => p.price))
                  : 0;
              const prodId = (product.id || (product as any)._id)?.toString();
              const isFav = isInWishlist(prodId);

              return (
                <div
                  key={prodId || product.slug}
                  className="gaming-card flex flex-col justify-between rounded-2xl overflow-hidden group hover:border-cyan-500/50 transition-all duration-300 relative"
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
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <Badge variant="success" className="bg-emerald-950/80 backdrop-blur-md">
                          {product.currentVersion}
                        </Badge>
                        <span className="rounded-full bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                          <Zap className="h-2.5 w-2.5" /> Sẵn Key
                        </span>
                      </div>

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(prodId);
                          toast.showToast({
                            type: 'SUCCESS',
                            title: isFav ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích',
                            message: product.name,
                          });
                        }}
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-rose-500 hover:border-rose-500/50 transition-all"
                        aria-label="Thêm vào danh sách yêu thích"
                      >
                        <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-cyan-400 uppercase tracking-wider">
                          {CATEGORY_LABELS[product.category] || product.category}
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          {product.salesCount && product.salesCount > 0
                            ? `${product.salesCount} lượt mua`
                            : 'Chưa có lượt bán'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        <Link href={`/tools/${product.slug}`}>{product.name}</Link>
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {product.tagline}
                      </p>

                      {/* Feature Pills */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        {product.features?.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate">{feat.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Quick Buy Footer */}
                  <div className="p-5 pt-0 border-t border-slate-800/60 mt-4 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Giá chỉ từ:</span>
                      <div className="text-right">
                        <span className="text-lg font-black text-cyan-400">
                          {formatCurrencyVND(lowestPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedProductForBuy(product)}
                        className="btn-gaming-primary text-xs font-bold w-full"
                      >
                        <Zap className="h-3.5 w-3.5 mr-1" /> Mua Nhanh
                      </Button>
                      <Link href={`/tools/${product.slug}`} className="w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs font-semibold border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200"
                        >
                          Chi Tiết Tool
                        </Button>
                      </Link>
                    </div>

                    {/* Compare Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setProductForCompare(product);
                        setCompareModalOpen(true);
                      }}
                      className="w-full text-center text-[11px] text-slate-500 hover:text-cyan-400 transition-colors py-1 flex items-center justify-center gap-1"
                    >
                      <Layers className="h-3 w-3" /> So sánh các gói bản quyền
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-[#0C1019] p-12 text-center space-y-4">
            <Gamepad2 className="h-12 w-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Chưa có sản phẩm nào phù hợp</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Không tìm thấy công cụ nào theo từ khóa hoặc danh mục đã chọn. Vui lòng thử tìm kiếm với từ khóa khác.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="text-xs"
            >
              Đặt lại bộ lọc
            </Button>
          </div>
        )}
      </div>

      {/* Quick Checkout Modal */}
      {selectedProductForBuy && (
        <CheckoutModal
          isOpen={!!selectedProductForBuy}
          onClose={() => setSelectedProductForBuy(null)}
          product={selectedProductForBuy}
          initialPlan={
            selectedProductForBuy.plans.find((p) => p.isPopular) ||
            selectedProductForBuy.plans[0]
          }
        />
      )}

      {/* Product Compare Modal */}
      <ProductCompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        product={productForCompare}
      />
    </div>
  );
}

export default function ToolsCatalogPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#07090E] p-8 text-center text-slate-400">Đang tải danh mục...</div>}>
      <ToolsCatalogContent />
    </React.Suspense>
  );
}
