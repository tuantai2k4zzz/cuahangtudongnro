import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { License, LicenseDocument } from '../licenses/schemas/license.schema';
import { ProductDocument } from '../products/schemas/product.schema';
import { TicketDocument } from '../tickets/schemas/ticket.schema';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { OrdersService } from '../orders/orders.service';
import { UserStatus, IAdminOverviewStats, IUserDetails } from '@tudongnro/shared-types';
export declare class AdminService {
    private orderModel;
    private userModel;
    private licenseModel;
    private productModel;
    private ticketModel;
    private auditLogModel;
    private ordersService;
    constructor(orderModel: Model<OrderDocument>, userModel: Model<UserDocument>, licenseModel: Model<LicenseDocument>, productModel: Model<ProductDocument>, ticketModel: Model<TicketDocument>, auditLogModel: Model<AuditLogDocument>, ordersService: OrdersService);
    getOverviewStats(range?: 'today' | 'week' | 'month' | 'all'): Promise<IAdminOverviewStats>;
    getAllUsers(query?: {
        search?: string;
        status?: string;
        role?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUserDetails(userId: string): Promise<IUserDetails>;
    toggleUserStatus(userId: string, adminId: string, adminEmail: string): Promise<{
        message: string;
        user: {
            id: Types.ObjectId;
            email: string;
            fullName: string;
            role: import("@tudongnro/shared-types").UserRole;
            status: UserStatus;
        };
    }>;
    approveOrderManual(orderId: string, adminId: string, adminEmail: string): Promise<{
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
        license: import("mongoose").Document<unknown, {}, LicenseDocument, {}, {}> & License & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    cancelOrderManual(orderId: string, adminId: string, adminEmail: string, reason?: string): Promise<{
        message: string;
        order: import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getAuditLogs(): Promise<(import("mongoose").Document<unknown, {}, AuditLogDocument, {}, {}> & AuditLog & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
