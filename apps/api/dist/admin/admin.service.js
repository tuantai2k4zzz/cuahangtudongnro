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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../orders/schemas/order.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const license_schema_1 = require("../licenses/schemas/license.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const ticket_schema_1 = require("../tickets/schemas/ticket.schema");
const audit_log_schema_1 = require("./schemas/audit-log.schema");
const orders_service_1 = require("../orders/orders.service");
const shared_types_1 = require("@tudongnro/shared-types");
let AdminService = class AdminService {
    orderModel;
    userModel;
    licenseModel;
    productModel;
    ticketModel;
    auditLogModel;
    ordersService;
    constructor(orderModel, userModel, licenseModel, productModel, ticketModel, auditLogModel, ordersService) {
        this.orderModel = orderModel;
        this.userModel = userModel;
        this.licenseModel = licenseModel;
        this.productModel = productModel;
        this.ticketModel = ticketModel;
        this.auditLogModel = auditLogModel;
        this.ordersService = ordersService;
    }
    async getOverviewStats(range = 'all') {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        let rangeCutoff = null;
        if (range === 'today') {
            rangeCutoff = startOfToday;
        }
        else if (range === 'week') {
            rangeCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
        else if (range === 'month') {
            rangeCutoff = startOfMonth;
        }
        const rangeFilter = rangeCutoff ? { paidAt: { $gte: rangeCutoff } } : {};
        const userRangeFilter = rangeCutoff ? { createdAt: { $gte: rangeCutoff } } : {};
        const [allPaidOrders, rangePaidOrders, todayPaidOrders, monthPaidOrders, totalOrders, pendingOrdersCount, cancelledOrdersCount, totalLicenses, activeLicenses, expiredLicenses, totalUsers, newUsersRange, totalProducts,] = await Promise.all([
            this.orderModel.find({ status: shared_types_1.OrderStatus.PAID }),
            this.orderModel.find({ status: shared_types_1.OrderStatus.PAID, ...rangeFilter }),
            this.orderModel.find({ status: shared_types_1.OrderStatus.PAID, paidAt: { $gte: startOfToday } }),
            this.orderModel.find({ status: shared_types_1.OrderStatus.PAID, paidAt: { $gte: startOfMonth } }),
            this.orderModel.countDocuments(),
            this.orderModel.countDocuments({ status: shared_types_1.OrderStatus.PENDING }),
            this.orderModel.countDocuments({ status: shared_types_1.OrderStatus.CANCELLED }),
            this.licenseModel.countDocuments(),
            this.licenseModel.countDocuments({ status: shared_types_1.LicenseStatus.ACTIVE }),
            this.licenseModel.countDocuments({ status: shared_types_1.LicenseStatus.EXPIRED }),
            this.userModel.countDocuments(),
            this.userModel.countDocuments(userRangeFilter),
            this.productModel.countDocuments(),
        ]);
        const totalRevenue = allPaidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const rangeRevenue = rangePaidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const todayRevenue = todayPaidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const monthlyRevenue = monthPaidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const paidOrdersCount = allPaidOrders.length;
        const productStatsMap = new Map();
        for (const order of allPaidOrders) {
            const pId = order.productId ? order.productId.toString() : 'unknown';
            const existing = productStatsMap.get(pId) || {
                name: order.productSnapshot?.name || 'Sản phẩm',
                slug: order.productSnapshot?.slug || '',
                count: 0,
                revenue: 0,
            };
            existing.count += 1;
            existing.revenue += order.amount || 0;
            productStatsMap.set(pId, existing);
        }
        const topProducts = Array.from(productStatsMap.entries())
            .map(([productId, data]) => ({
            productId,
            productName: data.name,
            slug: data.slug,
            salesCount: data.count,
            revenue: data.revenue,
        }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        const conversionRate = totalOrders > 0 ? Number(((paidOrdersCount / totalOrders) * 100).toFixed(1)) : 0;
        return {
            totalRevenue,
            monthlyRevenue,
            todayRevenue,
            rangeRevenue,
            totalOrders,
            paidOrdersCount,
            pendingOrdersCount,
            cancelledOrdersCount,
            totalLicenses,
            activeLicenses,
            expiredLicenses,
            totalUsers,
            newUsersRange,
            totalProducts,
            topProducts,
            conversionRate,
            updatedAt: new Date().toISOString(),
        };
    }
    async getAllUsers(query) {
        const filter = {};
        if (query?.status && query.status !== 'ALL') {
            filter.status = query.status;
        }
        if (query?.role && query.role !== 'ALL') {
            filter.role = query.role;
        }
        if (query?.search) {
            filter.$or = [
                { fullName: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
            ];
        }
        return this.userModel.find(filter).sort({ createdAt: -1 }).select('-password').exec();
    }
    async getUserDetails(userId) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) {
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        }
        const [orders, licenses, tickets] = await Promise.all([
            this.orderModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec(),
            this.licenseModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec(),
            this.ticketModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec(),
        ]);
        const totalSpent = orders
            .filter((o) => o.status === shared_types_1.OrderStatus.PAID)
            .reduce((sum, o) => sum + (o.amount || 0), 0);
        return {
            user: user.toObject(),
            totalSpent,
            orders: orders,
            licenses: licenses,
            tickets: tickets,
        };
    }
    async toggleUserStatus(userId, adminId, adminEmail) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        }
        const oldStatus = user.status;
        user.status = user.status === shared_types_1.UserStatus.ACTIVE ? shared_types_1.UserStatus.BANNED : shared_types_1.UserStatus.ACTIVE;
        await user.save();
        await this.auditLogModel.create({
            adminId,
            adminEmail,
            action: user.status === shared_types_1.UserStatus.BANNED ? 'BAN_USER' : 'UNBAN_USER',
            targetEntity: 'User',
            targetId: user._id.toString(),
            changes: { from: oldStatus, to: user.status },
        });
        return {
            message: `Đã ${user.status === shared_types_1.UserStatus.BANNED ? 'khóa' : 'mở khóa'} tài khoản thành công`,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                status: user.status,
            },
        };
    }
    async approveOrderManual(orderId, adminId, adminEmail) {
        const result = await this.ordersService.completeOrder(orderId, `ADMIN_MANUAL_${adminId}`);
        await this.auditLogModel.create({
            adminId,
            adminEmail,
            action: 'APPROVE_ORDER_MANUAL',
            targetEntity: 'Order',
            targetId: orderId,
            changes: { orderCode: result.order?.orderCode, status: shared_types_1.OrderStatus.PAID },
        });
        return result;
    }
    async cancelOrderManual(orderId, adminId, adminEmail, reason) {
        const order = await this.orderModel.findById(orderId);
        if (!order) {
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        }
        if (order.status === shared_types_1.OrderStatus.PAID) {
            throw new common_1.BadRequestException('Không thể hủy đơn hàng đã thanh toán thành công');
        }
        order.status = shared_types_1.OrderStatus.CANCELLED;
        await order.save();
        await this.auditLogModel.create({
            adminId,
            adminEmail,
            action: 'CANCEL_ORDER_MANUAL',
            targetEntity: 'Order',
            targetId: orderId,
            changes: { orderCode: order.orderCode, reason: reason || 'Admin hủy đơn' },
        });
        return { message: 'Đã hủy đơn hàng thành công', order };
    }
    async getAuditLogs() {
        return this.auditLogModel.find().sort({ createdAt: -1 }).limit(100).exec();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(license_schema_1.License.name)),
    __param(3, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(4, (0, mongoose_1.InjectModel)(ticket_schema_1.SupportTicket.name)),
    __param(5, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        orders_service_1.OrdersService])
], AdminService);
//# sourceMappingURL=admin.service.js.map