"use client";

import { useEffect, useState } from "react";
import LocalImageField from "@/components/admin/LocalImageField";
import { useToast } from "@/components/ui/ToastProvider";

const SECTIONS = [
  { key: "earlyBird", label: "Early Bird Banner" },
  { key: "featured", label: "Featured Products" },
  { key: "ourStory", label: "Our Story" },
  { key: "whyChooseUs", label: "Why Choose Us" },
  { key: "categories", label: "Product Categories" },
  { key: "faq", label: "FAQ Preview" },
  { key: "newsletter", label: "Newsletter Signup" },
];

export default function AdminHomepagePage() {
  const [form, setForm] = useState({
    heroHeading: "",
    heroSubheading: "",
    heroImage: "",
    ctaPrimaryText: "",
    ctaPrimaryLink: "",
    ctaSecondaryText: "",
    ctaSecondaryLink: "",
    ourStoryHeading: "",
    ourStoryBody: "",
    ourStoryImage: "",
    sectionsVisible: {} as Record<string, boolean>,
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/pagecontent/home")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const c = d.content;
          setForm({
            heroHeading: c.heroHeading || "",
            heroSubheading: c.heroSubheading || "",
            heroImage: c.heroImage || "",
            ctaPrimaryText: c.ctaPrimaryText || "",
            ctaPrimaryLink: c.ctaPrimaryLink || "",
            ctaSecondaryText: c.ctaSecondaryText || "",
            ctaSecondaryLink: c.ctaSecondaryLink || "",
            ourStoryHeading: c.ourStoryHeading || "",
            ourStoryBody: c.ourStoryBody || "",
            ourStoryImage: c.ourStoryImage || "",
            sectionsVisible: c.sectionsVisible || {},
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleSection(key: string) {
    setForm((f) => ({ ...f, sectionsVisible: { ...f.sectionsVisible, [key]: f.sectionsVisible[key] === false } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/pagecontent/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save");
      showToast("Homepage content saved", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save", "error");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Homepage Editor</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
        <h2 className="font-semibold text-brown">Hero Section</h2>
        <input placeholder="Hero Heading" value={form.heroHeading} onChange={(e) => update("heroHeading", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <textarea placeholder="Hero Subheading" value={form.heroSubheading} onChange={(e) => update("heroSubheading", e.target.value)} className="border border-beige rounded-lg px-3 py-2" rows={3} />
        <LocalImageField label="Hero Image" folder="pages" value={form.heroImage} onChange={(url) => update("heroImage", url)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <input placeholder="Primary CTA Text" value={form.ctaPrimaryText} onChange={(e) => update("ctaPrimaryText", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
          <input placeholder="Primary CTA Link" value={form.ctaPrimaryLink} onChange={(e) => update("ctaPrimaryLink", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
          <input placeholder="Secondary CTA Text" value={form.ctaSecondaryText} onChange={(e) => update("ctaSecondaryText", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
          <input placeholder="Secondary CTA Link" value={form.ctaSecondaryLink} onChange={(e) => update("ctaSecondaryLink", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        </div>

        <h2 className="font-semibold text-brown mt-4">Our Story</h2>
        <input placeholder="Our Story Heading" value={form.ourStoryHeading} onChange={(e) => update("ourStoryHeading", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <textarea placeholder="Our Story Body" value={form.ourStoryBody} onChange={(e) => update("ourStoryBody", e.target.value)} className="border border-beige rounded-lg px-3 py-2" rows={4} />

        <h2 className="font-semibold text-brown mt-4">Section Visibility</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {SECTIONS.map((s) => (
            <label key={s.key} className="flex items-center gap-2 text-sm font-medium text-brown">
              <input
                type="checkbox"
                checked={form.sectionsVisible[s.key] !== false}
                onChange={() => toggleSection(s.key)}
              />
              {s.label}
            </label>
          ))}
        </div>

        <button type="submit" className="bg-orange text-white font-semibold px-6 py-3 rounded-full self-start">
          Save Homepage
        </button>
      </form>
    </div>
  );
}
