import { Document, Schema as MongooseSchema } from 'mongoose';
import { ReviewStatus } from '@tudongnro/shared-types';
export type ReviewDocument = Review & Document;
export declare class Review {
    productId: MongooseSchema.Types.ObjectId;
    userId: MongooseSchema.Types.ObjectId;
    userName: string;
    userEmail: string;
    orderId: MongooseSchema.Types.ObjectId;
    isVerifiedBuyer: boolean;
    rating: number;
    comment: string;
    status: ReviewStatus;
}
export declare const ReviewSchema: MongooseSchema<Review, import("mongoose").Model<Review, any, any, any, Document<unknown, any, Review, any, {}> & Review & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, Document<unknown, {}, import("mongoose").FlatRecord<Review>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Review> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
