import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/adminAuth";
import { deleteStoredUploadByUrl } from "@/lib/deleteStoredUpload";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await connectToDatabase();
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, product: { ...product, _id: String(product._id) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load product" }, { status: 500 });
  }
}

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

    const existing = await Product.findById(id);
    if (!existing) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const oldMainImage = existing.mainImage;

    existing.name = body.name ?? existing.name;
    existing.slug = body.slug ?? existing.slug;
    existing.shortDescription = body.shortDescription ?? existing.shortDescription;
    existing.description = body.description ?? existing.description;
    if (typeof body.price === "number") existing.price = body.price;
    existing.salePrice = typeof body.salePrice === "number" ? body.salePrice : undefined;
    existing.category = body.category || undefined;
    existing.sku = body.sku ?? existing.sku;
    if (typeof body.stock === "number") existing.stock = body.stock;
    existing.packSize = body.packSize ?? existing.packSize;
    existing.ingredients = body.ingredients ?? existing.ingredients;
    existing.nutritionInformation = body.nutritionInformation ?? existing.nutritionInformation;
    if (typeof body.featured === "boolean") existing.featured = body.featured;
    if (typeof body.active === "boolean") existing.active = body.active;
    if (Array.isArray(body.badges)) existing.badges = body.badges;
    if (typeof body.mainImage === "string") existing.mainImage = body.mainImage;
    if (Array.isArray(body.galleryImages)) existing.galleryImages = body.galleryImages;
    existing.seoTitle = body.seoTitle ?? existing.seoTitle;
    existing.seoDescription = body.seoDescription ?? existing.seoDescription;

    await existing.save();

    if (typeof body.mainImage === "string" && oldMainImage && oldMainImage !== body.mainImage) {
      await deleteStoredUploadByUrl(oldMainImage);
    }

    return NextResponse.json({ success: true, product: { ...existing.toObject(), _id: String(existing._id) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 400 });
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
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    await Product.deleteOne({ _id: id });
    await deleteStoredUploadByUrl(product.mainImage);
    for (const img of product.galleryImages || []) {
      await deleteStoredUploadByUrl(img);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
