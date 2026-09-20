import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AddMessageDto } from './dto/add-message.dto';
import { TicketStatus } from '@tudongnro/shared-types';
export declare class TicketsController {
    private ticketsService;
    constructor(ticketsService: TicketsService);
    createTicket(req: any, dto: CreateTicketDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").SupportTicket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyTickets(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").SupportTicket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTicketById(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").SupportTicket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addMessage(id: string, dto: AddMessageDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").SupportTicket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    adminReply(id: string, dto: AddMessageDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").SupportTicket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllAdmin(status?: string, category?: string, search?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").SupportTicket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateStatus(id: string, status: TicketStatus): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").SupportTicket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
