import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductCategory, ProductStatus } from '@tudongnro/shared-types';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
export class ProductPlan {
  @Prop({ required: true })
  planId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  durationDays: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  originalPrice: number;

  @Prop({ default: false })
  isPopular: boolean;
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

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true })
  slug: string;

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

  @Prop({ required: true, default: 'v1.0.0' })
  currentVersion: string;

  @Prop({ type: [ProductChangelog], default: [] })
  changelog: ProductChangelog[];

  @Prop({ type: [ProductFeature], default: [] })
  features: ProductFeature[];

  @Prop({ type: [ProductPlan], default: [] })
  plans: ProductPlan[];

  @Prop({ type: Object, default: { os: 'Windows 10 / 11', ram: '4GB' } })
  systemRequirements: {
    os: string;
    ram: string;
    notes?: string;
  };

  @Prop({ default: 'Bản quyền cấp cho 01 máy tính vật lý (HWID).' })
  terms: string;

  @Prop({ default: 0 })
  salesCount: number;

  @Prop({ default: 0 })
  viewCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
