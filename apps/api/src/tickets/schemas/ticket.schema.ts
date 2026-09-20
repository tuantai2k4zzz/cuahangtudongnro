import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TicketCategory, TicketStatus } from '@tudongnro/shared-types';

export type TicketDocument = SupportTicket & Document;

@Schema({ _id: false })
export class TicketMessage {
  @Prop({ required: true, enum: ['USER', 'ADMIN'] })
  sender: 'USER' | 'ADMIN';

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({
  timestamps: true,
  collection: 'support_tickets',
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: any) => {
      ret.id = ret._id.toString();
      return ret;
    },
  },
  toObject: { virtuals: true },
})
export class SupportTicket {
  @Prop({ required: true, unique: true, index: true, uppercase: true })
  ticketCode: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null, index: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ default: null })
  customerPhone: string;

  @Prop({ type: String, enum: TicketCategory, default: TicketCategory.THANH_TOAN, index: true })
  category: TicketCategory;

  @Prop({ default: null, index: true })
  orderCode: string;

  @Prop({ required: true, trim: true })
  subject: string;

  @Prop({ type: String, enum: TicketStatus, default: TicketStatus.OPEN, index: true })
  status: TicketStatus;

  @Prop({ default: 'NORMAL' })
  priority: string;

  @Prop({ type: [TicketMessage], default: [] })
  messages: TicketMessage[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  assignedAdminId: MongooseSchema.Types.ObjectId;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);
