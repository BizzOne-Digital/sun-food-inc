"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Subscription failed");
      showToast("Thanks for subscribing!", "success");
      setEmail("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Subscription failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-leaf text-white">
      <div className="container-page py-14 flex flex-col items-center text-center">
        <h2 className="font-heading text-3xl font-bold mb-2">Stay in the Loop</h2>
        <p className="text-white/85 mb-6 max-w-md">
          Get early access to new flavors, offers, and family recipes.
        </p>
        <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
          <input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-full px-4 py-3 text-brown outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange text-white font-semibold px-6 py-3 rounded-full hover:bg-saffron transition-colors disabled:opacity-60"
          >
            {loading ? "..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
