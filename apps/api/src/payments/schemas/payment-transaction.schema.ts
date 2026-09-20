import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentMethod } from '@tudongnro/shared-types';

export type PaymentTransactionDocument = PaymentTransaction & Document;

@Schema({ timestamps: true, collection: 'payment_transactions' })
export class PaymentTransaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  gateway: PaymentMethod;

  @Prop({ required: true, unique: true, index: true })
  transactionId: string; // From VietQR / MoMo / Bank

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'SUCCESS' })
  status: string;

  @Prop({ default: null })
  signature: string;

  @Prop({ type: Object, default: {} })
  rawPayload: Record<string, any>;

  @Prop({ default: false })
  isProcessed: boolean;
}

export const PaymentTransactionSchema = SchemaFactory.createForClass(PaymentTransaction);
