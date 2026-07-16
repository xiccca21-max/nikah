import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type CancelBody = {
  guestId?: string;
};

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const token =
      authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    const body = (await request.json()) as CancelBody;
    const guestId = body.guestId?.trim();

    if (!guestId) {
      return NextResponse.json({ error: "Некорректный guestId" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Сессия истекла" }, { status: 401 });
    }

    const now = new Date().toISOString();

    // Не трогаем course_1/2/3, чтобы не упереться в NOT NULL.
    // Для "аннулирования" нам достаточно убрать responded_at — админка снова покажет "Не отвечал".
    const { error: updateError } = await supabase
      .from("guests")
      .update({
        responded_at: null,
        updated_at: now
      })
      .eq("id", guestId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to cancel RSVP", error);
    return NextResponse.json(
      { error: "Не удалось аннулировать заказ" },
      { status: 500 }
    );
  }
}

