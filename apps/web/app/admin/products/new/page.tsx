'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Rocket,
  Eye,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  Layers,
  Cpu,
  DollarSign,
  KeyRound,
  Search,
  Share2,
  HelpCircle,
  FileText,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { productsApi } from '@/lib/api-client';
import { formatCurrencyVND } from '@/lib/utils';
import {
  ProductCategory,
  ProductStatus,
  PlanDurationType,
  LicenseIssuanceType,
  UserRole,
} from '@tudongnro/shared-types';

export default function NewProductPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = React.useState<
    'BASIC' | 'TECH' | 'PLANS' | 'LICENSE' | 'SEO' | 'PREVIEW'
  >('BASIC');

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [confirmPublishOpen, setConfirmPublishOpen] = React.useState(false);

  // Form state
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [sku, setSku] = React.useState('');
  const [tagline, setTagline] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [thumbnailUrl, setThumbnailUrl] = React.useState(
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
  );
  const [galleryUrls, setGalleryUrls] = React.useState<string[]>([
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  ]);
  const [videoUrl, setVideoUrl] = React.useState('');
  const [category, setCategory] = React.useState<ProductCategory>(ProductCategory.ALL_IN_ONE);
  const [status, setStatus] = React.useState<ProductStatus>(ProductStatus.ACTIVE);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [badge, setBadge] = React.useState('HOT');
  const [sortOrder, setSortOrder] = React.useState(0);

  // Technical specs
  const [toolName, setToolName] = React.useState('');
  const [currentVersion, setCurrentVersion] = React.useState('v1.0.0');
  const [supportedGameVersion, setSupportedGameVersion] = React.useState('NRO Online v2.4.x');
  const [platform, setPlatform] = React.useState('PC Windows');
  const [supportedOs, setSupportedOs] = React.useState('Windows 10 / 11 (64-bit)');
  const [sysOs, setSysOs] = React.useState('Windows 10 / 11');
  const [sysRam, setSysRam] = React.useState('4GB RAM trở lên');
  const [sysCpu, setSysCpu] = React.useState('Intel Core i3 / AMD Ryzen 3 trở lên');
  const [sysDisk, setSysDisk] = React.useState('500MB dung lượng trống');
  const [sysNotes, setSysNotes] = React.useState('Tương thích mượt mà các giả lập MicroEmulator, LDPlayer');
  const [installationGuide, setInstallationGuide] = React.useState(
    '1. Tải bản nén tool .zip\n2. Giải nén vào thư mục không dấu\n3. Chạy file exe với quyền Run as Administrator\n4. Dán License Key được cấp để kích hoạt'
  );
  const [userGuide, setUserGuide] = React.useState(
    'Đăng nhập game NRO, mở tool và cấu hình tọa độ úp/săn boss theo mong muốn.'
  );

  // Features list
  const [features, setFeatures] = React.useState<Array<{ title: string; description: string }>>([
    { title: 'Tự Động Làm Nhiệm Vụ', description: 'Hoàn thành chuỗi nhiệm vụ chính tuyến thần tốc' },
    { title: 'Chống Ban 3 Lớp', description: 'Mô phỏng thao tác bấm phím như người thật' },
    { title: 'Treo Máy Tiết Kiệm RAM', description: 'Tối ưu CPU dưới 5% khi mở multi tab' },
  ]);

  const [unsupportedFeatures, setUnsupportedFeatures] = React.useState<string[]>([
    'Không hỗ trợ nền tảng MacOS hoặc iOS',
    'Không hỗ trợ can thiệp sửa đổi dữ liệu server game',
  ]);

  // Changelog
  const [changelog, setChangelog] = React.useState<
    Array<{ version: string; releaseDate: string; notes: string[] }>
  >([
    {
      version: 'v1.0.0',
      releaseDate: new Date().toISOString().split('T')[0],
      notes: ['Phiên bản khởi tạo chính thức', 'Tương thích máy chủ NRO mới nhất'],
    },
  ]);

  // Plans state
  const [plans, setPlans] = React.useState<any[]>([
    {
      planId: 'plan_7d',
      name: 'Gói 7 Ngày',
      durationType: PlanDurationType.WEEKLY,
      durationDays: 7,
      price: 50000,
      originalPrice: 70000,
      isPopular: false,
      status: 'ACTIVE',
      stockLimit: null,
      renewalRule: 'Gia hạn cộng dồn thêm 7 ngày vào license',
      warrantyPolicy: 'Bảo hành 1 đổi 1 trong 7 ngày',
    },
    {
      planId: 'plan_30d',
      name: 'Gói 30 Ngày',
      durationType: PlanDurationType.MONTHLY,
      durationDays: 30,
      price: 150000,
      originalPrice: 200000,
      isPopular: true,
      status: 'ACTIVE',
      stockLimit: null,
      renewalRule: 'Gia hạn cộng dồn thêm 30 ngày vào license',
      warrantyPolicy: 'Bảo hành 1 đổi 1 trong 30 ngày',
    },
    {
      planId: 'plan_permanent',
      name: 'Gói Vĩnh Viễn',
      durationType: PlanDurationType.LIFETIME,
      durationDays: 0,
      price: 750000,
      originalPrice: 1000000,
      isPopular: false,
      status: 'ACTIVE',
      stockLimit: null,
      renewalRule: 'Không giới hạn thời gian sử dụng',
      warrantyPolicy: 'Bảo hành và cập nhật vĩnh viễn',
    },
  ]);

  // License config
  const [licenseIssuanceType, setLicenseIssuanceType] = React.useState<LicenseIssuanceType>(
    LicenseIssuanceType.AUTOMATIC
  );
  const [maxDevices, setMaxDevices] = React.useState(1);
  const [terms, setTerms] = React.useState(
    'Mỗi key cấp cho 01 máy tính vật lý duy nhất (HWID). Mọi hành vi chia sẻ key công khai sẽ bị khóa vĩnh viễn.'
  );

  // SEO & Social sharing
  const [seoTitle, setSeoTitle] = React.useState('');
  const [metaDescription, setMetaDescription] = React.useState('');
  const [ogImage, setOgImage] = React.useState('');
  const [keywordsText, setKeywordsText] = React.useState('tool nro, auto ngoc rong, auto san boss');
  const [isIndexed, setIsIndexed] = React.useState(true);

  // Auto generate slug from name
  const handleGenerateSlug = () => {
    if (!name) return;
    const generated = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setSlug(generated);
    if (!seoTitle) setSeoTitle(`${name} - Bản Quyền Tự Động NRO Chính Hãng`);
    if (!metaDescription) setMetaDescription(tagline || `Mua bản quyền ${name} tự động hóa 24/7 uy tín.`);
    if (!toolName) setToolName(name.replace(/\s+/g, '_'));
  };

  const handleGenerateSku = () => {
    const prefix = category.substring(0, 4).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    setSku(`NRO-${prefix}-${randomNum}`);
  };

  // Validation errors
  const validationErrors = React.useMemo(() => {
    const errors: string[] = [];
    if (!name.trim()) errors.push('Tên sản phẩm không được để trống.');
    if (!slug.trim()) errors.push('Slug sản phẩm không được để trống.');
    if (!tagline.trim()) errors.push('Mô tả ngắn (tagline) không được để trống.');
    if (!description.trim()) errors.push('Mô tả chi tiết không được để trống.');
    if (!thumbnailUrl.trim()) errors.push('Ảnh đại diện (Thumbnail URL) không được để trống.');
    if (plans.length === 0) errors.push('Sản phẩm phải có ít nhất một gói giá bán.');
    for (let i = 0; i < plans.length; i++) {
      if (!plans[i].name) errors.push(`Gói #${i + 1} chưa đặt tên gói.`);
      if (!plans[i].price || plans[i].price <= 0) errors.push(`Gói "${plans[i].name || `#${i + 1}`}" giá bán phải lớn hơn 0đ.`);
    }
    return errors;
  }, [name, slug, tagline, description, thumbnailUrl, plans]);

  const handleSubmit = async (targetStatus: ProductStatus) => {
    if (validationErrors.length > 0) {
      toast.showToast({
        type: 'ERROR',
        title: 'Chưa đủ thông tin',
        message: validationErrors[0],
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        slug: slug.toLowerCase().trim(),
        sku: sku.trim() || undefined,
        tagline,
        description,
        thumbnailUrl,
        galleryUrls: galleryUrls.filter(Boolean),
        videoUrl: videoUrl || undefined,
        category,
        status: targetStatus,
        isFeatured,
        badge,
        sortOrder: Number(sortOrder) || 0,
        toolName: toolName || name,
        currentVersion,
        supportedGameVersion,
        platform,
        supportedOs,
        systemRequirements: {
          os: sysOs,
          ram: sysRam,
          cpu: sysCpu,
          disk: sysDisk,
          notes: sysNotes,
        },
        installationGuide,
        userGuide,
        features,
        unsupportedFeatures,
        plans,
        changelog,
        licenseIssuanceType,
        maxDevices: Number(maxDevices) || 1,
        terms,
        seoTitle: seoTitle || name,
        metaDescription: metaDescription || tagline,
        ogImage: ogImage || thumbnailUrl,
        keywords: keywordsText.split(',').map((k) => k.trim()).filter(Boolean),
        isIndexed,
      };

      await productsApi.create(payload);

      toast.showToast({
        type: 'SUCCESS',
        title: targetStatus === ProductStatus.DRAFT ? 'Đã lưu bản nháp!' : 'Xuất bản thành công!',
        message: `Sản phẩm "${name}" đã được lưu vào cơ sở dữ liệu.`,
      });

      router.push('/admin');
    } catch (err: any) {
      toast.showToast({
        type: 'ERROR',
        title: 'Lỗi tạo sản phẩm',
        message: err.message || 'Không thể tạo sản phẩm lúc này.',
      });
    } finally {
      setIsSubmitting(false);
      setConfirmPublishOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 pb-24 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-1" /> Quay Lại
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                Tạo Sản Phẩm Tool Mới
                <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 text-xs">
                  Enterprise Form
                </Badge>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Thiết lập thông tin kỹ thuật, gói giá và cấp license tự động vào MongoDB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => handleSubmit(ProductStatus.DRAFT)}
              className="border-slate-700 bg-slate-900 text-xs font-bold"
            >
              <Save className="h-3.5 w-3.5 mr-1 text-slate-400" /> Lưu Bản Nháp
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                if (validationErrors.length > 0) {
                  toast.showToast({
                    type: 'ERROR',
                    title: 'Còn trường chưa hợp lệ',
                    message: validationErrors[0],
                  });
                } else {
                  setConfirmPublishOpen(true);
                }
              }}
              className="btn-gaming-primary text-xs font-bold"
            >
              <Rocket className="h-3.5 w-3.5 mr-1" /> Xuất Bản Ngay
            </Button>
          </div>
        </div>

        {/* Validation Warning Alert (if errors exist) */}
        {validationErrors.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-300 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Cần hoàn thiện các trường trước khi xuất bản:</span>
              <ul className="list-disc list-inside space-y-0.5 text-amber-400/90 text-[11px]">
                {validationErrors.slice(0, 3).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
                {validationErrors.length > 3 && (
                  <li>...và {validationErrors.length - 3} điều kiện khác.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Tabs navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'BASIC', label: '1. Thông Tin Cơ Bản', icon: FileText },
            { id: 'TECH', label: '2. Kỹ Thuật & Yêu Cầu', icon: Cpu },
            { id: 'PLANS', label: `3. Gói & Giá Bán (${plans.length})`, icon: DollarSign },
            { id: 'LICENSE', label: '4. Cấp License & Bản Quyền', icon: KeyRound },
            { id: 'SEO', label: '5. SEO & Chia Sẻ MXH', icon: Share2 },
            { id: 'PREVIEW', label: '6. Xem Trước Giao Diện', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BASIC INFO */}
        {activeTab === 'BASIC' && (
          <div className="space-y-6">
            <Card className="border-slate-800 bg-[#0C1019] p-6 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400" /> Nhóm Thông Tin Cơ Bản
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Tên sản phẩm tool <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="Ví dụ: Auto NRO Pro Ultimate"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleGenerateSlug}
                    className="bg-slate-900/80 border-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      URL Slug (Đường dẫn tĩnh) <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Tự sinh từ tên
                    </button>
                  </div>
                  <Input
                    placeholder="auto-nro-pro-ultimate"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="bg-slate-900/80 border-slate-700 font-mono text-xs text-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Mã SKU định danh
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateSku}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Tự sinh SKU
                    </button>
                  </div>
                  <Input
                    placeholder="Ví dụ: NRO-AUTO-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="bg-slate-900/80 border-slate-700 font-mono uppercase text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Danh mục sản phẩm <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value={ProductCategory.ALL_IN_ONE}>Toàn Diện (All-in-One)</option>
                    <option value={ProductCategory.AUTO_TRAIN}>Auto Treo & Úp Đệ</option>
                    <option value={ProductCategory.SAN_BOSS}>Săn Boss & Săn Item</option>
                    <option value={ProductCategory.AUTO_NHIEM_VU}>Auto Làm Nhiệm Vụ</option>
                    <option value={ProductCategory.TIEN_ICH}>Tiện Ích & Mod Hỗ Trợ</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Mô tả ngắn (Tagline - hiển thị nổi bật trên thẻ) <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="Ví dụ: Bộ công cụ tối ưu hóa tự động hóa toàn diện game Ngọc Rồng Online"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="bg-slate-900/80 border-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Mô tả chi tiết sản phẩm <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Mô tả các ưu điểm, tính năng độc quyền và cam kết của tool..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              {/* Media URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Ảnh đại diện (Thumbnail URL) <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="https://..."
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="bg-slate-900/80 border-slate-700 text-xs"
                  />
                  {thumbnailUrl && (
                    <div className="mt-2 h-24 w-40 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumbnailUrl} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Video Demo (YouTube Embed hoặc MP4 URL)
                  </label>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="bg-slate-900/80 border-slate-700 text-xs"
                  />
                  <div className="text-[11px] text-slate-500">
                    Dán link YouTube để hiển thị trình phát video ngay trên trang chi tiết sản phẩm.
                  </div>
                </div>
              </div>

              {/* Publishing Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Trạng thái phát hành</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductStatus)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                  >
                    <option value={ProductStatus.ACTIVE}>Đang Bán (ACTIVE)</option>
                    <option value={ProductStatus.DRAFT}>Bản Nháp (DRAFT)</option>
                    <option value={ProductStatus.PAUSED}>Tạm Dừng (PAUSED)</option>
                    <option value={ProductStatus.DISCONTINUED}>Ngừng Kinh Doanh (DISCONTINUED)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Huy hiệu hiển thị (Badge)</label>
                  <Input
                    placeholder="HOT, NEW, SALE..."
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-xs uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Thứ tự hiển thị (Sort Order)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="bg-slate-900 border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                />
                <label htmlFor="isFeatured" className="text-xs font-medium text-slate-300 cursor-pointer">
                  Đặt làm sản phẩm nổi bật (Hiển thị ưu tiên tại Banner Trang Chủ)
                </label>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: TECHNICAL SPECS */}
        {activeTab === 'TECH' && (
          <div className="space-y-6">
            <Card className="border-slate-800 bg-[#0C1019] p-6 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" /> Thông Số Kỹ Thuật & Yêu Cầu Cấu Hình
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Tên Tool / File thực thi</label>
                  <Input
                    placeholder="AutoNRO_Pro_v4.exe"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Phiên bản hiện tại</label>
                  <Input
                    placeholder="v4.8.2"
                    value={currentVersion}
                    onChange={(e) => setCurrentVersion(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-xs text-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Phiên bản game NRO hỗ trợ</label>
                  <Input
                    placeholder="v2.4.x mới nhất"
                    value={supportedGameVersion}
                    onChange={(e) => setSupportedGameVersion(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Nền tảng hỗ trợ</label>
                  <Input
                    placeholder="PC Windows"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Hệ điều hành tương thích</label>
                  <Input
                    placeholder="Windows 10 / 11 (64-bit)"
                    value={supportedOs}
                    onChange={(e) => setSupportedOs(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-xs"
                  />
                </div>
              </div>

              {/* System requirements */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
                <div className="text-xs font-bold text-slate-300">Yêu cầu phần cứng máy tính:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">RAM khuyến nghị</label>
                    <Input
                      value={sysRam}
                      onChange={(e) => setSysRam(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">CPU</label>
                    <Input
                      value={sysCpu}
                      onChange={(e) => setSysCpu(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Ổ cứng trống</label>
                    <Input
                      value={sysDisk}
                      onChange={(e) => setSysDisk(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Ghi chú thêm</label>
                    <Input
                      value={sysNotes}
                      onChange={(e) => setSysNotes(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Hướng dẫn cài đặt (4 bước)</label>
                  <textarea
                    rows={4}
                    value={installationGuide}
                    onChange={(e) => setInstallationGuide(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Hướng dẫn sử dụng cơ bản</label>
                  <textarea
                    rows={4}
                    value={userGuide}
                    onChange={(e) => setUserGuide(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-xs text-white"
                  />
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Danh sách tính năng chính ({features.length})
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFeatures([...features, { title: 'Tính năng mới', description: 'Mô tả tính năng' }])}
                    className="text-cyan-400 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Thêm tính năng
                  </Button>
                </div>

                <div className="space-y-2">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        placeholder="Tiêu đề tính năng"
                        value={feat.title}
                        onChange={(e) => {
                          const updated = [...features];
                          updated[idx].title = e.target.value;
                          setFeatures(updated);
                        }}
                        className="bg-slate-900 border-slate-700 text-xs w-1/3"
                      />
                      <Input
                        placeholder="Mô tả chi tiết"
                        value={feat.description}
                        onChange={(e) => {
                          const updated = [...features];
                          updated[idx].description = e.target.value;
                          setFeatures(updated);
                        }}
                        className="bg-slate-900 border-slate-700 text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: PLANS & PRICING */}
        {activeTab === 'PLANS' && (
          <div className="space-y-6">
            <Card className="border-slate-800 bg-[#0C1019] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-cyan-400" /> Cấu Hình Các Gói Bán & Giá Tiền (VNĐ)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cho phép tạo nhiều gói thời hạn trong cùng một sản phẩm tool
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const newId = `plan_${Date.now()}`;
                    setPlans([
                      ...plans,
                      {
                        planId: newId,
                        name: 'Gói Mới',
                        durationType: PlanDurationType.MONTHLY,
                        durationDays: 30,
                        price: 100000,
                        originalPrice: 150000,
                        isPopular: false,
                        status: 'ACTIVE',
                        stockLimit: null,
                        renewalRule: 'Gia hạn cộng dồn ngày',
                        warrantyPolicy: 'Bảo hành 1 đổi 1',
                      },
                    ]);
                  }}
                  className="btn-gaming-primary text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Thêm Gói Mới
                </Button>
              </div>

              <div className="space-y-4">
                {plans.map((plan, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {plan.name || `Gói #${idx + 1}`}
                        </span>
                        {plan.isPopular && (
                          <Badge className="bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30">
                            Phổ biến nhất
                          </Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPlans(plans.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Xóa gói
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Tên gói</label>
                        <Input
                          value={plan.name}
                          onChange={(e) => {
                            const updated = [...plans];
                            updated[idx].name = e.target.value;
                            setPlans(updated);
                          }}
                          className="bg-slate-950 border-slate-800 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Mã gói (planId)</label>
                        <Input
                          value={plan.planId}
                          onChange={(e) => {
                            const updated = [...plans];
                            updated[idx].planId = e.target.value;
                            setPlans(updated);
                          }}
                          className="bg-slate-950 border-slate-800 text-xs font-mono text-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Thời hạn (ngày)</label>
                        <Input
                          type="number"
                          placeholder="0 = Vĩnh viễn"
                          value={plan.durationDays}
                          onChange={(e) => {
                            const updated = [...plans];
                            updated[idx].durationDays = Number(e.target.value);
                            setPlans(updated);
                          }}
                          className="bg-slate-950 border-slate-800 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Giá bán thực tế (VNĐ)</label>
                        <Input
                          type="number"
                          value={plan.price}
                          onChange={(e) => {
                            const updated = [...plans];
                            updated[idx].price = Number(e.target.value);
                            setPlans(updated);
                          }}
                          className="bg-slate-950 border-slate-800 text-xs font-bold text-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">Giá gốc gạch ngang (VNĐ)</label>
                        <Input
                          type="number"
                          value={plan.originalPrice}
                          onChange={(e) => {
                            const updated = [...plans];
                            updated[idx].originalPrice = Number(e.target.value);
                            setPlans(updated);
                          }}
                          className="bg-slate-950 border-slate-800 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">Quy tắc gia hạn</label>
                        <Input
                          value={plan.renewalRule || ''}
                          onChange={(e) => {
                            const updated = [...plans];
                            updated[idx].renewalRule = e.target.value;
                            setPlans(updated);
                          }}
                          className="bg-slate-950 border-slate-800 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">Chính sách bảo hành gói</label>
                        <Input
                          value={plan.warrantyPolicy || ''}
                          onChange={(e) => {
                            const updated = [...plans];
                            updated[idx].warrantyPolicy = e.target.value;
                            setPlans(updated);
                          }}
                          className="bg-slate-950 border-slate-800 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={plan.isPopular || false}
                          onChange={(e) => {
                            const updated = plans.map((p, i) => ({
                              ...p,
                              isPopular: i === idx ? e.target.checked : false,
                            }));
                            setPlans(updated);
                          }}
                          className="rounded border-slate-800 bg-slate-950 text-cyan-500"
                        />
                        <span>Đánh dấu gói "Phổ biến nhất"</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 4: LICENSE CONFIG */}
        {activeTab === 'LICENSE' && (
          <div className="space-y-6">
            <Card className="border-slate-800 bg-[#0C1019] p-6 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-cyan-400" /> Cấu Hình Cấp License & Bản Quyền
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Cơ chế cấp License</label>
                  <select
                    value={licenseIssuanceType}
                    onChange={(e) => setLicenseIssuanceType(e.target.value as LicenseIssuanceType)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                  >
                    <option value={LicenseIssuanceType.AUTOMATIC}>
                      Tự động cấp sau khi thanh toán thành công (Khuyên dùng)
                    </option>
                    <option value={LicenseIssuanceType.MANUAL}>
                      Admin duyệt thủ công trước khi gửi key
                    </option>
                    <option value={LicenseIssuanceType.NONE}>
                      Không cần cấp key (Phần mềm miễn phí / Mở rộng)
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Số thiết bị tối đa được phép kích hoạt (HWID)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={maxDevices}
                    onChange={(e) => setMaxDevices(Number(e.target.value))}
                    className="bg-slate-900 border-slate-700 text-xs"
                  />
                  <div className="text-[11px] text-slate-500">
                    Mặc định là 1 máy tính vật lý. Khách hàng có thể tự reset HWID tối đa 1 lần/tuần.
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Điều khoản sử dụng bản quyền</label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-xs text-white"
                />
              </div>
            </Card>
          </div>
        )}

        {/* TAB 5: SEO & SOCIAL SHARING */}
        {activeTab === 'SEO' && (
          <div className="space-y-6">
            <Card className="border-slate-800 bg-[#0C1019] p-6 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Share2 className="h-4 w-4 text-cyan-400" /> Tối Ưu SEO & Thẻ Chia Sẻ Mạng Xã Hội
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">SEO Title (Tiêu đề tìm kiếm Google)</label>
                  <Input
                    placeholder="Auto NRO Pro - Tool Game Ngọc Rồng Tự Động Hóa 24/7"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Từ khóa SEO (Keywords, cách nhau bằng dấu phẩy)</label>
                  <Input
                    placeholder="tool nro, auto ngoc rong, key ban quyen"
                    value={keywordsText}
                    onChange={(e) => setKeywordsText(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Meta Description (Mô tả snippet)</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả hiển thị trên kết quả tìm kiếm Google (khuyên dùng 150-160 ký tự)..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-xs text-white"
                />
              </div>

              {/* Live Facebook / Zalo Share Preview */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <span>Xem Trước Thẻ Chia Sẻ Khi Gửi Qua Facebook / Zalo:</span>
                </div>
                <div className="max-w-md rounded-xl border border-slate-700 bg-[#18191A] overflow-hidden shadow-lg">
                  <div className="h-44 w-full bg-slate-800 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ogImage || thumbnailUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'}
                      alt="Social Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3 bg-[#242526] space-y-1">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">TUDONGNROTT.COM</div>
                    <div className="text-xs font-bold text-white line-clamp-1">
                      {seoTitle || name || 'Tên Tool NRO Online Chuyên Nghiệp'}
                    </div>
                    <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {metaDescription || tagline || 'Nền tảng cung cấp bản quyền tool game Ngọc Rồng uy tín hàng đầu.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isIndexed"
                  checked={isIndexed}
                  onChange={(e) => setIsIndexed(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                />
                <label htmlFor="isIndexed" className="text-xs font-medium text-slate-300 cursor-pointer">
                  Cho phép Google Bot thu thập chỉ mục (Index) trang sản phẩm này
                </label>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 6: PREVIEW BEFORE PUBLISH */}
        {activeTab === 'PREVIEW' && (
          <div className="space-y-6">
            <Card className="border-slate-800 bg-[#0C1019] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Eye className="h-4 w-4 text-cyan-400" /> Mô Phỏng Giao Diện Người Mua Sắm
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kiểm tra cách sản phẩm hiển thị thực tế trên website trước khi lưu vào MongoDB
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={isSubmitting || validationErrors.length > 0}
                    onClick={() => setConfirmPublishOpen(true)}
                    className="btn-gaming-primary text-xs font-bold"
                  >
                    <Rocket className="h-3.5 w-3.5 mr-1" /> Xác Nhận Xuất Bản
                  </Button>
                </div>
              </div>

              {/* Preview UI snippet */}
              <div className="rounded-2xl border border-slate-800 bg-[#080B12] p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumbnailUrl} alt={name} className="h-full w-full object-cover" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 text-xs">
                        {category}
                      </Badge>
                      {badge && (
                        <Badge className="bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30">
                          {badge}
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-2xl font-black text-white">{name || 'Chưa đặt tên tool'}</h2>
                    <p className="text-xs text-slate-400 leading-relaxed">{tagline || 'Chưa có mô tả ngắn'}</p>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="text-xs font-bold text-slate-300">Chọn gói bản quyền:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {plans.map((p, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              p.isPopular
                                ? 'border-cyan-500/50 bg-cyan-950/20'
                                : 'border-slate-800 bg-slate-900/40'
                            }`}
                          >
                            <div className="font-bold text-white">{p.name}</div>
                            <div className="text-emerald-400 font-black text-sm mt-1">
                              {formatCurrencyVND(p.price)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Confirmation Modal before publish */}
        <Modal
          isOpen={confirmPublishOpen}
          onClose={() => setConfirmPublishOpen(false)}
          title="Xác Nhận Xuất Bản Sản Phẩm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xuất bản sản phẩm <strong className="text-white">"{name}"</strong> lên cửa hàng ngay bây giờ? Khách hàng sẽ có thể thấy và đặt mua tool tự động.
            </p>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center justify-between">
                <span>Slug:</span>
                <span className="font-mono text-cyan-400">{slug}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Số gói thời hạn:</span>
                <span className="text-white font-bold">{plans.length} gói</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cơ chế cấp License:</span>
                <span className="text-emerald-400 font-bold">{licenseIssuanceType}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmPublishOpen(false)}
                className="border-slate-700 bg-slate-900 text-xs"
              >
                Hủy bỏ
              </Button>
              <Button
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleSubmit(ProductStatus.ACTIVE)}
                className="btn-gaming-primary text-xs font-bold"
              >
                {isSubmitting ? 'Đang lưu...' : 'Đồng Ý Xuất Bản'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
