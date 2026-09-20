import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@tudongnro/shared-types';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mua tool (Server tính giá)' })
  async create(
    @CurrentUser('userId') userId: string,
    @CurrentUser('email') userEmail: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(userId, userEmail, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của người dùng' })
  async getMyOrders(@CurrentUser('userId') userId: string) {
    return this.ordersService.getMyOrders(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một đơn hàng' })
  async getOrder(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.ordersService.getOrderById(id, userId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng đang chờ thanh toán' })
  async cancel(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.ordersService.cancelOrder(id, userId);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Lấy toàn bộ đơn hàng (Admin Only)' })
  async getAllAdmin() {
    return this.ordersService.getAllOrdersAdmin();
  }

  @Post('admin/:id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Duyệt đơn hàng thủ công và cấp license (Admin Only)' })
  async approveAdmin(@Param('id') id: string) {
    return this.ordersService.completeOrder(id);
  }
}
