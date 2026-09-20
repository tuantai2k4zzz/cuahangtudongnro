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
import { DepositTransaction, DepositTransactionDocument } from './schemas/deposit.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { OrdersService } from '../orders/orders.service';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { PaymentMethod, OrderStatus, DepositStatus } from '@tudongnro/shared-types';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(PaymentTransaction.name)
    private paymentTxModel: Model<PaymentTransactionDocument>,
    @InjectModel(DepositTransaction.name)
    private depositTxModel: Model<DepositTransactionDocument>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
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

  // --- Deposit (Nạp Tiền Vào Ví Coin) ---
  async createDeposit(userId: string, userEmail: string, amount: number) {
    if (!amount || amount < 10000) {
      throw new BadRequestException('Số tiền nạp tối thiểu là 10.000 VNĐ');
    }

    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const depositCode = `NAP-${randomCode}`;

    const bankCode = this.configService.get<string>('BANK_CODE', 'MB');
    const accountNumber = this.configService.get<string>('BANK_ACCOUNT', '999988886666');
    const accountHolder = this.configService.get<string>('BANK_ACCOUNT_NAME', 'NGUYEN VAN ADMIN');

    const qrUrl = `https://api.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${depositCode}&accountName=${encodeURIComponent(accountHolder)}`;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 mins to pay

    const deposit = await this.depositTxModel.create({
      depositCode,
      userId: new Types.ObjectId(userId),
      userEmail: userEmail.toLowerCase(),
      amount,
      coins: amount, // 1 VNĐ = 1 Coin
      status: DepositStatus.PENDING,
      paymentMethod: PaymentMethod.VIETQR,
      qrUrl,
      bankInfo: {
        bankCode,
        accountNumber,
        accountHolder,
      },
      memo: depositCode,
      expiresAt,
    });

    return {
      depositId: deposit._id,
      depositCode: deposit.depositCode,
      amount: deposit.amount,
      coins: deposit.coins,
      bankInfo: deposit.bankInfo,
      memo: depositCode,
      qrUrl,
      expiresAt,
    };
  }

  async checkDepositStatus(depositCode: string) {
    const deposit = await this.depositTxModel.findOne({ depositCode: depositCode.toUpperCase() });
    if (!deposit) {
      throw new NotFoundException('Không tìm thấy giao dịch nạp tiền');
    }
    return {
      depositCode: deposit.depositCode,
      amount: deposit.amount,
      coins: deposit.coins,
      status: deposit.status,
      paidAt: deposit.paidAt,
    };
  }

  async getMyDeposits(userId: string) {
    return this.depositTxModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
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

    // 4. Check whether it is a Deposit (NAP-XXXXX) or Direct Tool Order (NRO-XXXXX)
    const depositCodeMatch = content.match(/NAP-\d{5}/i);
    const orderCodeMatch = content.match(/NRO-\d{5}/i);

    // --- CASE A: DEPOSIT TO WALLET (Nạp tiền vào Ví Coin) ---
    if (depositCodeMatch) {
      const depositCode = depositCodeMatch[0].toUpperCase();
      const deposit = await this.depositTxModel.findOne({ depositCode });

      if (!deposit) {
        this.logger.warn(`Deposit request with code ${depositCode} not found in DB`);
        return { success: false, message: `Không tìm thấy yêu cầu nạp tiền ${depositCode}` };
      }

      if (deposit.status === DepositStatus.SUCCESS) {
        return { success: true, message: 'Yêu cầu nạp tiền này đã được xử lý trước đó' };
      }

      if (amount < deposit.amount) {
        this.logger.warn(
          `Underpayment for deposit ${depositCode}: Expected ${deposit.amount}, got ${amount}`,
        );
        return { success: false, message: 'Số tiền chuyển khoản thấp hơn số tiền nạp' };
      }

      deposit.status = DepositStatus.SUCCESS;
      deposit.paidAt = new Date();
      deposit.transactionId = String(transactionId);
      deposit.rawPayload = payload;
      await deposit.save();

      // Cộng số dư ví Coin cho User
      await this.userModel.findByIdAndUpdate(deposit.userId, {
        $inc: { balance: deposit.coins },
      });

      // Ghi nhận transaction
      await this.paymentTxModel.create({
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
        message: `Nạp tiền thành công! Đã cộng +${deposit.coins} Coin vào tài khoản`,
        deposit,
      };
    }

    // --- CASE B: DIRECT TOOL ORDER (Mua ngay trực tiếp cấp License) ---
    if (!orderCodeMatch) {
      this.logger.warn(`Cannot extract orderCode or depositCode from transfer content: "${content}"`);
      await this.paymentTxModel.create({
        gateway: gateway as PaymentMethod,
        transactionId: String(transactionId),
        amount,
        status: 'UNMATCHED_ORDER_CODE',
        rawPayload: payload,
        isProcessed: false,
      });
      return { success: true, message: 'Ghi nhận giao dịch nhưng không tìm thấy mã đơn/nạp khớp' };
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

    // Complete Order and issue License
    const result = await this.ordersService.completeOrder(order._id.toString(), String(transactionId));

    // Record processed transaction
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
