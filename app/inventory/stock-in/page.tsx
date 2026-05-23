import { AppShell } from "@/components/app-shell";
import { InventoryModule } from "@/app/inventory/inventory-module";

export default function StockInPage() {
  return (
    <AppShell>
      <InventoryModule view="stock-in" />
    </AppShell>
  );
}
