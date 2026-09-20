export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DISCONTINUED = 'DISCONTINUED',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum PlanDurationType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  LIFETIME = 'LIFETIME',
}

export enum LicenseIssuanceType {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
  NONE = 'NONE',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  HIDDEN = 'HIDDEN',
}

export enum TicketCategory {
  THANH_TOAN = 'THANH_TOAN',
  LOI_TOOL = 'LOI_TOOL',
  LICENSE = 'LICENSE',
  GIA_HAN = 'GIA_HAN',
  TAI_KHOAN = 'TAI_KHOAN',
  KHIEU_NAI = 'KHIEU_NAI',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum ProductCategory {
  AUTO_TRAIN = 'AUTO_TRAIN',
  SAN_BOSS = 'SAN_BOSS',
  AUTO_NHIEM_VU = 'AUTO_NHIEM_VU',
  TIEN_ICH = 'TIEN_ICH',
  ALL_IN_ONE = 'ALL_IN_ONE',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum PaymentMethod {
  VIETQR = 'VIETQR',
  WALLET = 'WALLET',
  MOMO = 'MOMO',
  BANK_TRANSFER = 'BANK_TRANSFER',
  SEPAY = 'SEPAY',
  PAYOS = 'PAYOS',
}

export enum DepositStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  SUSPENDED = 'SUSPENDED',
}
