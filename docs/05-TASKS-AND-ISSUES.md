# Implementation Tasks & Issues
## AI Courses Platform — "LearnAI"

---

## Phase 1 — MVP Foundation (Weeks 1-8)

### Sprint 1: Project Setup & Auth (Week 1-2)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 1 | Initialize Next.js 14 project with TypeScript, Tailwind, ESLint, Prettier | P0 | 2h |
| 2 | Configure shadcn/ui component library + design tokens (colors, fonts, spacing) | P0 | 3h |
| 3 | Set up Prisma with PostgreSQL (Neon) + initial schema migration | P0 | 3h |
| 4 | Implement Auth.js v5 (Google, GitHub, Email/Password) | P0 | 8h |
| 5 | Build auth pages (Login, Register, Forgot Password) with form validation | P0 | 6h |
| 6 | Set up tRPC with Next.js App Router + create base routers | P0 | 4h |
| 7 | Implement role-based middleware (Student, Instructor, Admin) | P0 | 4h |
| 8 | Create base layout components (Header, Footer, Sidebar, Mobile Nav) | P0 | 6h |
| 9 | Set up Zustand stores (auth, UI state) | P1 | 2h |
| 10 | Configure CI/CD pipeline (GitHub Actions: lint, type-check, build) | P1 | 3h |

### Sprint 2: Homepage & Course Catalog (Week 3-4)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 11 | Design & build Homepage — Hero section with animated gradient + CTA | P0 | 6h |
| 12 | Homepage — Featured courses carousel (Framer Motion) | P0 | 4h |
| 13 | Homepage — Stats counter section (students, courses, certificates) | P0 | 3h |
| 14 | Homepage — Testimonials section with avatar cards | P0 | 3h |
| 15 | Homepage — Pricing preview + comparison table | P0 | 4h |
| 16 | Homepage — "How it works" section with step icons | P1 | 2h |
| 17 | Homepage — Newsletter signup + Footer | P1 | 2h |
| 18 | Build Course Catalog page with grid/list view toggle | P0 | 6h |
| 19 | Implement catalog filters (category, level, mode, price, rating) | P0 | 5h |
| 20 | Implement catalog search with debounced input | P0 | 3h |
| 21 | Implement pagination + infinite scroll option | P0 | 3h |
| 22 | Build Course Detail page — Hero, curriculum, instructor, reviews | P0 | 8h |
| 23 | Course Detail — "What you'll learn" + prerequisites sections | P0 | 2h |
| 24 | Course Detail — Preview video modal | P1 | 3h |
| 25 | Build Pricing page — Plan comparison with feature matrix | P0 | 5h |

### Sprint 3: Course CRUD & Instructor Portal (Week 5-6)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 26 | Instructor onboarding flow (profile setup, verification request) | P0 | 5h |
| 27 | Build Course Builder — Basic info form (title, description, level, category) | P0 | 6h |
| 28 | Course Builder — Module creation with drag-and-drop reordering | P0 | 6h |
| 29 | Course Builder — Lesson creation (type selection: video, article, quiz) | P0 | 6h |
| 30 | Implement video upload pipeline (Mux direct upload + webhook) | P0 | 8h |
| 31 | Build article editor (Markdown with live preview) | P1 | 5h |
| 32 | Course Builder — Publish/draft flow with validation | P0 | 4h |
| 33 | Instructor dashboard — My courses list with status badges | P0 | 4h |
| 34 | Instructor analytics — Basic metrics (enrollments, revenue) | P1 | 5h |
| 35 | Admin — Course review queue + approve/reject | P1 | 5h |

### Sprint 4: Enrollment & Video Player (Week 7-8)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 36 | Implement Stripe integration (checkout sessions + webhooks) | P0 | 8h |
| 37 | Enrollment flow — Free courses (instant enroll) | P0 | 3h |
| 38 | Enrollment flow — Paid courses (Stripe checkout → webhook → enroll) | P0 | 5h |
| 39 | Build Course Player page layout (video + sidebar navigation) | P0 | 8h |
| 40 | Video player — Mux HLS playback with quality selector | P0 | 6h |
| 41 | Video player — Progress tracking (save position, mark complete) | P0 | 4h |
| 42 | Video player — Playback speed control | P1 | 2h |
| 43 | Course sidebar — Module/lesson tree with completion checkmarks | P0 | 4h |
| 44 | Build User Dashboard — Enrolled courses with progress bars | P0 | 5h |
| 45 | User Dashboard — Continue learning widget | P0 | 3h |

---

## Phase 2 — Growth Features (Weeks 9-14)

### Sprint 5: Quizzes & Assessments (Week 9-10)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 46 | Build Quiz creation form for instructors (MCQ, multi-select, T/F) | P0 | 6h |
| 47 | Build Quiz-taking UI — Question display, answer selection, navigation | P0 | 8h |
| 48 | Implement timed quiz mode with countdown timer + auto-submit | P0 | 4h |
| 49 | Quiz scoring engine — Calculate results, store attempts | P0 | 4h |
| 50 | Quiz results page — Score breakdown, correct answers, explanations | P0 | 4h |
| 51 | Code question type — Monaco editor + basic execution | P2 | 8h |
| 52 | Assignment submission flow — Upload/paste code, instructor grading | P1 | 6h |

