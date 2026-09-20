"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicensesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcryptjs"));
const license_schema_1 = require("./schemas/license.schema");
const shared_types_1 = require("@tudongnro/shared-types");
let LicensesService = class LicensesService {
    licenseModel;
    constructor(licenseModel) {
        this.licenseModel = licenseModel;
    }
    async createLicense(data) {
        const rawKey = this.generateRandomKey();
        const keyHash = await bcrypt.hash(rawKey, 10);
        const now = new Date();
        let expiresDate = null;
        if (data.durationDays > 0) {
            expiresDate = new Date(now.getTime() + data.durationDays * 24 * 60 * 60 * 1000);
        }
        const newLicense = await this.licenseModel.create({
            licenseKey: rawKey,
            keyHash,
            userId: new mongoose_2.Types.ObjectId(data.userId),
            productId: new mongoose_2.Types.ObjectId(data.productId),
            orderId: new mongoose_2.Types.ObjectId(data.orderId),
            productName: data.productName,
            productSlug: data.productSlug,
            status: shared_types_1.LicenseStatus.ACTIVE,
            durationDays: data.durationDays,
            startDate: now,
            expiresDate,
            boundDevices: [],
        });
        return newLicense;
    }
    async getMyLicenses(userId) {
        const licenses = await this.licenseModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
        const now = new Date();
        for (const lic of licenses) {
            if (lic.status === shared_types_1.LicenseStatus.ACTIVE &&
                lic.expiresDate &&
                new Date(lic.expiresDate) < now) {
                lic.status = shared_types_1.LicenseStatus.EXPIRED;
                await lic.save();
            }
        }
        return licenses;
    }
    async getLicenseById(id, userId) {
        const license = await this.licenseModel.findById(id);
        if (!license) {
            throw new common_1.NotFoundException('Không tìm thấy license');
        }
        if (userId && license.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền xem license này');
        }
        return license;
    }
    async resetHwid(licenseId, userId) {
        const license = await this.getLicenseById(licenseId, userId);
        if (license.status !== shared_types_1.LicenseStatus.ACTIVE) {
            throw new common_1.BadRequestException('Chỉ có thể reset thiết bị cho License đang hoạt động');
        }
        if (license.lastHwidResetAt) {
            const daysSinceReset = (Date.now() - new Date(license.lastHwidResetAt).getTime()) /
                (1000 * 60 * 60 * 24);
            if (daysSinceReset < 30) {
                throw new common_1.BadRequestException(`Bạn chỉ được reset HWID 1 lần mỗi 30 ngày. Vui lòng thử lại sau ${Math.ceil(30 - daysSinceReset)} ngày.`);
            }
        }
        license.boundDevices = [];
        license.lastHwidResetAt = new Date();
        await license.save();
        return { message: 'Reset thiết bị (HWID) thành công. Mở tool trên máy mới để kích hoạt!' };
    }
    async verifyLicenseClient(licenseKey, hwid, deviceName) {
        const license = await this.licenseModel.findOne({
            licenseKey: licenseKey.trim().toUpperCase(),
        });
        if (!license) {
            return { valid: false, message: 'Mã License không tồn tại trong hệ thống' };
        }
        if (license.status === shared_types_1.LicenseStatus.REVOKED) {
            return {
                valid: false,
                message: `License đã bị thu hồi do vi phạm: ${license.revokedReason || 'Chính sách bảo mật'}`,
            };
        }
        const now = new Date();
        if (license.expiresDate && new Date(license.expiresDate) < now) {
            license.status = shared_types_1.LicenseStatus.EXPIRED;
            await license.save();
            return { valid: false, message: 'License đã hết hạn sử dụng' };
        }
        if (license.status !== shared_types_1.LicenseStatus.ACTIVE) {
            return { valid: false, message: 'License hiện đang bị tạm khóa' };
        }
        const existingDevice = license.boundDevices.find((d) => d.hwid === hwid);
        if (!existingDevice) {
            if (license.boundDevices.length >= license.maxDevices) {
                return {
                    valid: false,
                    message: 'License này đã được kích hoạt trên một máy tính khác. Vui lòng vào website để Reset HWID nếu bạn vừa đổi máy.',
                };
            }
            license.boundDevices.push({
                hwid,
                deviceName: deviceName || 'Máy tính khách',
                activatedAt: new Date(),
                lastActiveAt: new Date(),
            });
            await license.save();
        }
        else {
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
    async revokeLicenseAdmin(id, reason) {
        const license = await this.licenseModel.findById(id);
        if (!license) {
            throw new common_1.NotFoundException('Không tìm thấy License');
        }
        license.status = shared_types_1.LicenseStatus.REVOKED;
        license.revokedReason = reason || 'Quản trị viên thu hồi thủ công';
        await license.save();
        return { message: 'Đã thu hồi license thành công' };
    }
    generateRandomKey() {
        const chunk1 = crypto.randomBytes(2).toString('hex').toUpperCase();
        const chunk2 = crypto.randomBytes(2).toString('hex').toUpperCase();
        const chunk3 = crypto.randomBytes(2).toString('hex').toUpperCase();
        const year = new Date().getFullYear();
        return `NRO-${chunk1}-${chunk2}-${chunk3}-${year}`;
    }
};
exports.LicensesService = LicensesService;
exports.LicensesService = LicensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(license_schema_1.License.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LicensesService);
//# sourceMappingURL=licenses.service.js.map