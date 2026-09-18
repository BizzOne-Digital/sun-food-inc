import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Discount from "@/models/Discount";
import { calculateBestDiscount } from "@/lib/discounts";
import { generateOrderNumber } from "@/lib/orderNumber";
import { getPaymentProvider } from "@/lib/payments/manualProvider";
import { requireUser } from "@/lib/userAuth";

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
    const { items, customerInfo, shippingAddress, orderNotes } = body;

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
    const discounts = await Discount.find({ active: true }).lean();
    const discountAmount = calculateBestDiscount(
      validItems.map((i) => ({ productId: i.productId, price: i.price, qty: i.qty })),
      discounts
    );

    const shipping = 0;
    const tax = 0;
    const total = Math.max(0, subtotal - discountAmount + shipping + tax);

    const orderNumber = generateOrderNumber();
    const provider = getPaymentProvider();
    const paymentResult = await provider.initPayment({
      orderNumber,
      amount: total,
      currency: "CAD",
      customerEmail: customerInfo.email,
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

    return NextResponse.json({ success: true, orderNumber: order.orderNumber, orderId: String(order._id) });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
