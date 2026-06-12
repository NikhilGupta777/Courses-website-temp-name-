import { AiTutorWidget } from "@/components/ai-tutor/AiTutorWidget";

// Dashboard pages share the main layout but NOT the marketing header.
// We mount the floating AI Tutor widget here so it's available on every
// dashboard page (overview, courses, learn, profile, certificates).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AiTutorWidget />
    </>
  );
}
