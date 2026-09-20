'use client';

import * as React from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Clock,
  DownloadCloud,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  History,
  Sparkles,
  Heart,
  HelpCircle,
  Bug,
  Star,
  FileCode,
  Laptop,
  Check,
  Zap,
  Send,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatCurrencyVND, formatDate } from '@/lib/utils';
import { CATEGORY_LABELS } from '@/lib/constants';
import { CheckoutModal } from '@/components/checkout-modal';
import { useWishlist } from '@/contexts/wishlist-context';
import { useToast } from '@/contexts/toast-context';
import { useAuth } from '@/contexts/auth-context';
import { productsApi, reviewsApi } from '@/lib/api-client';
import { IProduct, IProductPlan, IReview } from '@tudongnro/shared-types';

export default function ToolDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = React.useState<IProduct | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedPlan, setSelectedPlan] = React.useState<IProductPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    'OVERVIEW' | 'INSTALL' | 'FAQ' | 'CHANGELOG' | 'REVIEWS'
  >('OVERVIEW');

  // Reviews state
  const [reviews, setReviews] = React.useState<IReview[]>([]);
  const [reviewsCount, setReviewsCount] = React.useState(0);
  const [avgRating, setAvgRating] = React.useState(0);
  const [ratingBreakdown, setRatingBreakdown] = React.useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  // Review Form
  const [newRating, setNewRating] = React.useState(5);
  const [newComment, setNewComment] = React.useState('');
  const [submittingReview, setSubmittingReview] = React.useState(false);

  // Fetch product from API
  React.useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await productsApi.getBySlug(slug);
        const prod = res.data;
        if (!prod) {
          setProduct(null);
          return;
        }
        setProduct(prod);
        if (prod.plans && prod.plans.length > 0) {
          const pop = prod.plans.find((p) => p.isPopular) || prod.plans[0];
          setSelectedPlan(pop);
        }

        // Fetch real reviews
        try {
          const revRes = await reviewsApi.getByProduct(prod.id);
          setReviews(revRes.data.reviews || []);
          setReviewsCount(revRes.data.count || 0);
          setAvgRating(revRes.data.averageRating || 0);
          setRatingBreakdown(revRes.data.ratingBreakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
        } catch {
          setReviews([]);
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleOpenBugReport = () => {
    const event = new CustomEvent('open-support-widget', {
      detail: {
        category: 'LOI_TOOL',
        subject: `Báo lỗi phần mềm: ${product?.name || ''}`,
      },
    });
    window.dispatchEvent(event);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!isAuthenticated) {
      toast.showToast({
        type: 'ERROR',
        title: 'Yêu cầu đăng nhập',
        message: 'Bạn cần đăng nhập tài khoản để gửi đánh giá.',
      });
      return;
    }
    if (!newComment.trim()) {
      toast.showToast({
        type: 'ERROR',
        title: 'Chưa nhập nhận xét',
        message: 'Vui lòng nhập nội dung đánh giá của bạn.',
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await reviewsApi.create({
        productId: product.id,
        rating: newRating,
        comment: newComment.trim(),
      });
      toast.showToast({
        type: 'SUCCESS',
        title: 'Đánh giá thành công!',
        message: 'Cảm ơn bạn đã đóng góp ý kiến.',
      });
      setReviews([res.data, ...reviews]);
      setReviewsCount((prev) => prev + 1);
      setNewComment('');
    } catch (err: any) {
      toast.showToast({
        type: 'ERROR',
        title: 'Không thể gửi đánh giá',
        message: err.message || 'Bạn đã đánh giá sản phẩm này rồi.',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] p-12 text-center space-y-4">
        <div className="h-10 w-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Đang tải thông tin bản quyền tool...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const prodId = (product.id || (product as any)._id)?.toString();
  const isFav = isInWishlist(prodId);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 pb-28 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Trang Chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/tools" className="hover:text-cyan-400 transition-colors">Danh Sách Tool</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-300 font-medium truncate">{product.name}</span>
        </nav>

        {/* Top Product Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Col 1: Media Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#0C1019] shadow-2xl shadow-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.thumbnailUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge variant="success" className="bg-emerald-950/90 backdrop-blur-md">
                  {product.currentVersion}
                </Badge>
                {product.badge && (
                  <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {product.badge}
                  </Badge>
                )}
              </div>
            </div>

            {/* Micro badges bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-center space-y-1">
                <ShieldCheck className="h-4 w-4 text-emerald-400 mx-auto" />
                <div className="text-[11px] font-bold text-white">Chống Khóa Nick</div>
                <div className="text-[10px] text-slate-500">Mô phỏng phím bấm 3 lớp</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-center space-y-1">
                <Clock className="h-4 w-4 text-cyan-400 mx-auto" />
                <div className="text-[11px] font-bold text-white">Cấp Key 3 Giây</div>
                <div className="text-[10px] text-slate-500">Tự động qua VietQR 24/7</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-center space-y-1">
                <DownloadCloud className="h-4 w-4 text-purple-400 mx-auto" />
                <div className="text-[11px] font-bold text-white">Update Trọn Đời</div>
                <div className="text-[10px] text-slate-500">Fix lỗi khi NRO bảo trì</div>
              </div>
            </div>
          </div>

          {/* Col 2: Pricing & Purchase Card */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#0C1019] p-6 sm:p-7 space-y-6 shadow-xl relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {CATEGORY_LABELS[product.category] || product.category}
                </span>
                <button
                  onClick={() => {
                    toggleWishlist(prodId);
                    toast.showToast({
                      type: 'SUCCESS',
                      title: isFav ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích',
                      message: product.name,
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isFav ? 'Đã thích' : 'Yêu thích'}</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>
                  {reviewsCount > 0 ? (
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {avgRating} ({reviewsCount} đánh giá)
                    </span>
                  ) : (
                    <span className="text-slate-500">Chưa có đánh giá</span>
                  )}
                </span>
                <span>•</span>
                <span className="font-mono">
                  {product.salesCount && product.salesCount > 0
                    ? `${product.salesCount} lượt mua`
                    : 'Chưa có lượt bán'}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              {product.tagline}
            </p>

            {/* Plan selection */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Chọn gói thời hạn bản quyền:</span>
                <span className="text-emerald-400 font-medium">Bảo hành 1 đổi 1</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.plans?.map((plan) => {
                  const isSelected = selectedPlan?.planId === plan.planId;
                  return (
                    <div
                      key={plan.planId}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative flex flex-col justify-between rounded-xl p-3 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      {plan.isPopular && (
                        <div className="absolute -top-2.5 right-2 rounded-full bg-cyan-500 px-2 py-0.5 text-[9px] font-black uppercase text-slate-950">
                          Khuyên Dùng
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-white">{plan.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {plan.durationDays === 0 ? 'Dùng vĩnh viễn' : `${plan.durationDays} ngày`}
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <div className="text-sm font-black text-cyan-400">
                          {formatCurrencyVND(plan.price)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Buy Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                size="lg"
                onClick={() => setIsCheckoutOpen(true)}
                className="btn-gaming-primary w-full text-sm font-black tracking-wider py-6"
              >
                <Zap className="h-4 w-4 mr-2" /> MUA NGAY - {selectedPlan ? formatCurrencyVND(selectedPlan.price) : '0đ'}
              </Button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Hỗ trợ VietQR quét mã tức thì</span>
                <button
                  onClick={handleOpenBugReport}
                  className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Bug className="h-3 w-3" /> Báo lỗi tool
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs Navigation */}
        <div className="space-y-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2">
            {[
              { id: 'OVERVIEW', label: 'Tính Năng & Cấu Hình', icon: FileCode },
              { id: 'INSTALL', label: 'Hướng Dẫn Cài Đặt', icon: Laptop },
              { id: 'FAQ', label: 'Hỏi Đáp Thường Gặp', icon: HelpCircle },
              { id: 'CHANGELOG', label: 'Lịch Sử Cập Nhật', icon: History },
              { id: 'REVIEWS', label: `Đánh Giá Thực Tế (${reviewsCount})`, icon: Star },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-[#0C1019] p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" /> Các Tính Năng Độc Quyền
                </h3>
                <div className="space-y-3">
                  {product.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-bold text-white">{feat.title}: </span>
                        <span className="text-slate-400">{feat.description}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {product.unsupportedFeatures && product.unsupportedFeatures.length > 0 && (
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-amber-400">Các tính năng chưa/không hỗ trợ:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
                      {product.unsupportedFeatures.map((uf, i) => (
                        <li key={i}>{uf}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Hardware Requirements */}
              <div className="rounded-2xl border border-slate-800 bg-[#0C1019] p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-purple-400" /> Yêu Cầu Cấu Hình Máy Tính
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Hệ điều hành:</span>
                    <span className="font-medium text-white">{product.systemRequirements?.os || 'Windows 10 / 11'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">RAM khuyến nghị:</span>
                    <span className="font-medium text-white">{product.systemRequirements?.ram || '4GB RAM trở lên'}</span>
                  </div>
                  {product.systemRequirements?.cpu && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Bộ vi xử lý (CPU):</span>
                      <span className="font-medium text-white">{product.systemRequirements.cpu}</span>
                    </div>
                  )}
                  {product.systemRequirements?.notes && (
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                      Ghi chú: {product.systemRequirements.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTALL GUIDE */}
          {activeTab === 'INSTALL' && (
            <div className="rounded-2xl border border-slate-800 bg-[#0C1019] p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Hướng Dẫn Cài Đặt & Kích Hoạt Tool
              </h3>
              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-sans whitespace-pre-wrap">
                  {product.installationGuide ||
                    '1. Sau khi thanh toán, lấy License Key tại trang quản lý.\n2. Tải bản nén tool .zip về máy.\n3. Giải nén vào thư mục không chứa dấu tiếng Việt.\n4. Mở file .exe với quyền Administrator và dán License Key.'}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: FAQ */}
          {activeTab === 'FAQ' && (
            <div className="rounded-2xl border border-slate-800 bg-[#0C1019] p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Câu Hỏi Thường Gặp
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">1. Tool có bị ban tài khoản Ngọc Rồng Online không?</div>
                  <p className="text-slate-400 leading-relaxed">
                    Tool sử dụng cơ chế giả lập bấm phím ngẫu nhiên như thao tác người thật, không can thiệp vào bộ nhớ game. Tỷ lệ an toàn đạt 99.9%.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">2. Tôi có thể đổi sang máy tính khác (HWID) không?</div>
                  <p className="text-slate-400 leading-relaxed">
                    Mỗi key cho phép reset HWID tự động 1 lần mỗi tuần tại trang quản lý bản quyền cá nhân.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CHANGELOG */}
          {activeTab === 'CHANGELOG' && (
            <div className="rounded-2xl border border-slate-800 bg-[#0C1019] p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Lịch Sử Phiên Bản & Bản Vá
              </h3>
              <div className="space-y-4">
                {product.changelog && product.changelog.length > 0 ? (
                  product.changelog.map((entry, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-cyan-400">{entry.version}</span>
                        <span className="text-[11px] text-slate-500">{entry.releaseDate}</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                        {entry.notes?.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500">Chưa có ghi chú cập nhật cho phiên bản này.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'REVIEWS' && (
            <div className="space-y-6">
              {/* Reviews Summary */}
              <div className="rounded-2xl border border-slate-800 bg-[#0C1019] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="text-center md:text-left space-y-1 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0">
                  <div className="text-4xl font-black text-white">
                    {reviewsCount > 0 ? avgRating : '0.0'}
                  </div>
                  <div className="flex justify-center md:justify-start gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star
                        key={st}
                        className={`h-4 w-4 ${
                          st <= Math.round(avgRating) ? 'fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-slate-400">
                    {reviewsCount > 0 ? `Dựa trên ${reviewsCount} đánh giá thực tế` : 'Chưa có đánh giá thực tế'}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5 text-xs">
                  {[5, 4, 3, 2, 1].map((st) => {
                    const count = ratingBreakdown[st] || 0;
                    const pct = reviewsCount > 0 ? (count / reviewsCount) * 100 : 0;
                    return (
                      <div key={st} className="flex items-center gap-2">
                        <span className="w-10 text-slate-400">{st} sao</span>
                        <div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-slate-500 text-[11px]">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Submission Form */}
              <div className="rounded-2xl border border-slate-800 bg-[#0C1019] p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Gửi Đánh Giá Của Bạn
                </h4>
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Chọn số sao:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <button
                            type="button"
                            key={st}
                            onClick={() => setNewRating(st)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`h-5 w-5 ${st <= newRating ? 'fill-amber-400' : 'text-slate-600'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Chia sẻ trải nghiệm sử dụng tool của bạn..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white"
                    />

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={submittingReview}
                        className="btn-gaming-primary text-xs font-bold"
                      >
                        <Send className="h-3.5 w-3.5 mr-1" />
                        {submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>Đăng nhập tài khoản để viết đánh giá cho sản phẩm này.</span>
                    <Link href="/login">
                      <Button size="sm" className="btn-gaming-primary text-xs">Đăng Nhập</Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* List of real reviews */}
              <div className="space-y-3">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{rev.userName}</span>
                          {rev.isVerifiedBuyer && (
                            <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                              Đã mua hàng
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">{formatDate(rev.createdAt)}</span>
                      </div>
                      <div className="flex gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <Star
                            key={st}
                            className={`h-3.5 w-3.5 ${st <= rev.rating ? 'fill-amber-400' : 'text-slate-700'}`}
                          />
                        ))}
                      </div>
                      <p className="text-slate-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm và chia sẻ!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout modal */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          product={product}
          initialPlan={selectedPlan}
        />
      )}
    </div>
  );
}
