import { AppShell } from "@/components/app-shell";
import { InventoryModule } from "@/app/inventory/inventory-module";

export default function AdjustmentPage() {
  return (
    <AppShell>
      <InventoryModule view="adjustment" />
    </AppShell>
  );
}
