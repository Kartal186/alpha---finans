import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cosmicSignalsTable } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db
      .select()
      .from(cosmicSignalsTable)
      .orderBy(desc(cosmicSignalsTable.createdAt))
      .limit(30);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { assetId, assetName, signalType, strength, dimension, price } = await req.json();

    if (!assetId || !assetName || !signalType || !strength || !dimension || !price) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const inserted = await db.insert(cosmicSignalsTable).values({
      assetId,
      assetName,
      signalType,
      strength,
      dimension,
      price,
    }).returning();

    return NextResponse.json({ success: true, data: inserted[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
