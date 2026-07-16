import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("guests")
      .select("id, name")
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
    console.error("Failed to load guests", error);
    return NextResponse.json(
      { error: "Не удалось загрузить список гостей" },
      { status: 500 }
    );
  }
}
