"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/ToastProvider";

const PROVINCES = ["ON", "QC", "BC", "AB", "MB", "SK", "NS", "NB", "NL", "PE", "YT", "NT", "NU"];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

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
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Order failed");
      clearCart();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Order failed", "error");
      router.push("/checkout/cancelled");
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
          Payment: Pay on delivery / manual bank transfer. We will contact you to confirm payment details.
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
        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-beige">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
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
