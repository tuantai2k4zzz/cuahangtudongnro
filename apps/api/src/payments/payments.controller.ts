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

  // --- Nạp tiền vào tài khoản (Ví Coin) ---
  @Post('deposit/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Khởi tạo yêu cầu nạp tiền vào ví Coin' })
  async createDeposit(
    @CurrentUser('userId') userId: string,
    @CurrentUser('email') userEmail: string,
    @Body('amount') amount: number,
  ) {
    return this.paymentsService.createDeposit(userId, userEmail, Number(amount));
  }

  @Get('deposit/status/:code')
  @ApiOperation({ summary: 'Kiểm tra trạng thái yêu cầu nạp tiền (Polling từ modal nạp)' })
  async checkDepositStatus(@Param('code') code: string) {
    return this.paymentsService.checkDepositStatus(code);
  }

  @Get('deposit/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lịch sử nạp tiền của tôi' })
  async getMyDeposits(@CurrentUser('userId') userId: string) {
    return this.paymentsService.getMyDeposits(userId);
  }
}

