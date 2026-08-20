import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(portfolioTable).orderBy(portfolioTable.createdAt);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { assetId, assetName, category, buyPrice, amount, action, id } = await req.json();

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ success: false, error: "Missing ID to delete" }, { status: 400 });
      }
      await db.delete(portfolioTable).where(eq(portfolioTable.id, Number(id)));
      return NextResponse.json({ success: true, message: "Transaction deleted" });
    }

    if (!assetId || !assetName || !category || !buyPrice || !amount) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(portfolioTable).values({
      assetId,
      assetName,
      category,
      buyPrice: String(buyPrice),
      amount: String(amount),
    });

    return NextResponse.json({ success: true, message: "Transaction added successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
