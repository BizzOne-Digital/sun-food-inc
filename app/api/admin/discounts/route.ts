import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Discount from "@/models/Discount";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const discounts = await Discount.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, discounts: discounts.map((d) => ({ ...d, _id: String(d._id) })) });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load discounts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }
    if (!["percentage", "fixed"].includes(body.type)) {
      return NextResponse.json({ success: false, error: "Invalid discount type" }, { status: 400 });
    }
    if (typeof body.value !== "number" || body.value < 0) {
      return NextResponse.json({ success: false, error: "Valid value is required" }, { status: 400 });
    }
    await connectToDatabase();
    const discount = await Discount.create({
      title: body.title.trim(),
      description: body.description || "",
      type: body.type,
      value: body.value,
      minQuantity: body.minQuantity || 1,
      minSubtotal: body.minSubtotal || 0,
      applicableProducts: Array.isArray(body.applicableProducts) ? body.applicableProducts : [],
      applicableCategories: Array.isArray(body.applicableCategories) ? body.applicableCategories : [],
      startDate: body.startDate || undefined,
      endDate: body.endDate || undefined,
      active: body.active !== false,
    });
    return NextResponse.json({ success: true, discount: { ...discount.toObject(), _id: String(discount._id) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create discount" }, { status: 500 });
  }
}
