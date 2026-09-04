# Gadget Purchase Tracker — Technical Specification (v1.1)

**Author:** Rifat Sarker
**Purpose:** Personal full-stack project to log and track tech gadget purchases (phones, laptops, computers, hubs, cables, pendrives, etc.) going forward. Source code is public (portfolio), live data is private (owner-only), with a sanitized public view for visitors.

This document is written to be handed directly to a developer or an AI coding agent for implementation. It defines architecture, data models, API contracts, business rules, and required advanced features — not just basic CRUD.

---

## 1. Project Overview

A single-user (owner-only write access) full-stack application where the owner logs every tech gadget/accessory they purchase, with photos of the receipt/memo, price, warranty info, and specs. The public internet can view a **sanitized, non-sensitive version** of the catalog (useful as a portfolio showcase); only the authenticated owner sees sensitive financial and personal data.

This is **not** a historical archive — it does not need to backfill past purchases. It starts tracking from the day it's deployed, going forward.

### 1.1 Goals
- Practical daily-use tool: log a gadget purchase in under a minute.
- Public-facing catalog that looks credible as a portfolio project (not "just another CRUD app").
- Demonstrates production-grade full-stack engineering: validation, auth, caching, background jobs, aggregation, rate limiting, file handling, and a real Next.js frontend — not a Postman-only backend demo.

### 1.2 Non-Goals
- Multi-user support / team accounts (single owner only, no user registration flow).
- Historical data migration or bulk import from old receipts.
- E-commerce integration (no auto-fetching prices from stores) — that's a future idea, not v1.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Language | TypeScript | Strict mode on, both apps |
| Backend Runtime | Node.js | LTS version |
| Backend Framework | Express.js | Follows existing controller-service-route convention |
| Database | PostgreSQL | Relational, but `specs` uses a `Json` column for flexible per-category attributes (a phone has IMEI/storage, a cable just has length) |
| ORM | Prisma | Type-safe client, migrations, schema-as-source-of-truth |
| Cache | Redis | Cache public product listing + analytics aggregates |
| File Storage | Cloudinary | Receipt/memo images and reference images |
| Auth | JWT (access + refresh token) | Single hardcoded owner account via env vars — no public registration |
| Validation | Zod | Schema validation at the controller boundary (backend) and form boundary (frontend) |
| Background Jobs | node-cron | Daily warranty-expiry check |
| Email | Nodemailer (SMTP) or Resend | Warranty expiry notification delivery |
| Frontend Framework | Next.js (App Router) | Public catalog + owner dashboard in one app |
| Styling | Tailwind CSS + Shadcn UI | Matches existing frontend stack |
| Frontend State/Data | Redux Toolkit + RTK Query | RTK Query slice consumes the Express REST API — no need for a second data-fetching library |
| Forms | React Hook Form + Zod | Client-side validation mirroring backend schemas |
| Charts | Recharts | Analytics dashboard |
| Deployment | Docker + Nginx + VPS | Matches existing deployment stack |
| Logging | Winston or Pino | Structured logs, request logging via morgan in dev |

---

## 3. Required Coding Conventions (Backend)

The agent implementing this **must** follow these conventions exactly — they are non-negotiable, not suggestions:

