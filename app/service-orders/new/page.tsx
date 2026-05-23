import { AppShell } from "@/components/app-shell";
import { ServiceOrderForm } from "@/app/service-orders/new/service-order-form";

export default function NewServiceOrderPage() {
  return (
    <AppShell>
      <ServiceOrderForm />
    </AppShell>
  );
}
