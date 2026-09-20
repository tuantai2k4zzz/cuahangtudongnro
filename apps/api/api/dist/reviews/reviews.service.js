"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const shared_types_1 = require("@tudongnro/shared-types");
let ReviewsService = class ReviewsService {
    reviewModel;
    orderModel;
    productModel;
    constructor(reviewModel, orderModel, productModel) {
        this.reviewModel = reviewModel;
        this.orderModel = orderModel;
        this.productModel = productModel;
    }
    async createReview(userId, userName, userEmail, dto) {
        const product = await this.productModel.findById(dto.productId);
        if (!product) {
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        }
        const existingReview = await this.reviewModel.findOne({
            productId: new mongoose_2.Types.ObjectId(dto.productId),
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (existingReview) {
            throw new common_1.BadRequestException('Bạn đã gửi đánh giá cho sản phẩm này rồi');
        }
        const hasPaidOrder = await this.orderModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            productId: new mongoose_2.Types.ObjectId(dto.productId),
            status: shared_types_1.OrderStatus.PAID,
        });
        const isVerifiedBuyer = !!hasPaidOrder;
        const review = await this.reviewModel.create({
            productId: new mongoose_2.Types.ObjectId(dto.productId),
            userId: new mongoose_2.Types.ObjectId(userId),
            userName: userName || 'Khách hàng ẩn danh',
            userEmail,
            orderId: hasPaidOrder ? hasPaidOrder._id : null,
            isVerifiedBuyer,
            rating: dto.rating,
            comment: dto.comment,
            status: shared_types_1.ReviewStatus.APPROVED,
        });
        return review;
    }
    async getProductReviews(productId) {
        const reviews = await this.reviewModel
            .find({
            productId: new mongoose_2.Types.ObjectId(productId),
            status: shared_types_1.ReviewStatus.APPROVED,
        })
            .sort({ createdAt: -1 })
            .exec();
        const count = reviews.length;
        let averageRating = 0;
        const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if (count > 0) {
            const sum = reviews.reduce((acc, r) => {
                ratingBreakdown[r.rating] = (ratingBreakdown[r.rating] || 0) + 1;
                return acc + r.rating;
            }, 0);
            averageRating = Number((sum / count).toFixed(1));
        }
        return {
            reviews,
            count,
            averageRating,
            ratingBreakdown,
        };
    }
    async getAllAdmin() {
        return this.reviewModel.find().sort({ createdAt: -1 }).populate('productId', 'name slug').exec();
    }
    async updateStatus(id, status) {
        const review = await this.reviewModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!review) {
            throw new common_1.NotFoundException('Không tìm thấy đánh giá');
        }
        return review;
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map