import { Document, Schema as MongooseSchema } from 'mongoose';
import { LicenseStatus } from '@tudongnro/shared-types';
export type LicenseDocument = License & Document;
export declare class BoundDevice {
    hwid: string;
    deviceName: string;
    activatedAt: Date;
    lastActiveAt: Date;
}
export declare class License {
    licenseKey: string;
    keyHash: string;
    userId: MongooseSchema.Types.ObjectId;
    productId: MongooseSchema.Types.ObjectId;
    orderId: MongooseSchema.Types.ObjectId;
    productName: string;
    productSlug: string;
    status: LicenseStatus;
    maxDevices: number;
    boundDevices: BoundDevice[];
    startDate: Date;
    expiresDate: Date;
    durationDays: number;
    revokedReason: string;
    lastHwidResetAt: Date;
}
export declare const LicenseSchema: MongooseSchema<License, import("mongoose").Model<License, any, any, any, Document<unknown, any, License, any, {}> & License & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, License, Document<unknown, {}, import("mongoose").FlatRecord<License>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<License> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
