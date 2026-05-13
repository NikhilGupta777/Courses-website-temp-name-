// Dashboard pages share the main layout but NOT the marketing header
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
