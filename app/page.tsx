import { AppShell } from "@/components/app-shell";
import { DashboardClient } from "@/app/dashboard-client";

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardClient />
    </AppShell>
  );
}
