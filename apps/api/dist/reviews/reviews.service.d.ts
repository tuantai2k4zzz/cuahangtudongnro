import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { OrderDocument } from '../orders/schemas/order.schema';
import { ProductDocument } from '../products/schemas/product.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewStatus } from '@tudongnro/shared-types';
export declare class ReviewsService {
    private reviewModel;
    private orderModel;
    private productModel;
    constructor(reviewModel: Model<ReviewDocument>, orderModel: Model<OrderDocument>, productModel: Model<ProductDocument>);
    createReview(userId: string, userName: string, userEmail: string, dto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getProductReviews(productId: string): Promise<{
        reviews: (import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        count: number;
        averageRating: number;
        ratingBreakdown: Record<number, number>;
    }>;
    getAllAdmin(): Promise<(import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateStatus(id: string, status: ReviewStatus): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
