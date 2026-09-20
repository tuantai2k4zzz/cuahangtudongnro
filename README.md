# TUDONGNROTT.com — Nền Tảng Bán & Quản Lý Tool Game NRO Online Chuyên Nghiệp

Hệ sinh thái thương mại điện tử và quản lý bản quyền (License Management) chuyên biệt cho các phần mềm tự động hóa (Tool) game Ngọc Rồng Online (NRO).

---

## 1. TECH STACK

- **Frontend**: Next.js 16+ App Router, TypeScript, Tailwind CSS v4, Lucide Icons, Dark Gaming SaaS UI System.
- **Backend**: NestJS 11, TypeScript, MongoDB & Mongoose, Passport JWT (HttpOnly Secure Cookie), RBAC (Customer/Admin), Swagger OpenAPI.
- **Thanh toán**: Payment Service Abstraction, tự động tạo mã VietQR theo mã đơn, Webhook HMAC Verification, Idempotency chống xử lý trùng (Anti double-spend).
- **Kiến trúc**: Monorepo (`pnpm-workspace`), chia sẻ types và enums qua package `@tudongnro/shared-types`.

---

## 2. CẤU TRÚC DỰ ÁN

```text
cuahangtudongnro/
├── apps/
│   ├── web/                     # Next.js 16 App Router Frontend
│   │   ├── app/
│   │   │   ├── (public)/        # /, /tools, /tools/[slug], /pricing
│   │   │   ├── (auth)/          # /login, /register, /forgot-password, /reset-password
│   │   │   ├── dashboard/       # /dashboard, /licenses, /orders, /profile
│   │   │   └── admin/           # /admin (Quản trị doanh thu, sản phẩm, đơn, license)
│   │   ├── components/          # UI components (Button, Badge, Card, Modal, CheckoutModal, Navbar, Footer)
│   │   └── lib/                 # api-client, mock-data, constants, utils
│   │
│   └── api/                     # NestJS Backend API
│       └── src/
│           ├── auth/            # JWT Strategy, HttpOnly Cookie, Register/Login/Logout
│           ├── users/           # User schema, RBAC
│           ├── products/        # CRUD sản phẩm, các gói thời hạn, changelog, auto-seed
│           ├── orders/          # Tính giá ở server, tạo đơn, hoàn tất đơn
│           ├── licenses/        # Cấp key ngẫu nhiên, mã hóa, HWID binding, verify API cho tool client
│           ├── payments/        # VietQR image generator, Webhook signature check, Idempotency check
│           ├── admin/           # KPI metrics, audit logs, user management
│           ├── common/          # TransformInterceptor, AllExceptionsFilter, RolesGuard
│           └── main.ts          # Bootstrap, CORS, Swagger Docs tại /api/docs
│
├── packages/
│   └── shared-types/            # Chia sẻ Enums (Role, OrderStatus, LicenseStatus) và Interfaces
│
├── docker-compose.yml           # MongoDB 7.0 & Mongo-Express dev container
├── pnpm-workspace.yaml          # Monorepo configuration
├── package.json                 # Root script
└── README.md
```

---

## 3. HƯỚNG DẪN CHẠY DỰ ÁN CỤC BỘ (LOCAL DEVELOPMENT)

### Bước 1: Khởi động cơ sở dữ liệu MongoDB (Docker)
```bash
docker compose up -d
```
MongoDB sẽ chạy tại: `mongodb://admin:secretpassword123@localhost:27017/tudongnro?authSource=admin`
Giao diện Mongo-Express tại: `http://localhost:8081`

### Bước 2: Cài đặt thư viện (nếu chưa cài)
```bash
pnpm install
```

### Bước 3: Khởi chạy Backend API (NestJS)
```bash
pnpm dev:api
```
- API chạy tại: `http://localhost:4000/api/v1`
- Swagger API Docs tương tác trực tiếp tại: `http://localhost:4000/api/docs`

### Bước 4: Khởi chạy Frontend Web (Next.js)
Mở một terminal mới:
```bash
pnpm dev:web
```
- Website hoạt động tại: `http://localhost:3000`

---

## 4. DANH SÁCH 13 TRANG FRONTEND HOÀN THIỆN

