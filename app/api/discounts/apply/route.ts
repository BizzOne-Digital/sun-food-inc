import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Discount from "@/models/Discount";
import { calculateCodeDiscount } from "@/lib/discounts";

export const runtime = "nodejs";

interface IncomingItem {
  productId: string;
  price: number;
  qty: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, items } = body;

    if (typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ success: false, error: "Enter a promo code" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Your cart is empty" }, { status: 400 });
    }

    const validItems: IncomingItem[] = items.filter(
      (i: IncomingItem) =>
        typeof i.productId === "string" && typeof i.price === "number" && typeof i.qty === "number" && i.qty > 0
    );

    await connectToDatabase();
    const discount = await Discount.findOne({ active: true, code: code.trim().toUpperCase() }).lean();

    if (!discount) {
      return NextResponse.json({ success: false, error: "Invalid promo code" }, { status: 400 });
    }

    const amount = calculateCodeDiscount(validItems, discount);
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "This promo code doesn't apply to your cart" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, discountAmount: amount, title: discount.title });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to apply promo code" }, { status: 500 });
  }
}
