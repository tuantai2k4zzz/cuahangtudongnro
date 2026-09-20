"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const payment_transaction_schema_1 = require("./schemas/payment-transaction.schema");
const deposit_schema_1 = require("./schemas/deposit.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const orders_service_1 = require("../orders/orders.service");
const order_schema_1 = require("../orders/schemas/order.schema");
const shared_types_1 = require("@tudongnro/shared-types");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    paymentTxModel;
    depositTxModel;
    orderModel;
    userModel;
    ordersService;
    configService;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(paymentTxModel, depositTxModel, orderModel, userModel, ordersService, configService) {
        this.paymentTxModel = paymentTxModel;
        this.depositTxModel = depositTxModel;
        this.orderModel = orderModel;
        this.userModel = userModel;
        this.ordersService = ordersService;
        this.configService = configService;
    }
    async createVietQrPayment(orderId, userId) {
        const order = await this.ordersService.getOrderById(orderId, userId);
        if (order.status === shared_types_1.OrderStatus.PAID) {
            throw new common_1.BadRequestException('Đơn hàng này đã được thanh toán thành công');
        }
        const bankCode = this.configService.get('BANK_CODE', 'MB');
        const accountNumber = this.configService.get('BANK_ACCOUNT', '999988886666');
        const accountHolder = this.configService.get('BANK_ACCOUNT_NAME', 'NGUYEN VAN ADMIN');
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
    async checkOrderStatus(orderCode) {
        const order = await this.orderModel.findOne({ orderCode: orderCode.toUpperCase() });
        if (!order) {
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        }
        return {
            orderCode: order.orderCode,
            status: order.status,
            paidAt: order.paidAt,
        };
    }
    async createDeposit(userId, userEmail, amount) {
        if (!amount || amount < 10000) {
            throw new common_1.BadRequestException('Số tiền nạp tối thiểu là 10.000 VNĐ');
        }
        const randomCode = Math.floor(10000 + Math.random() * 90000);
        const depositCode = `NAP-${randomCode}`;
        const bankCode = this.configService.get('BANK_CODE', 'MB');
        const accountNumber = this.configService.get('BANK_ACCOUNT', '999988886666');
        const accountHolder = this.configService.get('BANK_ACCOUNT_NAME', 'NGUYEN VAN ADMIN');
        const qrUrl = `https://api.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${depositCode}&accountName=${encodeURIComponent(accountHolder)}`;
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
        const deposit = await this.depositTxModel.create({
            depositCode,
            userId: new mongoose_2.Types.ObjectId(userId),
            userEmail: userEmail.toLowerCase(),
            amount,
            coins: amount,
            status: shared_types_1.DepositStatus.PENDING,
            paymentMethod: shared_types_1.PaymentMethod.VIETQR,
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
    async checkDepositStatus(depositCode) {
        const deposit = await this.depositTxModel.findOne({ depositCode: depositCode.toUpperCase() });
        if (!deposit) {
            throw new common_1.NotFoundException('Không tìm thấy giao dịch nạp tiền');
        }
        return {
            depositCode: deposit.depositCode,
            amount: deposit.amount,
            coins: deposit.coins,
            status: deposit.status,
            paidAt: deposit.paidAt,
        };
    }
    async getMyDeposits(userId) {
        return this.depositTxModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
    }
    async handleWebhook(gateway, payload, signature) {
        this.logger.log(`Received Webhook from [${gateway}]: ${JSON.stringify(payload)}`);
        const secret = this.configService.get('PAYMENT_WEBHOOK_SECRET');
        if (secret && signature) {
            const calculatedSig = crypto
                .createHmac('sha256', secret)
                .update(JSON.stringify(payload))
                .digest('hex');
            if (calculatedSig !== signature) {
                this.logger.warn(`Invalid webhook signature from ${gateway}`);
                throw new common_1.BadRequestException('Chữ ký Webhook không hợp lệ');
            }
        }
        const transactionId = payload.transactionId || payload.id || payload.ref || payload.transId;
        const amount = Number(payload.amount || payload.transferAmount);
        const content = payload.content || payload.description || payload.orderCode || '';
        if (!transactionId) {
            throw new common_1.BadRequestException('Thiếu mã giao dịch transactionId');
        }
        const existingTx = await this.paymentTxModel.findOne({ transactionId: String(transactionId) });
        if (existingTx) {
            this.logger.log(`Transaction [${transactionId}] already processed. Skipping duplicate.`);
            return { success: true, message: 'Giao dịch đã được xử lý trước đó (Idempotency OK)' };
        }
        const depositCodeMatch = content.match(/NAP-\d{5}/i);
        const orderCodeMatch = content.match(/NRO-\d{5}/i);
        if (depositCodeMatch) {
            const depositCode = depositCodeMatch[0].toUpperCase();
            const deposit = await this.depositTxModel.findOne({ depositCode });
            if (!deposit) {
                this.logger.warn(`Deposit request with code ${depositCode} not found in DB`);
                return { success: false, message: `Không tìm thấy yêu cầu nạp tiền ${depositCode}` };
            }
            if (deposit.status === shared_types_1.DepositStatus.SUCCESS) {
                return { success: true, message: 'Yêu cầu nạp tiền này đã được xử lý trước đó' };
            }
            if (amount < deposit.amount) {
                this.logger.warn(`Underpayment for deposit ${depositCode}: Expected ${deposit.amount}, got ${amount}`);
                return { success: false, message: 'Số tiền chuyển khoản thấp hơn số tiền nạp' };
            }
            deposit.status = shared_types_1.DepositStatus.SUCCESS;
            deposit.paidAt = new Date();
            deposit.transactionId = String(transactionId);
            deposit.rawPayload = payload;
            await deposit.save();
            await this.userModel.findByIdAndUpdate(deposit.userId, {
                $inc: { balance: deposit.coins },
            });
            await this.paymentTxModel.create({
                gateway: gateway.toUpperCase() || shared_types_1.PaymentMethod.VIETQR,
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
        if (!orderCodeMatch) {
            this.logger.warn(`Cannot extract orderCode or depositCode from transfer content: "${content}"`);
            await this.paymentTxModel.create({
                gateway: gateway,
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
        if (amount < order.amount) {
            this.logger.warn(`Underpayment for order ${orderCode}: Expected ${order.amount}, got ${amount}`);
            return { success: false, message: 'Số tiền chuyển khoản thấp hơn giá trị đơn hàng' };
        }
        const result = await this.ordersService.completeOrder(order._id.toString(), String(transactionId));
        await this.paymentTxModel.create({
            orderId: order._id,
            gateway: gateway.toUpperCase() || shared_types_1.PaymentMethod.VIETQR,
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_transaction_schema_1.PaymentTransaction.name)),
    __param(1, (0, mongoose_1.InjectModel)(deposit_schema_1.DepositTransaction.name)),
    __param(2, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        orders_service_1.OrdersService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map