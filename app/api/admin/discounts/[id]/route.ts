import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Discount from "@/models/Discount";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    await connectToDatabase();
    const discount = await Discount.findById(id);
    if (!discount) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    discount.title = body.title ?? discount.title;
    discount.description = body.description ?? discount.description;
    if (["percentage", "fixed"].includes(body.type)) discount.type = body.type;
    if (typeof body.value === "number") discount.value = body.value;
    if (typeof body.minQuantity === "number") discount.minQuantity = body.minQuantity;
    if (typeof body.minSubtotal === "number") discount.minSubtotal = body.minSubtotal;
    if (Array.isArray(body.applicableProducts)) discount.applicableProducts = body.applicableProducts;
    if (Array.isArray(body.applicableCategories)) discount.applicableCategories = body.applicableCategories;
    discount.startDate = body.startDate || undefined;
    discount.endDate = body.endDate || undefined;
    if (typeof body.active === "boolean") discount.active = body.active;

    await discount.save();
    return NextResponse.json({ success: true, discount: { ...discount.toObject(), _id: String(discount._id) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update discount" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await connectToDatabase();
    await Discount.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete discount" }, { status: 500 });
  }
}
