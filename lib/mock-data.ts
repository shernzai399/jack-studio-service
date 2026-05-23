import type {
  InventoryRow,
  Product,
  ServiceOrder,
  StockBalance,
  StockLocation,
  StockMovement,
  StoreRequest
} from "@/lib/types";

export const stores = [
  "Aeon Bukit Tinggi",
  "Paradigm Mall",
  "Main Place",
  "Aeon Permas Jaya",
  "Aeon Seremban 2",
  "Aeon Bukit Indah",
  "Aeon Wangsa Maju",
  "Aeon Kulaijaya",
  "Berjaya Time Square",
  "Alamanda Shopping",
  "Sunway Carnival",
  "Mayang Mall",
  "East Coast Mall"
];

export const serviceOrders: ServiceOrder[] = [
  {
    id: "SO-1",
    orderNo: "JS-SVC-240081",
    customerName: "Alicia Tan",
    storeName: "Aeon Bukit Tinggi",
    serviceType: "Luggage repair",
    status: "Waiting Review",
    paymentStatus: "unpaid",
    quotationAmount: 0,
    updatedAt: "Today, 10:20"
  },
  {
    id: "SO-2",
    orderNo: "JS-SVC-240079",
    customerName: "Daniel Lim",
    storeName: "Paradigm Mall",
    serviceType: "Leather care",
    status: "Quotation Sent",
    paymentStatus: "deposit_paid",
    quotationAmount: 180,
    updatedAt: "Today, 09:45"
  },
  {
    id: "SO-3",
    orderNo: "JS-SVC-240073",
    customerName: "Priya Nair",
    storeName: "Main Place",
    serviceType: "Engraving",
    status: "Ready For Collection",
    paymentStatus: "paid",
    quotationAmount: 45,
    updatedAt: "Yesterday"
  }
];

export const storeRequests: StoreRequest[] = [
  {
    id: "SR-1",
    requestNo: "JS-REQ-240210",
    requestType: "Replenishment",
    storeName: "Aeon Permas Jaya",
    status: "Under Review",
    priority: "urgent",
    itemCount: 7,
    updatedAt: "Today, 11:05"
  },
  {
    id: "SR-2",
    requestNo: "JS-REQ-240206",
    requestType: "Stock transfer",
    storeName: "Aeon Bukit Indah",
    status: "Processing",
    priority: "normal",
    itemCount: 3,
    updatedAt: "Today, 08:30"
  },
  {
    id: "SR-3",
    requestNo: "JS-REQ-240198",
    requestType: "Special product",
    storeName: "Aeon Wangsa Maju",
    status: "Waiting Stock",
    priority: "normal",
    itemCount: 1,
    updatedAt: "Friday"
  }
];

export const inventoryRows: InventoryRow[] = [
  {
    storeName: "Aeon Bukit Tinggi",
    sku: "JS-LG-022",
    productName: "Carry-on wheel set",
    onHand: 2,
    reserved: 1,
    reorderLevel: 5
  },
  {
    storeName: "Aeon Permas Jaya",
    sku: "JS-LC-014",
    productName: "Premium leather balm",
    onHand: 12,
    reserved: 0,
    reorderLevel: 4
  },
  {
    storeName: "Main Place",
    sku: "JS-HC-107",
    productName: "Brass initial charm",
    onHand: 1,
    reserved: 0,
    reorderLevel: 6
  }
];

export const stockLocations: StockLocation[] = [
  { id: "loc-hub", locationName: "Hub", locationType: "Hub" },
  { id: "loc-warehouse", locationName: "Warehouse", locationType: "Warehouse" },
  ...stores.map((store, index) => ({
    id: `loc-store-${index + 1}`,
    locationName: store,
    locationType: "Store" as const
  }))
];

export const products: Product[] = [
  {
    id: "prod-1",
    sku: "JS-LG-022",
    productName: "Carry-on wheel set",
    category: "Luggage Parts",
    color: "Black",
    size: "Standard",
    costPrice: 18,
    sellingPrice: 45,
    imageUrl: "",
    status: "active"
  },
  {
    id: "prod-2",
    sku: "JS-LC-014",
    productName: "Premium leather balm",
    category: "Leather Care",
    color: "Natural",
    size: "100ml",
    costPrice: 22,
    sellingPrice: 68,
    imageUrl: "",
    status: "active"
  },
  {
    id: "prod-3",
    sku: "JS-HC-107",
    productName: "Brass initial charm",
    category: "Accessories",
    color: "Brass",
    size: "One size",
    costPrice: 9,
    sellingPrice: 29,
    imageUrl: "",
    status: "active"
  }
];

export const stockBalances: StockBalance[] = [
  { productId: "prod-1", locationId: "loc-hub", quantity: 100 },
  { productId: "prod-1", locationId: "loc-store-1", quantity: 10 },
  { productId: "prod-1", locationId: "loc-store-6", quantity: 4 },
  { productId: "prod-2", locationId: "loc-warehouse", quantity: 55 },
  { productId: "prod-2", locationId: "loc-store-4", quantity: 12 },
  { productId: "prod-3", locationId: "loc-hub", quantity: 30 },
  { productId: "prod-3", locationId: "loc-store-3", quantity: 1 }
];

export const stockMovements: StockMovement[] = [
  {
    id: "mov-1",
    productId: "prod-1",
    movementType: "stock_in",
    quantity: 100,
    fromLocationId: null,
    toLocationId: "loc-hub",
    reason: "New stock arrival",
    pic: "Super Admin",
    remarks: "Initial incoming stock",
    createdAt: "2026-05-24"
  },
  {
    id: "mov-2",
    productId: "prod-1",
    movementType: "transfer",
    quantity: 10,
    fromLocationId: "loc-hub",
    toLocationId: "loc-store-1",
    reason: "Store replenishment",
    pic: "Super Admin",
    remarks: "Transfer to Aeon Bukit Tinggi",
    createdAt: "2026-05-24"
  }
];
