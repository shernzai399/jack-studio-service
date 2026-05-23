import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    await getCurrentUser();
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sku");

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    assertPermission(user.role, "inventory:stock_in");

    const body = await request.json();
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("products")
      .insert({
        sku: body.sku,
        product_name: body.product_name,
        category: body.category,
        color: body.color,
        size: body.size,
        cost_price: body.cost_price,
        selling_price: body.selling_price,
        image_url: body.image_url,
        status: body.status ?? "active"
      })
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}
