import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";

async function getCategories() {
  try {
    await connectToDatabase();
    const categories = await Category.find({ active: true }).lean();
    return categories.map((c) => ({
      _id: String(c._id),
      name: c.name,
      slug: c.slug,
      image: c.image,
    }));
  } catch {
    return [];
  }
}

export default async function CategoriesGrid() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <section className="container-page py-16">
      <h2 className="font-heading text-3xl font-bold text-brown text-center mb-10">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((c) => (
          <Link
            key={c._id}
            href={`/products?category=${c.slug}`}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-soft-bg border border-beige group"
          >
            <SafeImage
              src={c.image}
              alt={c.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-brown/30 flex items-center justify-center">
              <span className="text-white font-heading text-xl font-bold">{c.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
