import { serviceOrders } from "@/lib/mock-data";
import type { ServiceOrder, ServiceOrderStatus } from "@/lib/types";

export const serviceOrdersKey = "jack-studio-service-orders";

export function loadServiceOrders() {
  if (typeof window === "undefined") {
    return serviceOrders;
  }

  const saved = window.localStorage.getItem(serviceOrdersKey);
  if (!saved) {
    return serviceOrders;
  }

  try {
    return JSON.parse(saved) as ServiceOrder[];
  } catch {
    return serviceOrders;
  }
}

export function saveServiceOrders(orders: ServiceOrder[]) {
  window.localStorage.setItem(serviceOrdersKey, JSON.stringify(orders));
}

export function createServiceOrder(input: {
  customerName: string;
  storeName: string;
  serviceType: string;
  status: ServiceOrderStatus;
  paymentStatus: string;
  quotationAmount: number;
}) {
  const orders = loadServiceOrders();
  const now = new Date();
  const order: ServiceOrder = {
    id: `SO-${now.getTime()}`,
    orderNo: `JS-SVC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(orders.length + 1).padStart(3, "0")}`,
    customerName: input.customerName,
    storeName: input.storeName,
    serviceType: input.serviceType,
    status: input.status,
    paymentStatus: input.paymentStatus,
    quotationAmount: input.quotationAmount,
    updatedAt: "Just now"
  };

  const nextOrders = [order, ...orders];
  saveServiceOrders(nextOrders);
  return order;
}
