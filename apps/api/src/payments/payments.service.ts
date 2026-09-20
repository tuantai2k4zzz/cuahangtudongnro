import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PaymentTransaction, PaymentTransactionDocument } from './schemas/payment-transaction.schema';
import { OrdersService } from '../orders/orders.service';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { PaymentMethod, OrderStatus } from '@tudongnro/shared-types';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(PaymentTransaction.name)
    private paymentTxModel: Model<PaymentTransactionDocument>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    private ordersService: OrdersService,
    private configService: ConfigService,
  ) {}

  async createVietQrPayment(orderId: string, userId: string) {
    const order = await this.ordersService.getOrderById(orderId, userId);
    if (order.status === OrderStatus.PAID) {
      throw new BadRequestException('Đơn hàng này đã được thanh toán thành công');
    }

    const bankCode = this.configService.get<string>('BANK_CODE', 'MB');
    const accountNumber = this.configService.get<string>('BANK_ACCOUNT', '999988886666');
    const accountHolder = this.configService.get<string>('BANK_ACCOUNT_NAME', 'NGUYEN VAN ADMIN');

    const qrUrl = `https://api.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${order.amount}&addInfo=${order.orderCode}&accountName=${encodeURIComponent(accountHolder)}`;

    return {
      orderId: order._id,
      orderCode: order.orderCode,
      amount: order.amount,
      bankInfo: {
        bankCode,
        accountNumber,
        accountHolder,
      },
      memo: order.orderCode,
      qrUrl,
      expiresAt: order.expiresAt,
    };
  }

  async checkOrderStatus(orderCode: string) {
    const order = await this.orderModel.findOne({ orderCode: orderCode.toUpperCase() });
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return {
      orderCode: order.orderCode,
      status: order.status,
      paidAt: order.paidAt,
    };
  }

  async handleWebhook(gateway: string, payload: any, signature?: string) {
    this.logger.log(`Received Webhook from [${gateway}]: ${JSON.stringify(payload)}`);

    // 1. Verify HMAC Signature if configured
    const secret = this.configService.get<string>('PAYMENT_WEBHOOK_SECRET');
    if (secret && signature) {
      const calculatedSig = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (calculatedSig !== signature) {
        this.logger.warn(`Invalid webhook signature from ${gateway}`);
        throw new BadRequestException('Chữ ký Webhook không hợp lệ');
      }
    }

    // 2. Extract transaction details (supports standard VietQR / SePAY / PayOS format)
    const transactionId =
      payload.transactionId || payload.id || payload.ref || payload.transId;
    const amount = Number(payload.amount || payload.transferAmount);
    const content: string =
      payload.content || payload.description || payload.orderCode || '';

    if (!transactionId) {
      throw new BadRequestException('Thiếu mã giao dịch transactionId');
    }

    // 3. IDEMPOTENCY CHECK (Chống xử lý trùng lặp giao dịch)
    const existingTx = await this.paymentTxModel.findOne({ transactionId: String(transactionId) });
    if (existingTx) {
      this.logger.log(`Transaction [${transactionId}] already processed. Skipping duplicate.`);
      return { success: true, message: 'Giao dịch đã được xử lý trước đó (Idempotency OK)' };
    }

    // 4. Find matching order code from content (e.g. content contains "NRO-83921")
    const orderCodeMatch = content.match(/NRO-\d{5}/i);
    if (!orderCodeMatch) {
      this.logger.warn(`Cannot extract orderCode from transfer content: "${content}"`);
      // Record transaction for manual review
      await this.paymentTxModel.create({
        gateway: gateway as PaymentMethod,
        transactionId: String(transactionId),
        amount,
        status: 'UNMATCHED_ORDER_CODE',
        rawPayload: payload,
        isProcessed: false,
      });
      return { success: true, message: 'Ghi nhận giao dịch nhưng không tìm thấy mã đơn hàng khớp' };
    }

    const orderCode = orderCodeMatch[0].toUpperCase();
    const order = await this.orderModel.findOne({ orderCode });

    if (!order) {
      this.logger.warn(`Order with code ${orderCode} not found in DB`);
      return { success: false, message: `Không tìm thấy đơn hàng ${orderCode}` };
    }

    // Check amount
    if (amount < order.amount) {
      this.logger.warn(
        `Underpayment for order ${orderCode}: Expected ${order.amount}, got ${amount}`,
      );
      return { success: false, message: 'Số tiền chuyển khoản thấp hơn giá trị đơn hàng' };
    }

    // 5. Complete Order and issue License
    const result = await this.ordersService.completeOrder(order._id.toString(), String(transactionId));

    // 6. Record processed transaction
    await this.paymentTxModel.create({
      orderId: order._id,
      gateway: (gateway.toUpperCase() as PaymentMethod) || PaymentMethod.VIETQR,
      transactionId: String(transactionId),
      amount,
      status: 'SUCCESS',
      signature,
      rawPayload: payload,
      isProcessed: true,
    });

    return {
      success: true,
      message: 'Xử lý webhook thành công, đơn hàng đã được kích hoạt!',
      result,
    };
  }
}
