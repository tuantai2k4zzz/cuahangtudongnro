export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
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
  MOMO = 'MOMO',
  BANK_TRANSFER = 'BANK_TRANSFER',
  SEPAY = 'SEPAY',
  PAYOS = 'PAYOS',
}

export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  SUSPENDED = 'SUSPENDED',
}
