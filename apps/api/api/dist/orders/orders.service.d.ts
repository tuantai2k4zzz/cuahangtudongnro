import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { ProductDocument } from '../products/schemas/product.schema';
import { LicensesService } from '../licenses/licenses.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentMethod } from '@tudongnro/shared-types';
import { UserDocument } from '../users/schemas/user.schema';
export declare class OrdersService {
    private orderModel;
    private productModel;
    private userModel;
    private licensesService;
    constructor(orderModel: Model<OrderDocument>, productModel: Model<ProductDocument>, userModel: Model<UserDocument>, licensesService: LicensesService);
    createOrder(userId: string, userEmail: string, dto: CreateOrderDto): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        license: import("mongoose").Document<unknown, {}, import("../licenses/schemas/license.schema").LicenseDocument, {}, {}> & import("../licenses/schemas/license.schema").License & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        orderCode: string;
        userId: import("mongoose").Schema.Types.ObjectId;
        userEmail: string;
        productId: import("mongoose").Schema.Types.ObjectId;
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
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    getMyOrders(userId: string): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getOrderById(id: string, userId?: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    cancelOrder(id: string, userId: string): Promise<{
        message: string;
    }>;
    completeOrder(orderId: string, transactionId?: string): Promise<{
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
    }>;
    getAllOrdersAdmin(): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
