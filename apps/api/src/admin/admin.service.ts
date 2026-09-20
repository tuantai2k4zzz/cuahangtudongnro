import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { License, LicenseDocument } from '../licenses/schemas/license.schema';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { OrderStatus, LicenseStatus, UserStatus, IAdminOverviewStats } from '@tudongnro/shared-types';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(License.name) private licenseModel: Model<LicenseDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async getOverviewStats(): Promise<IAdminOverviewStats> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      paidOrders,
      todayPaidOrders,
      monthPaidOrders,
      totalOrders,
      pendingOrders,
      activeLicenses,
      totalUsers,
      newUsersToday,
    ] = await Promise.all([
      this.orderModel.find({ status: OrderStatus.PAID }),
      this.orderModel.find({ status: OrderStatus.PAID, paidAt: { $gte: startOfToday } }),
      this.orderModel.find({ status: OrderStatus.PAID, paidAt: { $gte: startOfMonth } }),
      this.orderModel.countDocuments(),
      this.orderModel.countDocuments({ status: OrderStatus.PENDING }),
      this.licenseModel.countDocuments({ status: LicenseStatus.ACTIVE }),
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ createdAt: { $gte: startOfToday } }),
    ]);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
    const todayRevenue = todayPaidOrders.reduce((sum, o) => sum + o.amount, 0);
    const monthlyRevenue = monthPaidOrders.reduce((sum, o) => sum + o.amount, 0);

    return {
      totalRevenue,
      monthlyRevenue,
      todayRevenue,
      totalOrders,
      pendingOrders,
      activeLicenses,
      totalUsers,
      newUsersToday,
    };
  }

  async getAllUsers() {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  async toggleUserStatus(userId: string, adminId: string, adminEmail: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const oldStatus = user.status;
    user.status = user.status === UserStatus.ACTIVE ? UserStatus.BANNED : UserStatus.ACTIVE;
    await user.save();

    // Log action to audit log
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
      user,
    };
  }

  async getAuditLogs() {
    return this.auditLogModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }
}
