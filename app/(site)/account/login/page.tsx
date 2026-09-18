"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";

export default function AccountLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Login failed");
      showToast("Welcome back!", "success");
      router.push("/account");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Login failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="font-heading text-3xl font-bold text-brown mb-6 text-center">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-beige rounded-2xl p-6">
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <button type="submit" disabled={loading} className="bg-orange text-white font-semibold px-6 py-3 rounded-full disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="text-center text-sm text-brown/70 mt-4">
        Don&apos;t have an account? <Link href="/account/register" className="text-orange font-semibold">Register</Link>
      </p>
    </div>
  );
}
