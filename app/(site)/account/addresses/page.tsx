"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

interface Address {
  _id: string;
  label?: string;
  address: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ label: "", address: "", apartment: "", city: "", province: "", postalCode: "", country: "Canada" });
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/account/me")
      .then((r) => {
        if (r.status === 401) {
          router.push("/account/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.success) setAddresses(data.user.addresses || []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to add address");
      setAddresses(data.addresses);
      setForm({ label: "", address: "", apartment: "", city: "", province: "", postalCode: "", country: "Canada" });
      showToast("Address added", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to add address", "error");
    }
  }

  async function handleDelete(addressId: string) {
    try {
      const res = await fetch("/api/account/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to remove address");
      setAddresses(data.addresses);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to remove address", "error");
    }
  }

  if (loading) return <div className="container-page py-16">Loading...</div>;

  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Saved Addresses</h1>

      <div className="flex flex-col gap-3 mb-8">
        {addresses.length === 0 && <p className="text-brown/70">No saved addresses yet.</p>}
        {addresses.map((a) => (
          <div key={a._id} className="bg-white border border-beige rounded-xl p-4 flex justify-between items-start">
            <div className="text-sm text-brown/80">
              {a.label && <div className="font-semibold text-brown">{a.label}</div>}
              <div>{a.address}{a.apartment ? `, ${a.apartment}` : ""}</div>
              <div>{a.city}, {a.province} {a.postalCode}</div>
              <div>{a.country}</div>
            </div>
            <button onClick={() => handleDelete(a._id)} className="text-orange text-sm font-semibold">Remove</button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="bg-soft-bg rounded-2xl p-6 flex flex-col gap-3">
        <h2 className="font-semibold text-brown">Add New Address</h2>
        <input placeholder="Label (e.g. Home)" value={form.label} onChange={(e) => update("label", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <input required placeholder="Address" value={form.address} onChange={(e) => update("address", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <input placeholder="Apartment / Unit" value={form.apartment} onChange={(e) => update("apartment", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <div className="grid grid-cols-3 gap-2">
          <input required placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
          <input required placeholder="Province" value={form.province} onChange={(e) => update("province", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
          <input required placeholder="Postal Code" value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        </div>
        <input required placeholder="Country" value={form.country} onChange={(e) => update("country", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <button type="submit" className="bg-orange text-white font-semibold px-6 py-3 rounded-full self-start">Add Address</button>
      </form>
    </div>
  );
}
