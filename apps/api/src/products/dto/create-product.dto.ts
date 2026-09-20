import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ProductCategory,
  ProductStatus,
  PlanDurationType,
  LicenseIssuanceType,
} from '@tudongnro/shared-types';

export class ProductPlanDto {
  @ApiProperty({ example: 'plan_30d' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ example: 'Gói 30 Ngày' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: PlanDurationType, example: PlanDurationType.MONTHLY, required: false })
  @IsOptional()
  @IsEnum(PlanDurationType)
  durationType?: PlanDurationType;

  @ApiProperty({ example: 30 })
  @IsNumber()
  durationDays: number;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 200000 })
  @IsNumber()
  originalPrice: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isPopular?: boolean;

  @ApiProperty({ example: 'ACTIVE', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: null, required: false })
  @IsOptional()
  stockLimit?: number | null;

  @ApiProperty({ example: 'Gia hạn cộng dồn ngày', required: false })
  @IsOptional()
  @IsString()
  renewalRule?: string;

  @ApiProperty({ example: 'Bảo hành 1 đổi 1', required: false })
  @IsOptional()
  @IsString()
  warrantyPolicy?: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Auto NRO Pro Ultimate' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'auto-nro-pro-ultimate' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'NRO-PRO-01', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: 'Phần mềm toàn diện tối ưu hóa tự động hóa mọi hoạt động NRO Online' })
  @IsString()
  @IsNotEmpty()
  tagline: string;

  @ApiProperty({ example: 'Mô tả chi tiết sản phẩm...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://images.unsplash.com/...' })
  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  galleryUrls?: string[];

  @ApiProperty({ example: null, required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ enum: ProductCategory, example: ProductCategory.ALL_IN_ONE })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: 'HOT', required: false })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ example: 'AutoNRO_Pro', required: false })
  @IsOptional()
  @IsString()
  toolName?: string;

  @ApiProperty({ example: 'v4.8.2' })
  @IsString()
  @IsNotEmpty()
  currentVersion: string;

  @ApiProperty({ example: 'v2.4.x', required: false })
  @IsOptional()
  @IsString()
  supportedGameVersion?: string;

  @ApiProperty({ example: 'PC Windows', required: false })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({ example: 'Windows 10 / 11 (64-bit)', required: false })
  @IsOptional()
  @IsString()
  supportedOs?: string;

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  changelog?: any[];

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  features?: any[];

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  unsupportedFeatures?: string[];

  @ApiProperty({ type: [ProductPlanDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductPlanDto)
  plans: ProductPlanDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  systemRequirements?: any;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  installationGuide?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  userGuide?: string;

  @ApiProperty({ enum: LicenseIssuanceType, required: false })
  @IsOptional()
  @IsEnum(LicenseIssuanceType)
  licenseIssuanceType?: LicenseIssuanceType;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  maxDevices?: number;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  terms?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  ogImage?: string;

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  keywords?: string[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isIndexed?: boolean;
}
