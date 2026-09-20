import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LicenseStatus } from '@tudongnro/shared-types';

export type LicenseDocument = License & Document;

@Schema({ _id: false })
export class BoundDevice {
  @Prop({ required: true })
  hwid: string;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ default: () => new Date() })
  activatedAt: Date;

  @Prop({ default: () => new Date() })
  lastActiveAt: Date;
}

@Schema({ timestamps: true, collection: 'licenses' })
export class License {
  @Prop({ required: true, unique: true, index: true, uppercase: true })
  licenseKey: string; // NRO-XXXX-XXXX-XXXX-XXXX

  @Prop({ required: true, select: false })
  keyHash: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true, unique: true })
  orderId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productSlug: string;

  @Prop({ type: String, enum: LicenseStatus, default: LicenseStatus.ACTIVE, index: true })
  status: LicenseStatus;

  @Prop({ default: 1 })
  maxDevices: number;

  @Prop({ type: [BoundDevice], default: [] })
  boundDevices: BoundDevice[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ default: null })
  expiresDate: Date; // null = Vĩnh viễn (Lifetime)

  @Prop({ required: true })
  durationDays: number;

  @Prop({ default: null })
  revokedReason: string;

  @Prop({ default: null })
  lastHwidResetAt: Date;
}

export const LicenseSchema = SchemaFactory.createForClass(License);
