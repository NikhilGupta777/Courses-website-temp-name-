# API Specification
## AI Courses Platform — "LearnAI"

---

## Overview

- **Protocol:** tRPC (type-safe RPC) for internal app communication
- **REST endpoints** only for webhooks and third-party integrations
- **Authentication:** Bearer token (JWT) via Auth.js
- **Rate Limiting:** 100 req/min (anonymous), 1000 req/min (authenticated)
- **Response Format:** JSON with consistent error structure

---

## tRPC Router Structure

```
appRouter
├── auth.*          — Authentication & sessions
├── user.*          — User profile & settings
├── course.*        — Course CRUD & catalog
├── module.*        — Module management
├── lesson.*        — Lesson management
├── enrollment.*    — Enrollment & progress
├── quiz.*          — Quizzes & attempts
├── payment.*       — Payments & subscriptions
├── certificate.*   — Certificate generation & verification
├── review.*        — Ratings & reviews
├── instructor.*    — Instructor portal
├── admin.*         — Admin operations
├── notification.*  — Notifications
├── search.*        — Full-text search
└── upload.*        — File & video uploads
```

---

## Detailed API Endpoints

### 1. Authentication (`auth.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `auth.register` | mutation | `{ email, password, name }` | `{ user, token }` | No | Create account |
| `auth.login` | mutation | `{ email, password }` | `{ user, token }` | No | Login with credentials |
| `auth.logout` | mutation | — | `{ success }` | Yes | Invalidate session |
| `auth.forgotPassword` | mutation | `{ email }` | `{ success }` | No | Send reset email |
| `auth.resetPassword` | mutation | `{ token, password }` | `{ success }` | No | Reset password |
| `auth.verifyEmail` | mutation | `{ token }` | `{ success }` | No | Verify email address |
| `auth.getSession` | query | — | `{ user, role }` | Yes | Get current session |

---

### 2. User (`user.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `user.getProfile` | query | — | `User` | Yes | Get own profile |
| `user.updateProfile` | mutation | `{ name?, bio?, image?, ... }` | `User` | Yes | Update profile |
| `user.getDashboard` | query | — | `DashboardData` | Yes | Dashboard overview |
| `user.getStreaks` | query | — | `StudyStreak[]` | Yes | Study streak data |
| `user.getBadges` | query | — | `Badge[]` | Yes | Earned badges |
| `user.deleteAccount` | mutation | `{ confirmation }` | `{ success }` | Yes | Delete account |

**DashboardData type:**
```typescript
{
  enrolledCourses: { course, progress, lastAccessed }[]
  upcomingLiveSessions: LiveSchedule[]
  recentQuizScores: QuizAttempt[]
  certificates: Certificate[]
  streak: { current, longest }
  recommendations: Course[]
}
```

---

### 3. Course (`course.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `course.getAll` | query | `{ page, limit, filters }` | `{ courses, total, pages }` | No | Paginated catalog |
| `course.getBySlug` | query | `{ slug }` | `CourseDetail` | No | Course detail page |
| `course.getFeatured` | query | — | `Course[]` | No | Homepage featured |
| `course.getCategories` | query | — | `Category[]` | No | All categories |
| `course.create` | mutation | `CreateCourseInput` | `Course` | Instructor | Create course |
| `course.update` | mutation | `UpdateCourseInput` | `Course` | Instructor | Update course |
| `course.delete` | mutation | `{ id }` | `{ success }` | Instructor | Delete course |
| `course.publish` | mutation | `{ id }` | `Course` | Instructor | Submit for review |
| `course.getRelated` | query | `{ courseId }` | `Course[]` | No | Related courses |

**Filters:**
```typescript
{
  category?: string
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"
  deliveryMode?: "LIVE_ONLINE" | "OFFLINE_WORKSHOP" | "PRE_RECORDED" | "HYBRID"
  priceRange?: { min: number, max: number }
  rating?: number // minimum rating
  isFree?: boolean
  sortBy?: "popular" | "newest" | "rating" | "price_low" | "price_high"
}
```

---

