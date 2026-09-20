"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseStatus = exports.PaymentMethod = exports.OrderStatus = exports.ProductCategory = exports.ProductStatus = exports.UserStatus = exports.UserRole = void 0;
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
    ProductStatus["ACTIVE"] = "ACTIVE";
    ProductStatus["INACTIVE"] = "INACTIVE";
    ProductStatus["MAINTENANCE"] = "MAINTENANCE";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
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
    PaymentMethod["MOMO"] = "MOMO";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["SEPAY"] = "SEPAY";
    PaymentMethod["PAYOS"] = "PAYOS";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var LicenseStatus;
(function (LicenseStatus) {
    LicenseStatus["ACTIVE"] = "ACTIVE";
    LicenseStatus["EXPIRED"] = "EXPIRED";
    LicenseStatus["REVOKED"] = "REVOKED";
    LicenseStatus["SUSPENDED"] = "SUSPENDED";
})(LicenseStatus || (exports.LicenseStatus = LicenseStatus = {}));
