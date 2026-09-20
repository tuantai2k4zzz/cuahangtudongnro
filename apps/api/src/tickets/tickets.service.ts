import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SupportTicket, TicketDocument } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus, TicketCategory } from '@tudongnro/shared-types';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(SupportTicket.name)
    private ticketModel: Model<TicketDocument>,
  ) {}

  async createTicket(dto: CreateTicketDto, userId?: string) {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const ticketCode = `TK-${randomCode}`;

    const newTicket = await this.ticketModel.create({
      ticketCode,
      userId: userId ? new Types.ObjectId(userId) : null,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail.toLowerCase(),
      customerPhone: dto.customerPhone || null,
      category: dto.category || TicketCategory.THANH_TOAN,
      orderCode: dto.orderCode ? dto.orderCode.toUpperCase() : null,
      subject: dto.subject,
      status: TicketStatus.OPEN,
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

  async getMyTickets(userId: string, userEmail: string) {
    const orConditions: any[] = [{ customerEmail: userEmail.toLowerCase() }];
    if (userId && Types.ObjectId.isValid(userId)) {
      orConditions.push({ userId: new Types.ObjectId(userId) });
    }
    return this.ticketModel
      .find({ $or: orConditions })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getTicketById(id: string, userId?: string, isAdmin?: boolean) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Không tìm thấy ticket hỗ trợ');
    }
    const ticket = await this.ticketModel.findById(id);
    if (!ticket) {
      throw new NotFoundException('Không tìm thấy ticket hỗ trợ');
    }

    if (!isAdmin && userId && ticket.userId && ticket.userId.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem ticket này');
    }

    return ticket;
  }

  async addMessage(
    id: string,
    sender: 'USER' | 'ADMIN',
    senderName: string,
    message: string,
    adminId?: string,
  ) {
    const ticket = await this.ticketModel.findById(id);
    if (!ticket) {
      throw new NotFoundException('Không tìm thấy ticket hỗ trợ');
    }

    ticket.messages.push({
      sender,
      senderName,
      message,
      createdAt: new Date(),
    });

    if (sender === 'ADMIN') {
      if (ticket.status === TicketStatus.OPEN) {
        ticket.status = TicketStatus.IN_PROGRESS;
      }
      if (adminId) {
        ticket.assignedAdminId = new Types.ObjectId(adminId) as any;
      }
    }

    await ticket.save();
    return ticket;
  }

  async getAllAdmin(query?: { status?: string; category?: string; search?: string }) {
    const filter: any = {};
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

  async updateStatus(id: string, status: TicketStatus) {
    const ticket = await this.ticketModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!ticket) {
      throw new NotFoundException('Không tìm thấy ticket hỗ trợ');
    }
    return ticket;
  }
}
