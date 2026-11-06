"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/ToastProvider";
import { SHIPPING_FEE, SHIPPING_ESTIMATE, SHIPPING_AREA } from "@/lib/shipping";
import { calculateHst } from "@/lib/tax";

const PROVINCES = ["ON", "QC", "BC", "AB", "MB", "SK", "NS", "NB", "NL", "PE", "YT", "NT", "NU"];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; title: string } | null>(
    null
  );

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "Toronto",
    province: "ON",
    postalCode: "",
    country: "Canada",
    notes: "",
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleApplyPromo() {
    if (!promoCode.trim()) {
      showToast("Enter a promo code first", "error");
      return;
    }
    setApplyingPromo(true);
    try {
      const res = await fetch("/api/discounts/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCode,
          items: items.map((i) => ({ productId: i.productId, price: i.price, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Invalid promo code");
      setAppliedDiscount({ code: promoCode.trim().toUpperCase(), amount: data.discountAmount, title: data.title });
      showToast(`Promo applied: ${data.title}`, "success");
    } catch (err) {
      setAppliedDiscount(null);
      showToast(err instanceof Error ? err.message : "Invalid promo code", "error");
    } finally {
      setApplyingPromo(false);
    }
  }

  function removePromo() {
    setAppliedDiscount(null);
    setPromoCode("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            qty: i.qty,
            image: i.image,
          })),
          customerInfo: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            address: form.address,
            apartment: form.apartment,
            city: form.city,
            province: form.province,
            postalCode: form.postalCode,
            country: form.country,
          },
          orderNotes: form.notes,
          promoCode: promoCode.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Order failed");
      if (data.redirectUrl) {
        // Cart is cleared on the success page once payment is confirmed,
        // not here, so an abandoned Stripe checkout doesn't lose the cart.
        window.location.href = data.redirectUrl;
        return;
      }
      clearCart();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Order failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page py-12 grid md:grid-cols-[1fr_320px] gap-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h1 className="font-heading text-3xl font-bold text-brown">Checkout</h1>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First Name" value={form.firstName} onChange={(v) => update("firstName", v)} required />
          <Field label="Last Name" value={form.lastName} onChange={(v) => update("lastName", v)} required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
          <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} required />
        </div>

        <div className="grid gap-4">
          <Field label="Address" value={form.address} onChange={(v) => update("address", v)} required />
          <Field label="Apartment / Unit (optional)" value={form.apartment} onChange={(v) => update("apartment", v)} />
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="City" value={form.city} onChange={(v) => update("city", v)} required />
            <div>
              <label className="text-sm font-semibold text-brown mb-1 block">Province</label>
              <select
                value={form.province}
                onChange={(e) => update("province", e.target.value)}
                className="w-full border border-beige rounded-lg px-3 py-2"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <Field label="Postal Code" value={form.postalCode} onChange={(v) => update("postalCode", v)} required />
          </div>
          <Field label="Country" value={form.country} onChange={(v) => update("country", v)} required />
        </div>

        <div>
          <label className="text-sm font-semibold text-brown mb-1 block">Order Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="w-full border border-beige rounded-lg px-3 py-2"
            rows={3}
          />
        </div>

        <div className="bg-soft-bg rounded-xl p-4 text-sm text-brown/80">
          You&apos;ll be redirected to our secure payment page to complete your order.
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-orange text-white font-semibold px-6 py-3 rounded-full hover:bg-saffron transition-colors disabled:opacity-60"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      <div className="bg-soft-bg rounded-2xl p-6 h-fit">
        <h2 className="font-heading text-xl font-bold text-brown mb-4">Order Summary</h2>
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm mb-2">
            <span>{item.name} x{item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-beige">
          <label className="text-sm font-semibold text-brown mb-1 block">Promo Code</label>
          {appliedDiscount ? (
            <div className="flex items-center justify-between bg-leaf/10 border border-leaf rounded-lg px-3 py-2 text-sm">
              <span className="text-leaf font-semibold">{appliedDiscount.code} applied</span>
              <button type="button" onClick={removePromo} className="text-brown/60 underline text-xs">
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 border border-beige rounded-lg px-3 py-2 text-sm uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={applyingPromo}
                className="border-2 border-orange text-orange font-semibold px-4 py-2 rounded-lg hover:bg-orange hover:text-white transition-colors disabled:opacity-60 text-sm"
              >
                {applyingPromo ? "..." : "Apply"}
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-between text-sm mt-4 pt-4 border-t border-beige">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {appliedDiscount && (
          <div className="flex justify-between text-sm mt-2 text-leaf">
            <span>Discount ({appliedDiscount.title})</span>
            <span>-${appliedDiscount.amount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm mt-2">
          <span>Shipping</span>
          <span>${SHIPPING_FEE.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span>HST (13%)</span>
          <span>
            $
            {calculateHst(
              Math.max(0, subtotal - (appliedDiscount?.amount || 0)) + SHIPPING_FEE
            ).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-beige">
          <span>Total</span>
          <span>
            $
            {(
              Math.max(0, subtotal - (appliedDiscount?.amount || 0)) +
              SHIPPING_FEE +
              calculateHst(Math.max(0, subtotal - (appliedDiscount?.amount || 0)) + SHIPPING_FEE)
            ).toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-brown/60 mt-4">
          Estimated delivery: {SHIPPING_ESTIMATE} within {SHIPPING_AREA}.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-brown mb-1 block">
        {label} {required && <span className="text-orange">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-beige rounded-lg px-3 py-2"
      />
    </div>
  );
}
