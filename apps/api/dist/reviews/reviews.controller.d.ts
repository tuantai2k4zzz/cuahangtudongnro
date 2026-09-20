import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewStatus } from '@tudongnro/shared-types';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    getProductReviews(productId: string): Promise<{
        reviews: (import("mongoose").Document<unknown, {}, import("./schemas/review.schema").ReviewDocument, {}, {}> & import("./schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        count: number;
        averageRating: number;
        ratingBreakdown: Record<number, number>;
    }>;
    createReview(req: any, dto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/review.schema").ReviewDocument, {}, {}> & import("./schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllAdmin(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/review.schema").ReviewDocument, {}, {}> & import("./schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateStatus(id: string, status: ReviewStatus): Promise<import("mongoose").Document<unknown, {}, import("./schemas/review.schema").ReviewDocument, {}, {}> & import("./schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
