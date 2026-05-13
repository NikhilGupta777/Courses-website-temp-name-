# Product Requirements Document (PRD)
## AI Courses Platform — "LearnAI"

---

## 1. Executive Summary

LearnAI is a premium, modern AI education platform offering live classes, offline workshops, pre-recorded video courses, interactive quizzes, timed tests, completion certificates, and a subscription/pricing model. The platform targets aspiring AI/ML engineers, data scientists, and professionals seeking to upskill.

---

## 2. Vision & Goals

| Goal | Metric |
|------|--------|
| Best-in-class learning experience | NPS > 70 |
| High completion rates | > 60% course completion |
| Scalable to 100k+ users | < 200ms p95 API latency |
| Revenue via subscriptions & one-time purchases | MRR growth 15% m/m |

---

## 3. Target Users

| Persona | Description |
|---------|-------------|
| **Aspiring AI Engineer** | College students / bootcamp grads wanting structured AI learning |
| **Working Professional** | Engineers upskilling into ML/AI roles |
| **Enterprise Learner** | Companies buying team licenses |
| **Instructor** | AI experts creating & selling courses |

---

## 4. Core Features

### 4.1 Course Delivery Modes

| Mode | Description |
|------|-------------|
| **Live Online Classes** | Real-time video sessions via integrated video (Zoom/custom WebRTC), scheduled calendar, chat, Q&A |
| **Offline Workshops** | In-person events with location, RSVP, QR check-in |
| **Pre-recorded Videos** | On-demand HD video lessons with chapters, playback speed, notes |
| **Hybrid** | Mix of live + recorded content in a single course |

### 4.2 Course Structure

- **Course** → Multiple **Modules** → Multiple **Lessons**
- Each lesson can be: Video, Article, Quiz, Assignment, Live Session
- **Learning Path** — curated sequence of courses (e.g., "AI Engineer in 6 months")
- **Timeline/Roadmap** — visual progress tracker showing milestones

### 4.3 Assessments & Gamification

| Feature | Details |
|---------|---------|
| **Quizzes** | MCQ, multi-select, true/false, code-based questions per lesson |
| **Timed Tests** | Chapter/module-level tests with countdown, auto-submit |
| **Assignments** | Code submissions with auto-grading (Jupyter/Python sandbox) |
| **Leaderboard** | Points, streaks, badges |
| **Progress Tracking** | Per-lesson, per-module, overall % completion |

### 4.4 Certificates

- Auto-generated PDF certificates on course completion
- Unique verification URL (shareable on LinkedIn)
- Customizable templates per course/instructor
- Blockchain-optional verification hash

### 4.5 Pricing & Payments

| Model | Details |
|-------|---------|
| **Free Tier** | Limited access to intro modules, community |
| **Pro Monthly** | $29/mo — full library access |
| **Pro Annual** | $249/yr — full library + priority support |
| **Enterprise** | Custom pricing, team dashboards, SSO |
| **One-time Purchase** | Individual course purchase ($49-$299) |
| **Offers/Coupons** | Discount codes, seasonal sales, referral credits |

### 4.6 User Dashboard

- Enrolled courses with progress bars
- Upcoming live sessions calendar
- Recent quiz scores
- Certificate gallery
- Recommended courses (AI-powered)
- Study streak & achievements

### 4.7 Instructor Portal

- Course builder (drag-and-drop modules/lessons)
- Video upload with transcoding pipeline
- Analytics (enrollments, completion, revenue)
- Student Q&A management
- Payout dashboard

### 4.8 Community & Engagement

- Discussion forums per course
- Peer code review
- AI chatbot tutor (GPT-powered Q&A on course content)
- Notifications (email, push, in-app)
- Study groups

### 4.9 Admin Panel

- User management (roles, bans, verification)
- Course approval workflow
- Revenue & analytics dashboards
- Content moderation
- Coupon/offer management
- Platform settings

---

## 5. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Performance** | < 200ms API response (p95), < 3s page load |
| **Scalability** | Handle 100k concurrent users |
| **Security** | SOC2 compliant, encrypted at rest/transit, OWASP top 10 |
| **Availability** | 99.9% uptime SLA |
| **Accessibility** | WCAG 2.1 AA compliant |
| **SEO** | Server-rendered pages, structured data |
| **Mobile** | Fully responsive, PWA-capable |
| **Internationalization** | Multi-language support (Phase 2) |

---

## 6. Pages & Navigation

### Public Pages
- **Homepage** — Hero, featured courses, testimonials, pricing, stats
- **Course Catalog** — Search, filter by category/level/mode/price
- **Course Detail** — Curriculum, instructor bio, reviews, pricing, preview
- **Pricing Page** — Plans comparison table
- **About / Contact**
- **Blog**

### Authenticated Pages
- **Dashboard** — Overview of enrolled courses, progress, upcoming
- **Course Player** — Video player + sidebar navigation + notes + quiz
- **Live Session Room** — Video call + chat + screen share
- **Quiz/Test Page** — Timer, questions, submit
- **Certificate Viewer**
- **Profile & Settings**
- **Instructor Studio** — Course builder, analytics, payouts

---

## 7. Success Metrics

- Course completion rate > 60%
- Average session duration > 25 min
- Monthly active users growth 20% m/m
- Subscription conversion from free trial > 8%
- NPS > 70
- Certificate share rate > 40%

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Video hosting costs | Use adaptive bitrate, CDN caching, tiered storage |
| Low completion rates | Gamification, reminders, bite-sized lessons |
| Instructor quality | Review process, student ratings, minimum standards |
| Payment fraud | Stripe Radar, webhook verification |
| Scale issues | Horizontal scaling, caching layers, async processing |

---

## 9. Timeline (High-Level)

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| **Phase 1 — MVP** | 8 weeks | Auth, courses CRUD, video playback, basic quizzes, payments |
| **Phase 2 — Growth** | 6 weeks | Live classes, certificates, leaderboard, instructor portal |
| **Phase 3 — Scale** | 6 weeks | Enterprise features, AI tutor, advanced analytics, mobile app |
| **Phase 4 — Polish** | 4 weeks | Performance optimization, accessibility, i18n |
