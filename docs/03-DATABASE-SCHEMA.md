# Database Schema
## AI Courses Platform — "LearnAI"

---

## Entity Relationship Overview

```
Users ──┬── Enrollments ──── Courses ──── Modules ──── Lessons
        │                       │                         │
        ├── Payments            ├── Reviews               ├── Quizzes ── Questions
        │                       │                         │
        ├── Certificates        ├── Instructors           ├── LessonProgress
        │                       │                         │
        ├── QuizAttempts        ├── Coupons               └── Assignments
        │                       │
        └── Notifications       └── Categories
```

---

## Complete Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER & AUTH
// ============================================

enum UserRole {
  STUDENT
  INSTRUCTOR
  ADMIN
}

enum AuthProvider {
  EMAIL
  GOOGLE
  GITHUB
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  password      String?   // hashed, null for OAuth users
  role          UserRole  @default(STUDENT)
  bio           String?
  headline      String?
  website       String?
  emailVerified DateTime?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  enrollments   Enrollment[]
  payments      Payment[]
  certificates  Certificate[]
  quizAttempts  QuizAttempt[]
  reviews       Review[]
  notifications Notification[]
  instructorProfile InstructorProfile?
  progress      LessonProgress[]
  streaks       StudyStreak[]
  badges        UserBadge[]

  @@index([email])
  @@index([role])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ============================================
// INSTRUCTOR
// ============================================

model InstructorProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  displayName     String
  bio             String
  expertise       String[] // e.g., ["Machine Learning", "NLP", "Computer Vision"]
  socialLinks     Json?    // { twitter, linkedin, github, website }
  isVerified      Boolean  @default(false)
  totalStudents   Int      @default(0)
  totalCourses    Int      @default(0)
  averageRating   Float    @default(0)
  payoutEmail     String?
  stripeAccountId String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courses Course[]
  payouts Payout[]
}

// ============================================
// COURSES & CONTENT
// ============================================

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum CourseStatus {
  DRAFT
  UNDER_REVIEW
  PUBLISHED
  ARCHIVED
}

enum DeliveryMode {
  LIVE_ONLINE
  OFFLINE_WORKSHOP
  PRE_RECORDED
  HYBRID
}

model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  icon        String?
  parentId    String?
  parent      Category?  @relation("CategoryChildren", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryChildren")
  courses     Course[]
  createdAt   DateTime @default(now())

  @@index([slug])
}

model Course {
  id              String       @id @default(cuid())
  title           String
  slug            String       @unique
  subtitle        String?
  description     String       // Rich text / markdown
  thumbnail       String?
  previewVideoUrl String?
  level           CourseLevel  @default(BEGINNER)
  status          CourseStatus @default(DRAFT)
  deliveryMode    DeliveryMode @default(PRE_RECORDED)
  language        String       @default("en")
  duration        Int?         // Total duration in minutes
  price           Float?       // null = included in subscription
  originalPrice   Float?       // For showing discounts
  isFree          Boolean      @default(false)
  isFeatured      Boolean      @default(false)
  tags            String[]
  prerequisites   String[]
  learningOutcomes String[]
  totalStudents   Int          @default(0)
  averageRating   Float        @default(0)
  totalReviews    Int          @default(0)
  publishedAt     DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  // Relations
  instructorId    String
  instructor      InstructorProfile @relation(fields: [instructorId], references: [id])
  categoryId      String?
  category        Category?    @relation(fields: [categoryId], references: [id])
  modules         Module[]
  enrollments     Enrollment[]
  reviews         Review[]
  certificates    Certificate[]
  coupons         Coupon[]
  liveSchedules   LiveSchedule[]

  @@index([slug])
  @@index([status])
  @@index([instructorId])
  @@index([categoryId])
  @@index([level, status])
}

