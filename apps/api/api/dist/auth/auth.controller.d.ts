import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<{
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                fullName: string;
                role: import("@tudongnro/shared-types").UserRole;
                status: import("@tudongnro/shared-types").UserStatus;
                balance: number;
            };
        };
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                fullName: string;
                role: import("@tudongnro/shared-types").UserRole;
                status: import("@tudongnro/shared-types").UserStatus.ACTIVE;
                balance: number;
            };
        };
    }>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>> | {
        message: string;
    }>;
    logout(userId: string, res: Response): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<{
        data: {
            id: string;
            email: string;
            fullName: string;
            role: import("@tudongnro/shared-types").UserRole;
            status: import("@tudongnro/shared-types").UserStatus;
            balance: number;
            createdAt: any;
            updatedAt: any;
            lastLoginAt: Date;
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto, res: Response): Promise<{
        message: string;
    }>;
    private setTokenCookies;
}
