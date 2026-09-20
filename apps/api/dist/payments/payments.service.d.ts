import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { PaymentTransactionDocument } from './schemas/payment-transaction.schema';
import { DepositTransaction, DepositTransactionDocument } from './schemas/deposit.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { OrdersService } from '../orders/orders.service';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { OrderStatus, DepositStatus } from '@tudongnro/shared-types';
export declare class PaymentsService {
    private paymentTxModel;
    private depositTxModel;
    private orderModel;
    private userModel;
    private ordersService;
    private configService;
    private readonly logger;
    constructor(paymentTxModel: Model<PaymentTransactionDocument>, depositTxModel: Model<DepositTransactionDocument>, orderModel: Model<OrderDocument>, userModel: Model<UserDocument>, ordersService: OrdersService, configService: ConfigService);
    createVietQrPayment(orderId: string, userId: string): Promise<{
        orderId: Types.ObjectId;
        orderCode: string;
        amount: number;
        bankInfo: {
            bankCode: string;
            accountNumber: string;
            accountHolder: string;
        };
        memo: string;
        qrUrl: string;
        expiresAt: Date;
    }>;
    checkOrderStatus(orderCode: string): Promise<{
        orderCode: string;
        status: OrderStatus;
        paidAt: Date;
    }>;
    createDeposit(userId: string, userEmail: string, amount: number): Promise<{
        depositId: Types.ObjectId;
        depositCode: string;
        amount: number;
        coins: number;
        bankInfo: {
            bankCode: string;
            accountNumber: string;
            accountHolder: string;
        };
        memo: string;
        qrUrl: string;
        expiresAt: Date;
    }>;
    checkDepositStatus(depositCode: string): Promise<{
        depositCode: string;
        amount: number;
        coins: number;
        status: DepositStatus;
        paidAt: Date;
    }>;
    getMyDeposits(userId: string): Promise<(import("mongoose").Document<unknown, {}, DepositTransactionDocument, {}, {}> & DepositTransaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    handleWebhook(gateway: string, payload: any, signature?: string): Promise<{
        success: boolean;
        message: string;
        deposit?: undefined;
        result?: undefined;
    } | {
        success: boolean;
        message: string;
        deposit: import("mongoose").Document<unknown, {}, DepositTransactionDocument, {}, {}> & DepositTransaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        result?: undefined;
    } | {
        success: boolean;
        message: string;
        result: {
            message: string;
            order: import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            };
            license?: undefined;
        } | {
            message: string;
            order: import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            };
            license: import("mongoose").Document<unknown, {}, import("../licenses/schemas/license.schema").LicenseDocument, {}, {}> & import("../licenses/schemas/license.schema").License & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            };
        };
        deposit?: undefined;
    }>;
}
