import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireUser } from "@/lib/userAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireUser(request);
  if (!session) {
    return NextResponse.json({ success: false, orders: [] }, { status: 401 });
  }
  try {
    await connectToDatabase();
    const orders = await Order.find({ user: session.id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({
        id: String(o._id),
        orderNumber: o.orderNumber,
        total: o.total,
        orderStatus: o.orderStatus,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ success: false, orders: [] }, { status: 500 });
  }
}