### 4. Module (`module.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `module.create` | mutation | `{ courseId, title, description }` | `Module` | Instructor | Add module |
| `module.update` | mutation | `{ id, title?, description? }` | `Module` | Instructor | Update module |
| `module.delete` | mutation | `{ id }` | `{ success }` | Instructor | Delete module |
| `module.reorder` | mutation | `{ courseId, moduleIds[] }` | `{ success }` | Instructor | Reorder modules |

---

### 5. Lesson (`lesson.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `lesson.create` | mutation | `CreateLessonInput` | `Lesson` | Instructor | Add lesson |
| `lesson.update` | mutation | `UpdateLessonInput` | `Lesson` | Instructor | Update lesson |
| `lesson.delete` | mutation | `{ id }` | `{ success }` | Instructor | Delete lesson |
| `lesson.reorder` | mutation | `{ moduleId, lessonIds[] }` | `{ success }` | Instructor | Reorder |
| `lesson.getContent` | query | `{ lessonId }` | `LessonContent` | Enrolled | Get lesson content |
| `lesson.getVideoUrl` | query | `{ lessonId }` | `{ url, token }` | Enrolled | Signed video URL |

---

### 6. Enrollment (`enrollment.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `enrollment.enroll` | mutation | `{ courseId }` | `Enrollment` | Yes | Enroll in free course |
| `enrollment.getAll` | query | — | `Enrollment[]` | Yes | My enrollments |
| `enrollment.getProgress` | query | `{ courseId }` | `ProgressData` | Yes | Course progress detail |
| `enrollment.markComplete` | mutation | `{ lessonId }` | `LessonProgress` | Yes | Mark lesson complete |
| `enrollment.updateVideoPos` | mutation | `{ lessonId, position }` | `{ success }` | Yes | Save video position |

**ProgressData type:**
```typescript
{
  overall: number // percentage
  modules: {
    id: string
    title: string
    progress: number
    lessons: { id, title, isCompleted, type }[]
  }[]
  completedLessons: number
  totalLessons: number
  timeSpent: number // minutes
}
```

---

### 7. Quiz (`quiz.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `quiz.get` | query | `{ quizId }` | `Quiz` (without answers) | Enrolled | Get quiz for taking |
| `quiz.submit` | mutation | `{ quizId, answers[] }` | `QuizResult` | Enrolled | Submit quiz |
| `quiz.getAttempts` | query | `{ quizId }` | `QuizAttempt[]` | Enrolled | My attempts |
| `quiz.create` | mutation | `CreateQuizInput` | `Quiz` | Instructor | Create quiz |
| `quiz.update` | mutation | `UpdateQuizInput` | `Quiz` | Instructor | Update quiz |
| `quiz.addQuestion` | mutation | `CreateQuestionInput` | `Question` | Instructor | Add question |
| `quiz.removeQuestion` | mutation | `{ questionId }` | `{ success }` | Instructor | Remove question |

**QuizResult type:**
```typescript
{
  score: number
  totalPoints: number
  earnedPoints: number
  passed: boolean
  answers: { questionId, isCorrect, explanation }[]
  timeTaken: number
}
```

---

### 8. Payment (`payment.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `payment.createCheckout` | mutation | `{ courseId, couponCode? }` | `{ sessionUrl }` | Yes | Stripe checkout |
| `payment.createSubscription` | mutation | `{ plan, couponCode? }` | `{ sessionUrl }` | Yes | Subscribe |
| `payment.getHistory` | query | `{ page, limit }` | `Payment[]` | Yes | Payment history |
| `payment.getSubscription` | query | — | `Subscription` | Yes | Current subscription |
| `payment.cancelSubscription` | mutation | — | `{ success }` | Yes | Cancel at period end |
| `payment.applyCoupon` | query | `{ code, courseId? }` | `CouponResult` | Yes | Validate coupon |
| `payment.getPortalUrl` | query | — | `{ url }` | Yes | Stripe customer portal |

---

### 9. Certificate (`certificate.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `certificate.generate` | mutation | `{ courseId }` | `Certificate` | Yes | Generate on completion |
| `certificate.getAll` | query | — | `Certificate[]` | Yes | My certificates |
| `certificate.verify` | query | `{ certificateNumber }` | `CertificatePublic` | No | Public verification |
| `certificate.download` | query | `{ id }` | `{ pdfUrl }` | Yes | Download PDF |

