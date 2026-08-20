import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { watchlistTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(watchlistTable).orderBy(watchlistTable.createdAt);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { assetId, assetName, category, action } = await req.json();

    if (!assetId || !assetName || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (action === "remove") {
      await db.delete(watchlistTable).where(eq(watchlistTable.assetId, assetId));
      return NextResponse.json({ success: true, message: "Asset removed from watchlist" });
    } else {
      // Check if already exists
      const existing = await db
        .select()
        .from(watchlistTable)
        .where(eq(watchlistTable.assetId, assetId))
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json({ success: true, message: "Asset already in watchlist" });
      }

      await db.insert(watchlistTable).values({
        assetId,
        assetName,
        category,
      });
      return NextResponse.json({ success: true, message: "Asset added to watchlist" });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
