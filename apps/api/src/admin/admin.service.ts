import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { License, LicenseDocument } from '../licenses/schemas/license.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { SupportTicket, TicketDocument } from '../tickets/schemas/ticket.schema';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { OrdersService } from '../orders/orders.service';
import {
  OrderStatus,
  LicenseStatus,
  UserStatus,
  IAdminOverviewStats,
  IUserDetails,
} from '@tudongnro/shared-types';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(License.name) private licenseModel: Model<LicenseDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(SupportTicket.name) private ticketModel: Model<TicketDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    private ordersService: OrdersService,
  ) {}

  async getOverviewStats(range: 'today' | 'week' | 'month' | 'all' = 'all'): Promise<IAdminOverviewStats> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let rangeCutoff: Date | null = null;
    if (range === 'today') {
      rangeCutoff = startOfToday;
    } else if (range === 'week') {
      rangeCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === 'month') {
      rangeCutoff = startOfMonth;
    }

    const rangeFilter: any = rangeCutoff ? { paidAt: { $gte: rangeCutoff } } : {};
    const userRangeFilter: any = rangeCutoff ? { createdAt: { $gte: rangeCutoff } } : {};

    const [
      allPaidOrders,
      rangePaidOrders,
      todayPaidOrders,
      monthPaidOrders,
      totalOrders,
      pendingOrdersCount,
      cancelledOrdersCount,
      totalLicenses,
      activeLicenses,
      expiredLicenses,
      totalUsers,
      newUsersRange,
      totalProducts,
    ] = await Promise.all([
      this.orderModel.find({ status: OrderStatus.PAID }),
      this.orderModel.find({ status: OrderStatus.PAID, ...rangeFilter }),
      this.orderModel.find({ status: OrderStatus.PAID, paidAt: { $gte: startOfToday } }),
      this.orderModel.find({ status: OrderStatus.PAID, paidAt: { $gte: startOfMonth } }),
      this.orderModel.countDocuments(),
      this.orderModel.countDocuments({ status: OrderStatus.PENDING }),
      this.orderModel.countDocuments({ status: OrderStatus.CANCELLED }),
      this.licenseModel.countDocuments(),
      this.licenseModel.countDocuments({ status: LicenseStatus.ACTIVE }),
      this.licenseModel.countDocuments({ status: LicenseStatus.EXPIRED }),
      this.userModel.countDocuments(),
      this.userModel.countDocuments(userRangeFilter),
      this.productModel.countDocuments(),
    ]);

    const totalRevenue = allPaidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const rangeRevenue = rangePaidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const todayRevenue = todayPaidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const monthlyRevenue = monthPaidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const paidOrdersCount = allPaidOrders.length;

    // Top selling products aggregate from real paid orders
    const productStatsMap = new Map<string, { name: string; slug: string; count: number; revenue: number }>();
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

    const conversionRate =
      totalOrders > 0 ? Number(((paidOrdersCount / totalOrders) * 100).toFixed(1)) : 0;

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

  async getAllUsers(query?: { search?: string; status?: string; role?: string }) {
    const filter: any = {};
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

  async getUserDetails(userId: string): Promise<IUserDetails> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const [orders, licenses, tickets] = await Promise.all([
      this.orderModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec(),
      this.licenseModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec(),
      this.ticketModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec(),
    ]);

    const totalSpent = orders
      .filter((o) => o.status === OrderStatus.PAID)
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    return {
      user: user.toObject() as any,
      totalSpent,
      orders: orders as any,
      licenses: licenses as any,
      tickets: tickets as any,
    };
  }

  async toggleUserStatus(userId: string, adminId: string, adminEmail: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const oldStatus = user.status;
    user.status = user.status === UserStatus.ACTIVE ? UserStatus.BANNED : UserStatus.ACTIVE;
    await user.save();

    await this.auditLogModel.create({
      adminId,
      adminEmail,
      action: user.status === UserStatus.BANNED ? 'BAN_USER' : 'UNBAN_USER',
      targetEntity: 'User',
      targetId: user._id.toString(),
      changes: { from: oldStatus, to: user.status },
    });

    return {
      message: `Đã ${user.status === UserStatus.BANNED ? 'khóa' : 'mở khóa'} tài khoản thành công`,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
      },
    };
  }

  async approveOrderManual(orderId: string, adminId: string, adminEmail: string) {
    const result = await this.ordersService.completeOrder(orderId, `ADMIN_MANUAL_${adminId}`);

    await this.auditLogModel.create({
      adminId,
      adminEmail,
      action: 'APPROVE_ORDER_MANUAL',
      targetEntity: 'Order',
      targetId: orderId,
      changes: { orderCode: (result as any).order?.orderCode, status: OrderStatus.PAID },
    });

    return result;
  }

  async cancelOrderManual(orderId: string, adminId: string, adminEmail: string, reason?: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    if (order.status === OrderStatus.PAID) {
      throw new BadRequestException('Không thể hủy đơn hàng đã thanh toán thành công');
    }

    order.status = OrderStatus.CANCELLED;
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
}
