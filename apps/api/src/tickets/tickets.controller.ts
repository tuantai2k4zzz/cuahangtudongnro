import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AddMessageDto } from './dto/add-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, TicketStatus } from '@tudongnro/shared-types';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Tạo ticket hỗ trợ mới (Public hoặc Khách đăng nhập)' })
  async createTicket(@Req() req: any, @Body() dto: CreateTicketDto) {
    const userId = req.user ? (req.user._id?.toString() || req.user.id) : undefined;
    return this.ticketsService.createTicket(dto, userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách ticket của tôi' })
  async getMyTickets(@Req() req: any) {
    const userId = req.user._id?.toString() || req.user.id;
    return this.ticketsService.getMyTickets(userId, req.user.email);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Xem chi tiết ticket' })
  async getTicketById(@Param('id') id: string, @Req() req: any) {
    const userId = req.user ? (req.user._id?.toString() || req.user.id) : undefined;
    const isAdmin = req.user?.role === UserRole.ADMIN;
    return this.ticketsService.getTicketById(id, userId, isAdmin);
  }

  @Post(':id/messages')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Khách gửi tin nhắn vào ticket' })
  async addMessage(
    @Param('id') id: string,
    @Body() dto: AddMessageDto,
    @Req() req: any,
  ) {
    const senderName = req.user ? (req.user.fullName || req.user.email) : 'Khách hàng';
    return this.ticketsService.addMessage(id, 'USER', senderName, dto.message);
  }

  @Post('admin/:id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin gửi phản hồi cho ticket' })
  async adminReply(
    @Param('id') id: string,
    @Body() dto: AddMessageDto,
    @Req() req: any,
  ) {
    const adminId = req.user._id?.toString() || req.user.id;
    const adminName = req.user.fullName || 'Quản Trị Viên';
    return this.ticketsService.addMessage(id, 'ADMIN', adminName, dto.message, adminId);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy tất cả ticket hỗ trợ (Admin Only)' })
  async getAllAdmin(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.ticketsService.getAllAdmin({ status, category, search });
  }

  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trạng thái ticket (Admin Only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: TicketStatus,
  ) {
    return this.ticketsService.updateStatus(id, status);
  }
}
