import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
    }

    await connectToDatabase();
    await NewsletterSubscriber.updateOne({ email }, { email }, { upsert: true });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Subscription failed" }, { status: 500 });
  }
}
