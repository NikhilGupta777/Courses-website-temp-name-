# System Architecture
## AI Courses Platform — "LearnAI"

---

## 1. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | SSR/SSG for SEO, React Server Components for performance |
| **UI Library** | Tailwind CSS + shadcn/ui + Framer Motion | Modern, accessible, highly customizable components with smooth animations |
| **State Management** | Zustand + React Query (TanStack) | Lightweight global state + powerful server state caching |
| **Backend** | Next.js API Routes + tRPC | End-to-end type safety, co-located with frontend |
| **Database** | PostgreSQL (via Supabase or Neon) | Relational, ACID, great for complex queries |
| **ORM** | Prisma | Type-safe DB access, migrations, seeding |
| **Authentication** | NextAuth.js (Auth.js v5) | OAuth + credentials, session management, role-based |
| **Payments** | Stripe | Subscriptions, one-time, coupons, webhooks |
| **Video Hosting** | Mux or Cloudflare Stream | Adaptive bitrate, DRM, analytics |
| **File Storage** | AWS S3 / Cloudflare R2 | Course assets, thumbnails, certificates |
| **Real-time** | Socket.io or Ably | Live chat, notifications, presence |
| **Video Calls** | Daily.co or LiveKit | WebRTC-based live classes |
| **Email** | Resend + React Email | Transactional emails (welcome, receipt, reminders) |
| **Search** | Meilisearch or Algolia | Full-text course search with faceted filters |
| **Caching** | Redis (Upstash) | Session cache, rate limiting, leaderboard |
| **Queue/Jobs** | BullMQ (Redis-backed) | Video transcoding, certificate generation, emails |
| **CDN** | Cloudflare / Vercel Edge | Static assets, edge caching |
| **Monitoring** | Sentry + Vercel Analytics | Error tracking, performance monitoring |
| **CI/CD** | GitHub Actions + Vercel | Automated testing, preview deploys, production |
| **Containerization** | Docker (optional) | Local dev parity, self-hosted option |

---

