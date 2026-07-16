import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Сессия истекла" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("guests")
      .select("id, name, course_1, course_2, course_3, responded_at, updated_at")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Failed to load admin responses", error);
    return NextResponse.json(
      { error: "Не удалось загрузить ответы" },
      { status: 500 }
    );
  }
}
