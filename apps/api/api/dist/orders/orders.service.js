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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const licenses_service_1 = require("../licenses/licenses.service");
const shared_types_1 = require("@tudongnro/shared-types");
const user_schema_1 = require("../users/schemas/user.schema");
let OrdersService = class OrdersService {
    orderModel;
    productModel;
    userModel;
    licensesService;
    constructor(orderModel, productModel, userModel, licensesService) {
        this.orderModel = orderModel;
        this.productModel = productModel;
        this.userModel = userModel;
        this.licensesService = licensesService;
    }
    async createOrder(userId, userEmail, dto) {
        const product = await this.productModel.findById(dto.productId);
        if (!product) {
            throw new common_1.NotFoundException('Sản phẩm tool không tồn tại');
        }
        const selectedPlan = product.plans.find((p) => p.planId === dto.planId);
        if (!selectedPlan) {
            throw new common_1.BadRequestException('Gói thời hạn không tồn tại cho sản phẩm này');
        }
        const randomCode = Math.floor(10000 + Math.random() * 90000);
        const orderCode = `NRO-${randomCode}`;
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
        if (dto.paymentMethod === shared_types_1.PaymentMethod.WALLET) {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException('Người dùng không tồn tại');
            }
            const currentBalance = user.balance || 0;
            if (currentBalance < selectedPlan.price) {
                throw new common_1.BadRequestException(`Số dư tài khoản không đủ (${currentBalance.toLocaleString('vi-VN')} Coin). Bạn cần ${selectedPlan.price.toLocaleString('vi-VN')} Coin để mua tool này.`);
            }
            await this.userModel.findByIdAndUpdate(userId, {
                $inc: { balance: -selectedPlan.price },
            });
            const paidOrder = await this.orderModel.create({
                orderCode,
                userId: new mongoose_2.Types.ObjectId(userId),
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
                    price: selectedPlan.price,
                },
                amount: selectedPlan.price,
                status: shared_types_1.OrderStatus.PAID,
                paymentMethod: shared_types_1.PaymentMethod.WALLET,
                paidAt: now,
                expiresAt,
            });
            const license = await this.licensesService.createLicense({
                userId: paidOrder.userId.toString(),
                productId: paidOrder.productId.toString(),
                orderId: paidOrder._id.toString(),
                productName: paidOrder.productSnapshot.name,
                productSlug: paidOrder.productSnapshot.slug,
                durationDays: paidOrder.planSnapshot.durationDays,
            });
            await this.productModel.findByIdAndUpdate(product._id, {
                $inc: { salesCount: 1 },
            });
            return {
                ...paidOrder.toObject(),
                license,
            };
        }
        const newOrder = await this.orderModel.create({
            orderCode,
            userId: new mongoose_2.Types.ObjectId(userId),
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
                price: selectedPlan.price,
            },
            amount: selectedPlan.price,
            status: shared_types_1.OrderStatus.PENDING,
            paymentMethod: dto.paymentMethod || shared_types_1.PaymentMethod.VIETQR,
            expiresAt,
        });
        return newOrder;
    }
    async getMyOrders(userId) {
        return this.orderModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
    }
    async getOrderById(id, userId) {
        const order = await this.orderModel.findById(id);
        if (!order) {
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        }
        if (userId && order.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền xem đơn hàng này');
        }
        return order;
    }
    async cancelOrder(id, userId) {
        const order = await this.getOrderById(id, userId);
        if (order.status !== shared_types_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Chỉ có thể hủy đơn hàng đang ở trạng thái chờ thanh toán');
        }
        order.status = shared_types_1.OrderStatus.CANCELLED;
        await order.save();
        return { message: 'Đã hủy đơn hàng' };
    }
    async completeOrder(orderId, transactionId) {
        const order = await this.orderModel.findById(orderId);
        if (!order) {
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng để hoàn tất');
        }
        if (order.status === shared_types_1.OrderStatus.PAID) {
            return { message: 'Đơn hàng này đã được thanh toán trước đó', order };
        }
        order.status = shared_types_1.OrderStatus.PAID;
        order.paidAt = new Date();
        await order.save();
        const license = await this.licensesService.createLicense({
            userId: order.userId.toString(),
            productId: order.productId.toString(),
            orderId: order._id.toString(),
            productName: order.productSnapshot.name,
            productSlug: order.productSnapshot.slug,
            durationDays: order.planSnapshot.durationDays,
        });
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        licenses_service_1.LicensesService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map