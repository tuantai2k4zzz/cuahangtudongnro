import {
  UserRole,
  UserStatus,
  ProductStatus,
  ProductCategory,
  OrderStatus,
  PaymentMethod,
  LicenseStatus,
} from './enums';

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface IProductPlan {
  planId: string;
  name: string;
  durationDays: number; // 0 = vĩnh viễn
  price: number;
  originalPrice: number;
  isPopular?: boolean;
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
  tagline: string;
  description: string;
  thumbnailUrl: string;
  galleryUrls: string[];
  videoUrl?: string;
  category: ProductCategory;
  status: ProductStatus;
  currentVersion: string;
  changelog: IProductChangelog[];
  features: IProductFeature[];
  plans: IProductPlan[];
  systemRequirements: {
    os: string;
    ram: string;
    notes?: string;
  };
  terms?: string;
  salesCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
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
  totalOrders: number;
  pendingOrders: number;
  activeLicenses: number;
  totalUsers: number;
  newUsersToday: number;
}
