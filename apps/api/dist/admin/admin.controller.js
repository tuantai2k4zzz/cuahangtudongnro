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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const shared_types_1 = require("@tudongnro/shared-types");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getOverview(range) {
        return this.adminService.getOverviewStats(range);
    }
    async getUsers(search, status, role) {
        return this.adminService.getAllUsers({ search, status, role });
    }
    async getUserDetails(id) {
        return this.adminService.getUserDetails(id);
    }
    async toggleUserStatus(id, adminId, adminEmail) {
        return this.adminService.toggleUserStatus(id, adminId, adminEmail);
    }
    async approveOrder(id, adminId, adminEmail) {
        return this.adminService.approveOrderManual(id, adminId, adminEmail);
    }
    async cancelOrder(id, adminId, adminEmail, reason) {
        return this.adminService.cancelOrderManual(id, adminId, adminEmail, reason);
    }
    async getAuditLogs() {
        return this.adminService.getAuditLogs();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy số liệu tổng quan doanh thu, đơn hàng, người dùng (Admin Only)' }),
    __param(0, (0, common_1.Query)('range')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả khách hàng (Admin Only)' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('users/:id/details'),
    (0, swagger_1.ApiOperation)({ summary: 'Xem chi tiết khách hàng: đơn hàng, license, tổng tiền đã chi' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Post)('users/:id/toggle-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Khóa / Mở khóa tài khoản khách hàng (Admin Only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleUserStatus", null);
__decorate([
    (0, common_1.Post)('orders/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Phê duyệt kích hoạt đơn hàng thủ công (Admin Only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveOrder", null);
__decorate([
    (0, common_1.Post)('orders/:id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Hủy đơn hàng chờ thanh toán (Admin Only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('email')),
    __param(3, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Xem lịch sử kiểm toán audit log (Admin Only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_types_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map