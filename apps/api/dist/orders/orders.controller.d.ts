import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(userId: string, userEmail: string, dto: CreateOrderDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/order.schema").OrderDocument, {}, {}> & import("./schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        license: import("mongoose").Document<unknown, {}, import("../licenses/schemas/license.schema").LicenseDocument, {}, {}> & import("../licenses/schemas/license.schema").License & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
        status: import("@tudongnro/shared-types").OrderStatus;
        paymentMethod: import("@tudongnro/shared-types").PaymentMethod;
        idempotencyKey: string;
        paidAt: Date;
        expiresAt: Date;
        _id: import("mongoose").Types.ObjectId;
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
    getMyOrders(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/order.schema").OrderDocument, {}, {}> & import("./schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getOrder(id: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").OrderDocument, {}, {}> & import("./schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    cancel(id: string, userId: string): Promise<{
        message: string;
    }>;
    getAllAdmin(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/order.schema").OrderDocument, {}, {}> & import("./schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    approveAdmin(id: string): Promise<{
        message: string;
        order: import("mongoose").Document<unknown, {}, import("./schemas/order.schema").OrderDocument, {}, {}> & import("./schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        license?: undefined;
    } | {
        message: string;
        order: import("mongoose").Document<unknown, {}, import("./schemas/order.schema").OrderDocument, {}, {}> & import("./schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        license: import("mongoose").Document<unknown, {}, import("../licenses/schemas/license.schema").LicenseDocument, {}, {}> & import("../licenses/schemas/license.schema").License & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
