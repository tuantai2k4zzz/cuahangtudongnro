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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const user_schema_1 = require("../users/schemas/user.schema");
const shared_types_1 = require("@tudongnro/shared-types");
let AuthService = AuthService_1 = class AuthService {
    userModel;
    jwtService;
    configService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userModel, jwtService, configService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async onModuleInit() {
        await this.seedDefaultAdmin();
    }
    async seedDefaultAdmin() {
        const adminCount = await this.userModel.countDocuments({ role: shared_types_1.UserRole.ADMIN });
        if (adminCount === 0) {
            const email = this.configService.get('ADMIN_DEFAULT_EMAIL', 'admin@tudongnrott.com');
            const password = this.configService.get('ADMIN_DEFAULT_PASSWORD', 'AdminPassword2026@');
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            await this.userModel.create({
                email: email.toLowerCase(),
                passwordHash,
                fullName: 'Quản Trị Viên TUDONGNRO',
                role: shared_types_1.UserRole.ADMIN,
                status: shared_types_1.UserStatus.ACTIVE,
            });
            this.logger.log(`Tạo thành công tài khoản Admin mặc định: ${email}`);
        }
    }
    async register(dto) {
        const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() });
        if (existing) {
            throw new common_1.ConflictException('Email này đã được đăng ký trên hệ thống');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const count = await this.userModel.countDocuments();
        const role = count === 0 ? shared_types_1.UserRole.ADMIN : shared_types_1.UserRole.CUSTOMER;
        const newUser = await this.userModel.create({
            email: dto.email.toLowerCase(),
            passwordHash,
            fullName: dto.fullName,
            role,
            status: shared_types_1.UserStatus.ACTIVE,
        });
        const tokens = await this.generateTokens(newUser._id.toString(), newUser.email, newUser.role);
        await this.updateRefreshTokenHash(newUser._id.toString(), tokens.refreshToken);
        return {
            user: {
                id: newUser._id.toString(),
                email: newUser.email,
                fullName: newUser.fullName,
                role: newUser.role,
                status: newUser.status,
                balance: newUser.balance || 0,
            },
            ...tokens,
        };
    }
    async login(dto) {
        const user = await this.userModel
            .findOne({ email: dto.email.toLowerCase() })
            .select('+passwordHash');
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }
        if (user.status === shared_types_1.UserStatus.BANNED) {
            throw new common_1.UnauthorizedException('Tài khoản của bạn đã bị khóa do vi phạm chính sách');
        }
        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }
        user.lastLoginAt = new Date();
        await user.save();
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);
        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                status: user.status,
                balance: user.balance || 0,
            },
            ...tokens,
        };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.userModel.findById(userId).select('+refreshTokenHash');
        if (!user || !user.refreshTokenHash) {
            throw new common_1.UnauthorizedException('Phiên đăng nhập không hợp lệ');
        }
        const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Refresh Token đã bị vô hiệu hóa hoặc bị giả mạo');
        }
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);
        return tokens;
    }
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash: null });
        return { message: 'Đăng xuất thành công' };
    }
    async getMe(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Người dùng không tồn tại');
        }
        return {
            id: user._id.toString(),
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            status: user.status,
            balance: user.balance || 0,
            createdAt: user['createdAt'],
            updatedAt: user['updatedAt'],
            lastLoginAt: user.lastLoginAt,
        };
    }
    async changePassword(userId, dto) {
        const user = await this.userModel.findById(userId).select('+passwordHash');
        if (!user) {
            throw new common_1.UnauthorizedException('Người dùng không tồn tại');
        }
        const isMatch = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new common_1.BadRequestException('Mật khẩu hiện tại không chính xác');
        }
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(dto.newPassword, salt);
        user.refreshTokenHash = null;
        await user.save();
        return { message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại!' };
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET', 'tudongnrott_jwt_access_super_secret_key_2026'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET', 'tudongnrott_jwt_refresh_super_secret_key_2026'),
                expiresIn: '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async updateRefreshTokenHash(userId, refreshToken) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(refreshToken, salt);
        await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash: hash });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map