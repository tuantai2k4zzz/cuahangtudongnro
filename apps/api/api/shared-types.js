"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseStatus = exports.DepositStatus = exports.PaymentMethod = exports.OrderStatus = exports.ProductCategory = exports.TicketStatus = exports.TicketCategory = exports.ReviewStatus = exports.LicenseIssuanceType = exports.PlanDurationType = exports.ProductStatus = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["BANNED"] = "BANNED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "DRAFT";
    ProductStatus["ACTIVE"] = "ACTIVE";
    ProductStatus["PAUSED"] = "PAUSED";
    ProductStatus["DISCONTINUED"] = "DISCONTINUED";
    ProductStatus["INACTIVE"] = "INACTIVE";
    ProductStatus["MAINTENANCE"] = "MAINTENANCE";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var PlanDurationType;
(function (PlanDurationType) {
    PlanDurationType["DAILY"] = "DAILY";
    PlanDurationType["WEEKLY"] = "WEEKLY";
    PlanDurationType["MONTHLY"] = "MONTHLY";
    PlanDurationType["LIFETIME"] = "LIFETIME";
})(PlanDurationType || (exports.PlanDurationType = PlanDurationType = {}));
var LicenseIssuanceType;
(function (LicenseIssuanceType) {
    LicenseIssuanceType["AUTOMATIC"] = "AUTOMATIC";
    LicenseIssuanceType["MANUAL"] = "MANUAL";
    LicenseIssuanceType["NONE"] = "NONE";
})(LicenseIssuanceType || (exports.LicenseIssuanceType = LicenseIssuanceType = {}));
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "PENDING";
    ReviewStatus["APPROVED"] = "APPROVED";
    ReviewStatus["HIDDEN"] = "HIDDEN";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
var TicketCategory;
(function (TicketCategory) {
    TicketCategory["THANH_TOAN"] = "THANH_TOAN";
    TicketCategory["LOI_TOOL"] = "LOI_TOOL";
    TicketCategory["LICENSE"] = "LICENSE";
    TicketCategory["GIA_HAN"] = "GIA_HAN";
    TicketCategory["TAI_KHOAN"] = "TAI_KHOAN";
    TicketCategory["KHIEU_NAI"] = "KHIEU_NAI";
})(TicketCategory || (exports.TicketCategory = TicketCategory = {}));
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "OPEN";
    TicketStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatus["RESOLVED"] = "RESOLVED";
    TicketStatus["CLOSED"] = "CLOSED";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["AUTO_TRAIN"] = "AUTO_TRAIN";
    ProductCategory["SAN_BOSS"] = "SAN_BOSS";
    ProductCategory["AUTO_NHIEM_VU"] = "AUTO_NHIEM_VU";
    ProductCategory["TIEN_ICH"] = "TIEN_ICH";
    ProductCategory["ALL_IN_ONE"] = "ALL_IN_ONE";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PAID"] = "PAID";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["EXPIRED"] = "EXPIRED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["VIETQR"] = "VIETQR";
    PaymentMethod["WALLET"] = "WALLET";
    PaymentMethod["MOMO"] = "MOMO";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["SEPAY"] = "SEPAY";
    PaymentMethod["PAYOS"] = "PAYOS";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var DepositStatus;
(function (DepositStatus) {
    DepositStatus["PENDING"] = "PENDING";
    DepositStatus["SUCCESS"] = "SUCCESS";
    DepositStatus["CANCELLED"] = "CANCELLED";
    DepositStatus["EXPIRED"] = "EXPIRED";
})(DepositStatus || (exports.DepositStatus = DepositStatus = {}));
var LicenseStatus;
(function (LicenseStatus) {
    LicenseStatus["ACTIVE"] = "ACTIVE";
    LicenseStatus["EXPIRED"] = "EXPIRED";
    LicenseStatus["REVOKED"] = "REVOKED";
    LicenseStatus["SUSPENDED"] = "SUSPENDED";
})(LicenseStatus || (exports.LicenseStatus = LicenseStatus = {}));
