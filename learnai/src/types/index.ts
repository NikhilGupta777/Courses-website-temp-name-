// Core application types

export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export type CourseStatus = "DRAFT" | "UNDER_REVIEW" | "PUBLISHED" | "ARCHIVED";

export type DeliveryMode = "LIVE_ONLINE" | "OFFLINE_WORKSHOP" | "PRE_RECORDED" | "HYBRID";

export type LessonType = "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT" | "LIVE_SESSION" | "RESOURCE";

export type PlanType = "FREE" | "PRO_MONTHLY" | "PRO_ANNUAL" | "ENTERPRISE";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  bio: string | null;
  headline: string | null;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string;
  thumbnail: string | null;
  level: CourseLevel;
  status: CourseStatus;
  deliveryMode: DeliveryMode;
  duration: number | null;
  price: number | null;
  originalPrice: number | null;
  isFree: boolean;
  isFeatured: boolean;
  tags: string[];
  learningOutcomes: string[];
  totalStudents: number;
  averageRating: number;
  totalReviews: number;
  instructor: {
    displayName: string;
    userId: string;
  };
  category: {
    name: string;
    slug: string;
  } | null;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  position: number;
  duration: number | null;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number | null;
  isFree: boolean;
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  earnedPoints: number;
  passed: boolean;
  timeTaken: number;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  verificationUrl: string;
  pdfUrl: string | null;
  issuedAt: string;
  course: {
    title: string;
  };
}

export interface Enrollment {
  id: string;
  progress: number;
  enrolledAt: string;
  course: Course;
}

export interface DashboardData {
  enrollments: Enrollment[];
  certificates: Certificate[];
  recentQuizzes: QuizResult[];
  stats: {
    totalEnrolled: number;
    totalCertificates: number;
  };
}
