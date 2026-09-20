import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentMethod } from '@tudongnro/shared-types';
export type PaymentTransactionDocument = PaymentTransaction & Document;
export declare class PaymentTransaction {
    orderId: MongooseSchema.Types.ObjectId;
    gateway: PaymentMethod;
    transactionId: string;
    amount: number;
    status: string;
    signature: string;
    rawPayload: Record<string, any>;
    isProcessed: boolean;
}
export declare const PaymentTransactionSchema: MongooseSchema<PaymentTransaction, import("mongoose").Model<PaymentTransaction, any, any, any, Document<unknown, any, PaymentTransaction, any, {}> & PaymentTransaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PaymentTransaction, Document<unknown, {}, import("mongoose").FlatRecord<PaymentTransaction>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<PaymentTransaction> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
