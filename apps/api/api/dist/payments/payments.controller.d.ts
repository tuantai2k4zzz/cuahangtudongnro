import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createQr(orderId: string, userId: string): Promise<{
        orderId: import("mongoose").Types.ObjectId;
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
    checkStatus(orderCode: string): Promise<{
        orderCode: string;
        status: import("@tudongnro/shared-types").OrderStatus;
        paidAt: Date;
    }>;
    handleWebhook(gateway: string, payload: any, signature?: string): Promise<{
        success: boolean;
        message: string;
        deposit?: undefined;
        result?: undefined;
    } | {
        success: boolean;
        message: string;
        deposit: import("mongoose").Document<unknown, {}, import("./schemas/deposit.schema").DepositTransactionDocument, {}, {}> & import("./schemas/deposit.schema").DepositTransaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        result?: undefined;
    } | {
        success: boolean;
        message: string;
        result: {
            message: string;
            order: import("mongoose").Document<unknown, {}, import("../orders/schemas/order.schema").OrderDocument, {}, {}> & import("../orders/schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
            license?: undefined;
        } | {
            message: string;
            order: import("mongoose").Document<unknown, {}, import("../orders/schemas/order.schema").OrderDocument, {}, {}> & import("../orders/schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
            license: import("mongoose").Document<unknown, {}, import("../licenses/schemas/license.schema").LicenseDocument, {}, {}> & import("../licenses/schemas/license.schema").License & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
        };
        deposit?: undefined;
    }>;
    createDeposit(userId: string, userEmail: string, amount: number): Promise<{
        depositId: import("mongoose").Types.ObjectId;
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
    checkDepositStatus(code: string): Promise<{
        depositCode: string;
        amount: number;
        coins: number;
        status: import("@tudongnro/shared-types").DepositStatus;
        paidAt: Date;
    }>;
    getMyDeposits(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/deposit.schema").DepositTransactionDocument, {}, {}> & import("./schemas/deposit.schema").DepositTransaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
