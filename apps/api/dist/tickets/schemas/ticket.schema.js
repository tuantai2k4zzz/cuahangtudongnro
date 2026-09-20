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
exports.SupportTicketSchema = exports.SupportTicket = exports.TicketMessage = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_types_1 = require("@tudongnro/shared-types");
let TicketMessage = class TicketMessage {
    sender;
    senderName;
    message;
    createdAt;
};
exports.TicketMessage = TicketMessage;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['USER', 'ADMIN'] }),
    __metadata("design:type", String)
], TicketMessage.prototype, "sender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TicketMessage.prototype, "senderName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], TicketMessage.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], TicketMessage.prototype, "createdAt", void 0);
exports.TicketMessage = TicketMessage = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], TicketMessage);
let SupportTicket = class SupportTicket {
    ticketCode;
    userId;
    customerName;
    customerEmail;
    customerPhone;
    category;
    orderCode;
    subject;
    status;
    priority;
    messages;
    assignedAdminId;
};
exports.SupportTicket = SupportTicket;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true, uppercase: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "ticketCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', default: null, index: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], SupportTicket.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], SupportTicket.prototype, "customerPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: shared_types_1.TicketCategory, default: shared_types_1.TicketCategory.THANH_TOAN, index: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, index: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "orderCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: shared_types_1.TicketStatus, default: shared_types_1.TicketStatus.OPEN, index: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'NORMAL' }),
    __metadata("design:type", String)
], SupportTicket.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TicketMessage], default: [] }),
    __metadata("design:type", Array)
], SupportTicket.prototype, "messages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], SupportTicket.prototype, "assignedAdminId", void 0);
exports.SupportTicket = SupportTicket = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'support_tickets',
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                ret.id = ret._id.toString();
                return ret;
            },
        },
        toObject: { virtuals: true },
    })
], SupportTicket);
exports.SupportTicketSchema = mongoose_1.SchemaFactory.createForClass(SupportTicket);
//# sourceMappingURL=ticket.schema.js.map