"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";

export default function AccountRegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Registration failed");
      showToast("Account created!", "success");
      router.push("/account");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="font-heading text-3xl font-bold text-brown mb-6 text-center">Create Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-beige rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="First Name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
          <input required placeholder="Last Name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        </div>
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <input required type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => update("password", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <button type="submit" disabled={loading} className="bg-orange text-white font-semibold px-6 py-3 rounded-full disabled:opacity-60">
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-brown/70 mt-4">
        Already have an account? <Link href="/account/login" className="text-orange font-semibold">Sign In</Link>
      </p>
    </div>
  );
}