- **Modular architecture:** `route → controller → service` for every module. Controllers never contain business logic; services never touch `req`/`res`.
- **`catchAsync` wrapper** around every async controller function for error handling (no manual try/catch in controllers).
- **`sendResponse` utility** for all successful responses — standardized shape:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Product retrieved successfully",
    "data": { }
  }
  ```
- **`http-status` package** for all status codes — never hardcode numeric status codes.
- **Centralized error handler middleware** — all errors (Zod validation, Prisma errors, JWT, custom `AppError`) funnel through one Express error-handling middleware and return a consistent error shape.
- **No business logic in routes.** Routes only wire `path + middleware + controller`.
- **Prisma Client is only ever called from the service layer** (`prisma.product.*`) — never directly from controllers. Use a single Prisma Client singleton (`lib/prisma.ts`), never instantiate `new PrismaClient()` per request.

---

## 4. Backend Folder Structure

```
apps/api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   ├── index.ts              # env var loader/validator
│   │   └── cloudinary.config.ts
│   ├── lib/
│   │   └── prisma.ts             # PrismaClient singleton
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   ├── product/
│   │   │   ├── product.route.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.validation.ts
│   │   │   ├── product.constant.ts
│   │   │   └── product.dto.ts     # public/private response shaping
│   │   ├── analytics/
│   │   │   ├── analytics.route.ts
│   │   │   ├── analytics.controller.ts
│   │   │   └── analytics.service.ts
│   │   └── warranty/
│   │       ├── warranty.cron.ts
│   │       └── warranty.service.ts
│   ├── middlewares/
│   │   ├── auth.ts                # attaches req.user if valid token; does NOT block if absent
│   │   ├── requireAuth.ts         # blocks if no valid token (for owner-only routes)
│   │   ├── validateRequest.ts     # Zod middleware
│   │   ├── rateLimiter.ts
│   │   ├── globalErrorHandler.ts
│   │   └── notFound.ts
│   ├── utils/
│   │   ├── catchAsync.ts
│   │   ├── sendResponse.ts
│   │   ├── AppError.ts
│   │   └── generateCsv.ts
│   └── types/
│       └── express.d.ts           # extends Request with `user`
```

> Note: Prisma generates the `Product` type automatically from `schema.prisma` — there is no separate `product.model.ts` file like you'd have with Mongoose. The schema file is the single source of truth for the shape of the data.

---

## 5. Data Model (Prisma Schema)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Category {
  PHONE
  LAPTOP
  DESKTOP
  MONITOR
  HUB
  CABLE
  PENDRIVE
  KEYBOARD
  MOUSE
  HEADPHONE
  CHARGER
  OTHER
}

enum ProductStatus {
  ACTIVE
  SOLD
  GIFTED
  BROKEN
  LOST
}

model Product {
  id               String        @id @default(cuid())
  name             String
  category         Category
  brand            String?
  model            String?

  // Flexible key-value specs — e.g. { "ram": "16GB", "storage": "512GB SSD", "color": "Space Gray" }
  specs            Json          @default("{}")

  // PUBLIC — copyright-free reference image (manufacturer press image / stock photo), not a personal photo
  referenceImage   String?

  // SENSITIVE — owner-only
  price            Float
  currency         String        @default("BDT")
  purchaseDate     DateTime
  purchasedFrom    String?
  warrantyExpiry   DateTime?
  serialNumber     String?
  receiptImages    String[]      // Cloudinary URLs — memo/receipt only
  notes            String?

  status           ProductStatus @default(ACTIVE)
  tags             String[]
  warrantyNotified Boolean       @default(false) // prevents duplicate reminder emails

  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@index([category])
  @@index([purchaseDate])
  @@index([warrantyExpiry])
  @@index([status])
}
```

> Search note: Prisma + Postgres doesn't get a free text index the way Mongoose gives you out of the box. v1 uses case-insensitive `contains` filtering across `name`/`brand`/`model` (see §10.4). If the catalog grows large enough that this feels slow, add the Postgres `pg_trgm` extension with a GIN index via a raw migration — documented as a future optimization, not required for v1.

### 5.1 Field Classification (drives the visibility logic in §6)

| Field | Visibility |
|---|---|
| name, category, brand, model, specs, referenceImage, tags, status | **Public** |
| purchaseDate → exposed only as `ownedSinceYear` (derived) | **Public (derived only)** |
| price, currency, purchaseDate (exact), purchasedFrom, warrantyExpiry, serialNumber, receiptImages, notes | **Owner-only** |

---

## 6. Access Control & Visibility Logic

There is **one dataset**, not two. Visibility is enforced at the response-serialization layer (DTO), not by duplicating routes or filtering at the query level. This keeps the API surface small and avoids drift between "public" and "private" logic paths.

### 6.1 Auth Middleware Behavior

- `attachUserIfPresent` — runs on **all** GET routes. If a valid JWT is present, sets `req.user`; if absent or invalid, does **not** throw — just proceeds with `req.user = undefined`.
- `requireAuth` — runs on all mutation routes (`POST`, `PATCH`, `DELETE`) and any analytics/export routes. Throws `401` if no valid token.

### 6.2 Response DTO

```ts
// product.dto.ts
import type { Product } from "@prisma/client";

export function toProductDTO(product: Product, isOwner: boolean) {
  const publicShape = {
    id: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    model: product.model,
    specs: product.specs,
    referenceImage: product.referenceImage,
    tags: product.tags,
    status: product.status,
    ownedSinceYear: product.purchaseDate.getFullYear(),
  };

  if (!isOwner) return publicShape;

  return {
    ...publicShape,
    price: product.price,
    currency: product.currency,
    purchaseDate: product.purchaseDate,
    purchasedFrom: product.purchasedFrom,
    warrantyExpiry: product.warrantyExpiry,
    serialNumber: product.serialNumber,
    receiptImages: product.receiptImages,
    notes: product.notes,
  };
}
```

Every service method that returns product(s) accepts `isOwner: boolean` (derived from `!!req.user` in the controller) and maps results through `toProductDTO` before calling `sendResponse`.