## 2. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                 │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Next.js    │  │   PWA/Mobile │  │  Admin Panel │               │
│  │   Frontend   │  │   (React)    │  │  (Next.js)   │               │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │
└─────────┼──────────────────┼──────────────────┼──────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                     │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────┐         │
│  │              Next.js API Routes + tRPC                    │         │
│  │                                                           │         │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │         │
│  │  │  Auth   │ │ Courses │ │Payments │ │  Media  │       │         │
│  │  │ Router  │ │ Router  │ │ Router  │ │ Router  │       │         │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │         │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │         │
│  │  │  Quiz   │ │  Cert   │ │  Users  │ │  Admin  │       │         │
│  │  │ Router  │ │ Router  │ │ Router  │ │ Router  │       │         │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │         │
│  └─────────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                                   │
│                                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │  Stripe  │ │   Mux    │ │  Redis   │ │ BullMQ   │               │
│  │ Payments │ │  Video   │ │  Cache   │ │  Queues  │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │  Resend  │ │ LiveKit  │ │Meilisearch│ │   S3    │               │
│  │  Email   │ │  WebRTC  │ │  Search  │ │ Storage  │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                      │
│                                                                       │
│  ┌─────────────────────────┐  ┌─────────────────────────┐           │
│  │    PostgreSQL (Neon)    │  │    Redis (Upstash)      │           │
│  │                         │  │                         │           │
│  │  • Users & Profiles     │  │  • Sessions             │           │
│  │  • Courses & Content    │  │  • Rate Limiting        │           │
│  │  • Enrollments          │  │  • Leaderboard          │           │
│  │  • Quizzes & Results    │  │  • Cache                │           │
│  │  • Payments & Subs      │  │  • Real-time Presence   │           │
│  │  • Certificates         │  │                         │           │
│  └─────────────────────────┘  └─────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Frontend Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public pages (no auth required)
│   │   ├── page.tsx              # Homepage
│   │   ├── courses/              # Catalog & detail
│   │   ├── pricing/              # Pricing page
│   │   ├── about/                # About page
│   │   └── blog/                 # Blog
│   ├── (auth)/                   # Auth pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Authenticated user area
│   │   ├── dashboard/            # User dashboard
│   │   ├── courses/[id]/learn/   # Course player
│   │   ├── certificates/         # Certificate gallery
│   │   ├── profile/              # User profile
│   │   └── settings/             # User settings
│   ├── (instructor)/             # Instructor portal
│   │   ├── studio/               # Course builder
│   │   ├── analytics/            # Instructor analytics
│   │   └── payouts/              # Payout management
│   ├── (admin)/                  # Admin panel
│   │   ├── users/
│   │   ├── courses/
│   │   ├── revenue/
│   │   └── settings/
│   ├── api/                      # API routes
│   │   ├── trpc/[trpc]/          # tRPC handler
│   │   ├── webhooks/             # Stripe, Mux webhooks
│   │   └── upload/               # File upload endpoints
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # Shared UI components
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/                   # Header, Footer, Sidebar
│   ├── course/                   # Course-specific components
│   ├── quiz/                     # Quiz components
│   ├── video/                    # Video player components
│   └── common/                   # Buttons, Cards, Modals
├── lib/                          # Utilities & configs
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # Auth config
│   ├── stripe.ts                 # Stripe client
│   ├── trpc/                     # tRPC setup
│   ├── validators/               # Zod schemas
│   └── utils.ts                  # Helper functions
├── server/                       # Server-side code
│   ├── routers/                  # tRPC routers
│   ├── services/                 # Business logic
│   └── jobs/                     # Background job handlers
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
├── types/                        # TypeScript types
└── styles/                       # Additional styles
```

---

## 4. Key Design Decisions

### 4.1 Monorepo vs Polyrepo
**Decision: Monorepo (single Next.js app)**
- Rationale: Faster development, shared types, simpler deployment
- Admin panel as route group, not separate app
- Can extract microservices later if needed

### 4.2 API Design: tRPC
**Decision: tRPC over REST**
- End-to-end type safety (no codegen needed)
- Automatic input validation with Zod
- Smaller bundle, better DX
- REST endpoints only for webhooks & third-party integrations

### 4.3 Video Strategy
**Decision: Mux for video hosting**
- HLS adaptive streaming out of the box
- Thumbnail generation
- DRM protection for paid content
- Analytics (engagement, buffering)
- Webhook-based transcoding status

### 4.4 Authentication Strategy
**Decision: Auth.js v5 with multiple providers**
- Google, GitHub, Email/Password
- Role-based access: Student, Instructor, Admin
- JWT sessions for API, database sessions for web
- Middleware-based route protection

### 4.5 Payment Architecture
**Decision: Stripe with webhook-driven state**
- Checkout Sessions for purchases
- Stripe Billing for subscriptions
- Customer Portal for self-service
- Webhook handlers for all state changes
- Idempotent processing with event deduplication

---

## 5. Deployment Architecture

```
                    ┌─────────────┐
                    │  Cloudflare │
                    │     CDN     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Vercel    │
                    │  (Next.js)  │
                    │             │
                    │ • SSR/SSG   │
                    │ • API Routes│
                    │ • Edge Fn   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
   │    Neon     │ │   Upstash   │ │     Mux     │
   │ PostgreSQL  │ │    Redis    │ │    Video    │
   └─────────────┘ └─────────────┘ └─────────────┘
```

---

## 6. Security Architecture

| Layer | Measure |
|-------|---------|
| Transport | TLS 1.3 everywhere |
| Authentication | Auth.js + CSRF tokens + rate limiting |
| Authorization | Role-based middleware + row-level security |
| Input Validation | Zod schemas on all inputs (tRPC) |
| SQL Injection | Prisma parameterized queries |
| XSS | React auto-escaping + CSP headers |
| CORS | Strict origin whitelist |
| Rate Limiting | Redis-based per-IP and per-user limits |
| Secrets | Environment variables, never in code |
| Payments | Stripe webhook signature verification |
| Video | Signed URLs with expiry for premium content |

---

## 7. Performance Strategy

| Technique | Application |
|-----------|------------|
| **SSG** | Homepage, pricing, blog (rebuild on content change) |
| **ISR** | Course catalog (revalidate every 60s) |
| **SSR** | Dashboard, course player (personalized) |
| **Edge Caching** | API responses with stale-while-revalidate |
| **Image Optimization** | Next.js Image with Cloudflare |
| **Code Splitting** | Dynamic imports for heavy components (video player, code editor) |
| **Prefetching** | Link prefetch for likely navigation |
| **DB Indexing** | Composite indexes on hot queries |
| **Connection Pooling** | PgBouncer / Neon serverless driver |
