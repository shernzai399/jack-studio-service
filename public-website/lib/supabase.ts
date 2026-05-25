import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const inquiryBucket = process.env.NEXT_PUBLIC_SUPABASE_INQUIRY_BUCKET;

export function isSupabaseReady() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function savePublicInquiry(input: {
  customerName: string;
  whatsappNumber: string;
  email: string;
  serviceType: string;
  productType: string;
  problemDescription: string;
  preferredStore: string;
  preferredContactTime: string;
  photos: FileList | null;
}) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    const pending = JSON.parse(window.localStorage.getItem("jack-studio-public-inquiries") ?? "[]") as unknown[];
    pending.push({
      ...input,
      photos: input.photos ? Array.from(input.photos).map((file) => file.name) : [],
      created_at: new Date().toISOString()
    });
    window.localStorage.setItem("jack-studio-public-inquiries", JSON.stringify(pending));
    return { savedTo: "local" as const };
  }

  const photoPaths: string[] = [];
  if (input.photos && inquiryBucket) {
    for (const file of Array.from(input.photos)) {
      const path = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from(inquiryBucket).upload(path, file, { upsert: false });
      if (!error) {
        photoPaths.push(path);
      }
    }
  }

  const { error } = await supabase.from("public_inquiries").insert({
    customer_name: input.customerName,
    whatsapp_number: input.whatsappNumber,
    email: input.email || null,
    service_type: input.serviceType,
    product_type: input.productType,
    problem_description: input.problemDescription,
    preferred_store: input.preferredStore,
    preferred_contact_time: input.preferredContactTime,
    photo_paths: photoPaths
  });

  if (error) {
    throw error;
  }

  return { savedTo: "supabase" as const };
}
