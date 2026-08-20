import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { feedbackTable } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db
      .select()
      .from(feedbackTable)
      .orderBy(desc(feedbackTable.createdAt))
      .limit(50);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userName, message } = await req.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Mesaj alanı boş bırakılamaz" }, { status: 400 });
    }

    await db.insert(feedbackTable).values({
      userName: userName || "Anonim Kaşif",
      message,
    });

    return NextResponse.json({ success: true, message: "Geri bildiriminiz başarıyla kozmik veri tabanına kaydedildi!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
