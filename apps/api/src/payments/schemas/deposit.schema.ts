import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DepositStatus, PaymentMethod } from '@tudongnro/shared-types';

export type DepositTransactionDocument = DepositTransaction & Document;

@Schema({
  timestamps: true,
  collection: 'deposit_transactions',
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: any) => {
      ret.id = ret._id.toString();
      return ret;
    },
  },
  toObject: { virtuals: true },
})
export class DepositTransaction {
  @Prop({ required: true, unique: true, index: true, uppercase: true })
  depositCode: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, lowercase: true, trim: true })
  userEmail: string;

  @Prop({ required: true, min: 10000 })
  amount: number;

  @Prop({ required: true, min: 10000 })
  coins: number;

  @Prop({ type: String, enum: DepositStatus, default: DepositStatus.PENDING, index: true })
  status: DepositStatus;

  @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.VIETQR })
  paymentMethod: PaymentMethod;

  @Prop({ default: null })
  qrUrl: string;

  @Prop({ type: Object, default: null })
  bankInfo: {
    bankCode: string;
    accountNumber: string;
    accountHolder: string;
  };

  @Prop({ default: null })
  memo: string;

  @Prop({ default: null })
  transactionId: string;

  @Prop({ default: null })
  paidAt: Date;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ type: Object, default: null })
  rawPayload: any;
}

export const DepositTransactionSchema = SchemaFactory.createForClass(DepositTransaction);
