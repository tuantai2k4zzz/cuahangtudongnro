import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { OrderStatus, PaymentMethod } from '@tudongnro/shared-types';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  @Prop({ required: true, unique: true, index: true, uppercase: true })
  orderCode: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Object, required: true })
  productSnapshot: {
    name: string;
    slug: string;
    version: string;
  };

  @Prop({ type: Object, required: true })
  planSnapshot: {
    planId: string;
    name: string;
    durationDays: number;
    price: number;
  };

  @Prop({ required: true })
  amount: number; // VND calculated strictly on server

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING, index: true })
  status: OrderStatus;

  @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.VIETQR })
  paymentMethod: PaymentMethod;

  @Prop({ default: null, unique: true, sparse: true })
  idempotencyKey: string;

  @Prop({ default: null })
  paidAt: Date;

  @Prop({ required: true })
  expiresAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
