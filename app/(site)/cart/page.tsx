"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import SafeImage from "@/components/ui/SafeImage";
import { calculateBestDiscount } from "@/lib/discounts";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetch("/api/discounts/active")
      .then((r) => r.json())
      .then((data) => {
        const discounts = data.discounts || [];
        const amount = calculateBestDiscount(
          items.map((i) => ({ productId: i.productId, price: i.price, qty: i.qty })),
          discounts
        );
        setDiscount(amount);
      })
      .catch(() => setDiscount(0));
  }, [items]);

  const total = Math.max(0, subtotal - discount);

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-heading text-3xl font-bold text-brown mb-4">Your Cart is Empty</h1>
        <p className="text-brown/70 mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="bg-orange text-white font-semibold px-6 py-3 rounded-full">
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12 grid md:grid-cols-[1fr_320px] gap-10">
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-bold text-brown mb-2">Your Cart</h1>
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 bg-white border border-beige rounded-xl p-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-soft-bg flex-shrink-0">
              <SafeImage src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
            </div>
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-semibold text-brown">
                {item.name}
              </Link>
              <div className="text-orange font-bold">${item.price.toFixed(2)}</div>
            </div>
            <div className="flex items-center border border-beige rounded-full">
              <button className="w-8 h-8" onClick={() => updateQty(item.productId, item.qty - 1)}>-</button>
              <span className="w-8 text-center">{item.qty}</span>
              <button className="w-8 h-8" onClick={() => updateQty(item.productId, item.qty + 1)}>+</button>
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-orange text-sm font-semibold"
              aria-label="Remove item"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="bg-soft-bg rounded-2xl p-6 h-fit">
        <h2 className="font-heading text-xl font-bold text-brown mb-4">Order Summary</h2>
        <div className="flex justify-between text-sm mb-2">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm mb-2 text-leaf">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-beige">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 block text-center bg-orange text-white font-semibold px-6 py-3 rounded-full hover:bg-saffron transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
