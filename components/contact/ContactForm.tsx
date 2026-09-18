"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send message");
      showToast("Message sent! We'll be in touch soon.", "success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to send message", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-2xl border border-beige p-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="border border-beige rounded-lg px-3 py-2"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="border border-beige rounded-lg px-3 py-2"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="border border-beige rounded-lg px-3 py-2"
        />
        <input
          required
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          className="border border-beige rounded-lg px-3 py-2"
        />
      </div>
      <textarea
        required
        placeholder="Message"
        rows={5}
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
        className="border border-beige rounded-lg px-3 py-2"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-orange text-white font-semibold px-6 py-3 rounded-full hover:bg-saffron transition-colors disabled:opacity-60 self-start"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
