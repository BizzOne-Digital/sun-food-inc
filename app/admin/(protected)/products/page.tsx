"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";

interface AdminProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  active: boolean;
  featured: boolean;
  category?: { name: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(product: AdminProduct) {
    await fetch(`/api/admin/products/${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active }),
    });
    load();
  }

  async function duplicate(id: string) {
    await fetch(`/api/admin/products/${id}/duplicate`, { method: "POST" });
    showToast("Product duplicated", "success");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      showToast("Product deleted", "success");
      load();
    } else {
      showToast(data.error || "Failed to delete", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-brown">Products</h1>
        <Link href="/admin/products/new" className="bg-orange text-white font-semibold px-5 py-2.5 rounded-full">
          + New Product
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-beige overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-beige">
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-beige/60">
                  <td className="p-4 font-semibold text-brown">{p.name}</td>
                  <td className="p-4">{p.category?.name || "-"}</td>
                  <td className="p-4">${p.price.toFixed(2)}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        p.active ? "bg-leaf text-white" : "bg-beige text-brown"
                      }`}
                    >
                      {p.active ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="p-4 flex gap-3">
                    <Link href={`/admin/products/${p._id}`} className="text-orange font-semibold">Edit</Link>
                    <button onClick={() => duplicate(p._id)} className="text-brown/70 font-semibold">Duplicate</button>
                    <button onClick={() => remove(p._id)} className="text-orange font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-brown/60">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
