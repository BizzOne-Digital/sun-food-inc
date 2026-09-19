import type { Metadata } from "next";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductGallery from "@/components/products/ProductGallery";
import AddToCartBox from "@/components/products/AddToCartBox";
import ProductCard, { ProductCardData } from "@/components/products/ProductCard";

async function getProduct(slug: string) {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug, active: true }).lean();
    return product;
  } catch {
    return null;
  }
}

async function getRelated(categoryId: unknown, excludeId: string): Promise<ProductCardData[]> {
  try {
    await connectToDatabase();
    const related = await Product.find({
      active: true,
      category: categoryId,
      _id: { $ne: excludeId },
    })
      .limit(4)
      .lean();
    return related.map((p) => ({
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found | SUN Foods" };
  return {
    title: product.seoTitle || `${product.name} | SUN Foods`,
    description: product.seoDescription || product.shortDescription || product.name,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = product.category ? await getRelated(product.category, String(product._id)) : [];
  const images = [product.mainImage, ...(product.galleryImages || [])].filter(Boolean) as string[];

  return (
    <div className="container-page py-12">
      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery images={images} name={product.name} />

        <div>
          <h1 className="font-heading text-3xl font-bold text-brown mb-2">{product.name}</h1>
          {product.shortDescription && (
            <p className="text-brown/70 mb-4">{product.shortDescription}</p>
          )}
          <div className="flex items-center gap-3 mb-6">
            {typeof product.salePrice === "number" && product.salePrice < product.price ? (
              <>
                <span className="text-2xl font-bold text-orange">${product.salePrice.toFixed(2)}</span>
                <span className="text-lg text-brown/50 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-orange">${product.price.toFixed(2)}</span>
            )}
            {product.packSize && <span className="text-sm text-brown/60">/ {product.packSize}</span>}
          </div>

          <AddToCartBox
            productId={String(product._id)}
            name={product.name}
            slug={product.slug}
            price={product.price}
            salePrice={product.salePrice}
            image={product.mainImage}
            stock={product.stock}
          />

          <div className="mt-10 flex flex-col gap-6">
            <div>
              <h2 className="font-heading text-xl font-semibold text-brown mb-2">Description</h2>
              <p className="text-brown/80 leading-relaxed">
                {product.description || "Description coming soon."}
              </p>
            </div>
            <div>
              <h2 className="font-heading text-xl font-semibold text-brown mb-2">Ingredients</h2>
              <p className="text-brown/80 leading-relaxed">{product.ingredients}</p>
            </div>
            <div>
              <h2 className="font-heading text-xl font-semibold text-brown mb-2">Nutrition Information</h2>
              <p className="text-brown/80 leading-relaxed">{product.nutritionInformation}</p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-brown mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
