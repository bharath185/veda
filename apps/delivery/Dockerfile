# Multi-stage Dockerfile for ShopFlow Delivery Partner PWA
FROM node:22-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm@11.5.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json tsconfig.json ./
COPY packages/ ./packages/
COPY apps/delivery/ ./apps/delivery/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @shopflow/shared build
RUN pnpm --filter @shopflow/ui build
RUN pnpm --filter @shopflow/delivery build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
USER node

COPY --chown=node:node --from=builder /app/apps/delivery/.next/standalone ./
COPY --chown=node:node --from=builder /app/apps/delivery/.next/static ./apps/delivery/.next/static
COPY --chown=node:node --from=builder /app/apps/delivery/public ./apps/delivery/public

EXPOSE 3002
CMD ["node", "apps/delivery/server.js"]