---

## 7. Authentication

Single-owner system — no public signup.

- Owner credentials (email + bcrypt-hashed password) seeded via env vars or a one-time Prisma seed script (`prisma/seed.ts`) into a minimal `User` table — or hardcoded via env vars if you'd rather skip a `User` model entirely for something this small.
- `POST /api/v1/auth/login` → validates credentials → returns `accessToken` (short-lived, ~15min) + `refreshToken` (long-lived, ~7d, httpOnly cookie).
- `POST /api/v1/auth/refresh` → issues new access token from valid refresh token.
- `POST /api/v1/auth/logout` → clears refresh token cookie.
- Passwords hashed with bcrypt (cost factor 12).

---

## 8. API Endpoints

Base path: `/api/v1`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Owner login |
| POST | `/auth/refresh` | Public (cookie) | Refresh access token |
| POST | `/auth/logout` | Owner | Clear session |
| GET | `/products` | Optional | List products — sanitized for public, full for owner. Supports query params below |
| GET | `/products/:id` | Optional | Single product — sanitized or full depending on auth |
| POST | `/products` | Owner | Create product (multipart: fields + `referenceImage` + `receiptImages[]`) |
| PATCH | `/products/:id` | Owner | Update product |
| DELETE | `/products/:id` | Owner | Soft delete (set status) or hard delete — see §10.7 |
| GET | `/products/export/csv` | Owner | Export full purchase history as CSV |
| GET | `/analytics/summary` | Owner | Total spend, total items, avg price |
| GET | `/analytics/by-category` | Owner | Spend grouped by category |
| GET | `/analytics/by-month` | Owner | Spend over time (monthly buckets) |
| GET | `/analytics/upcoming-warranty` | Owner | Products with warranty expiring in next 30 days |

### 8.1 `GET /products` Query Parameters

| Param | Type | Description |
|---|---|---|
| `search` | string | Case-insensitive search across name/brand/model/tags |
| `category` | string | Filter by category |
| `status` | string | Filter by status |
| `tags` | string (comma-separated) | Filter by tags |
| `sortBy` | string | `purchaseDate` \| `price` \| `name` |
| `sortOrder` | `asc` \| `desc` | Default `desc` |
| `page` | number | Default 1 |
| `limit` | number | Default 10, max 50 |

> Note: for unauthenticated requests, sorting by `price` or `purchaseDate` is still allowed **at the query level** (the DB has the real values) even though the field is stripped from the response — this lets public visitors sort a showcase by "recency" without exposing the value. Document this clearly in code comments since it's a subtle intentional exception.

---

## 9. Frontend Architecture (Next.js)

One Next.js app serves both the public catalog and the owner-only dashboard — no need for two separate frontend apps.

### 9.1 Folder Structure

```
apps/web/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # public catalog grid
│   │   └── products/[id]/page.tsx      # public product detail
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # protected layout, checks auth
│   │   ├── dashboard/page.tsx          # owner product table + quick stats
│   │   ├── dashboard/products/new/page.tsx
│   │   ├── dashboard/products/[id]/edit/page.tsx
│   │   └── dashboard/analytics/page.tsx
│   └── layout.tsx                      # root layout
├── components/
│   ├── ui/                             # shadcn components
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx                 # React Hook Form + Zod, shared by create/edit
│   └── charts/
│       ├── CategorySpendChart.tsx
│       └── MonthlySpendChart.tsx
├── lib/
│   ├── store.ts                        # Redux store setup
│   ├── api/
│   │   └── productsApi.ts              # RTK Query API slice
│   └── auth.ts                         # token/session helpers
├── middleware.ts                       # route protection for /dashboard/*
└── next.config.js                      # whitelist Cloudinary domain for next/image
```

### 9.2 Rendering Strategy

- **Public pages** (`/`, `/products/[id]`) — Server Components fetching directly from the API with time-based revalidation (`fetch(url, { next: { revalidate: 60 } })`). This is a low-write catalog, so ISR-style revalidation is enough — no need for real-time updates on public pages. Good for SEO on a portfolio page too.
- **Dashboard pages** — Client Components using RTK Query, since they're interactive (forms, mutations, optimistic updates) and don't need SEO.

### 9.3 Auth Flow on the Frontend

- Access token kept in memory (Redux state), **not** `localStorage`, to reduce XSS exposure.
- Refresh token lives in the httpOnly cookie set by the backend (§7) — the browser can't read it directly, which is the point.
- On app load, silently call `/auth/refresh` to rehydrate the access token if a valid refresh cookie exists.
- `middleware.ts` checks for the refresh cookie's presence on `/dashboard/*` routes and redirects to `/login` if missing (a cheap presence check; the real authorization still happens API-side on every request).

