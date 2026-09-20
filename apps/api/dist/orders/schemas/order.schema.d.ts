import { Document, Schema as MongooseSchema } from 'mongoose';
import { OrderStatus, PaymentMethod } from '@tudongnro/shared-types';
export type OrderDocument = Order & Document;
export declare class Order {
    orderCode: string;
    userId: MongooseSchema.Types.ObjectId;
    userEmail: string;
    productId: MongooseSchema.Types.ObjectId;
    productSnapshot: {
        name: string;
        slug: string;
        version: string;
    };
    planSnapshot: {
        planId: string;
        name: string;
        durationDays: number;
        price: number;
    };
    amount: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    idempotencyKey: string;
    paidAt: Date;
    expiresAt: Date;
}
export declare const OrderSchema: MongooseSchema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Order> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
