import { Document, Schema as MongooseSchema } from 'mongoose';
import { TicketCategory, TicketStatus } from '@tudongnro/shared-types';
export type TicketDocument = SupportTicket & Document;
export declare class TicketMessage {
    sender: 'USER' | 'ADMIN';
    senderName: string;
    message: string;
    createdAt: Date;
}
export declare class SupportTicket {
    ticketCode: string;
    userId: MongooseSchema.Types.ObjectId;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    category: TicketCategory;
    orderCode: string;
    subject: string;
    status: TicketStatus;
    priority: string;
    messages: TicketMessage[];
    assignedAdminId: MongooseSchema.Types.ObjectId;
}
export declare const SupportTicketSchema: MongooseSchema<SupportTicket, import("mongoose").Model<SupportTicket, any, any, any, Document<unknown, any, SupportTicket, any, {}> & SupportTicket & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SupportTicket, Document<unknown, {}, import("mongoose").FlatRecord<SupportTicket>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<SupportTicket> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
