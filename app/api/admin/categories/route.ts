import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, categories: categories.map((c) => ({ ...c, _id: String(c._id) })) });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.name !== "string" || !body.name.trim() || typeof body.slug !== "string" || !body.slug.trim()) {
      return NextResponse.json({ success: false, error: "Name and slug are required" }, { status: 400 });
    }
    await connectToDatabase();
    const category = await Category.create({
      name: body.name.trim(),
      slug: body.slug.trim().toLowerCase(),
      description: body.description || "",
      image: body.image || "",
      active: body.active !== false,
    });
    return NextResponse.json({ success: true, category: { ...category.toObject(), _id: String(category._id) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create category (slug may already exist)" }, { status: 400 });
  }
}
