"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Camera, CircleDollarSign, UserRound } from "lucide-react";
import { Card, Field, PrimaryButton, inputClass } from "@/components/ui";
import { serviceOrderStatuses, type ServiceOrderStatus } from "@/lib/types";
import { createServiceOrder } from "@/app/service-orders/service-order-store";
import { fetchStoreNames } from "@/lib/supabase/data";

export function ServiceOrderForm() {
  const [savedOrderNo, setSavedOrderNo] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [stores, setStores] = useState<string[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    preferredContact: "WhatsApp",
    serviceType: "Luggage repair",
    storeName: "",
    itemBrand: "",
    itemModel: "",
    itemColor: "",
    expectedCompletionDate: "",
    itemDescription: "",
    issueDescription: "",
    quotationAmount: "",
    paymentStatus: "unpaid",
    status: "New Request" as ServiceOrderStatus,
    quotationNotes: ""
  });

  useEffect(() => {
    async function loadStores() {
      try {
        const storeNames = await fetchStoreNames();
        setStores(storeNames);
        setForm((current) => ({ ...current, storeName: current.storeName || storeNames[0] || "" }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load outlets.");
      }
    }

    loadStores();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.customerName.trim()) {
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      const order = await createServiceOrder({
        customerName: form.customerName.trim(),
        phone: form.phone,
        email: form.email,
        preferredContact: form.preferredContact,
        storeName: form.storeName,
        serviceType: form.serviceType,
        itemBrand: form.itemBrand,
        itemModel: form.itemModel,
        itemColor: form.itemColor,
        expectedCompletionDate: form.expectedCompletionDate,
        itemDescription: form.itemDescription,
        issueDescription: form.issueDescription,
        status: form.status,
        paymentStatus: form.paymentStatus,
        quotationAmount: Number(form.quotationAmount) || 0,
        quotationNotes: form.quotationNotes
      });

      setSavedOrderNo(order.orderNo);
      setForm({
        ...form,
        customerName: "",
        phone: "",
        email: "",
        itemBrand: "",
        itemModel: "",
        itemColor: "",
        expectedCompletionDate: "",
        itemDescription: "",
        issueDescription: "",
        quotationAmount: "",
        status: "New Request",
        quotationNotes: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create service order.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="grid gap-6">
        {savedOrderNo && (
          <Card className="border-emerald-200 bg-emerald-50">
            <p className="font-semibold text-emerald-900">Service order created: {savedOrderNo}</p>
            <Link href="/service-orders" className="mt-2 inline-block text-sm font-semibold text-emerald-800 underline">
              View service order list
            </Link>
          </Card>
        )}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <p className="font-semibold text-red-900">{error}</p>
          </Card>
        )}

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <UserRound size={20} className="text-clay" />
            <h3 className="text-lg font-semibold">Customer Information</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Customer name">
              <input className={inputClass} value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="Full name" />
            </Field>
            <Field label="Phone number">
              <input className={inputClass} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+60..." />
            </Field>
            <Field label="Email">
              <input className={inputClass} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" placeholder="customer@email.com" />
            </Field>
            <Field label="Preferred contact">
              <select className={inputClass} value={form.preferredContact} onChange={(event) => setForm({ ...form, preferredContact: event.target.value })}>
                <option>WhatsApp</option>
                <option>Phone call</option>
                <option>Email</option>
              </select>
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold">Service Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Service type">
              <select className={inputClass} value={form.serviceType} onChange={(event) => setForm({ ...form, serviceType: event.target.value })}>
                <option>Luggage repair</option>
                <option>Leather care service</option>
                <option>Handcraft service</option>
                <option>Engraving and customization</option>
              </select>
            </Field>
            <Field label="Outlet drop-off location">
              <select className={inputClass} value={form.storeName} onChange={(event) => setForm({ ...form, storeName: event.target.value })}>
                {stores.map((store) => (
                  <option key={store}>{store}</option>
                ))}
              </select>
            </Field>
            <Field label="Item brand">
              <input className={inputClass} value={form.itemBrand} onChange={(event) => setForm({ ...form, itemBrand: event.target.value })} placeholder="Brand" />
            </Field>
            <Field label="Item model / code">
              <input className={inputClass} value={form.itemModel} onChange={(event) => setForm({ ...form, itemModel: event.target.value })} placeholder="Model, SKU, or serial" />
            </Field>
            <Field label="Item color">
              <input className={inputClass} value={form.itemColor} onChange={(event) => setForm({ ...form, itemColor: event.target.value })} placeholder="Color" />
            </Field>
            <Field label="Expected completion date">
              <input className={inputClass} value={form.expectedCompletionDate} onChange={(event) => setForm({ ...form, expectedCompletionDate: event.target.value })} type="date" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Item description">
                <textarea className={inputClass} value={form.itemDescription} onChange={(event) => setForm({ ...form, itemDescription: event.target.value })} rows={3} placeholder="Describe the item received from customer" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Issue description">
                <textarea className={inputClass} value={form.issueDescription} onChange={(event) => setForm({ ...form, issueDescription: event.target.value })} rows={4} placeholder="Damage, requested repair, special handling notes" />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Camera size={20} className="text-clay" />
            <h3 className="text-lg font-semibold">Photo Upload</h3>
          </div>
          <div className="rounded-md border border-dashed border-black/20 bg-linen/45 p-6 text-center">
            <input className="mx-auto block text-sm" name="photos" type="file" accept="image/*" multiple />
            <p className="mt-3 text-sm text-moss">Upload front, back, defect close-up, and receipt photos.</p>
          </div>
        </Card>
      </div>

      <aside className="grid h-fit gap-6">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <CircleDollarSign size={20} className="text-clay" />
            <h3 className="text-lg font-semibold">Quotation</h3>
          </div>
          <div className="grid gap-4">
            <Field label="Quotation amount">
              <input className={inputClass} value={form.quotationAmount} onChange={(event) => setForm({ ...form, quotationAmount: event.target.value })} min="0" step="0.01" type="number" placeholder="0.00" />
            </Field>
            <Field label="Payment status">
              <select className={inputClass} value={form.paymentStatus} onChange={(event) => setForm({ ...form, paymentStatus: event.target.value })}>
                <option value="unpaid">Unpaid</option>
                <option value="deposit_paid">Deposit paid</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="waived">Waived</option>
              </select>
            </Field>
            <Field label="Repair status">
              <select className={inputClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ServiceOrderStatus })}>
                {serviceOrderStatuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </Field>
            <Field label="Quotation notes">
              <textarea className={inputClass} value={form.quotationNotes} onChange={(event) => setForm({ ...form, quotationNotes: event.target.value })} rows={5} />
            </Field>
            <PrimaryButton type="submit">{isSaving ? "Creating..." : "Create service order"}</PrimaryButton>
          </div>
        </Card>
      </aside>
    </form>
  );
}
