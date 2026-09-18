"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

const ABOUT_BLOCKS = [
  { key: "origin", label: "Origin & Tradition" },
  { key: "wellness", label: "Wellness Approach" },
  { key: "ingredients", label: "Ingredient Philosophy" },
  { key: "family", label: "Family Focus" },
  { key: "mission", label: "Mission" },
];

export default function AdminPagesEditor() {
  const [page, setPage] = useState<"about" | "contact">("about");
  const [heroHeading, setHeroHeading] = useState("");
  const [heroSubheading, setHeroSubheading] = useState("");
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/pagecontent/${page}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setHeroHeading(d.content.heroHeading || "");
          setHeroSubheading(d.content.heroSubheading || "");
          setBlocks(d.content.blocks || {});
        }
      })
      .finally(() => setLoading(false));
  }, [page]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/pagecontent/${page}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroHeading, heroSubheading, blocks }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save");
      showToast("Page content saved", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save", "error");
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Page Content</h1>
      <div className="flex gap-3 mb-6">
        <button onClick={() => setPage("about")} className={`px-4 py-2 rounded-full font-semibold ${page === "about" ? "bg-orange text-white" : "bg-white border border-beige"}`}>About</button>
        <button onClick={() => setPage("contact")} className={`px-4 py-2 rounded-full font-semibold ${page === "contact" ? "bg-orange text-white" : "bg-white border border-beige"}`}>Contact</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
          <input placeholder="Hero Heading" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
          <textarea placeholder="Hero Subheading" value={heroSubheading} onChange={(e) => setHeroSubheading(e.target.value)} className="border border-beige rounded-lg px-3 py-2" rows={3} />

          {page === "about" && ABOUT_BLOCKS.map((b) => (
            <div key={b.key}>
              <label className="text-sm font-semibold text-brown mb-1 block">{b.label}</label>
              <textarea
                value={blocks[b.key] || ""}
                onChange={(e) => setBlocks((prev) => ({ ...prev, [b.key]: e.target.value }))}
                className="w-full border border-beige rounded-lg px-3 py-2"
                rows={3}
              />
            </div>
          ))}

          <button type="submit" className="bg-orange text-white font-semibold px-6 py-3 rounded-full self-start">
            Save Page
          </button>
        </form>
      )}
    </div>
  );
}
