import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserRole, UserStatus } from '@tudongnro/shared-types';
export declare class AuthService implements OnModuleInit {
    private userModel;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, configService: ConfigService);
    onModuleInit(): Promise<void>;
    private seedDefaultAdmin;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: UserRole;
            status: UserStatus;
            balance: number;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: UserRole;
            status: UserStatus.ACTIVE;
            balance: number;
        };
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: UserRole;
        status: UserStatus;
        balance: number;
        createdAt: any;
        updatedAt: any;
        lastLoginAt: Date;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    private generateTokens;
    private updateRefreshTokenHash;
}
