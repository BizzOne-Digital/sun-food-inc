import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await connectToDatabase();
    const original = await Product.findById(id).lean();
    if (!original) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const copy = { ...original } as Record<string, unknown>;
    delete copy._id;
    delete copy.createdAt;
    delete copy.updatedAt;
    copy.name = `${original.name} (Copy)`;
    copy.slug = `${original.slug}-copy-${Date.now()}`;
    copy.active = false;

    const created = await Product.create(copy);
    return NextResponse.json({ success: true, product: { ...created.toObject(), _id: String(created._id) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to duplicate product" }, { status: 500 });
  }
}
