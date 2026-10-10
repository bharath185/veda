# Multi-stage Dockerfile for ShopFlow Admin Dashboard
FROM node:22-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm@11.5.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json tsconfig.json ./
COPY packages/ ./packages/
COPY apps/admin/ ./apps/admin/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @shopflow/shared build
RUN pnpm --filter @shopflow/ui build
RUN pnpm --filter @shopflow/admin build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
USER node

COPY --chown=node:node --from=builder /app/apps/admin/.next/standalone ./
COPY --chown=node:node --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --chown=node:node --from=builder /app/apps/admin/public ./apps/admin/public

EXPOSE 3001
CMD ["node", "apps/admin/server.js"]