### 9.4 Image Handling

- Use `next/image` for both `referenceImage` (public pages) and `receiptImages` (dashboard only).
- Add the Cloudinary hostname to `images.remotePatterns` in `next.config.js`.

---

## 10. Advanced Features (Required — Must Implement)

These are not optional extras. The project must not ship as a bare CRUD app.

### 10.1 Warranty Expiry Notifications
- `node-cron` job runs daily (e.g. 8:00 AM server time).
- Query via Prisma: `warrantyExpiry` between now and now+30 days, `warrantyNotified: false`.
- Send an email (Nodemailer/Resend) to the owner listing all products expiring soon.
- Set `warrantyNotified: true` after sending to avoid duplicate emails.
- Reset `warrantyNotified` to `false` if `warrantyExpiry` is edited (in the update service).

### 10.2 Analytics Dashboard (Prisma Aggregation)
- **Summary:** `prisma.product.aggregate({ _sum: { price: true }, _count: true, _avg: { price: true } })`.
- **By category:** `prisma.product.groupBy({ by: ["category"], _sum: { price: true }, _count: true })` — powers a pie/bar chart.
- **By month:** Prisma's `groupBy` can't truncate dates, so use a raw query: `prisma.$queryRaw` with `DATE_TRUNC('month', "purchaseDate")` grouped and summed — powers a spend-over-time line chart.
- All analytics routes are owner-only (they operate on sensitive `price` data).
- Cache analytics results in Redis with a short TTL (e.g. 5 minutes), invalidated on product create/update/delete, since aggregations are more expensive than simple finds.

### 10.3 CSV Export
- `GET /products/export/csv` streams a CSV of the owner's full purchase history (all fields, including sensitive ones — this is an owner-only route).
- Use a streaming CSV library (e.g. `fast-csv`) rather than building the whole string in memory, in case the collection grows.

### 10.4 Search, Filter, Sort, Pagination
- Implemented via the query params in §8.1.
- `search` uses `OR` with `contains` + `mode: "insensitive"` across `name`, `brand`, `model`; see the `pg_trgm` note in §5 if this needs to scale later.
- Always paginate — never return unbounded result sets (`skip`/`take` in Prisma).

### 10.5 Redis Caching for Public Reads
- Cache `GET /products` (public, unauthenticated variant only) and `GET /products/:id` (public variant) in Redis, keyed by the full query string.
- TTL: 60–120 seconds is enough — this is a low-write personal catalog, not a high-frequency-update system.
- Invalidate (or let TTL expire naturally) on any product mutation. For a project this size, TTL-based expiry is simpler and sufficient — don't build a complex invalidation graph.
- **Never cache the owner (authenticated) response** — only the public-shape response, to avoid ever accidentally serving sensitive data from a shared cache key.

### 10.6 Rate Limiting
- Apply `express-rate-limit` globally, stricter on `/auth/login` (e.g. 5 attempts / 15 min per IP) to prevent brute-forcing the single owner account.
- Public `GET /products` gets a more generous limit than mutation routes.

### 10.7 Soft Delete via Status
- Prefer setting `status: "SOLD" | "GIFTED" | "BROKEN" | "LOST"` over hard-deleting records — preserves purchase history/analytics accuracy.
- Provide a separate `DELETE /products/:id?hard=true` owner-only escape hatch for actual removal (e.g. duplicate entry cleanup), clearly distinct from the normal soft-delete flow.

### 10.8 Receipt/Memo Image Handling
- Only **memo/receipt photos** are uploaded by the owner (no personal "owned product" photo).
- `referenceImage` is a copyright-free product image (manufacturer press kit, stock photo, or similar) — sourced manually at data-entry time, not scraped automatically.
- Validate uploads: mime type whitelist (`image/jpeg`, `image/png`, `image/webp`), max file size (e.g. 5MB), max count per product (e.g. 5 receipt images).
- Use Cloudinary upload presets to auto-generate a smaller thumbnail alongside the original for list views.

---

## 11. Validation (Zod)

Define a Zod schema per operation (`createProductSchema`, `updateProductSchema`, `loginSchema`, etc.) and enforce via a `validateRequest(schema)` middleware before the controller runs. Key rules:
- `name`, `category`, `price`, `purchaseDate` required on create.
- `price` must be a positive number.
- `category` must be one of the Prisma enum values.
- `warrantyExpiry` (if present) must be a valid date ≥ `purchaseDate`.
- Reject unknown fields (`.strict()`) to prevent silent typos from being ignored.
- Mirror the same shape (not literally shared code across separate apps unless you set up a monorepo shared package) in the frontend's React Hook Form resolvers, so validation errors match between client and server.

