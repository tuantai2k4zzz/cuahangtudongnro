import {
  UserRole,
  UserStatus,
  ProductStatus,
  ProductCategory,
  OrderStatus,
  PaymentMethod,
  LicenseStatus,
  PlanDurationType,
  LicenseIssuanceType,
  ReviewStatus,
  TicketCategory,
  TicketStatus,
  DepositStatus,
} from './enums';

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  balance?: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface IProductPlan {
  planId: string;
  name: string;
  durationType?: PlanDurationType;
  durationDays: number; // 0 = vĩnh viễn
  price: number;
  originalPrice: number;
  isPopular?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  stockLimit?: number | null;
  renewalRule?: string;
  warrantyPolicy?: string;
}

export interface IProductChangelog {
  version: string;
  releaseDate: string;
  notes: string[];
}

export interface IProductFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  tagline: string;
  description: string;
  thumbnailUrl: string;
  galleryUrls: string[];
  videoUrl?: string;
  category: ProductCategory;
  status: ProductStatus;
  isFeatured?: boolean;
  badge?: string;
  sortOrder?: number;
  toolName?: string;
  currentVersion: string;
  supportedGameVersion?: string;
  platform?: string;
  supportedOs?: string;
  changelog: IProductChangelog[];
  features: IProductFeature[];
  unsupportedFeatures?: string[];
  plans: IProductPlan[];
  systemRequirements: {
    os: string;
    ram: string;
    cpu?: string;
    disk?: string;
    notes?: string;
  };
  installationGuide?: string;
  userGuide?: string;
  licenseIssuanceType?: LicenseIssuanceType;
  maxDevices?: number;
  terms?: string;
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string[];
  isIndexed?: boolean;
  salesCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  lastUpdated?: string;
}

export interface IOrder {
  id: string;
  orderCode: string;
  userId: string;
  userEmail: string;
  productId: string;
  productSnapshot: {
    name: string;
    slug: string;
    version: string;
  };
  planSnapshot: {
    planId: string;
    name: string;
    durationDays: number;
    price: number;
  };
  amount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  idempotencyKey?: string;
  transactionId?: string;
  paidAt?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBoundDevice {
  hwid: string;
  deviceName: string;
  activatedAt: string;
  lastActiveAt: string;
}

export interface ILicense {
  id: string;
  licenseKey: string;
  userId: string;
  productId: string;
  orderId: string;
  productName?: string;
  productSlug?: string;
  status: LicenseStatus;
  maxDevices: number;
  boundDevices: IBoundDevice[];
  startDate: string;
  expiresDate: string | null; // null = vĩnh viễn
  durationDays: number;
  revokedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderId?: string;
  isVerifiedBuyer: boolean;
  rating: number; // 1-5
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface ISupportTicketMessage {
  id?: string;
  sender: 'USER' | 'ADMIN';
  senderName: string;
  message: string;
  createdAt: string;
}

export interface ISupportTicket {
  id: string;
  ticketCode: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  category: TicketCategory;
  orderCode?: string;
  subject: string;
  status: TicketStatus;
  priority?: 'NORMAL' | 'URGENT';
  messages: ISupportTicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface IAdminOverviewStats {
  totalRevenue: number;
  monthlyRevenue: number;
  todayRevenue: number;
  rangeRevenue: number;
  totalOrders: number;
  paidOrdersCount: number;
  pendingOrdersCount: number;
  cancelledOrdersCount: number;
  totalLicenses: number;
  activeLicenses: number;
  expiredLicenses: number;
  totalUsers: number;
  newUsersRange: number;
  totalProducts: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    slug: string;
    salesCount: number;
    revenue: number;
  }>;
  conversionRate: number;
  updatedAt: string;
  pendingOrders?: number;
  newUsersToday?: number;
}

export interface IUserDetails {
  user: IUser;
  totalSpent: number;
  orders: IOrder[];
  licenses: ILicense[];
  tickets: ISupportTicket[];
}

export interface IDepositTransaction {
  id: string;
  depositCode: string;
  userId: string;
  userEmail: string;
  amount: number;
  coins: number;
  status: DepositStatus;
  paymentMethod: PaymentMethod;
  qrUrl?: string;
  bankInfo?: {
    bankCode: string;
    accountNumber: string;
    accountHolder: string;
  };
  memo?: string;
  paidAt?: string;
  expiresAt: string;
  createdAt: string;
}
