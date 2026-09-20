import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@tudongnro/shared-types';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats/overview')
  @ApiOperation({ summary: 'Lấy số liệu tổng quan doanh thu, đơn hàng, người dùng (Admin Only)' })
  async getOverview(@Query('range') range?: 'today' | 'week' | 'month' | 'all') {
    return this.adminService.getOverviewStats(range);
  }

  @Get('users')
  @ApiOperation({ summary: 'Lấy danh sách tất cả khách hàng (Admin Only)' })
  async getUsers(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getAllUsers({ search, status, role });
  }

  @Get('users/:id/details')
  @ApiOperation({ summary: 'Xem chi tiết khách hàng: đơn hàng, license, tổng tiền đã chi' })
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Post('users/:id/toggle-status')
  @ApiOperation({ summary: 'Khóa / Mở khóa tài khoản khách hàng (Admin Only)' })
  async toggleUserStatus(
    @Param('id') id: string,
    @CurrentUser('userId') adminId: string,
    @CurrentUser('email') adminEmail: string,
  ) {
    return this.adminService.toggleUserStatus(id, adminId, adminEmail);
  }

  @Post('orders/:id/approve')
  @ApiOperation({ summary: 'Phê duyệt kích hoạt đơn hàng thủ công (Admin Only)' })
  async approveOrder(
    @Param('id') id: string,
    @CurrentUser('userId') adminId: string,
    @CurrentUser('email') adminEmail: string,
  ) {
    return this.adminService.approveOrderManual(id, adminId, adminEmail);
  }

  @Post('orders/:id/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng chờ thanh toán (Admin Only)' })
  async cancelOrder(
    @Param('id') id: string,
    @CurrentUser('userId') adminId: string,
    @CurrentUser('email') adminEmail: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.cancelOrderManual(id, adminId, adminEmail, reason);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Xem lịch sử kiểm toán audit log (Admin Only)' })
  async getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
