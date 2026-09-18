import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireUser } from "@/lib/userAuth";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireUser(request);
  if (!session) {
    return NextResponse.json({ success: false, order: null }, { status: 401 });
  }
  const { id } = await params;
  try {
    await connectToDatabase();
    const order = await Order.findOne({ _id: id, user: session.id }).lean();
    if (!order) return NextResponse.json({ success: false, order: null }, { status: 404 });
    return NextResponse.json({ success: true, order: { ...order, _id: String(order._id) } });
  } catch {
    return NextResponse.json({ success: false, order: null }, { status: 500 });
  }
}
