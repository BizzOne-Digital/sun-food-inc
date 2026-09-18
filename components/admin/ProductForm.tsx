"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LocalImageField from "@/components/admin/LocalImageField";
import { useToast } from "@/components/ui/ToastProvider";

interface Category {
  _id: string;
  name: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  category?: string;
  sku: string;
  stock: number;
  packSize: string;
  ingredients: string;
  nutritionInformation: string;
  featured: boolean;
  active: boolean;
  badges: string;
  mainImage: string;
  galleryImages: string[];
  seoTitle: string;
  seoDescription: string;
}

const DEFAULT_FORM: ProductFormData = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: 0,
  salePrice: undefined,
  category: "",
  sku: "",
  stock: 0,
  packSize: "",
  ingredients: "",
  nutritionInformation: "",
  featured: false,
  active: true,
  badges: "",
  mainImage: "",
  galleryImages: [],
  seoTitle: "",
  seoDescription: "",
};

export default function ProductForm({
  productId,
  initial,
}: {
  productId?: string;
  initial?: Partial<ProductFormData>;
}) {
  const [form, setForm] = useState<ProductFormData>({ ...DEFAULT_FORM, ...initial });
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => setCategories([]));
  }, []);

  function update<K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        badges: form.badges.split(",").map((b) => b.trim()).filter(Boolean),
        salePrice: form.salePrice || undefined,
        category: form.category || undefined,
      };
      const res = await fetch(productId ? `/api/admin/products/${productId}` : "/api/admin/products", {
        method: productId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save product");
      showToast("Product saved", "success");
      router.push("/admin/products");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save product", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Name" value={form.name} onChange={(v) => update("name", v)} required />
        <TextField label="Slug" value={form.slug} onChange={(v) => update("slug", v)} required />
      </div>

      <TextField label="Short Description" value={form.shortDescription} onChange={(v) => update("shortDescription", v)} />
      <TextAreaField label="Description" value={form.description} onChange={(v) => update("description", v)} />

      <div className="grid sm:grid-cols-3 gap-4">
        <NumberField label="Price" value={form.price} onChange={(v) => update("price", v)} required />
        <NumberField label="Sale Price (optional)" value={form.salePrice ?? ""} onChange={(v) => update("salePrice", v)} />
        <NumberField label="Stock" value={form.stock} onChange={(v) => update("stock", v)} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-brown mb-1 block">Category</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full border border-beige rounded-lg px-3 py-2"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <TextField label="SKU" value={form.sku} onChange={(v) => update("sku", v)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Pack Size" value={form.packSize} onChange={(v) => update("packSize", v)} />
        <TextField label="Badges (comma separated)" value={form.badges} onChange={(v) => update("badges", v)} />
      </div>

      <TextAreaField label="Ingredients" value={form.ingredients} onChange={(v) => update("ingredients", v)} />
      <TextAreaField label="Nutrition Information" value={form.nutritionInformation} onChange={(v) => update("nutritionInformation", v)} />

      <LocalImageField label="Main Image" folder="products" value={form.mainImage} onChange={(url) => update("mainImage", url)} required />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="SEO Title" value={form.seoTitle} onChange={(v) => update("seoTitle", v)} />
        <TextField label="SEO Description" value={form.seoDescription} onChange={(v) => update("seoDescription", v)} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-brown">
          <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-brown">
          <input type="checkbox" checked={form.active} onChange={(e) => update("active", e.target.checked)} />
          Published
        </label>
      </div>

      <button type="submit" disabled={saving} className="bg-orange text-white font-semibold px-6 py-3 rounded-full self-start disabled:opacity-60">
        {saving ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}

function TextField({ label, value, onChange, required = false }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-semibold text-brown mb-1 block">{label} {required && <span className="text-orange">*</span>}</label>
      <input required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-beige rounded-lg px-3 py-2" />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-semibold text-brown mb-1 block">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full border border-beige rounded-lg px-3 py-2" />
    </div>
  );
}

function NumberField({ label, value, onChange, required = false }: { label: string; value: number | string; onChange: (v: number) => void; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-semibold text-brown mb-1 block">{label} {required && <span className="text-orange">*</span>}</label>
      <input
        type="number"
        step="0.01"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
        className="w-full border border-beige rounded-lg px-3 py-2"
      />
    </div>
  );
}
