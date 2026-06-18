import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get("listId");

    if (!listId) {
      return NextResponse.json(
        { error: "listId is required" },
        { status: 400 },
      );
    }

    const { data: cards, error } = await supabase
      .from("cards")
      .select("*")
      .eq("list_id", listId)
      .order("order", { ascending: true });

    if (error) throw error;

    const formattedCards = cards.map((c) => ({
      id: c.id,
      title: c.title,
      order: c.order,
      listId: c.list_id,
    }));

    return NextResponse.json(formattedCards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, listId, order } = body;

    if (!title || !listId) {
      return NextResponse.json(
        { error: "Title are required" },
        { status: 400 },
      );
    }

    const { data: newCard, error } = await supabase
      .from("cards")
      .insert([{ title, list_id: listId, order: order || 0 }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: newCard.id,
      title: newCard.title,
      order: newCard.order,
      listId: newCard.list_id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
