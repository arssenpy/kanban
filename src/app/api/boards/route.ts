import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase";

export async function GET() {
  try {
    const { data: boards, error } = await supabase.from("boards").select("*");

    if (error) {
      throw error;
    }

    return NextResponse.json(boards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Please write a title" },
        { status: 400 },
      );
    }

    const { data: newBoard, error } = await supabase
      .from("boards")
      .insert([{ title }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(newBoard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
