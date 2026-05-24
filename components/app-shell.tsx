"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeftRight, Boxes, ClipboardList, LayoutDashboard, LogOut, Menu, PackagePlus, PackageSearch, Settings, SlidersHorizontal, X } from "lucide-react";
import { getInternalSession, signOutInternal, type InternalSession } from "@/lib/internal-auth";

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
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<InternalSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const currentSession = getInternalSession();
    if (!currentSession) {
      router.replace("/sign-in");
      return;
    }

    setSession(currentSession);
    setIsCheckingSession(false);
  }, [router]);

  function handleSignOut() {
    signOutInternal();
    router.replace("/sign-in");
  }

  if (isCheckingSession) {
    return (
      <div className="grid min-h-screen place-items-center bg-pearl px-4">
        <p className="text-sm text-moss">Checking sign in...</p>
      </div>
    );
  }

  const navigation = (
    <nav className="grid gap-1 px-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-white/78 transition hover:bg-white/10 hover:text-white"
          >
            <Icon aria-hidden size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-pearl">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-black/10 bg-ink text-white lg:block">
        <div className="px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">JACK STUDIO</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">Service</h1>
        </div>
        {navigation}
      </aside>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/35"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative h-full w-72 max-w-[86vw] border-r border-black/10 bg-ink py-4 text-white shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3 px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">JACK STUDIO</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-normal">Service</h1>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-md bg-white/10 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            {navigation}
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-black/10 bg-pearl/90 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <button
                type="button"
                aria-label="Open menu"
                className="grid size-10 shrink-0 place-items-center rounded-md border border-black/10 bg-white text-ink lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">13 outlets connected</p>
                <h2 className="text-xl font-semibold text-ink">Central Service Operations</h2>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-moss">
              <span>Signed in as: {session?.displayName ?? "Super Admin"}</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex min-h-8 items-center gap-1 rounded-md border border-black/10 px-2 text-xs font-semibold text-ink hover:bg-linen"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
