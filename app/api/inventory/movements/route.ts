import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    await getCurrentUser();
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("stock_movements")
      .select("*, products(sku, product_name), from_location:locations!stock_movements_from_location_id_fkey(location_name), to_location:locations!stock_movements_to_location_id_fkey(location_name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 401 });
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}
