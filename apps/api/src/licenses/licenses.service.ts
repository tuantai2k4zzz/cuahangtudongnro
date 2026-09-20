import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { License, LicenseDocument } from './schemas/license.schema';
import { LicenseStatus } from '@tudongnro/shared-types';

@Injectable()
export class LicensesService {
  constructor(
    @InjectModel(License.name) private licenseModel: Model<LicenseDocument>,
  ) {}

  async createLicense(data: {
    userId: string;
    productId: string;
    orderId: string;
    productName: string;
    productSlug: string;
    durationDays: number;
  }) {
    // Generate secure license key: NRO-XXXX-XXXX-XXXX-XXXX
    const rawKey = this.generateRandomKey();
    const keyHash = await bcrypt.hash(rawKey, 10);

    const now = new Date();
    let expiresDate: Date | null = null;
    if (data.durationDays > 0) {
      expiresDate = new Date(now.getTime() + data.durationDays * 24 * 60 * 60 * 1000);
    }

    const newLicense = await this.licenseModel.create({
      licenseKey: rawKey,
      keyHash,
      userId: new Types.ObjectId(data.userId),
      productId: new Types.ObjectId(data.productId),
      orderId: new Types.ObjectId(data.orderId),
      productName: data.productName,
      productSlug: data.productSlug,
      status: LicenseStatus.ACTIVE,
      durationDays: data.durationDays,
      startDate: now,
      expiresDate,
      boundDevices: [],
    });

    return newLicense;
  }

  async getMyLicenses(userId: string) {
    const licenses = await this.licenseModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();

    // Check expiration on read
    const now = new Date();
    for (const lic of licenses) {
      if (
        lic.status === LicenseStatus.ACTIVE &&
        lic.expiresDate &&
        new Date(lic.expiresDate) < now
      ) {
        lic.status = LicenseStatus.EXPIRED;
        await lic.save();
      }
    }

    return licenses;
  }

  async getLicenseById(id: string, userId?: string) {
    const license = await this.licenseModel.findById(id);
    if (!license) {
      throw new NotFoundException('Không tìm thấy license');
    }
    if (userId && license.userId.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem license này');
    }
    return license;
  }

  async resetHwid(licenseId: string, userId: string) {
    const license = await this.getLicenseById(licenseId, userId);

    if (license.status !== LicenseStatus.ACTIVE) {
      throw new BadRequestException('Chỉ có thể reset thiết bị cho License đang hoạt động');
    }

    // Check limit: 1 reset per 30 days
    if (license.lastHwidResetAt) {
      const daysSinceReset =
        (Date.now() - new Date(license.lastHwidResetAt).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSinceReset < 30) {
        throw new BadRequestException(
          `Bạn chỉ được reset HWID 1 lần mỗi 30 ngày. Vui lòng thử lại sau ${Math.ceil(
            30 - daysSinceReset,
          )} ngày.`,
        );
      }
    }

    license.boundDevices = [];
    license.lastHwidResetAt = new Date();
    await license.save();

    return { message: 'Reset thiết bị (HWID) thành công. Mở tool trên máy mới để kích hoạt!' };
  }

  async verifyLicenseClient(licenseKey: string, hwid: string, deviceName?: string) {
    const license = await this.licenseModel.findOne({
      licenseKey: licenseKey.trim().toUpperCase(),
    });

    if (!license) {
      return { valid: false, message: 'Mã License không tồn tại trong hệ thống' };
    }

    if (license.status === LicenseStatus.REVOKED) {
      return {
        valid: false,
        message: `License đã bị thu hồi do vi phạm: ${license.revokedReason || 'Chính sách bảo mật'}`,
      };
    }

    const now = new Date();
    if (license.expiresDate && new Date(license.expiresDate) < now) {
      license.status = LicenseStatus.EXPIRED;
      await license.save();
      return { valid: false, message: 'License đã hết hạn sử dụng' };
    }

    if (license.status !== LicenseStatus.ACTIVE) {
      return { valid: false, message: 'License hiện đang bị tạm khóa' };
    }

    // Hardware ID locking
    const existingDevice = license.boundDevices.find((d) => d.hwid === hwid);
    if (!existingDevice) {
      if (license.boundDevices.length >= license.maxDevices) {
        return {
          valid: false,
          message:
            'License này đã được kích hoạt trên một máy tính khác. Vui lòng vào website để Reset HWID nếu bạn vừa đổi máy.',
        };
      }
      // Bind new device
      license.boundDevices.push({
        hwid,
        deviceName: deviceName || 'Máy tính khách',
        activatedAt: new Date(),
        lastActiveAt: new Date(),
      });
      await license.save();
    } else {
      existingDevice.lastActiveAt = new Date();
      await license.save();
    }

    return {
      valid: true,
      productName: license.productName,
      expiresDate: license.expiresDate,
      durationDays: license.durationDays,
      boundDeviceCount: license.boundDevices.length,
      message: 'Xác thực bản quyền thành công!',
    };
  }

  async getAllLicensesAdmin() {
    return this.licenseModel.find().sort({ createdAt: -1 }).exec();
  }

  async revokeLicenseAdmin(id: string, reason: string) {
    const license = await this.licenseModel.findById(id);
    if (!license) {
      throw new NotFoundException('Không tìm thấy License');
    }
    license.status = LicenseStatus.REVOKED;
    license.revokedReason = reason || 'Quản trị viên thu hồi thủ công';
    await license.save();
    return { message: 'Đã thu hồi license thành công' };
  }

  private generateRandomKey(): string {
    const chunk1 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const chunk2 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const chunk3 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const year = new Date().getFullYear();
    return `NRO-${chunk1}-${chunk2}-${chunk3}-${year}`;
  }
}