model Module {
  id          String   @id @default(cuid())
  title       String
  description String?
  position    Int      // Order within course
  duration    Int?     // Minutes
  courseId     String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons     Lesson[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([courseId, position])
}

enum LessonType {
  VIDEO
  ARTICLE
  QUIZ
  ASSIGNMENT
  LIVE_SESSION
  RESOURCE
}

model Lesson {
  id           String     @id @default(cuid())
  title        String
  description  String?
  type         LessonType
  position     Int        // Order within module
  duration     Int?       // Minutes
  isFree       Boolean    @default(false) // Preview lesson
  isPublished  Boolean    @default(false)

  // Video-specific
  videoUrl     String?
  muxAssetId   String?
  muxPlaybackId String?
  videoStatus  String?    // "preparing", "ready", "errored"

  // Article-specific
  content      String?    // Markdown content

  // Resource-specific
  resourceUrl  String?
  resourceType String?    // "pdf", "zip", "notebook"

  moduleId     String
  module       Module     @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  quiz         Quiz?
  assignment   Assignment?
  progress     LessonProgress[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@index([moduleId, position])
}

// ============================================
// ASSESSMENTS
// ============================================

model Quiz {
  id            String     @id @default(cuid())
  lessonId      String     @unique
  lesson        Lesson     @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  title         String
  description   String?
  timeLimit     Int?       // Minutes, null = no limit
  passingScore  Float      @default(70) // Percentage
  maxAttempts   Int?       // null = unlimited
  shuffleQuestions Boolean @default(false)
  showCorrectAnswers Boolean @default(true)
  questions     Question[]
  attempts      QuizAttempt[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

enum QuestionType {
  MULTIPLE_CHOICE
  MULTI_SELECT
  TRUE_FALSE
  SHORT_ANSWER
  CODE
}

model Question {
  id           String       @id @default(cuid())
  quizId       String
  quiz         Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)
  type         QuestionType
  text         String       // The question text (supports markdown)
  explanation  String?      // Explanation shown after answering
  points       Int          @default(1)
  position     Int
  options      Json?        // Array of { id, text, isCorrect } for MCQ
  correctAnswer String?     // For short answer
  codeTemplate String?      // For code questions
  testCases    Json?        // For code questions: [{ input, expected }]
  createdAt    DateTime     @default(now())

  @@index([quizId, position])
}

model QuizAttempt {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  quizId      String
  quiz        Quiz     @relation(fields: [quizId], references: [id])
  score       Float    // Percentage
  totalPoints Int
  earnedPoints Int
  answers     Json     // [{ questionId, answer, isCorrect, points }]
  startedAt   DateTime @default(now())
  completedAt DateTime?
  timeTaken   Int?     // Seconds

  @@index([userId, quizId])
  @@index([quizId])
}

model Assignment {
  id           String   @id @default(cuid())
  lessonId     String   @unique
  lesson       Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  title        String
  instructions String   // Markdown
  starterCode  String?
  language     String?  // "python", "javascript", etc.
  dueDate      DateTime?
  maxScore     Int      @default(100)
  submissions  AssignmentSubmission[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum SubmissionStatus {
  SUBMITTED
  GRADING
  GRADED
  RETURNED
}

model AssignmentSubmission {
  id           String           @id @default(cuid())
  assignmentId String
  assignment   Assignment       @relation(fields: [assignmentId], references: [id])
  userId       String
  code         String
  status       SubmissionStatus @default(SUBMITTED)
  score        Int?
  feedback     String?
  submittedAt  DateTime         @default(now())
  gradedAt     DateTime?

  @@index([assignmentId, userId])
}

// ============================================
// ENROLLMENT & PROGRESS
// ============================================

enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  EXPIRED
  REFUNDED
}

model Enrollment {
  id          String           @id @default(cuid())
  userId      String
  user        User             @relation(fields: [userId], references: [id])
  courseId     String
  course      Course           @relation(fields: [courseId], references: [id])
  status      EnrollmentStatus @default(ACTIVE)
  progress    Float            @default(0) // Percentage 0-100
  enrolledAt  DateTime         @default(now())
  completedAt DateTime?
  expiresAt   DateTime?        // For time-limited access

  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
}

model LessonProgress {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id])
  isCompleted Boolean  @default(false)
  watchTime   Int?     // Seconds watched (for video)
  lastPosition Int?    // Last video position in seconds
  completedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, lessonId])
  @@index([userId])
}

// ============================================
// CERTIFICATES
// ============================================

model Certificate {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  courseId         String
  course          Course   @relation(fields: [courseId], references: [id])
  certificateNumber String @unique // e.g., "CERT-2024-ABC123"
  verificationUrl String   @unique
  pdfUrl          String?
  templateId      String?
  metadata        Json?    // { courseName, userName, completionDate, score }
  issuedAt        DateTime @default(now())

  @@index([userId])
  @@index([certificateNumber])
}

// ============================================
// LIVE CLASSES
// ============================================

enum LiveSessionStatus {
  SCHEDULED
  LIVE
  COMPLETED
  CANCELLED
}

model LiveSchedule {
  id          String            @id @default(cuid())
  courseId     String
  course      Course            @relation(fields: [courseId], references: [id])
  title       String
  description String?
  startTime   DateTime
  endTime     DateTime
  timezone    String            @default("UTC")
  status      LiveSessionStatus @default(SCHEDULED)
  meetingUrl  String?           // Generated meeting room URL
  recordingUrl String?          // Post-session recording
  maxAttendees Int?
  rsvpCount   Int              @default(0)
  metadata    Json?            // { platform, roomId, etc. }
  createdAt   DateTime         @default(now())

  @@index([courseId])
  @@index([startTime])
  @@index([status])
}

