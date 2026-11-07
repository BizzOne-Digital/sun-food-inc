import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Discount from "@/models/Discount";
import { calculateBestDiscount, calculateCodeDiscount } from "@/lib/discounts";
import { generateOrderNumber } from "@/lib/orderNumber";
import { getPaymentProvider } from "@/lib/payments/manualProvider";
import { requireUser } from "@/lib/userAuth";
import { SHIPPING_FEE } from "@/lib/shipping";
import { calculateHst } from "@/lib/tax";

export const runtime = "nodejs";

interface IncomingItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerInfo, shippingAddress, orderNotes, promoCode } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    const requiredCustomerFields = ["firstName", "lastName", "email", "phone"];
    const requiredAddressFields = ["address", "city", "province", "postalCode", "country"];

    for (const field of requiredCustomerFields) {
      if (!customerInfo?.[field] || typeof customerInfo[field] !== "string") {
        return NextResponse.json({ success: false, error: `Missing customer field: ${field}` }, { status: 400 });
      }
    }
    for (const field of requiredAddressFields) {
      if (!shippingAddress?.[field] || typeof shippingAddress[field] !== "string") {
        return NextResponse.json({ success: false, error: `Missing address field: ${field}` }, { status: 400 });
      }
    }

    await connectToDatabase();

    const validItems: IncomingItem[] = items.filter(
      (i: IncomingItem) =>
        typeof i.productId === "string" &&
        typeof i.name === "string" &&
        typeof i.price === "number" &&
        typeof i.qty === "number" &&
        i.qty > 0
    );

    if (validItems.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid cart items" }, { status: 400 });
    }

    const subtotal = validItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discountableItems = validItems.map((i) => ({ productId: i.productId, price: i.price, qty: i.qty }));

    const discounts = await Discount.find({ active: true, code: { $exists: false } }).lean();
    let discountAmount = calculateBestDiscount(discountableItems, discounts);

    if (typeof promoCode === "string" && promoCode.trim()) {
      const codeDiscount = await Discount.findOne({
        active: true,
        code: promoCode.trim().toUpperCase(),
      }).lean();
      if (!codeDiscount) {
        return NextResponse.json({ success: false, error: "Invalid promo code" }, { status: 400 });
      }
      const codeAmount = calculateCodeDiscount(discountableItems, codeDiscount);
      if (codeAmount <= 0) {
        return NextResponse.json(
          { success: false, error: "This promo code doesn't apply to your cart" },
          { status: 400 }
        );
      }
      discountAmount = Math.max(discountAmount, codeAmount);
    }

    const shipping = SHIPPING_FEE;
    const tax = calculateHst(Math.max(0, subtotal - discountAmount) + shipping);
    const total = Math.max(0, subtotal - discountAmount + shipping + tax);

    const orderNumber = generateOrderNumber();
    const provider = getPaymentProvider();
    const siteUrl = request.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const paymentResult = await provider.initPayment({
      orderNumber,
      amount: total,
      currency: "CAD",
      customerEmail: customerInfo.email,
      siteUrl,
    });

    const session = await requireUser(request);

    const order = await Order.create({
      orderNumber,
      user: session?.id,
      items: validItems.map((i) => ({
        product: i.productId,
        name: i.name,
        price: i.price,
        qty: i.qty,
        image: i.image,
      })),
      subtotal,
      discount: discountAmount,
      shipping,
      tax,
      total,
      customerInfo,
      shippingAddress,
      orderNotes: typeof orderNotes === "string" ? orderNotes : "",
      paymentStatus: paymentResult.paymentStatus,
      paymentProvider: provider.name,
      providerReference: paymentResult.providerReference,
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: String(order._id),
      redirectUrl: paymentResult.redirectUrl,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
