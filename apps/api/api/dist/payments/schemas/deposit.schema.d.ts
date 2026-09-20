import { Document, Schema as MongooseSchema } from 'mongoose';
import { DepositStatus, PaymentMethod } from '@tudongnro/shared-types';
export type DepositTransactionDocument = DepositTransaction & Document;
export declare class DepositTransaction {
    depositCode: string;
    userId: MongooseSchema.Types.ObjectId;
    userEmail: string;
    amount: number;
    coins: number;
    status: DepositStatus;
    paymentMethod: PaymentMethod;
    qrUrl: string;
    bankInfo: {
        bankCode: string;
        accountNumber: string;
        accountHolder: string;
    };
    memo: string;
    transactionId: string;
    paidAt: Date;
    expiresAt: Date;
    rawPayload: any;
}
export declare const DepositTransactionSchema: MongooseSchema<DepositTransaction, import("mongoose").Model<DepositTransaction, any, any, any, Document<unknown, any, DepositTransaction, any, {}> & DepositTransaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DepositTransaction, Document<unknown, {}, import("mongoose").FlatRecord<DepositTransaction>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<DepositTransaction> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
