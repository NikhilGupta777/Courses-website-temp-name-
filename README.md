# LearnAI - AI Courses Platform

A premium, modern AI education platform offering live classes, offline workshops, pre-recorded video courses, interactive quizzes, timed tests, completion certificates, and flexible pricing.

## Overview

LearnAI is a full-stack web application built with cutting-edge technologies to deliver the best possible learning experience for AI/ML education.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui + Framer Motion |
| State | Zustand + TanStack React Query |
| Backend | Next.js API Routes + tRPC |
| Database | PostgreSQL (Neon) + Prisma ORM |
| Auth | Auth.js v5 (NextAuth) |
| Payments | Stripe |
| Video | Mux |
| Storage | AWS S3 / Cloudflare R2 |
| Cache | Redis (Upstash) |
| Email | Resend |
| Search | Meilisearch |

## Features

- **Multi-mode Courses**: Live online, offline workshops, pre-recorded, hybrid
- **Rich Content**: Video lessons, articles, code exercises
- **Assessments**: Quizzes, timed tests, coding assignments
- **Certificates**: Auto-generated, verifiable, shareable
- **Subscriptions**: Free, Pro Monthly ($29), Pro Annual ($249), Enterprise
- **Instructor Portal**: Course builder, analytics, payouts
- **AI Tutor**: GPT-powered Q&A chatbot
- **Gamification**: Streaks, badges, leaderboard
- **Community**: Forums, peer review, study groups

## Getting Started

```bash
# Clone the repository
git clone https://github.com/NikhilGupta777/Courses-website-temp-name-.git
cd Courses-website-temp-name-/learnai

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Set up database
pnpm prisma generate
pnpm prisma db push

# Start development server
pnpm dev
```

## Project Structure

```
learnai/
├── docs/               # Planning documents (PRD, Architecture, DB Schema, API Spec, Tasks)
├── prisma/             # Database schema & migrations
├── public/             # Static assets
└── src/
    ├── app/            # Next.js App Router pages
    │   ├── (public)/   # Public pages (catalog, pricing, etc.)
    │   ├── (auth)/     # Authentication pages
    │   ├── (dashboard)/ # Student dashboard
    │   ├── (instructor)/ # Instructor portal
    │   ├── (admin)/    # Admin panel
    │   └── api/        # API routes & webhooks
    ├── components/     # Reusable UI components
    ├── lib/            # Utilities, configs, DB client
    ├── server/         # tRPC routers & business logic
    ├── stores/         # Zustand state stores
    ├── hooks/          # Custom React hooks
    └── types/          # TypeScript type definitions
```

## Documentation

- [PRD (Product Requirements)](docs/01-PRD.md)
- [Architecture](docs/02-ARCHITECTURE.md)
- [Database Schema](docs/03-DATABASE-SCHEMA.md)
- [API Specification](docs/04-API-SPEC.md)
- [Tasks & Issues](docs/05-TASKS-AND-ISSUES.md)

## Development Phases

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1 — MVP | 8 weeks | In Progress |
| Phase 2 — Growth | 6 weeks | Planned |
| Phase 3 — Scale | 6 weeks | Planned |
| Phase 4 — Polish | 4 weeks | Planned |

## License

MIT
