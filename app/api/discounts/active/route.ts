import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Discount from "@/models/Discount";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();
    const now = new Date();
    const discounts = await Discount.find({
      active: true,
      $and: [
        { $or: [{ startDate: { $exists: false } }, { startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }] },
      ],
    }).lean();

    return NextResponse.json({
      success: true,
      discounts: discounts.map((d) => ({
        type: d.type,
        value: d.value,
        minQuantity: d.minQuantity,
        minSubtotal: d.minSubtotal,
        applicableProducts: (d.applicableProducts || []).map((p: unknown) => String(p)),
        applicableCategories: (d.applicableCategories || []).map((c: unknown) => String(c)),
        active: d.active,
      })),
    });
  } catch {
    return NextResponse.json({ success: false, discounts: [] });
  }
}
