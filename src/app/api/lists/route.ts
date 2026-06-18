import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("boardId");

    if (!boardId) {
      return NextResponse.json(
        { error: "boardId is required" },
        { status: 400 },
      );
    }

    const { data: lists, error } = await supabase
      .from("lists")
      .select("*")
      .eq("board_id", boardId)
      .order("order", { ascending: true });

    if (error) throw error;

    const formattedLists = lists.map((l) => ({
      id: l.id,
      title: l.title,
      order: l.order,
      boardId: l.board_id,
    }));

    return NextResponse.json(formattedLists);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, boardId, order } = body;

    if (!title || !boardId) {
      return NextResponse.json(
        { error: "Title and boardId are required" },
        { status: 400 },
      );
    }

    const { data: newList, error } = await supabase
      .from("lists")
      .insert([
        {
          title,
          board_id: boardId,
          order: order || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: newList.id,
      title: newList.title,
      order: newList.order,
      boardId: newList.board_id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
