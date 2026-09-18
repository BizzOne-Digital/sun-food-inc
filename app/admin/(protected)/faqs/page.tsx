"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
}

const EMPTY = { question: "", answer: "", category: "General", order: 0, active: true };

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showToast } = useToast();

  async function load() {
    const res = await fetch("/api/admin/faqs");
    const data = await res.json();
    setFaqs(data.faqs || []);
  }

  useEffect(() => {
    load();
  }, []);

  function edit(f: FAQItem) {
    setEditingId(f._id);
    setForm({ question: f.question, answer: f.answer, category: f.category, order: f.order, active: f.active });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(editingId ? `/api/admin/faqs/${editingId}` : "/api/admin/faqs", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save FAQ");
      showToast("FAQ saved", "success");
      resetForm();
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save FAQ", "error");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    showToast("FAQ deleted", "success");
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">FAQs</h1>
      <div className="grid md:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-3">
          {faqs.map((f) => (
            <div key={f._id} className="bg-white border border-beige rounded-xl p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-brown">{f.question}</h3>
                <div className="flex gap-3 flex-shrink-0 ml-4">
                  <button onClick={() => edit(f)} className="text-orange text-sm font-semibold">Edit</button>
                  <button onClick={() => remove(f._id)} className="text-orange text-sm font-semibold">Delete</button>
                </div>
              </div>
              <p className="text-sm text-brown/70 mt-1">{f.answer}</p>
              <p className="text-xs text-brown/50 mt-2">{f.category} · order {f.order} · {f.active ? "Active" : "Hidden"}</p>
            </div>
          ))}
          {faqs.length === 0 && <p className="text-brown/60">No FAQs yet.</p>}
        </div>

        <form onSubmit={handleSubmit} className="bg-soft-bg rounded-2xl p-6 flex flex-col gap-3 h-fit">
          <h2 className="font-semibold text-brown">{editingId ? "Edit FAQ" : "New FAQ"}</h2>
          <input required placeholder="Question" value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} className="border border-beige rounded-lg px-3 py-2" />
          <textarea required placeholder="Answer" value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} className="border border-beige rounded-lg px-3 py-2" rows={3} />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="border border-beige rounded-lg px-3 py-2" />
          <input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="border border-beige rounded-lg px-3 py-2" />
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
