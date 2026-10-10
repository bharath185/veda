# Multi-stage Dockerfile for ShopFlow Customer Web Storefront
FROM node:22-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm@11.5.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json tsconfig.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @shopflow/shared build
RUN pnpm --filter @shopflow/ui build
RUN pnpm --filter @shopflow/web build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
USER node

COPY --chown=node:node --from=builder /app/apps/web/.next/standalone ./
COPY --chown=node:node --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --chown=node:node --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
