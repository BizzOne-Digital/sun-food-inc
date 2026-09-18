"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

interface Discount {
  _id: string;
  title: string;
  description?: string;
  type: "percentage" | "fixed";
  value: number;
  minQuantity?: number;
  minSubtotal?: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
}

const EMPTY = {
  title: "",
  description: "",
  type: "percentage" as "percentage" | "fixed",
  value: 0,
  minQuantity: 1,
  minSubtotal: 0,
  startDate: "",
  endDate: "",
  active: true,
};

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showToast } = useToast();

  async function load() {
    const res = await fetch("/api/admin/discounts");
    const data = await res.json();
    setDiscounts(data.discounts || []);
  }

  useEffect(() => {
    load();
  }, []);

  function edit(d: Discount) {
    setEditingId(d._id);
    setForm({
      title: d.title,
      description: d.description || "",
      type: d.type,
      value: d.value,
      minQuantity: d.minQuantity || 1,
      minSubtotal: d.minSubtotal || 0,
      startDate: d.startDate ? d.startDate.slice(0, 10) : "",
      endDate: d.endDate ? d.endDate.slice(0, 10) : "",
      active: d.active,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(editingId ? `/api/admin/discounts/${editingId}` : "/api/admin/discounts", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save discount");
      showToast("Discount saved", "success");
      resetForm();
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save discount", "error");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this discount?")) return;
    await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
    showToast("Discount deleted", "success");
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Discounts</h1>
      <div className="grid md:grid-cols-[1fr_360px] gap-8">
        <div className="bg-white rounded-2xl border border-beige overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-beige">
                <th className="p-4">Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d._id} className="border-b border-beige/60">
                  <td className="p-4 font-semibold text-brown">{d.title}</td>
                  <td className="p-4">{d.type}</td>
                  <td className="p-4">{d.type === "percentage" ? `${d.value}%` : `$${d.value}`}</td>
                  <td className="p-4">{d.active ? "Active" : "Inactive"}</td>
                  <td className="p-4 flex gap-3">
                    <button onClick={() => edit(d)} className="text-orange font-semibold">Edit</button>
                    <button onClick={() => remove(d._id)} className="text-orange font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-brown/60">No discounts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit} className="bg-soft-bg rounded-2xl p-6 flex flex-col gap-3 h-fit">
          <h2 className="font-semibold text-brown">{editingId ? "Edit Discount" : "New Discount"}</h2>
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="border border-beige rounded-lg px-3 py-2" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="border border-beige rounded-lg px-3 py-2" rows={2} />
          <div className="grid grid-cols-2 gap-2">
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "percentage" | "fixed" }))} className="border border-beige rounded-lg px-3 py-2">
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            <input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: parseFloat(e.target.value) || 0 }))} className="border border-beige rounded-lg px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Min Quantity" value={form.minQuantity} onChange={(e) => setForm((f) => ({ ...f, minQuantity: parseInt(e.target.value) || 0 }))} className="border border-beige rounded-lg px-3 py-2" />
            <input type="number" placeholder="Min Subtotal" value={form.minSubtotal} onChange={(e) => setForm((f) => ({ ...f, minSubtotal: parseFloat(e.target.value) || 0 }))} className="border border-beige rounded-lg px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="border border-beige rounded-lg px-3 py-2" />
            <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="border border-beige rounded-lg px-3 py-2" />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-brown">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
            Active
          </label>
          <div className="flex gap-3">
            <button type="submit" className="bg-orange text-white font-semibold px-5 py-2.5 rounded-full">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="text-brown font-semibold">Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
