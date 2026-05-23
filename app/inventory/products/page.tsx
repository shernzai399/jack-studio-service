import { AppShell } from "@/components/app-shell";
import { InventoryModule } from "@/app/inventory/inventory-module";

export default function ProductsPage() {
  return (
    <AppShell>
      <InventoryModule view="products" />
    </AppShell>
  );
}
