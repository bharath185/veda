# ShopFlow — Enterprise Multi-Vendor E-Commerce Platform

ShopFlow is a production-grade, multi-vendor-capable e-commerce platform engineered with a modular monolith architecture, distinct desktop and mobile component trees, real-time WebSocket courier tracking, Indian (Razorpay/UPI) and international (Stripe) payments, Instagram attribution share generators, and OWASP Top 10 security hardening.

---

## 🏗️ Architecture & Monorepo Structure

```
shopflow/
├── apps/
│   ├── api/                   # NestJS Modular Monolith Backend (Port 4000)
│   │   ├── src/
│   │   │   ├── auth/          # JWT rotation, Argon2id, 2FA TOTP, lockout
│   │   │   ├── products/      # Catalog, Trigram search, JSON-LD, CSV import
│   │   │   ├── cart/          # Cart management & stock calculation
│   │   │   ├── payments/      # Razorpay + Stripe, Webhooks HMAC, Idempotency
│   │   │   ├── orders/        # State machine, cancellations & returns
│   │   │   ├── delivery/      # Courier assignments, GPS pings, Socket.IO
│   │   │   ├── share/         # Instagram nanoid links, captions, dynamic OG
│   │   │   ├── analytics/     # Real-time KPIs, funnels, cohort turnover
│   │   │   └── health/        # /health & /ready probes
│   │   └── Dockerfile         # Multi-stage non-root container
│   │
│   ├── web/                   # Next.js 14 App Router Customer Storefront (Port 3000)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── desktop/   # Mega menu, Cmd+K search, side-by-side checkout
│   │   │   │   └── mobile/    # Bottom nav, swipe carousels, 1-question checkout
│   │   │   ├── hooks/         # useIsMobile() viewport & UA detector
│   │   │   └── store/         # Zustand cart state
│   │   └── public/manifest.json # PWA Offline Manifest
│   │
│   ├── admin/                 # Next.js 14 Admin Control Center (Port 3001)
│   │   └── src/app/page.tsx   # Real-time KPIs, charts, inventory alerts, fleet
│   │
│   └── delivery/              # Next.js 14 Delivery Partner App (Port 3002)
│       └── src/app/page.tsx   # Route list, live GPS broadcast, OTP proof of delivery
│
├── packages/
│   ├── shared/                # Zod schemas, TypeScript types, Enums & UTM helpers
│   ├── db/                    # Prisma schema, migrations & 50-product seed script
│   └── ui/                    # Design tokens, formatters & UI primitives
│
├── infra/
│   ├── nginx/                 # Reverse proxy, SSL, security headers & WebSocket config
│   ├── terraform/             # AWS IaC (VPC, Multi-AZ RDS, S3, CloudFront, ALB)
│   └── k8s/                   # Kubernetes deployment & service manifests
│
├── tests/
│   ├── e2e/                   # Playwright mobile & desktop end-to-end tests
│   └── load/                  # k6 1,000 concurrent user load test
│
├── docker-compose.yml         # Local Docker setup (Postgres, Redis, API, Web, Nginx)
├── ShopFlow.postman_collection.json # Complete API collection
└── .env.example               # Full environment variable configuration reference
```

---

## ⚡ Quick Start & Local Development

### Prerequisites
- Node.js >= 20 (v22 recommended)
- pnpm >= 9 (or npm)
- Docker & Docker Compose (optional, for Postgres + Redis)

### 1. Installation
```bash
# Clone the repository
git clone <repo-url>
cd valiant-mendeleev

# Install dependencies across all monorepo workspaces
pnpm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

### 3. Database Migration & Seed
```bash
# Generate Prisma Client
pnpm db:generate

# Apply Migrations
pnpm db:migrate

# Seed 50 real e-commerce products, 10 categories, and test user accounts
pnpm db:seed
```

### 4. Running the Platform
```bash
# Start all apps concurrently via Turborepo
pnpm dev
```

App Access URLs:
- **Customer Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin Control Center:** [http://localhost:3001](http://localhost:3001)
- **Delivery Partner App:** [http://localhost:3002](http://localhost:3002)
- **Backend API & Swagger Docs:** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 🔑 Pre-Configured Test Accounts (From Database Seed)

| Role | Email | Password | Details |
|---|---|---|---|
| **Super Admin** | `admin@shopflow.io` | `ShopFlow@1234` | Full access to KPIs, orders, inventory alerts |
| **Delivery Agent** | `delivery@shopflow.io` | `ShopFlow@1234` | Scooter KA-01-EQ-9988, live GPS & OTP verify |
| **Customer** | `customer@shopflow.io` | `ShopFlow@1234` | Address in Indiranagar, Bangalore + pre-filled cart |
| **Vendor** | `vendor@shopflow.io` | `ShopFlow@1234` | UrbanStyle Brands distributor |

---

## 🛡️ Security Hardening Checklist (OWASP Top 10 + PCI-DSS)

- [x] **Argon2id Password Hashing:** Salted key derivation with pbkdf2 fallback.
- [x] **Account Lockout:** 5 consecutive failed attempts lock user account for 15 minutes.
- [x] **JWT Rotation & Revocation:** 15-minute access token + 7-day refresh token with Redis blacklist.
- [x] **TOTP 2FA:** RFC 6238 two-factor authentication via `otplib` & QR code generation.
- [x] **PCI-DSS SAQ-A Compliance:** Zero storage of raw credit card PAN or CVV; only tokenized intents via Razorpay/Stripe.
- [x] **HMAC Signature Verification:** Razorpay & Stripe webhooks validated with raw payload buffers.
- [x] **Idempotency Keys:** Stored on payment mutations to prevent double-charges.
- [x] **Rate Limiting:** IP and user-based throttling (100 req/min) via express-rate-limit.
- [x] **Security Headers:** Helmet.js with CSP, HSTS, frameguard, and non-root Docker runners.

---

## 📸 Instagram Share Link Generator

The `/share/generate` API allows merchants to generate viral social links with:
1. **Short Codes:** 8-character `nanoid` short URLs (`/s/:shortCode`) that track clicks, conversions, and revenue.
2. **Dynamic OG Images:** Generates SVG assets on the fly:
   - `1080x1080` (Instagram Square Post)
   - `1080x1920` (Instagram Story Sticker)
   - `1200x630` (WhatsApp & Twitter Cards)
3. **Automated Captions:** Generates copy-paste Instagram captions with emojis, auto-hashtags, discount percentages, and link in bio notes.
4. **Deep Linking:** Formats `shopflow://product/:slug` with automatic web fallback.

---

## 🧪 Testing Suites

```bash
# Run API Unit & Integration Tests
pnpm --filter @shopflow/api test

# Run E2E Playwright Tests (Desktop & Mobile viewports)
pnpm test:e2e

# Run k6 Load Test (1,000 concurrent users)
k6 run tests/load/k6-checkout.js
```

---

## 🚢 Docker & Production Deployment

```bash
# Build and run complete multi-container stack with Nginx
docker-compose up -d --build
```
