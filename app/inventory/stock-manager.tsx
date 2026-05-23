"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { Badge, Card, Field, PrimaryButton, inputClass } from "@/components/ui";
import { inventoryRows, stores } from "@/lib/mock-data";
import type { InventoryRow } from "@/lib/types";

const storageKey = "jack-studio-service-inventory";

function loadInventory() {
  if (typeof window === "undefined") {
    return inventoryRows;
  }

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) {
    return inventoryRows;
  }

  try {
    return JSON.parse(saved) as InventoryRow[];
  } catch {
    return inventoryRows;
  }
}

export function StockManager() {
  const [rows, setRows] = useState<InventoryRow[]>(loadInventory);
  const [form, setForm] = useState({
    storeName: stores[0],
    sku: "",
    productName: "",
    quantity: "1",
    reorderLevel: "3"
  });

  const totalStock = useMemo(
    () => rows.reduce((sum, row) => sum + row.onHand, 0),
    [rows]
  );

  const totalReserved = useMemo(
    () => rows.reduce((sum, row) => sum + row.reserved, 0),
    [rows]
  );

  const uniqueProducts = useMemo(
    () => new Set(rows.map((row) => row.sku)).size,
    [rows]
  );

  function saveRows(nextRows: InventoryRow[]) {
    setRows(nextRows);
    window.localStorage.setItem(storageKey, JSON.stringify(nextRows));
  }

  function addStock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const quantity = Number(form.quantity);
    const reorderLevel = Number(form.reorderLevel);
    const sku = form.sku.trim().toUpperCase();
    const productName = form.productName.trim();

    if (!sku || !productName || !Number.isFinite(quantity) || quantity <= 0) {
      return;
    }

    const existingIndex = rows.findIndex(
      (row) => row.storeName === form.storeName && row.sku.toUpperCase() === sku
    );

    const nextRows = [...rows];
    if (existingIndex >= 0) {
      nextRows[existingIndex] = {
        ...nextRows[existingIndex],
        productName,
        onHand: nextRows[existingIndex].onHand + quantity,
        reorderLevel: Number.isFinite(reorderLevel) && reorderLevel >= 0 ? reorderLevel : nextRows[existingIndex].reorderLevel
      };
    } else {
      nextRows.unshift({
        storeName: form.storeName,
        sku,
        productName,
        onHand: quantity,
        reserved: 0,
        reorderLevel: Number.isFinite(reorderLevel) && reorderLevel >= 0 ? reorderLevel : 3
      });
    }

    saveRows(nextRows);
    setForm((current) => ({
      ...current,
      sku: "",
      productName: "",
      quantity: "1"
    }));
  }

  function resetDemoStock() {
    saveRows(inventoryRows);
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-moss">Total stock on hand</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{totalStock}</p>
        </Card>
        <Card>
          <p className="text-sm text-moss">Total reserved stock</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{totalReserved}</p>
        </Card>
        <Card>
          <p className="text-sm text-moss">Unique SKUs</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{uniqueProducts}</p>
        </Card>
      </section>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Super Admin Stock Control</h3>
            <p className="mt-1 text-sm text-moss">Add stock by outlet and see totals update instantly.</p>
          </div>
          <button
            type="button"
            onClick={resetDemoStock}
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-black/15 bg-white px-3 text-sm font-semibold text-ink transition hover:bg-linen"
          >
            <RotateCcw size={16} />
            Reset demo stock
          </button>
        </div>

        <form onSubmit={addStock} className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1.4fr_0.7fr_0.8fr_auto]">
          <Field label="Outlet">
            <select
              className={inputClass}
              value={form.storeName}
              onChange={(event) => setForm({ ...form, storeName: event.target.value })}
            >
              {stores.map((store) => (
                <option key={store}>{store}</option>
              ))}
            </select>
          </Field>
          <Field label="SKU">
            <input
              className={inputClass}
              value={form.sku}
              onChange={(event) => setForm({ ...form, sku: event.target.value })}
              placeholder="JS-..."
            />
          </Field>
          <Field label="Product name">
            <input
              className={inputClass}
              value={form.productName}
              onChange={(event) => setForm({ ...form, productName: event.target.value })}
              placeholder="Product name"
            />
          </Field>
          <Field label="Add qty">
            <input
              className={inputClass}
              value={form.quantity}
              min="1"
              onChange={(event) => setForm({ ...form, quantity: event.target.value })}
              type="number"
            />
          </Field>
          <Field label="Reorder level">
            <input
              className={inputClass}
              value={form.reorderLevel}
              min="0"
              onChange={(event) => setForm({ ...form, reorderLevel: event.target.value })}
              type="number"
            />
          </Field>
          <div className="flex items-end">
            <PrimaryButton type="submit">
              <span className="inline-flex items-center gap-2">
                <Plus size={16} />
                Add stock
              </span>
            </PrimaryButton>
          </div>
        </form>
      </Card>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Inventory Tracking by Store</h3>
            <p className="mt-1 text-sm text-moss">Store-level stock, reserved quantity, and low stock alert thresholds.</p>
          </div>
          <Badge tone="warn">Auto alert when on hand {"<="} reorder level</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-moss">
              <tr>
                <th className="py-3">Store</th>
                <th>SKU</th>
                <th>Product</th>
                <th>On hand</th>
                <th>Reserved</th>
                <th>Reorder level</th>
                <th>Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {rows.map((row) => {
                const isLow = row.onHand <= row.reorderLevel;
                return (
                  <tr key={`${row.storeName}-${row.sku}`}>
                    <td className="py-3 font-medium">{row.storeName}</td>
                    <td>{row.sku}</td>
                    <td>{row.productName}</td>
                    <td>{row.onHand}</td>
                    <td>{row.reserved}</td>
                    <td>{row.reorderLevel}</td>
                    <td><Badge tone={isLow ? "danger" : "good"}>{isLow ? "Low stock" : "Healthy"}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
