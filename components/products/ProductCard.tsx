import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";

export interface ProductCardData {
  _id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  mainImage?: string;
  badges?: string[];
  stock?: number;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const onSale = typeof product.salePrice === "number" && product.salePrice < product.price;
  const outOfStock = typeof product.stock === "number" && product.stock <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-beige overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square bg-soft-bg">
        <SafeImage
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {product.badges?.map((badge) => (
          <span
            key={badge}
            className="absolute top-2 left-2 bg-leaf text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full"
          >
            {badge}
          </span>
        ))}
        {outOfStock && (
          <span className="absolute top-2 right-2 bg-brown text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">
            Sold Out
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h3 className="font-heading text-lg text-brown">{product.name}</h3>
        <div className="flex items-center gap-2">
          {onSale ? (
            <>
              <span className="text-orange font-bold">${product.salePrice!.toFixed(2)}</span>
              <span className="text-sm text-brown/50 line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-orange font-bold">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
