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

    const updatePromises = body.map((item) =>
      supabase.from("lists").update({ order: item.order }).eq("id", item.id),
    );
    const results = await Promise.all(updatePromises);
    const firstError = results.find((res) => res.error)?.error;
    if (firstError) {
      throw firstError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