### Sprint 6: Certificates & Live Classes (Week 11-12)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 53 | Certificate template design (PDF generation with @react-pdf) | P0 | 6h |
| 54 | Auto-generate certificate on 100% course completion | P0 | 4h |
| 55 | Certificate verification page (public URL) | P0 | 3h |
| 56 | Certificate gallery in user dashboard | P0 | 3h |
| 57 | LinkedIn share button for certificates | P1 | 2h |
| 58 | Live class scheduling UI (instructor sets date/time) | P0 | 5h |
| 59 | Live class calendar view for students | P0 | 4h |
| 60 | Integrate video calling (Daily.co/LiveKit) for live sessions | P0 | 8h |
| 61 | Live session — Chat sidebar + Q&A | P1 | 5h |
| 62 | Post-session recording auto-save | P2 | 4h |

### Sprint 7: Subscriptions & Offers (Week 13-14)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 63 | Stripe Billing — Monthly/Annual subscription setup | P0 | 6h |
| 64 | Subscription gating — Check access before content delivery | P0 | 4h |
| 65 | Stripe Customer Portal integration (manage/cancel) | P0 | 3h |
| 66 | Coupon system — Create, validate, apply at checkout | P0 | 5h |
| 67 | Referral credits system | P2 | 6h |
| 68 | Instructor payouts — Revenue split calculation + Stripe Connect | P1 | 8h |
| 69 | Payment history page for users | P0 | 3h |
| 70 | Admin — Revenue dashboard with charts | P1 | 5h |

---

## Phase 3 — Scale & Intelligence (Weeks 15-20)

### Sprint 8: Community & Engagement (Week 15-16)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 71 | Discussion forum per course (threaded comments) | P1 | 8h |
| 72 | Notification system — In-app notifications with dropdown | P0 | 5h |
| 73 | Email notifications (Resend) — Welcome, receipt, reminders | P0 | 5h |
| 74 | Leaderboard — Points system + weekly/monthly ranking | P1 | 5h |
| 75 | Study streak tracking + streak badge | P1 | 3h |
| 76 | Badge/achievement system | P2 | 5h |
| 77 | Course recommendations (collaborative filtering) | P2 | 6h |

### Sprint 9: AI Features & Search (Week 17-18)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 78 | Implement full-text search (Meilisearch) with facets | P0 | 6h |
| 79 | Search auto-complete suggestions | P1 | 3h |
| 80 | AI Tutor chatbot — GPT-powered Q&A on course content | P1 | 8h |
| 81 | AI-generated quiz questions from lesson content | P2 | 6h |
| 82 | Smart progress insights ("You're 2x faster than average") | P2 | 4h |
| 83 | Learning path recommendations | P2 | 5h |

### Sprint 10: Enterprise & Admin (Week 19-20)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 84 | Enterprise plan — Team management dashboard | P1 | 8h |
| 85 | SSO integration (SAML/OIDC) for enterprise | P2 | 6h |
| 86 | Admin panel — User management (roles, bans, search) | P0 | 5h |
| 87 | Admin panel — Content moderation queue | P1 | 4h |
| 88 | Admin panel — System settings (site name, logo, SEO) | P1 | 4h |
| 89 | Bulk import — CSV course/student import | P2 | 5h |
| 90 | API keys for enterprise integrations | P2 | 4h |

---

## Phase 4 — Polish & Performance (Weeks 21-24)

### Sprint 11: Performance & SEO (Week 21-22)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 91 | Performance audit — Lighthouse optimization (target > 95) | P0 | 6h |
| 92 | Image optimization pipeline (sharp, WebP, lazy loading) | P0 | 3h |
| 93 | Implement ISR for catalog pages | P0 | 3h |
| 94 | Add structured data (JSON-LD) for courses (SEO) | P0 | 3h |
| 95 | Sitemap generation + robots.txt | P0 | 2h |
| 96 | Bundle analysis + code splitting optimization | P1 | 4h |
| 97 | Implement Redis caching for hot queries | P1 | 4h |
| 98 | Database query optimization + explain analysis | P1 | 4h |

### Sprint 12: Accessibility & Final Polish (Week 23-24)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 99 | WCAG 2.1 AA audit + remediation | P0 | 8h |
| 100 | Keyboard navigation for all interactive elements | P0 | 4h |
| 101 | Screen reader testing + ARIA labels | P0 | 4h |
| 102 | Dark mode implementation | P1 | 5h |
| 103 | Responsive design audit (mobile, tablet, desktop) | P0 | 4h |
| 104 | Error boundary + fallback UI for all routes | P0 | 3h |
| 105 | Loading states + skeleton screens for all pages | P0 | 4h |
| 106 | End-to-end testing (Playwright) — Critical paths | P1 | 8h |
| 107 | Monitoring setup (Sentry + Vercel Analytics) | P1 | 3h |
| 108 | Documentation — README, contributing guide, env setup | P1 | 4h |

---

## Summary

| Phase | Tasks | Total Estimate |
|-------|-------|----------------|
| Phase 1 — MVP | 45 tasks | ~180 hours |
| Phase 2 — Growth | 25 tasks | ~120 hours |
| Phase 3 — Scale | 20 tasks | ~100 hours |
| Phase 4 — Polish | 18 tasks | ~70 hours |
| **Total** | **108 tasks** | **~470 hours** |

---

## Priority Legend

| Priority | Meaning |
|----------|---------|
| **P0** | Must have for phase completion |
| **P1** | Should have, significant value |
| **P2** | Nice to have, can defer |
