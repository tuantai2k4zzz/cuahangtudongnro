import { AdminService } from './admin.service';
import { UserRole } from '@tudongnro/shared-types';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getOverview(range?: 'today' | 'week' | 'month' | 'all'): Promise<import("@tudongnro/shared-types").IAdminOverviewStats>;
    getUsers(search?: string, status?: string, role?: string): Promise<(import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, {}> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUserDetails(id: string): Promise<import("@tudongnro/shared-types").IUserDetails>;
    toggleUserStatus(id: string, adminId: string, adminEmail: string): Promise<{
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            role: UserRole;
            status: import("@tudongnro/shared-types").UserStatus;
        };
    }>;
    approveOrder(id: string, adminId: string, adminEmail: string): Promise<{
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
    }>;
    cancelOrder(id: string, adminId: string, adminEmail: string, reason?: string): Promise<{
        message: string;
        order: import("mongoose").Document<unknown, {}, import("../orders/schemas/order.schema").OrderDocument, {}, {}> & import("../orders/schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getAuditLogs(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/audit-log.schema").AuditLogDocument, {}, {}> & import("./schemas/audit-log.schema").AuditLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
