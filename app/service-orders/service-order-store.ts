import type { ServiceOrder, ServiceOrderStatus } from "@/lib/types";
import { createServiceOrderInSupabase, fetchServiceOrders } from "@/lib/supabase/data";

export async function loadServiceOrders() {
  return fetchServiceOrders();
}

export async function createServiceOrder(input: {
  customerName: string;
  phone: string;
  email: string;
  preferredContact: string;
  storeName: string;
  serviceType: string;
  itemBrand: string;
  itemModel: string;
  itemColor: string;
  expectedCompletionDate: string;
  itemDescription: string;
  issueDescription: string;
  status: ServiceOrderStatus;
  paymentStatus: string;
  quotationAmount: number;
  quotationNotes: string;
}): Promise<ServiceOrder> {
  return createServiceOrderInSupabase(input);
}
