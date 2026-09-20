import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewStatus, OrderStatus } from '@tudongnro/shared-types';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createReview(userId: string, userName: string, userEmail: string, dto: CreateReviewDto) {
    const product = await this.productModel.findById(dto.productId);
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Check if user has already reviewed this product
    const existingReview = await this.reviewModel.findOne({
      productId: new Types.ObjectId(dto.productId),
      userId: new Types.ObjectId(userId),
    });
    if (existingReview) {
      throw new BadRequestException('Bạn đã gửi đánh giá cho sản phẩm này rồi');
    }

    // Check if user has purchased the product
    const hasPaidOrder = await this.orderModel.findOne({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(dto.productId),
      status: OrderStatus.PAID,
    });

    const isVerifiedBuyer = !!hasPaidOrder;

    const review = await this.reviewModel.create({
      productId: new Types.ObjectId(dto.productId),
      userId: new Types.ObjectId(userId),
      userName: userName || 'Khách hàng ẩn danh',
      userEmail,
      orderId: hasPaidOrder ? hasPaidOrder._id : null,
      isVerifiedBuyer,
      rating: dto.rating,
      comment: dto.comment,
      status: ReviewStatus.APPROVED,
    });

    return review;
  }

  async getProductReviews(productId: string) {
    const reviews = await this.reviewModel
      .find({
        productId: new Types.ObjectId(productId),
        status: ReviewStatus.APPROVED,
      })
      .sort({ createdAt: -1 })
      .exec();

    const count = reviews.length;
    let averageRating = 0;
    const ratingBreakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

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

  async updateStatus(id: string, status: ReviewStatus) {
    const review = await this.reviewModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }
    return review;
  }
}
