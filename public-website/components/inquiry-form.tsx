"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { contactOptions, productTypes, serviceTypes, stores } from "@/lib/site-data";
import { savePublicInquiry } from "@/lib/supabase";

const inputClass = "min-h-11 rounded-md border border-espresso/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25";

export function InquiryForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    whatsappNumber: "",
    email: "",
    serviceType: serviceTypes[0],
    productType: productTypes[0],
    problemDescription: "",
    preferredStore: stores[0],
    preferredContactTime: contactOptions[0]
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.customerName.trim() || !form.whatsappNumber.trim() || !form.problemDescription.trim()) {
      setError("Please fill in your name, WhatsApp number and item problem.");
      return;
    }

    setIsSaving(true);
    try {
      await savePublicInquiry({ ...form, photos });
      setMessage("Thank you. Our team will contact you through WhatsApp soon.");
      setForm({
        customerName: "",
        whatsappNumber: "",
        email: "",
        serviceType: serviceTypes[0],
        productType: productTypes[0],
        problemDescription: "",
        preferredStore: stores[0],
        preferredContactTime: contactOptions[0]
      });
      setPhotos(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit inquiry now. Please WhatsApp us for help.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-md border border-espresso/10 bg-white p-5 shadow-soft md:p-8">
      {message && <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-900">{message}</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-900">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Customer name">
          <input className={inputClass} value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} />
        </Field>
        <Field label="WhatsApp number">
          <input className={inputClass} value={form.whatsappNumber} onChange={(event) => setForm({ ...form, whatsappNumber: event.target.value })} placeholder="+60..." />
        </Field>
        <Field label="Email">
          <input className={inputClass} type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </Field>
        <Field label="Service type">
          <select className={inputClass} value={form.serviceType} onChange={(event) => setForm({ ...form, serviceType: event.target.value })}>
            {serviceTypes.map((service) => <option key={service}>{service}</option>)}
          </select>
        </Field>
        <Field label="Product type">
          <select className={inputClass} value={form.productType} onChange={(event) => setForm({ ...form, productType: event.target.value })}>
            {productTypes.map((product) => <option key={product}>{product}</option>)}
          </select>
        </Field>
        <Field label="Preferred store">
          <select className={inputClass} value={form.preferredStore} onChange={(event) => setForm({ ...form, preferredStore: event.target.value })}>
            {stores.map((store) => <option key={store}>{store}</option>)}
          </select>
        </Field>
        <Field label="Preferred contact time">
          <select className={inputClass} value={form.preferredContactTime} onChange={(event) => setForm({ ...form, preferredContactTime: event.target.value })}>
            {contactOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </Field>
        <Field label="Photo upload">
          <input className={inputClass} type="file" accept="image/*" multiple onChange={(event) => setPhotos(event.target.files)} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Problem description">
            <textarea className={inputClass} rows={5} value={form.problemDescription} onChange={(event) => setForm({ ...form, problemDescription: event.target.value })} placeholder="Tell us what happened, what you want repaired, or what you want customized." />
          </Field>
        </div>
      </div>
      <button type="submit" className="min-h-11 rounded-md bg-espresso px-5 text-sm font-semibold text-cream transition hover:bg-leather">
        {isSaving ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-espresso">
      {label}
      {children}
    </label>
  );
}
