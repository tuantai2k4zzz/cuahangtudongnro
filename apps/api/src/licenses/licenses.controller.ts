import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LicensesService } from './licenses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@tudongnro/shared-types';

@ApiTags('Licenses')
@Controller('licenses')
export class LicensesController {
  constructor(private licensesService: LicensesService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách license của người dùng đang đăng nhập' })
  async getMyLicenses(@CurrentUser('userId') userId: string) {
    return this.licensesService.getMyLicenses(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem chi tiết một license và thiết bị HWID đã liên kết' })
  async getLicense(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.licensesService.getLicenseById(id, userId);
  }

  @Post(':id/reset-hwid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset phần cứng (HWID) để đổi máy tính sử dụng tool' })
  async resetHwid(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.licensesService.resetHwid(id, userId);
  }

  @Post('verify')
  @ApiOperation({ summary: 'API dành cho ứng dụng Tool Game Client xác thực License & HWID' })
  async verifyClient(
    @Body() body: { licenseKey: string; hwid: string; deviceName?: string },
  ) {
    return this.licensesService.verifyLicenseClient(
      body.licenseKey,
      body.hwid,
      body.deviceName,
    );
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem toàn bộ license trên hệ thống (Admin Only)' })
  async getAllAdmin() {
    return this.licensesService.getAllLicensesAdmin();
  }

  @Post('admin/:id/revoke')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thu hồi license vi phạm chính sách (Admin Only)' })
  async revokeAdmin(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.licensesService.revokeLicenseAdmin(id, reason);
  }
}