---

## 12. Security Requirements

- `helmet` for HTTP headers.
- `cors` configured with an explicit allow-list (your Next.js frontend origin + localhost in dev) — not `*`.
- JWT secrets, DB URI, Cloudinary keys, SMTP credentials — all via environment variables, never hardcoded.
- Refresh token stored as `httpOnly`, `secure`, `sameSite=strict` cookie.
- Input validation on every mutation route (§11) — never trust client input, including file mimetype (validate server-side, not just by extension).
- Global error handler must never leak stack traces, Prisma error internals, or other implementation details in production responses.

---

## 13. Environment Variables

**Backend (`apps/api/.env`)**
```
NODE_ENV=
PORT=
DATABASE_URL=postgresql://user:password@host:5432/gadget_tracker?schema=public
REDIS_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
OWNER_EMAIL=
OWNER_PASSWORD_HASH=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
NOTIFICATION_EMAIL_TO=
CORS_ALLOWED_ORIGINS=
```

**Frontend (`apps/web/.env.local`)**
```
NEXT_PUBLIC_API_BASE_URL=
```

---

## 14. Non-Functional Requirements

- **Health check:** `GET /health` — no auth, returns DB/Redis connection status, used for uptime monitoring and Docker healthchecks.
- **Graceful shutdown:** handle `SIGTERM`/`SIGINT` — close HTTP server, Prisma connection, and Redis connection cleanly.
- **Logging:** structured request logs (method, path, status, duration) in production; verbose `morgan('dev')` logging in development only.
- **Indexes:** ensure indexes defined in §5 (`@@index` on `category`, `purchaseDate`, `warrantyExpiry`, `status`) are present after migration — verify with `EXPLAIN ANALYZE` on the main list query once seeded with sample data.

---

## 15. Deployment

- Multi-stage `Dockerfile` for `apps/api` (build stage compiles TypeScript + runs `prisma generate`, runtime stage runs compiled JS only — keeps the image lean).
- `docker-compose.yml` for local dev: api + web + postgres + redis.
- Run `npx prisma migrate deploy` as part of the deployment pipeline (before starting the API container) — never `migrate dev` in production.
- The Next.js app (`apps/web`) can be deployed on the same VPS behind Nginx (separate port, reverse-proxied) or independently on Vercel if you'd rather not manage its process yourself — either works, pick whichever is less operational overhead for you.
- Nginx reverse proxy in front of both the Node API and (if self-hosted) the Next.js app, with SSL via Let's Encrypt.
- `.env` files excluded from the repo (`.gitignore`) — only `.env.example` committed with placeholder values.

---

## 16. Suggested Build Order

1. Monorepo scaffold (`apps/api`, `apps/web`) + `prisma init` + first migration + `catchAsync`/`sendResponse`/`AppError` utils + global error handler.
2. Auth module (login/refresh/logout) with single owner account.
3. Product model (Prisma) + CRUD (owner-only first, no public view yet).
4. Public visibility layer (DTO + optional-auth middleware) on top of existing CRUD.
5. Search/filter/sort/pagination.
6. Cloudinary upload integration (receipt images + manual referenceImage URL field).
7. Next.js scaffold: public catalog + product detail pages consuming the API.
8. Login page + protected dashboard shell (middleware-based route protection).
9. Dashboard product create/edit forms (React Hook Form + Zod) wired to RTK Query.
10. Redis caching on public reads.
11. Analytics endpoints (Prisma aggregation) + dashboard charts (Recharts).
12. Warranty cron job + email notifications.
13. CSV export.
14. Rate limiting + security hardening pass.
15. Dockerize + deploy.

---

## 17. Future Feature Ideas (Not in v1 Scope)

- OCR-based receipt parsing (auto-extract price/date/seller from an uploaded receipt photo using an AI vision model) to reduce manual data entry.
- Browser extension or Telegram/WhatsApp bot to add a purchase on the go by forwarding an order confirmation.
- Public "portfolio mode" toggle that generates a shareable read-only link with seeded/demo data instead of real purchases, for showing recruiters without exposing your real catalog.
- Depreciation/resale-value tracking per item over time.
- Multi-currency support with live exchange-rate conversion for a unified "total spend" figure.
- Barcode/IMEI scanner (mobile camera) for faster product entry.
- Integration with a price-tracking API to alert you if you significantly overpaid compared to market price at purchase time.
- "Total cost of ownership" view combining purchase price + any repair/accessory costs logged against the same item.
