import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ReviewStatus } from '@tudongnro/shared-types';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', default: null })
  orderId: MongooseSchema.Types.ObjectId;

  @Prop({ default: false })
  isVerifiedBuyer: boolean;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, trim: true })
  comment: string;

  @Prop({ type: String, enum: ReviewStatus, default: ReviewStatus.APPROVED, index: true })
  status: ReviewStatus;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
