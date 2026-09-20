#!/bin/bash

# ========================================================
# Script Tự Động Triển Khai Nền Tảng TUDONGNROTT.com (VPS)
# ========================================================

set -e

echo "=================================================="
echo "🚀 BẮT ĐẦU TRIỂN KHAI TUDONGNROTT.COM TRÊN VPS"
echo "=================================================="

# 1. Kiểm tra Docker & Docker Compose
if ! command -v docker &> /dev/null; then
    echo "⚠️ Docker chưa được cài đặt. Đang cài đặt Docker tự động..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
fi

# 2. Tạo thư mục cấu hình SSL nếu chưa có
mkdir -p nginx/ssl

# 3. Dừng các container cũ nếu có
echo "🛑 Dừng các container cũ..."
docker compose -f docker-compose.prod.yml down --remove-orphans || true

# 4. Build và khởi chạy các container production
echo "🔨 Đang đóng gói Docker images và khởi chạy..."
docker compose -f docker-compose.prod.yml up -d --build

echo "=================================================="
echo "✅ TRIỂN KHAI THÀNH CÔNG!"
echo "🌐 Frontend: http://tudongnrott.com"
echo "⚙️ Backend API: http://api.tudongnrott.com/api/v1"
echo "📖 Swagger Docs: http://api.tudongnrott.com/api/docs"
echo "=================================================="
