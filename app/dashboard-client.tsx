"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ClipboardCheck, PackageCheck, WalletCards } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import type { ServiceOrder, StoreRequest } from "@/lib/types";
import { fetchDashboardData, fetchServiceOrders, fetchStoreRequests } from "@/lib/supabase/data";

type DashboardData = Awaited<ReturnType<typeof fetchDashboardData>>;

export function DashboardClient() {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [storeRequests, setStoreRequests] = useState<StoreRequest[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData>({
    totalRepairOrders: 0,
    pendingRepairOrders: 0,
    totalSku: 0,
    lowStockItems: 0,
    pendingStoreRequests: 0,
    recentStockMovements: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      setError("");
      try {
        const [dashboardData, orders, requests] = await Promise.all([
          fetchDashboardData(),
          fetchServiceOrders(),
          fetchStoreRequests()
        ]);
        setDashboard(dashboardData);
        setServiceOrders(orders.slice(0, 5));
        setStoreRequests(requests.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const metrics = [
    { label: "Total repair orders", value: String(dashboard.totalRepairOrders), icon: ClipboardCheck },
    { label: "Pending repair orders", value: String(dashboard.pendingRepairOrders), icon: PackageCheck },
    { label: "Total SKU", value: String(dashboard.totalSku), icon: WalletCards },
    { label: "Low stock items", value: String(dashboard.lowStockItems), icon: AlertTriangle }
  ];

  return (
    <div className="grid gap-6">
      {isLoading && <p className="text-sm text-moss">Loading dashboard...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-moss">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-ink">{metric.value}</p>
                </div>
                <div className="grid size-11 place-items-center rounded-md bg-linen text-clay">
                  <Icon aria-hidden size={22} />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Service Module</h3>
            <Badge tone="warn">Service review queue</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-moss">
                <tr>
                  <th className="py-3">Order</th>
                  <th>Customer</th>
                  <th>Store</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {serviceOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-medium">{order.orderNo}</td>
                    <td>{order.customerName}</td>
                    <td>{order.storeName}</td>
                    <td>{order.serviceType}</td>
                    <td><Badge>{order.status}</Badge></td>
                    <td>{order.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Low Stock</h3>
            <Badge tone="danger">{dashboard.lowStockItems} alerts</Badge>
          </div>
          <div className="grid gap-3">
            <div className="rounded-md border border-red-100 bg-red-50 p-3">
              <p className="font-medium text-red-950">Low stock items</p>
              <p className="mt-1 text-sm text-red-800">
                {dashboard.lowStockItems} SKU/location balances are at or below reorder level.
              </p>
            </div>
            <div className="rounded-md border border-black/10 bg-white p-3">
              <p className="font-medium text-ink">Recent stock movements</p>
              <p className="mt-1 text-sm text-moss">{dashboard.recentStockMovements.length} recent movements loaded from Supabase.</p>
            </div>
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Store Operation Module</h3>
          <Badge tone="good">{dashboard.pendingStoreRequests} pending</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-moss">
              <tr>
                <th className="py-3">Request</th>
                <th>Type</th>
                <th>Store</th>
                <th>Items</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {storeRequests.map((request) => (
                <tr key={request.id}>
                  <td className="py-3 font-medium">{request.requestNo}</td>
                  <td>{request.requestType}</td>
                  <td>{request.storeName}</td>
                  <td>{request.itemCount}</td>
                  <td>{request.priority}</td>
                  <td><Badge>{request.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
