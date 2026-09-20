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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const shared_types_1 = require("@tudongnro/shared-types");
let ProductsService = class ProductsService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async onModuleInit() {
        await this.seedInitialProducts();
    }
    async findAll(query) {
        const filter = {};
        if (query.status) {
            filter.status = query.status;
        }
        else {
            filter.status = shared_types_1.ProductStatus.ACTIVE;
        }
        if (query.category) {
            filter.category = query.category;
        }
        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { tagline: { $regex: query.search, $options: 'i' } },
                { description: { $regex: query.search, $options: 'i' } },
            ];
        }
        let sortOption = { salesCount: -1 };
        if (query.sort === 'NEWEST')
            sortOption = { createdAt: -1 };
        if (query.sort === 'NAME_ASC')
            sortOption = { name: 1 };
        return this.productModel.find(filter).sort(sortOption).exec();
    }
    async findBySlug(slug) {
        const product = await this.productModel.findOne({ slug: slug.toLowerCase() });
        if (!product) {
            throw new common_1.NotFoundException(`Không tìm thấy sản phẩm với slug: ${slug}`);
        }
        await this.productModel.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });
        return product;
    }
    async findAllAdmin(query) {
        const filter = {};
        if (query.status && query.status !== 'ALL') {
            filter.status = query.status;
        }
        if (query.category && query.category !== 'ALL') {
            filter.category = query.category;
        }
        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { slug: { $regex: query.search, $options: 'i' } },
                { sku: { $regex: query.search, $options: 'i' } },
                { tagline: { $regex: query.search, $options: 'i' } },
            ];
        }
        return this.productModel.find(filter).sort({ sortOrder: 1, createdAt: -1 }).exec();
    }
    async findById(id) {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new common_1.NotFoundException(`Không tìm thấy sản phẩm với ID: ${id}`);
        }
        return product;
    }
    async create(dto) {
        const existingSlug = await this.productModel.findOne({ slug: dto.slug.toLowerCase() });
        if (existingSlug) {
            throw new common_1.ConflictException(`Slug '${dto.slug}' đã tồn tại`);
        }
        if (dto.sku) {
            const existingSku = await this.productModel.findOne({ sku: dto.sku.toUpperCase() });
            if (existingSku) {
                throw new common_1.ConflictException(`Mã SKU '${dto.sku}' đã tồn tại`);
            }
        }
        return this.productModel.create({
            ...dto,
            slug: dto.slug.toLowerCase(),
            sku: dto.sku ? dto.sku.toUpperCase() : undefined,
            salesCount: 0,
            viewCount: 0,
            lastUpdated: new Date(),
        });
    }
    async update(id, updateData) {
        if (updateData.slug) {
            const existing = await this.productModel.findOne({
                slug: updateData.slug.toLowerCase(),
                _id: { $ne: id },
            });
            if (existing) {
                throw new common_1.ConflictException(`Slug '${updateData.slug}' đã tồn tại`);
            }
            updateData.slug = updateData.slug.toLowerCase();
        }
        if (updateData.sku) {
            const existingSku = await this.productModel.findOne({
                sku: updateData.sku.toUpperCase(),
                _id: { $ne: id },
            });
            if (existingSku) {
                throw new common_1.ConflictException(`Mã SKU '${updateData.sku}' đã tồn tại`);
            }
            updateData.sku = updateData.sku.toUpperCase();
        }
        updateData.lastUpdated = new Date();
        const updated = await this.productModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException('Không tìm thấy sản phẩm để cập nhật');
        }
        return updated;
    }
    async remove(id) {
        const deleted = await this.productModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new common_1.NotFoundException('Không tìm thấy sản phẩm để xóa');
        }
        return { message: 'Đã xóa sản phẩm thành công' };
    }
    async seedInitialProducts() {
        const count = await this.productModel.countDocuments();
        if (count > 0)
            return;
        const sampleProducts = [
            {
                name: 'Auto NRO Pro Ultimate',
                slug: 'auto-nro-pro-ultimate',
                tagline: 'Phần mềm toàn diện tối ưu hóa tự động hóa mọi hoạt động NRO Online',
                description: 'Auto NRO Pro Ultimate là bộ công cụ đỉnh cao dành cho game thủ Ngọc Rồng Online. Hỗ trợ đập đồ lên cấp 8-9 an toàn, tự làm nhiệm vụ, úp đệ tử và treo máy mượt mà.',
                thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
                galleryUrls: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'],
                category: shared_types_1.ProductCategory.ALL_IN_ONE,
                status: shared_types_1.ProductStatus.ACTIVE,
                currentVersion: 'v4.8.2',
                plans: [
                    { planId: 'plan_7d', name: 'Gói 7 Ngày', durationDays: 7, price: 50000, originalPrice: 70000 },
                    { planId: 'plan_30d', name: 'Gói 30 Ngày', durationDays: 30, price: 150000, originalPrice: 200000, isPopular: true },
                    { planId: 'plan_permanent', name: 'Gói Vĩnh Viễn', durationDays: 0, price: 850000, originalPrice: 1200000 },
                ],
                salesCount: 1420,
                viewCount: 18900,
            },
            {
                name: 'Auto Săn Boss VIP Siêu Tốc',
                slug: 'auto-san-boss-vip',
                tagline: 'Đón đầu Boss xuất hiện, tự bay khu, combo skill dứt điểm đoạt bảo vật',
                description: 'Bắt radar Boss xuất hiện trên toàn map với khoảng cách mili-giây, nhảy khu vắng và tự nhặt vật phẩm rơi.',
                thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
                category: shared_types_1.ProductCategory.SAN_BOSS,
                status: shared_types_1.ProductStatus.ACTIVE,
                currentVersion: 'v3.2.0',
                plans: [
                    { planId: 'boss_7d', name: 'Gói 7 Ngày', durationDays: 7, price: 40000, originalPrice: 60000 },
                    { planId: 'boss_30d', name: 'Gói 30 Ngày', durationDays: 30, price: 120000, originalPrice: 180000, isPopular: true },
                ],
                salesCount: 890,
                viewCount: 12400,
            },
        ];
        await this.productModel.insertMany(sampleProducts);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map