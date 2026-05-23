import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftRight, Boxes, ClipboardList, LayoutDashboard, PackagePlus, PackageSearch, Settings, SlidersHorizontal } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/service-orders", label: "Service List", icon: ClipboardList },
  { href: "/service-orders/new", label: "New Service", icon: ClipboardList },
  { href: "/store-requests/new", label: "Store Request", icon: Boxes },
  { href: "/inventory", label: "Inventory Dashboard", icon: PackageSearch },
  { href: "/inventory/products", label: "Product List", icon: Boxes },
  { href: "/inventory/stock-in", label: "Add Stock", icon: PackagePlus },
  { href: "/inventory/stock-out", label: "Stock Out", icon: ArrowLeftRight },
  { href: "/inventory/movements", label: "Movement History", icon: ClipboardList },
  { href: "/inventory/adjustment", label: "Stock Adjustment", icon: SlidersHorizontal },
  { href: "/admin/permissions", label: "Permissions", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-pearl">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-black/10 bg-ink text-white lg:block">
        <div className="px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">JACK STUDIO</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">Service</h1>
        </div>
        <nav className="grid gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-white/78 transition hover:bg-white/10 hover:text-white"
              >
                <Icon aria-hidden size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-black/10 bg-pearl/90 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">13 outlets connected</p>
              <h2 className="text-xl font-semibold text-ink">Central Service Operations</h2>
            </div>
            <div className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-moss">
              Signed in as: Super Admin
            </div>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
