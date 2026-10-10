# Multi-stage Dockerfile for ShopFlow API
# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@11.5.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json tsconfig.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @shopflow/db generate
RUN pnpm --filter @shopflow/shared build
RUN pnpm --filter @shopflow/api build

# Stage 2: Production Non-Root Runner
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm@11.5.0

# Security: Non-root user
USER node

COPY --chown=node:node --from=builder /app/package.json ./
COPY --chown=node:node --from=builder /app/pnpm-workspace.yaml ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/packages ./packages
COPY --chown=node:node --from=builder /app/apps/api/dist ./apps/api/dist
COPY --chown=node:node --from=builder /app/apps/api/package.json ./apps/api/package.json

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "apps/api/dist/main.js"]
