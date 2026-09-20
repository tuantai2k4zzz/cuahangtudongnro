# ========================================================
# Dockerfile cho Next.js Web Frontend (Standalone Multi-Stage)
# ========================================================
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@11.1.2

COPY package.json pnpm-workspace.yaml .npmrc ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/web/package.json ./apps/web/

RUN pnpm install --ignore-scripts

COPY packages/shared-types ./packages/shared-types
COPY apps/web ./apps/web

RUN pnpm --filter shared-types build

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter web build

# --------------------------------------------------------
# Runner stage (Chỉ ~120MB)
# --------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
