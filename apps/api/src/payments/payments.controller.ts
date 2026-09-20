import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-qr/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Khởi tạo thông tin mã VietQR cho đơn hàng' })
  async createQr(
    @Param('orderId') orderId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.paymentsService.createVietQrPayment(orderId, userId);
  }

  @Get('check-status/:orderCode')
  @ApiOperation({ summary: 'Kiểm tra trạng thái đơn hàng (Polling từ modal frontend)' })
  async checkStatus(@Param('orderCode') orderCode: string) {
    return this.paymentsService.checkOrderStatus(orderCode);
  }

  @Post('webhook/:gateway')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tiếp nhận webhook thanh toán tự động (VietQR, SePAY, PayOS, MoMo)' })
  async handleWebhook(
    @Param('gateway') gateway: string,
    @Body() payload: any,
    @Headers('x-signature') signature?: string,
  ) {
    return this.paymentsService.handleWebhook(gateway, payload, signature);
  }
}
