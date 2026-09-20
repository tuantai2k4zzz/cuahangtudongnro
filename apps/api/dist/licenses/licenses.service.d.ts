import { Model, Types } from 'mongoose';
import { License, LicenseDocument } from './schemas/license.schema';
export declare class LicensesService {
    private licenseModel;
    constructor(licenseModel: Model<LicenseDocument>);
    createLicense(data: {
        userId: string;
        productId: string;
        orderId: string;
        productName: string;
        productSlug: string;
        durationDays: number;
    }): Promise<import("mongoose").Document<unknown, {}, LicenseDocument, {}, {}> & License & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyLicenses(userId: string): Promise<(import("mongoose").Document<unknown, {}, LicenseDocument, {}, {}> & License & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getLicenseById(id: string, userId?: string): Promise<import("mongoose").Document<unknown, {}, LicenseDocument, {}, {}> & License & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    resetHwid(licenseId: string, userId: string): Promise<{
        message: string;
    }>;
    verifyLicenseClient(licenseKey: string, hwid: string, deviceName?: string): Promise<{
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
    getAllLicensesAdmin(): Promise<(import("mongoose").Document<unknown, {}, LicenseDocument, {}, {}> & License & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    revokeLicenseAdmin(id: string, reason: string): Promise<{
        message: string;
    }>;
    private generateRandomKey;
}
