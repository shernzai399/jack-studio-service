"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { Card, Field, PrimaryButton, inputClass } from "@/components/ui";
import { storeRequestStatuses, type StoreRequestStatus } from "@/lib/types";
import { createStoreRequestInSupabase, fetchStoreNames } from "@/lib/supabase/data";

type RequestItem = {
  sku: string;
  productName: string;
  requestedQuantity: string;
};

export function StoreRequestForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");
  const [stores, setStores] = useState<string[]>([]);
  const [form, setForm] = useState({
    requestType: "replenishment",
    priority: "normal" as "low" | "normal" | "urgent",
    fromStoreName: "",
    toStoreName: "",
    reason: "",
    status: "New Request" as StoreRequestStatus,
    hqNotes: ""
  });
  const [items, setItems] = useState<RequestItem[]>([
    { sku: "", productName: "", requestedQuantity: "1" },
    { sku: "", productName: "", requestedQuantity: "1" },
    { sku: "", productName: "", requestedQuantity: "1" }
  ]);

  useEffect(() => {
    async function loadStores() {
      try {
        const storeNames = await fetchStoreNames();
        setStores(storeNames);
        setForm((current) => ({
          ...current,
          fromStoreName: current.fromStoreName || storeNames[0] || "",
          toStoreName: current.toStoreName || storeNames[0] || ""
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load outlets.");
      }
    }

    loadStores();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setSavedMessage("");
    setError("");

    try {
      await createStoreRequestInSupabase({
        requestType: form.requestType,
        priority: form.priority,
        fromStoreName: form.fromStoreName,
        toStoreName: form.toStoreName,
        reason: form.reason,
        status: form.status,
        hqNotes: form.hqNotes,
        items: items.map((item) => ({
          sku: item.sku,
          productName: item.productName,
          requestedQuantity: Number(item.requestedQuantity) || 0
        }))
      });
      setSavedMessage("Store request saved to Supabase.");
      setForm({ ...form, reason: "", hqNotes: "", status: "New Request" });
      setItems(items.map(() => ({ sku: "", productName: "", requestedQuantity: "1" })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save store request.");
    } finally {
      setIsSaving(false);
    }
  }

  function updateItem(index: number, value: Partial<RequestItem>) {
    setItems(items.map((item, itemIndex) => itemIndex === index ? { ...item, ...value } : item));
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="grid gap-6">
        {savedMessage && <Card className="border-emerald-200 bg-emerald-50"><p className="font-semibold text-emerald-900">{savedMessage}</p></Card>}
        {error && <Card className="border-red-200 bg-red-50"><p className="font-semibold text-red-900">{error}</p></Card>}

        <Card>
          <h3 className="mb-4 text-lg font-semibold">Store Operation Request</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Request type">
              <select className={inputClass} value={form.requestType} onChange={(event) => setForm({ ...form, requestType: event.target.value })}>
                <option value="replenishment">Replenishment request</option>
                <option value="stock_transfer">Stock transfer request</option>
                <option value="new_product">New product request</option>
                <option value="backorder">Backorder request</option>
                <option value="special_product">Special product request</option>
              </select>
            </Field>
            <Field label="Priority">
              <select className={inputClass} value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as "low" | "normal" | "urgent" })}>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="low">Low</option>
              </select>
            </Field>
            <Field label="Requesting store">
              <select className={inputClass} value={form.fromStoreName} onChange={(event) => setForm({ ...form, fromStoreName: event.target.value })}>
                {stores.map((store) => <option key={store}>{store}</option>)}
              </select>
            </Field>
            <Field label="Destination / transfer store">
              <select className={inputClass} value={form.toStoreName} onChange={(event) => setForm({ ...form, toStoreName: event.target.value })}>
                {stores.map((store) => <option key={store}>{store}</option>)}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Business reason">
                <textarea className={inputClass} value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} rows={4} placeholder="Customer demand, low stock, campaign need, product issue, or urgent transfer reason" />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Request Items</h3>
            <button type="button" onClick={() => setItems([...items, { sku: "", productName: "", requestedQuantity: "1" }])} className="inline-flex min-h-9 items-center gap-2 rounded-md border border-black/15 px-3 text-sm font-medium">
              <Plus size={16} />
              Add item
            </button>
          </div>
          <div className="grid gap-3">
            {items.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-md border border-black/10 p-3 md:grid-cols-[1fr_1.5fr_120px]">
                <Field label="SKU">
                  <input className={inputClass} value={item.sku} onChange={(event) => updateItem(index, { sku: event.target.value })} placeholder="JS-..." />
                </Field>
                <Field label="Product name">
                  <input className={inputClass} value={item.productName} onChange={(event) => updateItem(index, { productName: event.target.value })} placeholder="Product name or special product description" />
                </Field>
                <Field label="Qty">
                  <input className={inputClass} value={item.requestedQuantity} onChange={(event) => updateItem(index, { requestedQuantity: event.target.value })} min="1" type="number" />
                </Field>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <aside className="grid h-fit gap-6">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-clay" />
            <h3 className="text-lg font-semibold">HQ Approval Workflow</h3>
          </div>
          <div className="grid gap-4">
            <Field label="Request status">
              <select className={inputClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as StoreRequestStatus })}>
                {storeRequestStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </Field>
            <Field label="HQ notes">
              <textarea className={inputClass} value={form.hqNotes} onChange={(event) => setForm({ ...form, hqNotes: event.target.value })} rows={5} placeholder="Approval, rejection, allocation, stock ETA, or fulfillment notes" />
            </Field>
            <PrimaryButton type="submit">{isSaving ? "Saving..." : "Submit request"}</PrimaryButton>
          </div>
        </Card>
      </aside>
    </form>
  );
}
