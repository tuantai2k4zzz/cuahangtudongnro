import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  ProductCategory,
  ProductStatus,
  PlanDurationType,
  LicenseIssuanceType,
} from '@tudongnro/shared-types';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
export class ProductPlan {
  @Prop({ required: true })
  planId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: PlanDurationType, default: PlanDurationType.MONTHLY })
  durationType: PlanDurationType;

  @Prop({ required: true })
  durationDays: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  originalPrice: number;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop({ default: null })
  stockLimit: number;

  @Prop({ default: 'Gia hạn cộng dồn ngày vào license hiện tại.' })
  renewalRule: string;

  @Prop({ default: 'Bảo hành 1 đổi 1 trong suốt thời gian sử dụng bản quyền.' })
  warrantyPolicy: string;
}

@Schema({ _id: false })
export class ProductChangelog {
  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  releaseDate: string;

  @Prop({ type: [String], default: [] })
  notes: string[];
}

@Schema({ _id: false })
export class ProductFeature {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: null })
  icon: string;
}

@Schema({
  timestamps: true,
  collection: 'products',
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: any) => {
      ret.id = ret._id.toString();
      return ret;
    },
  },
  toObject: { virtuals: true },
})
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ unique: true, sparse: true, trim: true, uppercase: true })
  sku: string;

  @Prop({ required: true })
  tagline: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  thumbnailUrl: string;

  @Prop({ type: [String], default: [] })
  galleryUrls: string[];

  @Prop({ default: null })
  videoUrl: string;

  @Prop({ type: String, enum: ProductCategory, default: ProductCategory.ALL_IN_ONE, index: true })
  category: ProductCategory;

  @Prop({ type: String, enum: ProductStatus, default: ProductStatus.ACTIVE, index: true })
  status: ProductStatus;

  @Prop({ default: false, index: true })
  isFeatured: boolean;

  @Prop({ default: null })
  badge: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: null })
  toolName: string;

  @Prop({ required: true, default: 'v1.0.0' })
  currentVersion: string;

  @Prop({ default: 'Bản quyền NRO Online mới nhất' })
  supportedGameVersion: string;

  @Prop({ default: 'PC Windows' })
  platform: string;

  @Prop({ default: 'Windows 10 / 11 (64-bit)' })
  supportedOs: string;

  @Prop({ type: [ProductChangelog], default: [] })
  changelog: ProductChangelog[];

  @Prop({ type: [ProductFeature], default: [] })
  features: ProductFeature[];

  @Prop({ type: [String], default: [] })
  unsupportedFeatures: string[];

  @Prop({ type: [ProductPlan], default: [] })
  plans: ProductPlan[];

  @Prop({
    type: Object,
    default: {
      os: 'Windows 10 / 11',
      ram: '4GB RAM trở lên',
      cpu: 'Intel Core i3 / AMD Ryzen 3 trở lên',
      disk: '500MB dung lượng trống',
      notes: 'Tương thích mượt mà các trình giả lập và client game',
    },
  })
  systemRequirements: {
    os: string;
    ram: string;
    cpu?: string;
    disk?: string;
    notes?: string;
  };

  @Prop({ default: '' })
  installationGuide: string;

  @Prop({ default: '' })
  userGuide: string;

  @Prop({ type: String, enum: LicenseIssuanceType, default: LicenseIssuanceType.AUTOMATIC })
  licenseIssuanceType: LicenseIssuanceType;

  @Prop({ default: 1 })
  maxDevices: number;

  @Prop({ default: 'Bản quyền cấp cho 01 máy tính vật lý (HWID). Không chia sẻ công khai.' })
  terms: string;

  @Prop({ default: '' })
  seoTitle: string;

  @Prop({ default: '' })
  metaDescription: string;

  @Prop({ default: '' })
  ogImage: string;

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop({ default: true })
  isIndexed: boolean;

  @Prop({ default: 0 })
  salesCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: null })
  lastUpdated: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
