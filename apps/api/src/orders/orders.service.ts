import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { Order, OrderDocument } from './schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { LicensesService } from '../licenses/licenses.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentMethod } from '@tudongnro/shared-types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private licensesService: LicensesService,
  ) {}

  async createOrder(userId: string, userEmail: string, dto: CreateOrderDto) {
    const product = await this.productModel.findById(dto.productId);
    if (!product) {
      throw new NotFoundException('Sản phẩm tool không tồn tại');
    }

    const selectedPlan = product.plans.find((p) => p.planId === dto.planId);
    if (!selectedPlan) {
      throw new BadRequestException('Gói thời hạn không tồn tại cho sản phẩm này');
    }

    // Generate unique order code: NRO-XXXXX
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const orderCode = `NRO-${randomCode}`;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 mins to pay

    const newOrder = await this.orderModel.create({
      orderCode,
      userId: new Types.ObjectId(userId),
      userEmail,
      productId: product._id,
      productSnapshot: {
        name: product.name,
        slug: product.slug,
        version: product.currentVersion,
      },
      planSnapshot: {
        planId: selectedPlan.planId,
        name: selectedPlan.name,
        durationDays: selectedPlan.durationDays,
        price: selectedPlan.price, // STRICTLY FROM DB
      },
      amount: selectedPlan.price,
      status: OrderStatus.PENDING,
      paymentMethod: dto.paymentMethod || PaymentMethod.VIETQR,
      expiresAt,
    });

    return newOrder;
  }

  async getMyOrders(userId: string) {
    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getOrderById(id: string, userId?: string) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    if (userId && order.userId.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem đơn hàng này');
    }
    return order;
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.getOrderById(id, userId);
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể hủy đơn hàng đang ở trạng thái chờ thanh toán');
    }
    order.status = OrderStatus.CANCELLED;
    await order.save();
    return { message: 'Đã hủy đơn hàng' };
  }

  async completeOrder(orderId: string, transactionId?: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng để hoàn tất');
    }

    if (order.status === OrderStatus.PAID) {
      return { message: 'Đơn hàng này đã được thanh toán trước đó', order };
    }

    order.status = OrderStatus.PAID;
    order.paidAt = new Date();
    await order.save();

    // 1. Automatically generate and issue the License Key
    const license = await this.licensesService.createLicense({
      userId: order.userId.toString(),
      productId: order.productId.toString(),
      orderId: order._id.toString(),
      productName: order.productSnapshot.name,
      productSlug: order.productSnapshot.slug,
      durationDays: order.planSnapshot.durationDays,
    });

    // 2. Increment salesCount on the product
    await this.productModel.findByIdAndUpdate(order.productId, {
      $inc: { salesCount: 1 },
    });

    return {
      message: 'Xác nhận thanh toán và cấp License thành công!',
      order,
      license,
    };
  }

  async getAllOrdersAdmin() {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }
}
