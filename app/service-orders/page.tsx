import { AppShell } from "@/components/app-shell";
import { ServiceOrderList } from "@/app/service-orders/service-order-list";

export default function ServiceOrdersPage() {
  return (
    <AppShell>
      <ServiceOrderList />
    </AppShell>
  );
}
