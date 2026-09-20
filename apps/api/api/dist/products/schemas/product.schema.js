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
exports.ProductSchema = exports.Product = exports.ProductFeature = exports.ProductChangelog = exports.ProductPlan = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const shared_types_1 = require("@tudongnro/shared-types");
let ProductPlan = class ProductPlan {
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
};
exports.ProductPlan = ProductPlan;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductPlan.prototype, "planId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductPlan.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: shared_types_1.PlanDurationType, default: shared_types_1.PlanDurationType.MONTHLY }),
    __metadata("design:type", String)
], ProductPlan.prototype, "durationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ProductPlan.prototype, "durationDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ProductPlan.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ProductPlan.prototype, "originalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ProductPlan.prototype, "isPopular", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'ACTIVE' }),
    __metadata("design:type", String)
], ProductPlan.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], ProductPlan.prototype, "stockLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Gia hạn cộng dồn ngày vào license hiện tại.' }),
    __metadata("design:type", String)
], ProductPlan.prototype, "renewalRule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Bảo hành 1 đổi 1 trong suốt thời gian sử dụng bản quyền.' }),
    __metadata("design:type", String)
], ProductPlan.prototype, "warrantyPolicy", void 0);
exports.ProductPlan = ProductPlan = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ProductPlan);
let ProductChangelog = class ProductChangelog {
    version;
    releaseDate;
    notes;
};
exports.ProductChangelog = ProductChangelog;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductChangelog.prototype, "version", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductChangelog.prototype, "releaseDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ProductChangelog.prototype, "notes", void 0);
exports.ProductChangelog = ProductChangelog = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ProductChangelog);
let ProductFeature = class ProductFeature {
    title;
    description;
    icon;
};
exports.ProductFeature = ProductFeature;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductFeature.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductFeature.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], ProductFeature.prototype, "icon", void 0);
exports.ProductFeature = ProductFeature = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ProductFeature);
let Product = class Product {
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
    salesCount;
    viewCount;
    lastUpdated;
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true, trim: true, uppercase: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "tagline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "galleryUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Product.prototype, "videoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: shared_types_1.ProductCategory, default: shared_types_1.ProductCategory.ALL_IN_ONE, index: true }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: shared_types_1.ProductStatus, default: shared_types_1.ProductStatus.ACTIVE, index: true }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Product.prototype, "badge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "sortOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Product.prototype, "toolName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'v1.0.0' }),
    __metadata("design:type", String)
], Product.prototype, "currentVersion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Bản quyền NRO Online mới nhất' }),
    __metadata("design:type", String)
], Product.prototype, "supportedGameVersion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'PC Windows' }),
    __metadata("design:type", String)
], Product.prototype, "platform", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Windows 10 / 11 (64-bit)' }),
    __metadata("design:type", String)
], Product.prototype, "supportedOs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ProductChangelog], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "changelog", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ProductFeature], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "features", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "unsupportedFeatures", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ProductPlan], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "plans", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            os: 'Windows 10 / 11',
            ram: '4GB RAM trở lên',
            cpu: 'Intel Core i3 / AMD Ryzen 3 trở lên',
            disk: '500MB dung lượng trống',
            notes: 'Tương thích mượt mà các trình giả lập và client game',
        },
    }),
    __metadata("design:type", Object)
], Product.prototype, "systemRequirements", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Product.prototype, "installationGuide", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Product.prototype, "userGuide", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: shared_types_1.LicenseIssuanceType, default: shared_types_1.LicenseIssuanceType.AUTOMATIC }),
    __metadata("design:type", String)
], Product.prototype, "licenseIssuanceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Product.prototype, "maxDevices", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Bản quyền cấp cho 01 máy tính vật lý (HWID). Không chia sẻ công khai.' }),
    __metadata("design:type", String)
], Product.prototype, "terms", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Product.prototype, "seoTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Product.prototype, "metaDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Product.prototype, "ogImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "keywords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isIndexed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "salesCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "viewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Product.prototype, "lastUpdated", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'products',
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                ret.id = ret._id.toString();
                return ret;
            },
        },
        toObject: { virtuals: true },
    })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
//# sourceMappingURL=product.schema.js.map