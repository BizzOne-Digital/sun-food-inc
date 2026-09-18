"use client";

import { useEffect, useState } from "react";
import LocalImageField from "@/components/admin/LocalImageField";
import { useToast } from "@/components/ui/ToastProvider";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  active: boolean;
}

const EMPTY = { name: "", slug: "", description: "", image: "", active: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showToast } = useToast();

  async function load() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }

  useEffect(() => {
    load();
  }, []);

  function edit(c: Category) {
    setEditingId(c._id);
    setForm({ name: c.name, slug: c.slug, description: c.description || "", image: c.image || "", active: c.active });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save category");
      showToast("Category saved", "success");
      resetForm();
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save category", "error");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    showToast("Category deleted", "success");
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Categories</h1>

      <div className="grid md:grid-cols-[1fr_320px] gap-8">
        <div className="bg-white rounded-2xl border border-beige overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-beige">
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-b border-beige/60">
                  <td className="p-4 font-semibold text-brown">{c.name}</td>
                  <td className="p-4">{c.slug}</td>
                  <td className="p-4">{c.active ? "Active" : "Hidden"}</td>
                  <td className="p-4 flex gap-3">
                    <button onClick={() => edit(c)} className="text-orange font-semibold">Edit</button>
                    <button onClick={() => remove(c._id)} className="text-orange font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-brown/60">No categories yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit} className="bg-soft-bg rounded-2xl p-6 flex flex-col gap-4 h-fit">
          <h2 className="font-semibold text-brown">{editingId ? "Edit Category" : "New Category"}</h2>
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border border-beige rounded-lg px-3 py-2" />
          <input required placeholder="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="border border-beige rounded-lg px-3 py-2" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="border border-beige rounded-lg px-3 py-2" rows={3} />
          <LocalImageField label="Image" folder="gallery" value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
          <label className="flex items-center gap-2 text-sm font-semibold text-brown">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
            Active
          </label>
          <div className="flex gap-3">
            <button type="submit" className="bg-orange text-white font-semibold px-5 py-2.5 rounded-full">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-brown font-semibold">Cancel</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
