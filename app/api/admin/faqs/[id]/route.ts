import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    await connectToDatabase();
    const faq = await FAQ.findByIdAndUpdate(
      id,
      {
        question: body.question,
        answer: body.answer,
        category: body.category,
        order: body.order,
        active: body.active,
      },
      { new: true }
    ).lean();
    if (!faq) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, faq: { ...faq, _id: String(faq._id) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update FAQ" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await connectToDatabase();
    await FAQ.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete FAQ" }, { status: 500 });
  }
}
