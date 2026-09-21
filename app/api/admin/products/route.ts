import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 }).populate("category", "name slug").lean();
    return NextResponse.json({
      success: true,
      products: products.map((p) => ({ ...p, _id: String(p._id) })),
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    if (typeof body.slug !== "string" || !body.slug.trim()) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }
    if (typeof body.price !== "number" || body.price < 0) {
      return NextResponse.json({ success: false, error: "Valid price is required" }, { status: 400 });
    }

    await connectToDatabase();
    const product = await Product.create({
      name: body.name.trim(),
      slug: body.slug.trim().toLowerCase(),
      shortDescription: body.shortDescription || "",
      description: body.description || "",
      price: body.price,
      salePrice: typeof body.salePrice === "number" ? body.salePrice : undefined,
      category: body.category || undefined,
      sku: body.sku || "",
      stock: typeof body.stock === "number" ? body.stock : 0,
      packSize: body.packSize || "",
      ingredients: body.ingredients || undefined,
      nutritionInformation: body.nutritionInformation || undefined,
      featured: Boolean(body.featured),
      active: body.active !== false,
      badges: Array.isArray(body.badges) ? body.badges : [],
      mainImage: body.mainImage || "",
      galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
      seoTitle: body.seoTitle || "",
      seoDescription: body.seoDescription || "",
    });

    return NextResponse.json({ success: true, product: { ...product.toObject(), _id: String(product._id) } });
  } catch (err) {
    const message = err instanceof Error && err.message.includes("duplicate") ? "Slug already exists" : "Failed to create product";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
