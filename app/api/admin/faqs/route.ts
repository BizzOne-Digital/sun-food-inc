import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const faqs = await FAQ.find().sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, faqs: faqs.map((f) => ({ ...f, _id: String(f._id) })) });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load FAQs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.question !== "string" || !body.question.trim() || typeof body.answer !== "string" || !body.answer.trim()) {
      return NextResponse.json({ success: false, error: "Question and answer are required" }, { status: 400 });
    }
    await connectToDatabase();
    const faq = await FAQ.create({
      question: body.question.trim(),
      answer: body.answer.trim(),
      category: body.category || "General",
      order: typeof body.order === "number" ? body.order : 0,
      active: body.active !== false,
    });
    return NextResponse.json({ success: true, faq: { ...faq.toObject(), _id: String(faq._id) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create FAQ" }, { status: 500 });
  }
}
