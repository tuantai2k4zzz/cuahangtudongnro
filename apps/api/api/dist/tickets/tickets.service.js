"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ticket_schema_1 = require("./schemas/ticket.schema");
const shared_types_1 = require("@tudongnro/shared-types");
let TicketsService = class TicketsService {
    ticketModel;
    constructor(ticketModel) {
        this.ticketModel = ticketModel;
    }
    async createTicket(dto, userId) {
        const randomCode = Math.floor(10000 + Math.random() * 90000);
        const ticketCode = `TK-${randomCode}`;
        const newTicket = await this.ticketModel.create({
            ticketCode,
            userId: userId ? new mongoose_2.Types.ObjectId(userId) : null,
            customerName: dto.customerName,
            customerEmail: dto.customerEmail.toLowerCase(),
            customerPhone: dto.customerPhone || null,
            category: dto.category || shared_types_1.TicketCategory.THANH_TOAN,
            orderCode: dto.orderCode ? dto.orderCode.toUpperCase() : null,
            subject: dto.subject,
            status: shared_types_1.TicketStatus.OPEN,
            messages: [
                {
                    sender: 'USER',
                    senderName: dto.customerName,
                    message: dto.message,
                    createdAt: new Date(),
                },
            ],
        });
        return newTicket;
    }
    async getMyTickets(userId, userEmail) {
        const orConditions = [{ customerEmail: userEmail.toLowerCase() }];
        if (userId && mongoose_2.Types.ObjectId.isValid(userId)) {
            orConditions.push({ userId: new mongoose_2.Types.ObjectId(userId) });
        }
        return this.ticketModel
            .find({ $or: orConditions })
            .sort({ updatedAt: -1 })
            .exec();
    }
    async getTicketById(id, userId, isAdmin) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Không tìm thấy ticket hỗ trợ');
        }
        const ticket = await this.ticketModel.findById(id);
        if (!ticket) {
            throw new common_1.NotFoundException('Không tìm thấy ticket hỗ trợ');
        }
        if (!isAdmin && userId && ticket.userId && ticket.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền xem ticket này');
        }
        return ticket;
    }
    async addMessage(id, sender, senderName, message, adminId) {
        const ticket = await this.ticketModel.findById(id);
        if (!ticket) {
            throw new common_1.NotFoundException('Không tìm thấy ticket hỗ trợ');
        }
        ticket.messages.push({
            sender,
            senderName,
            message,
            createdAt: new Date(),
        });
        if (sender === 'ADMIN') {
            if (ticket.status === shared_types_1.TicketStatus.OPEN) {
                ticket.status = shared_types_1.TicketStatus.IN_PROGRESS;
            }
            if (adminId) {
                ticket.assignedAdminId = new mongoose_2.Types.ObjectId(adminId);
            }
        }
        await ticket.save();
        return ticket;
    }
    async getAllAdmin(query) {
        const filter = {};
        if (query?.status && query.status !== 'ALL') {
            filter.status = query.status;
        }
        if (query?.category && query.category !== 'ALL') {
            filter.category = query.category;
        }
        if (query?.search) {
            filter.$or = [
                { ticketCode: { $regex: query.search, $options: 'i' } },
                { customerName: { $regex: query.search, $options: 'i' } },
                { customerEmail: { $regex: query.search, $options: 'i' } },
                { orderCode: { $regex: query.search, $options: 'i' } },
                { subject: { $regex: query.search, $options: 'i' } },
            ];
        }
        return this.ticketModel.find(filter).sort({ updatedAt: -1 }).exec();
    }
    async updateStatus(id, status) {
        const ticket = await this.ticketModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!ticket) {
            throw new common_1.NotFoundException('Không tìm thấy ticket hỗ trợ');
        }
        return ticket;
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(ticket_schema_1.SupportTicket.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map