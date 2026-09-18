import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
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
    const message = await ContactMessage.findByIdAndUpdate(id, { read: Boolean(body.read) }, { new: true }).lean();
    if (!message) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: { ...message, _id: String(message._id) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update message" }, { status: 400 });
  }
}
