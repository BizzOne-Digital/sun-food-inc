import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import ContactMessage from "@/models/ContactMessage";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();

    const [totalProducts, totalOrders, totalCustomers, pendingOrders, unreadMessages, revenueAgg] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments(),
        Order.countDocuments({ orderStatus: "Pending" }),
        ContactMessage.countDocuments({ read: false }),
        Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);

    const revenue = revenueAgg[0]?.total || 0;

    return NextResponse.json({
      success: true,
      stats: { totalProducts, totalOrders, totalCustomers, pendingOrders, unreadMessages, revenue },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load dashboard" }, { status: 500 });
  }
}
