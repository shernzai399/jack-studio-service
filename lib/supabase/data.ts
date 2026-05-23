import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type {
  MovementType,
  Product,
  ProductStatus,
  ServiceOrder,
  ServiceOrderStatus,
  StockBalance,
  StockLocation,
  StockMovement,
  StoreRequest,
  StoreRequestStatus
} from "@/lib/types";

type ServiceOrderRow = {
  id: string;
  order_no: string;
  service_type: string;
  status: ServiceOrderStatus;
  payment_status: string;
  quotation_amount: number | null;
  updated_at: string;
  customers: { full_name: string } | null;
  stores: { name: string } | null;
};

type ProductRow = {
  id: string;
  sku: string;
  product_name: string;
  category: string;
  color: string | null;
  size: string | null;
  cost_price: number | null;
  selling_price: number | null;
  image_url: string | null;
  status: ProductStatus;
};

type LocationRow = {
  id: string;
  location_name: string;
  location_type: StockLocation["locationType"];
};

type InventoryRow = {
  product_id: string;
  location_id: string;
  quantity: number;
};

type MovementRow = {
  id: string;
  product_id: string;
  movement_type: MovementType;
  quantity: number;
  from_location_id: string | null;
  to_location_id: string | null;
  reason: string | null;
  pic: string;
  remarks: string | null;
  created_at: string;
};

type StoreRequestRow = {
  id: string;
  request_no: string;
  request_type: string;
  status: StoreRequestStatus;
  priority: "low" | "normal" | "urgent";
  updated_at: string;
  from_store: { name: string } | null;
  store_request_items: { id: string }[] | null;
};

export function toDbServiceType(label: string) {
  const map: Record<string, string> = {
    "Luggage repair": "luggage_repair",
    "Leather care service": "leather_care",
    "Handcraft service": "handcraft",
    "Engraving and customization": "engraving_customization"
  };

  return map[label] ?? label;
}

export function fromDbServiceType(value: string) {
  const map: Record<string, string> = {
    luggage_repair: "Luggage repair",
    leather_care: "Leather care",
    handcraft: "Handcraft",
    engraving_customization: "Engraving"
  };

  return map[value] ?? value;
}

export async function fetchStoreNames() {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("stores")
    .select("name")
    .order("name");

  if (error) throw error;
  return (data ?? []).map((store) => store.name as string);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export async function fetchServiceOrders(): Promise<ServiceOrder[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("service_orders")
    .select("id, order_no, service_type, status, payment_status, quotation_amount, updated_at, customers(full_name), stores(name)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as ServiceOrderRow[]).map((row) => ({
    id: row.id,
    orderNo: row.order_no,
    customerName: row.customers?.full_name ?? "-",
    storeName: row.stores?.name ?? "-",
    serviceType: fromDbServiceType(row.service_type),
    status: row.status,
    paymentStatus: row.payment_status,
    quotationAmount: Number(row.quotation_amount ?? 0),
    updatedAt: formatDate(row.updated_at)
  }));
}

export async function createServiceOrderInSupabase(input: {
  customerName: string;
  phone: string;
  email: string;
  preferredContact: string;
  serviceType: string;
  storeName: string;
  itemBrand: string;
  itemModel: string;
  itemColor: string;
  expectedCompletionDate: string;
  itemDescription: string;
  issueDescription: string;
  quotationAmount: number;
  paymentStatus: string;
  status: ServiceOrderStatus;
  quotationNotes: string;
}) {
  const supabase = createSupabaseBrowserClient();

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id")
    .eq("name", input.storeName)
    .single();

  if (storeError) throw storeError;

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .insert({
      full_name: input.customerName,
      phone: input.phone || "-",
      email: input.email || null,
      preferred_contact: input.preferredContact.toLowerCase()
    })
    .select("id")
    .single();

  if (customerError) throw customerError;

  const now = new Date();
  const orderNo = `JS-SVC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${now.getTime().toString().slice(-5)}`;
  const { data: order, error: orderError } = await supabase
    .from("service_orders")
    .insert({
      order_no: orderNo,
      customer_id: customer.id,
      store_id: store.id,
      service_type: toDbServiceType(input.serviceType),
      item_brand: input.itemBrand || null,
      item_model: input.itemModel || null,
      item_color: input.itemColor || null,
      item_description: input.itemDescription || "-",
      issue_description: input.issueDescription || "-",
      quotation_amount: input.quotationAmount,
      quotation_notes: input.quotationNotes || null,
      payment_status: input.paymentStatus,
      status: input.status,
      expected_completion_date: input.expectedCompletionDate || null
    })
    .select("id, order_no, service_type, status, payment_status, quotation_amount, updated_at, customers(full_name), stores(name)")
    .single();

  if (orderError) throw orderError;

  const row = order as unknown as ServiceOrderRow;
  return {
    id: row.id,
    orderNo: row.order_no,
    customerName: row.customers?.full_name ?? input.customerName,
    storeName: row.stores?.name ?? input.storeName,
    serviceType: fromDbServiceType(row.service_type),
    status: row.status,
    paymentStatus: row.payment_status,
    quotationAmount: Number(row.quotation_amount ?? 0),
    updatedAt: formatDate(row.updated_at)
  } satisfies ServiceOrder;
}

