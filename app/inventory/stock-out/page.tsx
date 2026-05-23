import { AppShell } from "@/components/app-shell";
import { InventoryModule } from "@/app/inventory/inventory-module";

export default function StockOutPage() {
  return (
    <AppShell>
      <InventoryModule view="stock-out" />
    </AppShell>
  );
}
