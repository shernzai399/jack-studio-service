"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeftRight, ClipboardCheck, PackagePlus, SlidersHorizontal } from "lucide-react";
import { Badge, Card, Field, PrimaryButton, inputClass } from "@/components/ui";
import {
  applyStockAdjustment,
  applyStockIn,
  applyStockTransfer,
  fetchInventoryData,
  upsertProduct
} from "@/lib/supabase/data";
import type { Product, StockBalance, StockLocation, StockMovement } from "@/lib/types";

type InventoryView = "dashboard" | "products" | "stock-in" | "stock-out" | "movements" | "adjustment";

const lowStockThreshold = 5;

const navItems: { href: string; label: string; view: InventoryView }[] = [
  { href: "/inventory", label: "Dashboard", view: "dashboard" },
  { href: "/inventory/products", label: "Product List", view: "products" },
  { href: "/inventory/stock-in", label: "Add Stock", view: "stock-in" },
  { href: "/inventory/stock-out", label: "Stock Out", view: "stock-out" },
  { href: "/inventory/movements", label: "Movement History", view: "movements" },
  { href: "/inventory/adjustment", label: "Adjustment", view: "adjustment" }
];

export function InventoryModule({ view }: { view: InventoryView }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [balances, setBalances] = useState<StockBalance[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [stockInForm, setStockInForm] = useState({
    sku: "",
    productName: "",
    category: "Luggage Parts",
    color: "",
    size: "",
    quantity: "1",
    costPrice: "",
    sellingPrice: "",
    imageUrl: "",
    locationId: "",
    pic: "Super Admin",
    remarks: ""
  });
  const [stockOutForm, setStockOutForm] = useState({
    sourceLocationId: "",
    destinationLocationId: "",
    productId: "",
    quantity: "1",
    transferDate: "2026-05-24",
    pic: "Super Admin",
    remarks: ""
  });
  const [adjustmentForm, setAdjustmentForm] = useState({
    locationId: "",
    productId: "",
    quantity: "0",
    reason: "Stock take mismatch",
    date: "2026-05-24",
    pic: "Super Admin",
    remarks: ""
  });

  useEffect(() => {
    refreshInventory();
  }, []);

  async function refreshInventory() {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchInventoryData();
      setProducts(data.products);
      setLocations(data.locations);
      setBalances(data.balances);
      setMovements(data.movements);

      const hub = data.locations.find((location) => location.locationType === "Hub") ?? data.locations[0];
      const firstStore = data.locations.find((location) => location.locationType === "Store") ?? data.locations[0];
      const firstProduct = data.products[0];

      setStockInForm((current) => ({ ...current, locationId: current.locationId || hub?.id || "" }));
      setStockOutForm((current) => ({
        ...current,
        sourceLocationId: current.sourceLocationId || hub?.id || "",
        destinationLocationId: current.destinationLocationId || firstStore?.id || "",
        productId: current.productId || firstProduct?.id || ""
      }));
      setAdjustmentForm((current) => ({
        ...current,
        locationId: current.locationId || hub?.id || "",
        productId: current.productId || firstProduct?.id || ""
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load inventory data.");
    } finally {
      setIsLoading(false);
    }
  }

  const productTotals = useMemo(
    () => products.map((product) => ({
      product,
      total: balances
        .filter((balance) => balance.productId === product.id)
        .reduce((sum, balance) => sum + balance.quantity, 0)
    })),
    [balances, products]
  );

  const totalStock = productTotals.reduce((sum, item) => sum + item.total, 0);
  const lowStockItems = productTotals.filter((item) => item.total > 0 && item.total <= lowStockThreshold);
  const outOfStockItems = productTotals.filter((item) => item.total <= 0);

  function getProduct(productId: string) {
    return products.find((product) => product.id === productId);
  }

  function getLocation(locationId: string | null) {
    if (!locationId) {
      return "-";
    }

    return locations.find((location) => location.id === locationId)?.locationName ?? "-";
  }

  async function handleStockIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(stockInForm.quantity);
    if (!stockInForm.sku.trim() || !stockInForm.productName.trim() || quantity <= 0 || !stockInForm.locationId) {
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      const product = await upsertProduct({
        sku: stockInForm.sku.trim().toUpperCase(),
        productName: stockInForm.productName.trim(),
        category: stockInForm.category,
        color: stockInForm.color.trim(),
        size: stockInForm.size.trim(),
        costPrice: Number(stockInForm.costPrice) || 0,
        sellingPrice: Number(stockInForm.sellingPrice) || 0,
        imageUrl: stockInForm.imageUrl.trim()
      });
      await applyStockIn({
        productId: product.id,
        locationId: stockInForm.locationId,
        quantity,
        pic: stockInForm.pic,
        remarks: stockInForm.remarks
      });
      setStockInForm({ ...stockInForm, sku: "", productName: "", color: "", size: "", quantity: "1", costPrice: "", sellingPrice: "", imageUrl: "", remarks: "" });
      await refreshInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add stock.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStockOut(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(stockOutForm.quantity);
    const currentSource = balances.find(
      (balance) => balance.productId === stockOutForm.productId && balance.locationId === stockOutForm.sourceLocationId
    )?.quantity ?? 0;

    if (quantity <= 0 || currentSource < quantity || stockOutForm.sourceLocationId === stockOutForm.destinationLocationId) {
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await applyStockTransfer({
        productId: stockOutForm.productId,
        fromLocationId: stockOutForm.sourceLocationId,
        toLocationId: stockOutForm.destinationLocationId,
        quantity,
        pic: stockOutForm.pic,
        remarks: stockOutForm.remarks
      });
      setStockOutForm({ ...stockOutForm, quantity: "1", remarks: "" });
      await refreshInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to transfer stock.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAdjustment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(adjustmentForm.quantity);
    if (!quantity) {
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await applyStockAdjustment({
        productId: adjustmentForm.productId,
        locationId: adjustmentForm.locationId,
        quantityAdjusted: quantity,
        reason: adjustmentForm.reason,
        pic: adjustmentForm.pic,
        remarks: adjustmentForm.remarks
      });
      setAdjustmentForm({ ...adjustmentForm, quantity: "0", remarks: "" });
      await refreshInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to adjust stock.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
              item.view === view
                ? "border-ink bg-ink text-white"
                : "border-black/10 bg-white text-ink hover:bg-linen"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {isLoading && <p className="text-sm text-moss">Loading inventory data...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      {view === "dashboard" && (
        <InventoryDashboard
          totalSku={products.length}
          totalStock={totalStock}
          lowStockItems={lowStockItems.length}
          outOfStockItems={outOfStockItems.length}
          movements={movements}
          getProduct={getProduct}
          getLocation={getLocation}
        />
      )}

      {view === "products" && (
        <ProductList
          productTotals={productTotals}
          balances={balances}
          getLocation={getLocation}
        />
      )}

      {view === "stock-in" && (
        <Card>
          <FormHeader icon={<PackagePlus size={20} />} title="Add Stock / Stock In" text="Create a new SKU or add arriving quantity into Hub, Warehouse, or any retail store." />
          <form onSubmit={handleStockIn} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="SKU"><input className={inputClass} value={stockInForm.sku} onChange={(event) => setStockInForm({ ...stockInForm, sku: event.target.value })} /></Field>
            <Field label="Product name"><input className={inputClass} value={stockInForm.productName} onChange={(event) => setStockInForm({ ...stockInForm, productName: event.target.value })} /></Field>
            <Field label="Category">
              <select className={inputClass} value={stockInForm.category} onChange={(event) => setStockInForm({ ...stockInForm, category: event.target.value })}>
                <option>Luggage Parts</option>
                <option>Leather Care</option>
                <option>Accessories</option>
                <option>Handcraft</option>
                <option>Engraving</option>
              </select>
            </Field>
            <Field label="Color"><input className={inputClass} value={stockInForm.color} onChange={(event) => setStockInForm({ ...stockInForm, color: event.target.value })} /></Field>
            <Field label="Size"><input className={inputClass} value={stockInForm.size} onChange={(event) => setStockInForm({ ...stockInForm, size: event.target.value })} /></Field>
            <Field label="Quantity"><input className={inputClass} min="1" type="number" value={stockInForm.quantity} onChange={(event) => setStockInForm({ ...stockInForm, quantity: event.target.value })} /></Field>
            <Field label="Cost price"><input className={inputClass} min="0" step="0.01" type="number" value={stockInForm.costPrice} onChange={(event) => setStockInForm({ ...stockInForm, costPrice: event.target.value })} /></Field>
            <Field label="Selling price"><input className={inputClass} min="0" step="0.01" type="number" value={stockInForm.sellingPrice} onChange={(event) => setStockInForm({ ...stockInForm, sellingPrice: event.target.value })} /></Field>
            <Field label="Product image URL"><input className={inputClass} value={stockInForm.imageUrl} onChange={(event) => setStockInForm({ ...stockInForm, imageUrl: event.target.value })} /></Field>
            <Field label="Stock location">
              <select className={inputClass} value={stockInForm.locationId} onChange={(event) => setStockInForm({ ...stockInForm, locationId: event.target.value })}>
                {locations.map((location) => <option key={location.id} value={location.id}>{location.locationName} ({location.locationType})</option>)}
              </select>
            </Field>
            <Field label="PIC"><input className={inputClass} value={stockInForm.pic} onChange={(event) => setStockInForm({ ...stockInForm, pic: event.target.value })} /></Field>
            <Field label="Remarks"><input className={inputClass} value={stockInForm.remarks} onChange={(event) => setStockInForm({ ...stockInForm, remarks: event.target.value })} /></Field>
            <div className="md:col-span-2 xl:col-span-3"><PrimaryButton type="submit">{isSaving ? "Saving..." : "Add stock and record movement"}</PrimaryButton></div>
          </form>
        </Card>
      )}

      {view === "stock-out" && (
        <Card>
          <FormHeader icon={<ArrowLeftRight size={20} />} title="Stock Out / Transfer" text="Deduct stock from Hub or Warehouse and add it to the selected destination store." />
          <form onSubmit={handleStockOut} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="From location">
              <select className={inputClass} value={stockOutForm.sourceLocationId} onChange={(event) => setStockOutForm({ ...stockOutForm, sourceLocationId: event.target.value })}>
                {locations.map((location) => <option key={location.id} value={location.id}>{location.locationName}</option>)}
              </select>
            </Field>
            <Field label="Destination store">
              <select className={inputClass} value={stockOutForm.destinationLocationId} onChange={(event) => setStockOutForm({ ...stockOutForm, destinationLocationId: event.target.value })}>
                {locations.filter((location) => location.locationType === "Store").map((location) => <option key={location.id} value={location.id}>{location.locationName}</option>)}
              </select>
            </Field>
            <Field label="SKU">
              <select className={inputClass} value={stockOutForm.productId} onChange={(event) => setStockOutForm({ ...stockOutForm, productId: event.target.value })}>
                {products.map((product) => <option key={product.id} value={product.id}>{product.sku} - {product.productName}</option>)}
              </select>
            </Field>
            <Field label="Quantity"><input className={inputClass} min="1" type="number" value={stockOutForm.quantity} onChange={(event) => setStockOutForm({ ...stockOutForm, quantity: event.target.value })} /></Field>
            <Field label="Transfer date"><input className={inputClass} type="date" value={stockOutForm.transferDate} onChange={(event) => setStockOutForm({ ...stockOutForm, transferDate: event.target.value })} /></Field>
            <Field label="PIC"><input className={inputClass} value={stockOutForm.pic} onChange={(event) => setStockOutForm({ ...stockOutForm, pic: event.target.value })} /></Field>
            <div className="md:col-span-2 xl:col-span-3">
              <Field label="Remarks"><textarea className={inputClass} rows={3} value={stockOutForm.remarks} onChange={(event) => setStockOutForm({ ...stockOutForm, remarks: event.target.value })} /></Field>
            </div>
            <div className="md:col-span-2 xl:col-span-3"><PrimaryButton type="submit">{isSaving ? "Saving..." : "Transfer stock and record movement"}</PrimaryButton></div>
          </form>
        </Card>
      )}

      {view === "movements" && (
        <MovementHistory movements={movements} getProduct={getProduct} getLocation={getLocation} />
      )}

      {view === "adjustment" && (
        <Card>
          <FormHeader icon={<SlidersHorizontal size={20} />} title="Stock Adjustment" text="Correct mismatch, damaged, missing, returned, or stock-take quantity differences." />
          <form onSubmit={handleAdjustment} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Location">
              <select className={inputClass} value={adjustmentForm.locationId} onChange={(event) => setAdjustmentForm({ ...adjustmentForm, locationId: event.target.value })}>
                {locations.map((location) => <option key={location.id} value={location.id}>{location.locationName}</option>)}
              </select>
            </Field>
            <Field label="SKU">
              <select className={inputClass} value={adjustmentForm.productId} onChange={(event) => setAdjustmentForm({ ...adjustmentForm, productId: event.target.value })}>
                {products.map((product) => <option key={product.id} value={product.id}>{product.sku} - {product.productName}</option>)}
              </select>
            </Field>
            <Field label="Quantity adjusted"><input className={inputClass} type="number" value={adjustmentForm.quantity} onChange={(event) => setAdjustmentForm({ ...adjustmentForm, quantity: event.target.value })} /></Field>
            <Field label="Adjustment reason">
              <select className={inputClass} value={adjustmentForm.reason} onChange={(event) => setAdjustmentForm({ ...adjustmentForm, reason: event.target.value })}>
                <option>Stock take mismatch</option>
                <option>Inventory correction</option>
                <option>Damaged stock</option>
                <option>Missing stock</option>
                <option>Returned stock</option>
              </select>
            </Field>
            <Field label="Date"><input className={inputClass} type="date" value={adjustmentForm.date} onChange={(event) => setAdjustmentForm({ ...adjustmentForm, date: event.target.value })} /></Field>
            <Field label="PIC"><input className={inputClass} value={adjustmentForm.pic} onChange={(event) => setAdjustmentForm({ ...adjustmentForm, pic: event.target.value })} /></Field>
            <div className="md:col-span-2 xl:col-span-3">
              <Field label="Remarks"><textarea className={inputClass} rows={3} value={adjustmentForm.remarks} onChange={(event) => setAdjustmentForm({ ...adjustmentForm, remarks: event.target.value })} /></Field>
            </div>
            <div className="md:col-span-2 xl:col-span-3"><PrimaryButton type="submit">{isSaving ? "Saving..." : "Save adjustment and record movement"}</PrimaryButton></div>
          </form>
        </Card>
      )}

      <button type="button" onClick={refreshInventory} className="w-fit rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-linen">
        Refresh inventory
      </button>
    </div>
  );
}

function FormHeader({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="grid size-10 place-items-center rounded-md bg-linen text-clay">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-moss">{text}</p>
      </div>
    </div>
  );
}

function InventoryDashboard({
  totalSku,
  totalStock,
  lowStockItems,
  outOfStockItems,
  movements,
  getProduct,
  getLocation
}: {
  totalSku: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  movements: StockMovement[];
  getProduct: (productId: string) => Product | undefined;
  getLocation: (locationId: string | null) => string;
}) {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Total SKU" value={totalSku} />
        <Metric label="Total Stock Quantity" value={totalStock} />
        <Metric label="Low Stock Items" value={lowStockItems} tone="warn" />
        <Metric label="Out of Stock Items" value={outOfStockItems} tone="danger" />
      </section>
      <MovementHistory movements={movements.slice(0, 5)} getProduct={getProduct} getLocation={getLocation} compact />
    </div>
  );
}

function Metric({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "warn" | "danger" }) {
  const colors = {
    neutral: "text-ink",
    warn: "text-amber-700",
    danger: "text-red-700"
  };
  return (
    <Card>
      <p className="text-sm text-moss">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${colors[tone]}`}>{value}</p>
    </Card>
  );
}

function ProductList({
  productTotals,
  balances,
  getLocation
}: {
  productTotals: { product: Product; total: number }[];
  balances: StockBalance[];
  getLocation: (locationId: string | null) => string;
}) {
  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold">Product List</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-moss">
            <tr>
              <th className="py-3">SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Color</th>
              <th>Size</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>By Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {productTotals.map(({ product, total }) => (
              <tr key={product.id}>
                <td className="py-3 font-medium">{product.sku}</td>
                <td>{product.productName}</td>
                <td>{product.category}</td>
                <td>{product.color}</td>
                <td>{product.size}</td>
                <td>RM {product.costPrice.toFixed(2)}</td>
                <td>RM {product.sellingPrice.toFixed(2)}</td>
                <td>{total}</td>
                <td><Badge tone={product.status === "active" ? "good" : "neutral"}>{product.status}</Badge></td>
                <td className="max-w-xs">
                  {balances.filter((balance) => balance.productId === product.id && balance.quantity > 0).map((balance) => (
                    <span key={`${balance.productId}-${balance.locationId}`} className="mr-2 inline-block text-xs text-moss">
                      {getLocation(balance.locationId)}: {balance.quantity}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function MovementHistory({
  movements,
  getProduct,
  getLocation,
  compact = false
}: {
  movements: StockMovement[];
  getProduct: (productId: string) => Product | undefined;
  getLocation: (locationId: string | null) => string;
  compact?: boolean;
}) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <ClipboardCheck size={20} className="text-clay" />
        <h3 className="text-lg font-semibold">{compact ? "Recent Stock Movement" : "Stock Movement History"}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-moss">
            <tr>
              <th className="py-3">Date</th>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Movement Type</th>
              <th>Quantity</th>
              <th>From Location</th>
              <th>To Location</th>
              <th>PIC</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {movements.map((movement) => {
              const product = getProduct(movement.productId);
              return (
                <tr key={movement.id}>
                  <td className="py-3">{movement.createdAt}</td>
                  <td className="font-medium">{product?.sku ?? "-"}</td>
                  <td>{product?.productName ?? "-"}</td>
                  <td><Badge>{movement.movementType.replace("_", " ")}</Badge></td>
                  <td>{movement.quantity}</td>
                  <td>{getLocation(movement.fromLocationId)}</td>
                  <td>{getLocation(movement.toLocationId)}</td>
                  <td>{movement.pic}</td>
                  <td>{movement.remarks || movement.reason}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
