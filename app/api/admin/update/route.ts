import { NextResponse } from "next/server";
import { menuCourses } from "@/lib/invitation-data";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type UpdateBody = {
  guestId?: string;
  course1?: string;
  course2?: string;
  course3?: string;
};

function isMenuChoice(value: string, choices: readonly string[]) {
  return choices.includes(value);
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    const body = (await request.json()) as UpdateBody;
    const guestId = body.guestId?.trim();
    const course1 = body.course1?.trim();
    const course2 = body.course2?.trim();
    const course3 = body.course3?.trim();

    if (
      !guestId ||
      !course1 ||
      !course2 ||
      !course3 ||
      !isMenuChoice(course1, menuCourses.course1) ||
      !isMenuChoice(course2, menuCourses.course2) ||
      !isMenuChoice(course3, menuCourses.course3)
    ) {
      return NextResponse.json(
        { error: "Выберите все три блюда из меню" },
        { status: 400 }
      );
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
    const { error: updateError } = await supabase
      .from("guests")
      .update({
        course_1: course1,
        course_2: course2,
        course_3: course3,
        responded_at: now,
        updated_at: now
      })
      .eq("id", guestId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update guest menu", error);
    return NextResponse.json(
      { error: "Не удалось сохранить меню" },
      { status: 500 }
    );
  }
}
