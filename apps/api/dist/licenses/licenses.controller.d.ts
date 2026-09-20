import { LicensesService } from './licenses.service';
export declare class LicensesController {
    private licensesService;
    constructor(licensesService: LicensesService);
    getMyLicenses(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/license.schema").LicenseDocument, {}, {}> & import("./schemas/license.schema").License & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getLicense(id: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/license.schema").LicenseDocument, {}, {}> & import("./schemas/license.schema").License & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    resetHwid(id: string, userId: string): Promise<{
        message: string;
    }>;
    verifyClient(body: {
        licenseKey: string;
        hwid: string;
        deviceName?: string;
    }): Promise<{
        valid: boolean;
        message: string;
        productName?: undefined;
        expiresDate?: undefined;
        durationDays?: undefined;
        boundDeviceCount?: undefined;
    } | {
        valid: boolean;
        productName: string;
        expiresDate: Date;
        durationDays: number;
        boundDeviceCount: number;
        message: string;
    }>;
    getAllAdmin(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/license.schema").LicenseDocument, {}, {}> & import("./schemas/license.schema").License & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    revokeAdmin(id: string, reason: string): Promise<{
        message: string;
    }>;
}
