import { Model, Types } from 'mongoose';
import { SupportTicket, TicketDocument } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus } from '@tudongnro/shared-types';
export declare class TicketsService {
    private ticketModel;
    constructor(ticketModel: Model<TicketDocument>);
    createTicket(dto: CreateTicketDto, userId?: string): Promise<import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & SupportTicket & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyTickets(userId: string, userEmail: string): Promise<(import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & SupportTicket & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTicketById(id: string, userId?: string, isAdmin?: boolean): Promise<import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & SupportTicket & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addMessage(id: string, sender: 'USER' | 'ADMIN', senderName: string, message: string, adminId?: string): Promise<import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & SupportTicket & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllAdmin(query?: {
        status?: string;
        category?: string;
        search?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & SupportTicket & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateStatus(id: string, status: TicketStatus): Promise<import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & SupportTicket & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
