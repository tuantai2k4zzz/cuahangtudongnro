"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const order_schema_1 = require("../orders/schemas/order.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const license_schema_1 = require("../licenses/schemas/license.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const ticket_schema_1 = require("../tickets/schemas/ticket.schema");
const audit_log_schema_1 = require("./schemas/audit-log.schema");
const orders_module_1 = require("../orders/orders.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: license_schema_1.License.name, schema: license_schema_1.LicenseSchema },
                { name: audit_log_schema_1.AuditLog.name, schema: audit_log_schema_1.AuditLogSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: ticket_schema_1.SupportTicket.name, schema: ticket_schema_1.SupportTicketSchema },
            ]),
            orders_module_1.OrdersModule,
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map