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
exports.PaymentTransactionSchema = exports.PaymentTransaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_types_1 = require("@tudongnro/shared-types");
let PaymentTransaction = class PaymentTransaction {
    orderId;
    gateway;
    transactionId;
    amount;
    status;
    signature;
    rawPayload;
    isProcessed;
};
exports.PaymentTransaction = PaymentTransaction;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Order', required: true, index: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], PaymentTransaction.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: shared_types_1.PaymentMethod, required: true }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "gateway", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PaymentTransaction.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'SUCCESS' }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "signature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], PaymentTransaction.prototype, "rawPayload", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], PaymentTransaction.prototype, "isProcessed", void 0);
exports.PaymentTransaction = PaymentTransaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'payment_transactions' })
], PaymentTransaction);
exports.PaymentTransactionSchema = mongoose_1.SchemaFactory.createForClass(PaymentTransaction);
//# sourceMappingURL=payment-transaction.schema.js.map