---

### 10. Review (`review.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `review.create` | mutation | `{ courseId, rating, title?, comment? }` | `Review` | Enrolled | Submit review |
| `review.update` | mutation | `{ id, rating?, comment? }` | `Review` | Yes | Update review |
| `review.delete` | mutation | `{ id }` | `{ success }` | Yes | Delete review |
| `review.getByCourse` | query | `{ courseId, page }` | `{ reviews, average, distribution }` | No | Course reviews |

---

### 11. Instructor (`instructor.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `instructor.getProfile` | query | — | `InstructorProfile` | Instructor | My instructor profile |
| `instructor.updateProfile` | mutation | `UpdateInstructorInput` | `InstructorProfile` | Instructor | Update profile |
| `instructor.getAnalytics` | query | `{ period }` | `AnalyticsData` | Instructor | Revenue & stats |
| `instructor.getCourses` | query | — | `Course[]` | Instructor | My courses |
| `instructor.getStudents` | query | `{ courseId }` | `Student[]` | Instructor | Enrolled students |
| `instructor.getPayouts` | query | — | `Payout[]` | Instructor | Payout history |
| `instructor.requestPayout` | mutation | — | `Payout` | Instructor | Request payout |

---

### 12. Admin (`admin.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `admin.getUsers` | query | `{ page, search, role }` | `{ users, total }` | Admin | List users |
| `admin.updateUser` | mutation | `{ id, role?, isActive? }` | `User` | Admin | Manage user |
| `admin.getCourses` | query | `{ status }` | `Course[]` | Admin | Review courses |
| `admin.approveCourse` | mutation | `{ id }` | `Course` | Admin | Approve course |
| `admin.rejectCourse` | mutation | `{ id, reason }` | `Course` | Admin | Reject course |
| `admin.getRevenue` | query | `{ period }` | `RevenueData` | Admin | Revenue analytics |
| `admin.createCoupon` | mutation | `CreateCouponInput` | `Coupon` | Admin | Create coupon |
| `admin.getSystemStats` | query | — | `SystemStats` | Admin | Platform overview |

---

### 13. Search (`search.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `search.courses` | query | `{ query, filters }` | `SearchResult[]` | No | Full-text search |
| `search.suggest` | query | `{ query }` | `string[]` | No | Auto-complete |

---

### 14. Notification (`notification.*`)

| Procedure | Type | Input | Output | Auth | Description |
|-----------|------|-------|--------|------|-------------|
| `notification.getAll` | query | `{ page }` | `Notification[]` | Yes | My notifications |
| `notification.markRead` | mutation | `{ ids[] }` | `{ success }` | Yes | Mark as read |
| `notification.markAllRead` | mutation | — | `{ success }` | Yes | Mark all read |
| `notification.getUnreadCount` | query | — | `{ count }` | Yes | Unread badge count |

---

## REST Endpoints (Webhooks & External)

### Stripe Webhooks
```
POST /api/webhooks/stripe
Headers: stripe-signature
Events handled:
  - checkout.session.completed
  - invoice.paid
  - invoice.payment_failed
  - customer.subscription.updated
  - customer.subscription.deleted
```

### Mux Webhooks
```
POST /api/webhooks/mux
Headers: mux-signature
Events handled:
  - video.asset.ready
  - video.asset.errored
  - video.upload.asset_created
```

### File Upload
```
POST /api/upload/video    → Returns Mux upload URL
POST /api/upload/image    → Returns S3 presigned URL
POST /api/upload/resource → Returns S3 presigned URL
```

### Certificate Verification (Public)
```
GET /api/verify/:certificateNumber → Returns certificate details
```

---

## Error Response Format

```typescript
{
  error: {
    code: string        // "NOT_FOUND", "UNAUTHORIZED", "VALIDATION_ERROR"
    message: string     // Human-readable message
    details?: unknown   // Zod validation errors, etc.
  }
}
```

## Standard HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Not authorized |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 429 | Rate limited |
| 500 | Internal server error |
