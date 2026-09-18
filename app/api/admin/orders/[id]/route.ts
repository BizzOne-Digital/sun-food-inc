import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order, { OrderStatus } from "@/models/Order";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

const VALID_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    if (!VALID_STATUSES.includes(body.orderStatus)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }
    await connectToDatabase();
    const order = await Order.findByIdAndUpdate(id, { orderStatus: body.orderStatus }, { new: true }).lean();
    if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, order: { ...order, _id: String(order._id) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}
