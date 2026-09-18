import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(24, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    const query: Record<string, unknown> = { active: true };
    if (category) {
      const Category = (await import("@/models/Category")).default;
      const cat = await Category.findOne({ slug: category }).lean();
      if (cat) query.category = cat._id;
      else query.category = null;
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
    };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortMap[sort] || sortMap.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      products: products.map((p) => ({
        _id: String(p._id),
        name: p.name,
        slug: p.slug,
        price: p.price,
        salePrice: p.salePrice,
        mainImage: p.mainImage,
        badges: p.badges,
        stock: p.stock,
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ success: false, products: [], total: 0, page: 1, pages: 1 });
  }
}
