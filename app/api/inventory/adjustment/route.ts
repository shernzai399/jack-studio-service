import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    assertPermission(user.role, "inventory:adjust");

    const body = await request.json();
    const supabase = createSupabaseServerClient();

    const { error } = await supabase.rpc("apply_stock_adjustment", {
      p_product_id: body.product_id,
      p_location_id: body.location_id,
      p_quantity_adjusted: body.quantity_adjusted,
      p_reason: body.reason,
      p_pic: body.pic ?? user.email,
      p_remarks: body.remarks
    });

    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}
