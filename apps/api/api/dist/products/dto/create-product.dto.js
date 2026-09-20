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
exports.CreateProductDto = exports.ProductPlanDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const shared_types_1 = require("@tudongnro/shared-types");
class ProductPlanDto {
    planId;
    name;
    durationType;
    durationDays;
    price;
    originalPrice;
    isPopular;
    status;
    stockLimit;
    renewalRule;
    warrantyPolicy;
}
exports.ProductPlanDto = ProductPlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'plan_30d' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductPlanDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Gói 30 Ngày' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductPlanDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_types_1.PlanDurationType, example: shared_types_1.PlanDurationType.MONTHLY, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_types_1.PlanDurationType),
    __metadata("design:type", String)
], ProductPlanDto.prototype, "durationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductPlanDto.prototype, "durationDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150000 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductPlanDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200000 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductPlanDto.prototype, "originalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProductPlanDto.prototype, "isPopular", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ACTIVE', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductPlanDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: null, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProductPlanDto.prototype, "stockLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Gia hạn cộng dồn ngày', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductPlanDto.prototype, "renewalRule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bảo hành 1 đổi 1', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductPlanDto.prototype, "warrantyPolicy", void 0);
class CreateProductDto {
    name;
    slug;
    sku;
    tagline;
    description;
    thumbnailUrl;
    galleryUrls;
    videoUrl;
    category;
    status;
    isFeatured;
    badge;
    sortOrder;
    toolName;
    currentVersion;
    supportedGameVersion;
    platform;
    supportedOs;
    changelog;
    features;
    unsupportedFeatures;
    plans;
    systemRequirements;
    installationGuide;
    userGuide;
    licenseIssuanceType;
    maxDevices;
    terms;
    seoTitle;
    metaDescription;
    ogImage;
    keywords;
    isIndexed;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Auto NRO Pro Ultimate' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'auto-nro-pro-ultimate' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NRO-PRO-01', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Phần mềm toàn diện tối ưu hóa tự động hóa mọi hoạt động NRO Online' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "tagline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mô tả chi tiết sản phẩm...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://images.unsplash.com/...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "galleryUrls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: null, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_types_1.ProductCategory, example: shared_types_1.ProductCategory.ALL_IN_ONE }),
    (0, class_validator_1.IsEnum)(shared_types_1.ProductCategory),
    __metadata("design:type", String)
], CreateProductDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_types_1.ProductStatus, example: shared_types_1.ProductStatus.ACTIVE, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_types_1.ProductStatus),
    __metadata("design:type", String)
], CreateProductDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HOT', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "badge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AutoNRO_Pro', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "toolName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'v4.8.2' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "currentVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'v2.4.x', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "supportedGameVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PC Windows', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Windows 10 / 11 (64-bit)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "supportedOs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "changelog", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "unsupportedFeatures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductPlanDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProductPlanDto),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "plans", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateProductDto.prototype, "systemRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "installationGuide", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "userGuide", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_types_1.LicenseIssuanceType, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_types_1.LicenseIssuanceType),
    __metadata("design:type", String)
], CreateProductDto.prototype, "licenseIssuanceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "maxDevices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "terms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "seoTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "metaDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "ogImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isIndexed", void 0);
//# sourceMappingURL=create-product.dto.js.map