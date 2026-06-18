import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Payload must be array" },
        { status: 400 },
      );
    }

    for (const item of body) {
      const { error } = await supabase
        .from("cards")
        .update({
          order: item.order,
          list_id: item.listId || item.list_id,
        })
        .eq("id", item.id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
