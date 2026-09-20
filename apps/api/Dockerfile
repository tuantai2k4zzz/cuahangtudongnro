# ========================================================
# Dockerfile cho NestJS Backend API (Production Multi-Stage)
# ========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt pnpm
RUN npm install -g pnpm@11.1.2

# Copy package manifests
COPY package.json pnpm-workspace.yaml .npmrc ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/api/package.json ./apps/api/

# Cài đặt dependencies
RUN pnpm install --ignore-scripts

# Copy mã nguồn
COPY packages/shared-types ./packages/shared-types
COPY apps/api ./apps/api

# Build shared-types và NestJS
RUN pnpm --filter shared-types build
RUN pnpm --filter api build

# --------------------------------------------------------
# Runner stage (Siêu nhẹ)
# --------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Copy node_modules và build artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared-types ./packages/shared-types
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

EXPOSE 4000

CMD ["node", "apps/api/dist/main"]
