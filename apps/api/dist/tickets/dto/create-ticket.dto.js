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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTicketDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const shared_types_1 = require("@tudongnro/shared-types");
class CreateTicketDto {
    customerName;
    customerEmail;
    customerPhone;
    category;
    orderCode;
    subject;
    message;
}
exports.CreateTicketDto = CreateTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nguyễn Văn Đạt' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'dat.nro@gmail.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '0983542830', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "customerPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_types_1.TicketCategory, example: shared_types_1.TicketCategory.THANH_TOAN }),
    (0, class_validator_1.IsEnum)(shared_types_1.TicketCategory),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NRO-88219', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "orderCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cần hỗ trợ kiểm tra tiền nạp MBBank chưa cộng key' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tôi đã chuyển 150.000đ nhưng chưa thấy key hiện lên trang quản lý.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "message", void 0);
//# sourceMappingURL=create-ticket.dto.js.map