export async function fetchInventoryData() {
  const supabase = createSupabaseBrowserClient();
  const [productsResult, locationsResult, inventoryResult, movementsResult] = await Promise.all([
    supabase.from("products").select("*").order("sku"),
    supabase.from("locations").select("id, location_name, location_type").order("location_type").order("location_name"),
    supabase.from("inventory").select("product_id, location_id, quantity"),
    supabase.from("stock_movements").select("*").order("created_at", { ascending: false })
  ]);

  if (productsResult.error) throw productsResult.error;
  if (locationsResult.error) throw locationsResult.error;
  if (inventoryResult.error) throw inventoryResult.error;
  if (movementsResult.error) throw movementsResult.error;

  return {
    products: ((productsResult.data ?? []) as ProductRow[]).map(toProduct),
    locations: ((locationsResult.data ?? []) as LocationRow[]).map(toLocation),
    balances: ((inventoryResult.data ?? []) as InventoryRow[]).map((row) => ({
      productId: row.product_id,
      locationId: row.location_id,
      quantity: row.quantity
    })),
    movements: ((movementsResult.data ?? []) as MovementRow[]).map(toMovement)
  };
}

export async function upsertProduct(input: Omit<Product, "id" | "status"> & { id?: string }) {
  const supabase = createSupabaseBrowserClient();
  const { data: existing, error: existingError } = await supabase
    .from("products")
    .select("id")
    .eq("sku", input.sku)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing?.id) {
    const { data, error } = await supabase
      .from("products")
      .update({
        product_name: input.productName,
        category: input.category,
        color: input.color,
        size: input.size,
        cost_price: input.costPrice,
        selling_price: input.sellingPrice,
        image_url: input.imageUrl || null
      })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw error;
    return toProduct(data as ProductRow);
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      sku: input.sku,
      product_name: input.productName,
      category: input.category,
      color: input.color,
      size: input.size,
      cost_price: input.costPrice,
      selling_price: input.sellingPrice,
      image_url: input.imageUrl || null,
      status: "active"
    })
    .select("*")
    .single();

  if (error) throw error;
  return toProduct(data as ProductRow);
}

export async function applyStockIn(input: {
  productId: string;
  locationId: string;
  quantity: number;
  pic: string;
  remarks: string;
}) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("apply_stock_in", {
    p_product_id: input.productId,
    p_location_id: input.locationId,
    p_quantity: input.quantity,
    p_pic: input.pic,
    p_remarks: input.remarks || null
  });
  if (error) throw error;
}

export async function applyStockTransfer(input: {
  productId: string;
  fromLocationId: string;
  toLocationId: string;
  quantity: number;
  pic: string;
  remarks: string;
}) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("apply_stock_transfer", {
    p_product_id: input.productId,
    p_from_location_id: input.fromLocationId,
    p_to_location_id: input.toLocationId,
    p_quantity: input.quantity,
    p_pic: input.pic,
    p_remarks: input.remarks || null
  });
  if (error) throw error;
}

export async function applyStockAdjustment(input: {
  productId: string;
  locationId: string;
  quantityAdjusted: number;
  reason: string;
  pic: string;
  remarks: string;
}) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("apply_stock_adjustment", {
    p_product_id: input.productId,
    p_location_id: input.locationId,
    p_quantity_adjusted: input.quantityAdjusted,
    p_reason: input.reason,
    p_pic: input.pic,
    p_remarks: input.remarks || null
  });
  if (error) throw error;
}

export async function fetchStoreRequests(): Promise<StoreRequest[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("store_requests")
    .select("id, request_no, request_type, status, priority, updated_at, from_store:stores!store_requests_from_store_id_fkey(name), store_request_items(id)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as StoreRequestRow[]).map((row) => ({
    id: row.id,
    requestNo: row.request_no,
    requestType: row.request_type.replaceAll("_", " "),
    storeName: row.from_store?.name ?? "-",
    status: row.status,
    priority: row.priority,
    itemCount: row.store_request_items?.length ?? 0,
    updatedAt: formatDate(row.updated_at)
  }));
}

