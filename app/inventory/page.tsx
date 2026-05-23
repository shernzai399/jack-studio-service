import { AppShell } from "@/components/app-shell";
import { StockManager } from "@/app/inventory/stock-manager";

export default function InventoryPage() {
  return (
    <AppShell>
      <StockManager />
    </AppShell>
  );
}