// ============================================
// PAYMENTS & SUBSCRIPTIONS
// ============================================

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum PaymentType {
  ONE_TIME
  SUBSCRIPTION
}

model Payment {
  id                String        @id @default(cuid())
  userId            String
  user              User          @relation(fields: [userId], references: [id])
  amount            Float
  currency          String        @default("usd")
  status            PaymentStatus @default(PENDING)
  type              PaymentType
  stripePaymentId   String?       @unique
  stripeInvoiceId   String?
  courseId           String?       // For one-time course purchases
  subscriptionId    String?       // For subscription payments
  couponId          String?
  metadata          Json?
  createdAt         DateTime      @default(now())

  @@index([userId])
  @@index([stripePaymentId])
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELLED
  EXPIRED
  TRIALING
}

enum PlanType {
  FREE
  PRO_MONTHLY
  PRO_ANNUAL
  ENTERPRISE
}

model Subscription {
  id                   String             @id @default(cuid())
  userId               String
  plan                 PlanType
  status               SubscriptionStatus @default(ACTIVE)
  stripeSubscriptionId String?            @unique
  stripeCustomerId     String?
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean            @default(false)
  trialEnd             DateTime?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  @@index([userId])
  @@index([stripeSubscriptionId])
}

model Coupon {
  id              String   @id @default(cuid())
  code            String   @unique
  description     String?
  discountType    String   // "percentage" or "fixed"
  discountValue   Float    // e.g., 20 for 20% or 10 for $10 off
  maxUses         Int?
  currentUses     Int      @default(0)
  minPurchase     Float?
  courseId         String?  // null = applies to any course
  course          Course?  @relation(fields: [courseId], references: [id])
  validFrom       DateTime @default(now())
  validUntil      DateTime?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())

  @@index([code])
}

model Payout {
  id           String   @id @default(cuid())
  instructorId String
  instructor   InstructorProfile @relation(fields: [instructorId], references: [id])
  amount       Float
  currency     String   @default("usd")
  status       String   // "pending", "processing", "completed", "failed"
  stripeTransferId String?
  periodStart  DateTime
  periodEnd    DateTime
  createdAt    DateTime @default(now())

  @@index([instructorId])
}

// ============================================
// REVIEWS & RATINGS
// ============================================

model Review {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  courseId   String
  course    Course   @relation(fields: [courseId], references: [id])
  rating    Int      // 1-5
  title     String?
  comment   String?
  isVerified Boolean @default(false) // Verified purchase
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, courseId])
  @@index([courseId])
}

// ============================================
// GAMIFICATION
// ============================================

model StudyStreak {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  date      DateTime @db.Date
  minutes   Int      // Minutes studied that day

  @@unique([userId, date])
  @@index([userId])
}

model Badge {
  id          String      @id @default(cuid())
  name        String      @unique
  description String
  icon        String
  criteria    Json        // { type: "courses_completed", value: 5 }
  users       UserBadge[]
}

model UserBadge {
  id       String   @id @default(cuid())
  userId   String
  user     User     @relation(fields: [userId], references: [id])
  badgeId  String
  badge    Badge    @relation(fields: [badgeId], references: [id])
  earnedAt DateTime @default(now())

  @@unique([userId, badgeId])
}

// ============================================
// NOTIFICATIONS
// ============================================

enum NotificationType {
  COURSE_UPDATE
  LIVE_SESSION_REMINDER
  QUIZ_RESULT
  CERTIFICATE_ISSUED
  PAYMENT_RECEIPT
  PROMOTION
  SYSTEM
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id])
  type      NotificationType
  title     String
  message   String
  link      String?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  @@index([userId, isRead])
  @@index([createdAt])
}
```

---

## Index Strategy

| Table | Index | Purpose |
|-------|-------|---------|
| User | email | Login lookup |
| Course | slug | URL resolution |
| Course | status, level | Catalog filtering |
| Enrollment | userId + courseId | Unique constraint + lookup |
| LessonProgress | userId + lessonId | Progress tracking |
| Payment | stripePaymentId | Webhook processing |
| LiveSchedule | startTime | Upcoming sessions query |
| Notification | userId + isRead | Unread count |

---

## Data Retention

| Data | Retention |
|------|-----------|
| User accounts | Until deletion request |
| Course content | Permanent (while published) |
| Quiz attempts | 2 years |
| Payment records | 7 years (legal requirement) |
| Notifications | 90 days |
| Session data | Until expiry |
| Video analytics | 1 year |
