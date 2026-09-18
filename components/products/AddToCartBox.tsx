"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/ToastProvider";

interface AddToCartBoxProps {
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  stock: number;
}

export default function AddToCartBox({
  productId,
  name,
  slug,
  price,
  salePrice,
  image,
  stock,
}: AddToCartBoxProps) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const effectivePrice = typeof salePrice === "number" && salePrice < price ? salePrice : price;
  const outOfStock = stock <= 0;

  function handleAdd() {
    addItem({ productId, name, slug, price: effectivePrice, image }, qty);
    showToast("Added to cart", "success");
  }

  function handleBuyNow() {
    addItem({ productId, name, slug, price: effectivePrice, image }, qty);
    router.push("/cart");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-beige rounded-full">
          <button
            className="w-9 h-9 flex items-center justify-center"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <span className="w-8 text-center">{qty}</span>
          <button
            className="w-9 h-9 flex items-center justify-center"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>
        <span className={`text-sm font-semibold ${outOfStock ? "text-orange" : "text-leaf"}`}>
          {outOfStock ? "Out of Stock" : `${stock} in stock`}
        </span>
      </div>
      <div className="flex gap-3">
        <button
          disabled={outOfStock}
          onClick={handleAdd}
          className="flex-1 border-2 border-orange text-orange font-semibold px-6 py-3 rounded-full hover:bg-orange hover:text-white transition-colors disabled:opacity-50"
        >
          Add to Cart
        </button>
        <button
          disabled={outOfStock}
          onClick={handleBuyNow}
          className="flex-1 bg-orange text-white font-semibold px-6 py-3 rounded-full hover:bg-saffron transition-colors disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
