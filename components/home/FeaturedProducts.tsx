import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard, { ProductCardData } from "@/components/products/ProductCard";
import Link from "next/link";

async function getFeaturedProducts(): Promise<ProductCardData[]> {
  try {
    await connectToDatabase();
    const products = await Product.find({ active: true, featured: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();
    return products.map((p) => ({
      _id: String(p._id),
      name: p.name,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice,
      mainImage: p.mainImage,
      badges: p.badges,
      stock: p.stock,
    }));
  } catch {
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="container-page py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-heading text-3xl text-brown font-bold">Featured Products</h2>
          <p className="text-brown/70 mt-1">Our most-loved bites, ready to ship in Toronto.</p>
        </div>
        <Link href="/products" className="text-orange font-semibold hidden sm:block">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
