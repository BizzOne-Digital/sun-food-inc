import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, subscribers: subscribers.map((s) => ({ ...s, _id: String(s._id) })) });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load subscribers" }, { status: 500 });
  }
}
