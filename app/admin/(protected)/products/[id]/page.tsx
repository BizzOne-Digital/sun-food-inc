"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Partial<ProductFormData> | null>(null);

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const p = d.product;
          setInitial({
            name: p.name,
            slug: p.slug,
            shortDescription: p.shortDescription || "",
            description: p.description || "",
            price: p.price,
            salePrice: p.salePrice,
            category: p.category ? String(p.category) : "",
            sku: p.sku || "",
            stock: p.stock,
            packSize: p.packSize || "",
            ingredients: p.ingredients || "",
            nutritionInformation: p.nutritionInformation || "",
            featured: p.featured,
            active: p.active,
            badges: (p.badges || []).join(", "),
            mainImage: p.mainImage || "",
            galleryImages: p.galleryImages || [],
            seoTitle: p.seoTitle || "",
            seoDescription: p.seoDescription || "",
          });
        }
      });
  }, [params.id]);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Edit Product</h1>
      {initial ? <ProductForm productId={params.id} initial={initial} /> : <p>Loading...</p>}
    </div>
  );
}
