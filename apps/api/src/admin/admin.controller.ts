import {
  Controller,
  Get,
  Post,
  Param,
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
  async getOverview() {
    return this.adminService.getOverviewStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Lấy danh sách tất cả khách hàng (Admin Only)' })
  async getUsers() {
    return this.adminService.getAllUsers();
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

  @Get('audit-logs')
  @ApiOperation({ summary: 'Xem lịch sử kiểm toán audit log (Admin Only)' })
  async getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