1. `/` — **Trang Chủ**: Hero phát sáng Ki Energy, KPI metrics, danh sách tool tiêu biểu, công nghệ bảo vệ nick 3 lớp, quy trình mua 3 bước, FAQ và CTA.
2. `/tools` — **Cửa Hàng Tool**: Tìm kiếm theo tên/tính năng, bộ lọc theo danh mục (All-in-one, Săn Boss, Úp Đệ, Tiện ích), sắp xếp theo giá và lượt mua.
3. `/tools/[slug]` — **Chi Tiết Tool**: Banner preview, tính năng chi tiết, lịch sử cập nhật (Changelog), yêu cầu cấu hình máy tính, chọn gói và mua ngay.
4. `/pricing` — **Bảng Giá Tổng Hợp**: So sánh quyền lợi giữa 4 gói: 7 Ngày, 30 Ngày, 90 Ngày và Vĩnh Viễn (Lifetime).
5. `/login` — **Đăng Nhập**: Form đăng nhập email/mật khẩu, ghi nhớ đăng nhập.
6. `/register` — **Đăng Ký**: Form tạo tài khoản kèm điều khoản bản quyền.
7. `/forgot-password` — **Quên Mật Khẩu**: Khôi phục tài khoản qua email.
8. `/reset-password` — **Đặt Lại Mật Khẩu**: Nhập mật khẩu mới an toàn.
9. `/dashboard` — **Tổng Quan Tài Khoản**: Thống kê số key đang dùng, ngày hết hạn gần nhất, tổng chi tiêu và đơn hàng mới.
10. `/dashboard/licenses` — **Quản Lý License**: Xem key, sao chép 1-click, theo dõi máy tính đã khóa (HWID), nút đổi máy mới (Reset HWID 1 lần/tháng).
11. `/dashboard/orders` — **Lịch Sử Đơn Hàng**: Chi tiết mã đơn, giá tiền, thời gian và popup xem hóa đơn.
12. `/dashboard/profile` — **Cài Đặt Cá Nhân**: Đổi mật khẩu tài khoản, xem thiết bị đăng nhập.
13. `/admin` — **Trung Tâm Quản Trị (Admin RBAC)**:
    - Tab 1: Tổng quan doanh thu, doanh số hôm nay, biểu đồ KPI.
    - Tab 2: Quản lý sản phẩm tool NRO.
    - Tab 3: Quản lý đơn hàng và nút duyệt tay (nếu khách chuyển thiếu cú pháp).
    - Tab 4: Quản lý toàn bộ License và công cụ Thu hồi (Revoke Key).
    - Tab 5: Cấu hình cổng thanh toán VietQR và Webhook secret.

---

## 5. BẢO MẬT & KIỂM TRA CHỨC NĂNG

### A. Kiểm tra tính giá Server-Side (Không tin dữ liệu Client)
Khi gửi yêu cầu mua hàng từ Frontend, client chỉ gửi `{ productId, planId }`. Server đọc dữ liệu giá gốc từ MongoDB để tính tổng thanh toán, ngăn chặn triệt để hành vi can thiệp sửa giá.

### B. Chống gian lận Webhook (Idempotency)
Khi cổng thanh toán gọi Webhook đến `/payments/webhook/:gateway`, hệ thống kiểm tra `transactionId`:
- Nếu `transactionId` đã tồn tại trong `payment_transactions`, hệ thống lập tức trả về `200 OK` và không cấp thêm License.
- Ngăn ngừa hoàn toàn lỗi double-spend (xử lý trùng đơn hàng).

### C. API Xác Thực Bản Quyền Dành Cho Ứng Dụng Tool Game Desktop
Ứng dụng game client (C#, Java, Python, C++) gọi endpoint:
```http
POST /api/v1/licenses/verify
Content-Type: application/json

{
  "licenseKey": "NRO-8K2A-99F1-XP77-2026",
  "hwid": "BFEBFBFF000906EA-MSI-MAG-Z690",
  "deviceName": "DESKTOP-GAMING"
}
```
Phản hồi:
```json
{
  "valid": true,
  "productName": "Auto NRO Pro Ultimate",
  "expiresDate": "2026-10-18T14:22:15.000Z",
  "durationDays": 30,
  "message": "Xác thực bản quyền thành công!"
}
```
Nếu HWID khác với máy đã đăng ký hoặc license bị thu hồi, hệ thống sẽ từ chối truy cập ngay lập tức.

---

## 6. HƯỚNG DẪN TRIỂN KHAI PRODUCTION (DEPLOYMENT)

### Frontend (Next.js):
- Triển khai trên **Vercel** hoặc VPS Linux với PM2 / Docker.
- Đặt biến môi trường:
  - `NEXT_PUBLIC_API_URL=https://api.tudongnrott.com/api/v1`

### Backend (NestJS):
- Triển khai trên **VPS Linux (Ubuntu 22.04 / 24.04)** với Node.js 20+ hoặc Docker.
- Cấu hình Nginx Reverse Proxy và SSL Certbot Let's Encrypt.
- Đặt các biến môi trường trong file `.env`:
  - `PORT=4000`
  - `NODE_ENV=production`
  - `CLIENT_URL=https://tudongnrott.com`
  - `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tudongnro`
  - `JWT_ACCESS_SECRET=your_long_random_access_secret`
  - `JWT_REFRESH_SECRET=your_long_random_refresh_secret`
  - `PAYMENT_WEBHOOK_SECRET=your_vietqr_webhook_secret`
