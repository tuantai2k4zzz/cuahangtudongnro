import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'audit_logs' })
export class AuditLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  adminId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  adminEmail: string;

  @Prop({ required: true })
  action: string; // REVOKE_LICENSE, UPDATE_PRODUCT, BAN_USER, etc.

  @Prop({ required: true })
  targetEntity: string; // License, Product, User, Order

  @Prop({ required: true })
  targetId: string;

  @Prop({ type: Object, default: {} })
  changes: Record<string, any>;

  @Prop({ default: null })
  ipAddress: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
