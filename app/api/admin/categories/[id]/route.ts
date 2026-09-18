import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/adminAuth";
import { deleteStoredUploadByUrl } from "@/lib/deleteStoredUpload";

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
    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const oldImage = category.image;
    category.name = body.name ?? category.name;
    category.slug = body.slug ?? category.slug;
    category.description = body.description ?? category.description;
    if (typeof body.image === "string") category.image = body.image;
    if (typeof body.active === "boolean") category.active = body.active;
    await category.save();

    if (typeof body.image === "string" && oldImage && oldImage !== body.image) {
      await deleteStoredUploadByUrl(oldImage);
    }

    return NextResponse.json({ success: true, category: { ...category.toObject(), _id: String(category._id) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 400 });
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
    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    await Category.deleteOne({ _id: id });
    await deleteStoredUploadByUrl(category.image);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}
