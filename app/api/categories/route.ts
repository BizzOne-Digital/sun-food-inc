import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({ active: true }).lean();
    return NextResponse.json({
      success: true,
      categories: categories.map((c) => ({ _id: String(c._id), name: c.name, slug: c.slug })),
    });
  } catch {
    return NextResponse.json({ success: false, categories: [] });
  }
}
