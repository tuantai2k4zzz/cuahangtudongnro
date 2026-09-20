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
exports.DepositTransactionSchema = exports.DepositTransaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_types_1 = require("@tudongnro/shared-types");
let DepositTransaction = class DepositTransaction {
    depositCode;
    userId;
    userEmail;
    amount;
    coins;
    status;
    paymentMethod;
    qrUrl;
    bankInfo;
    memo;
    transactionId;
    paidAt;
    expiresAt;
    rawPayload;
};
exports.DepositTransaction = DepositTransaction;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true, uppercase: true }),
    __metadata("design:type", String)
], DepositTransaction.prototype, "depositCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], DepositTransaction.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], DepositTransaction.prototype, "userEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 10000 }),
    __metadata("design:type", Number)
], DepositTransaction.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 10000 }),
    __metadata("design:type", Number)
], DepositTransaction.prototype, "coins", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: shared_types_1.DepositStatus, default: shared_types_1.DepositStatus.PENDING, index: true }),
    __metadata("design:type", String)
], DepositTransaction.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: shared_types_1.PaymentMethod, default: shared_types_1.PaymentMethod.VIETQR }),
    __metadata("design:type", String)
], DepositTransaction.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], DepositTransaction.prototype, "qrUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], DepositTransaction.prototype, "bankInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], DepositTransaction.prototype, "memo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], DepositTransaction.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], DepositTransaction.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], DepositTransaction.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], DepositTransaction.prototype, "rawPayload", void 0);
exports.DepositTransaction = DepositTransaction = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'deposit_transactions',
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                ret.id = ret._id.toString();
                return ret;
            },
        },
        toObject: { virtuals: true },
    })
], DepositTransaction);
exports.DepositTransactionSchema = mongoose_1.SchemaFactory.createForClass(DepositTransaction);
//# sourceMappingURL=deposit.schema.js.map