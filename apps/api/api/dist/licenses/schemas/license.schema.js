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
exports.LicenseSchema = exports.License = exports.BoundDevice = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_types_1 = require("@tudongnro/shared-types");
let BoundDevice = class BoundDevice {
    hwid;
    deviceName;
    activatedAt;
    lastActiveAt;
};
exports.BoundDevice = BoundDevice;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BoundDevice.prototype, "hwid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BoundDevice.prototype, "deviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date() }),
    __metadata("design:type", Date)
], BoundDevice.prototype, "activatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date() }),
    __metadata("design:type", Date)
], BoundDevice.prototype, "lastActiveAt", void 0);
exports.BoundDevice = BoundDevice = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BoundDevice);
let License = class License {
    licenseKey;
    keyHash;
    userId;
    productId;
    orderId;
    productName;
    productSlug;
    status;
    maxDevices;
    boundDevices;
    startDate;
    expiresDate;
    durationDays;
    revokedReason;
    lastHwidResetAt;
};
exports.License = License;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true, uppercase: true }),
    __metadata("design:type", String)
], License.prototype, "licenseKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, select: false }),
    __metadata("design:type", String)
], License.prototype, "keyHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], License.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Product', required: true, index: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], License.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], License.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], License.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], License.prototype, "productSlug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: shared_types_1.LicenseStatus, default: shared_types_1.LicenseStatus.ACTIVE, index: true }),
    __metadata("design:type", String)
], License.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], License.prototype, "maxDevices", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [BoundDevice], default: [] }),
    __metadata("design:type", Array)
], License.prototype, "boundDevices", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], License.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], License.prototype, "expiresDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], License.prototype, "durationDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], License.prototype, "revokedReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], License.prototype, "lastHwidResetAt", void 0);
exports.License = License = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'licenses' })
], License);
exports.LicenseSchema = mongoose_1.SchemaFactory.createForClass(License);
//# sourceMappingURL=license.schema.js.map