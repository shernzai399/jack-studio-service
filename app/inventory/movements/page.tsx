import { AppShell } from "@/components/app-shell";
import { InventoryModule } from "@/app/inventory/inventory-module";

export default function MovementsPage() {
  return (
    <AppShell>
      <InventoryModule view="movements" />
    </AppShell>
  );
}
