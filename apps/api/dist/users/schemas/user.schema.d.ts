import { Document } from 'mongoose';
import { UserRole, UserStatus } from '@tudongnro/shared-types';
export type UserDocument = User & Document;
export declare class User {
    email: string;
    passwordHash: string;
    fullName: string;
    avatarUrl: string;
    role: UserRole;
    status: UserStatus;
    balance: number;
    refreshTokenHash: string;
    lastLoginAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