export async function createStoreRequestInSupabase(input: {
  requestType: string;
  priority: "low" | "normal" | "urgent";
  fromStoreName: string;
  toStoreName: string;
  reason: string;
  status: StoreRequestStatus;
  hqNotes: string;
  items: { sku: string; productName: string; requestedQuantity: number }[];
}) {
  const supabase = createSupabaseBrowserClient();
  const { data: stores, error: storesError } = await supabase
    .from("stores")
    .select("id, name")
    .in("name", [input.fromStoreName, input.toStoreName]);

  if (storesError) throw storesError;

  const fromStore = stores?.find((store) => store.name === input.fromStoreName);
  const toStore = stores?.find((store) => store.name === input.toStoreName);
  if (!fromStore) throw new Error("Requesting store was not found in Supabase.");

  const now = new Date();
  const { data: request, error: requestError } = await supabase
    .from("store_requests")
    .insert({
      request_no: `JS-REQ-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${now.getTime().toString().slice(-5)}`,
      request_type: input.requestType,
      from_store_id: fromStore.id,
      to_store_id: toStore?.id ?? null,
      status: input.status,
      reason: input.reason || "-",
      priority: input.priority,
      hq_notes: input.hqNotes || null
    })
    .select("id")
    .single();

  if (requestError) throw requestError;

  const items = input.items
    .filter((item) => item.productName.trim() && item.requestedQuantity > 0)
    .map((item) => ({
      store_request_id: request.id,
      sku: item.sku || null,
      product_name: item.productName,
      requested_quantity: item.requestedQuantity
    }));

  if (items.length) {
    const { error: itemsError } = await supabase.from("store_request_items").insert(items);
    if (itemsError) throw itemsError;
  }

  return request.id as string;
}

export async function fetchDashboardData() {
  const supabase = createSupabaseBrowserClient();
  const [
    serviceOrdersResult,
    pendingServiceResult,
    productsResult,
    lowStockResult,
    pendingRequestsResult,
    movementsResult
  ] = await Promise.all([
    supabase.from("service_orders").select("id", { count: "exact", head: true }),
    supabase.from("service_orders").select("id", { count: "exact", head: true }).in("status", ["New Request", "Waiting Review", "Quotation Sent"]),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("low_stock_inventory").select("*"),
    supabase.from("store_requests").select("id", { count: "exact", head: true }).in("status", ["New Request", "Under Review", "Waiting Stock"]),
    supabase.from("stock_movements").select("*, products(sku, product_name)").order("created_at", { ascending: false }).limit(5)
  ]);

  if (serviceOrdersResult.error) throw serviceOrdersResult.error;
  if (pendingServiceResult.error) throw pendingServiceResult.error;
  if (productsResult.error) throw productsResult.error;
  if (lowStockResult.error) throw lowStockResult.error;
  if (pendingRequestsResult.error) throw pendingRequestsResult.error;
  if (movementsResult.error) throw movementsResult.error;

  return {
    totalRepairOrders: serviceOrdersResult.count ?? 0,
    pendingRepairOrders: pendingServiceResult.count ?? 0,
    totalSku: productsResult.count ?? 0,
    lowStockItems: lowStockResult.data?.length ?? 0,
    pendingStoreRequests: pendingRequestsResult.count ?? 0,
    recentStockMovements: movementsResult.data ?? []
  };
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    productName: row.product_name,
    category: row.category,
    color: row.color ?? "",
    size: row.size ?? "",
    costPrice: Number(row.cost_price ?? 0),
    sellingPrice: Number(row.selling_price ?? 0),
    imageUrl: row.image_url ?? "",
    status: row.status
  };
}

function toLocation(row: LocationRow): StockLocation {
  return {
    id: row.id,
    locationName: row.location_name,
    locationType: row.location_type
  };
}

function toMovement(row: MovementRow): StockMovement {
  return {
    id: row.id,
    productId: row.product_id,
    movementType: row.movement_type,
    quantity: row.quantity,
    fromLocationId: row.from_location_id,
    toLocationId: row.to_location_id,
    reason: row.reason ?? "",
    pic: row.pic,
    remarks: row.remarks ?? "",
    createdAt: row.created_at.slice(0, 10)
  };
}
