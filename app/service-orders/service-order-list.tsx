"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { serviceOrderStatuses } from "@/lib/types";
import { loadServiceOrders, saveServiceOrders } from "@/app/service-orders/service-order-store";

export function ServiceOrderList() {
  const [orders, setOrders] = useState(loadServiceOrders);
  const [storeFilter, setStoreFilter] = useState("All outlets");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const stores = useMemo(
    () => Array.from(new Set(orders.map((order) => order.storeName))).sort(),
    [orders]
  );

  const filteredOrders = orders.filter((order) => {
    const storeMatches = storeFilter === "All outlets" || order.storeName === storeFilter;
    const statusMatches = statusFilter === "All statuses" || order.status === statusFilter;
    return storeMatches && statusMatches;
  });

  const openOrders = orders.filter((order) => !["Completed", "Cancelled"].includes(order.status)).length;
  const waitingReview = orders.filter((order) => order.status === "Waiting Review" || order.status === "New Request").length;

  function resetDemoOrders() {
    window.localStorage.removeItem("jack-studio-service-orders");
    const nextOrders = loadServiceOrders();
    setOrders(nextOrders);
    saveServiceOrders(nextOrders);
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-moss">Total service orders</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{orders.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-moss">Open orders</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{openOrders}</p>
        </Card>
        <Card>
          <p className="text-sm text-moss">Need review</p>
          <p className="mt-2 text-3xl font-semibold text-amber-700">{waitingReview}</p>
        </Card>
      </section>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Outlet Service Order List</h3>
            <p className="mt-1 text-sm text-moss">Every new service request created by an outlet appears here for Super Admin review.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/service-orders/new" className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-moss">
              Add new service
            </Link>
            <button type="button" onClick={resetDemoOrders} className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-linen">
              Reset demo list
            </button>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <select className="min-h-10 rounded-md border border-black/15 bg-white px-3 text-sm" value={storeFilter} onChange={(event) => setStoreFilter(event.target.value)}>
            <option>All outlets</option>
            {stores.map((store) => <option key={store}>{store}</option>)}
          </select>
          <select className="min-h-10 rounded-md border border-black/15 bg-white px-3 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>All statuses</option>
            {serviceOrderStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-moss">
              <tr>
                <th className="py-3">Order</th>
                <th>Customer</th>
                <th>Outlet</th>
                <th>Service</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Quotation</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 font-medium">{order.orderNo}</td>
                  <td>{order.customerName}</td>
                  <td>{order.storeName}</td>
                  <td>{order.serviceType}</td>
                  <td><Badge>{order.status}</Badge></td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.quotationAmount ? `RM ${order.quotationAmount.toFixed(2)}` : "-"}</td>
                  <td>{order.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
