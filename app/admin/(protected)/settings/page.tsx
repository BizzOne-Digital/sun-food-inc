"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    businessName: "",
    email: "",
    phone: "",
    address: "",
    serviceArea: "",
    socialFacebook: "",
    socialInstagram: "",
    socialTwitter: "",
    footerText: "",
    seoTitle: "",
    seoDescription: "",
    earlyBirdEnabled: true,
    earlyBirdText: "",
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setForm((f) => ({ ...f, ...d.settings }));
      })
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save settings");
      showToast("Settings saved", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save settings", "error");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Site Settings</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
        <input placeholder="Business Name" value={form.businessName} onChange={(e) => update("businessName", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <div className="grid sm:grid-cols-2 gap-4">
          <input placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        </div>
        <input placeholder="Address" value={form.address} onChange={(e) => update("address", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <textarea placeholder="Service Area" value={form.serviceArea} onChange={(e) => update("serviceArea", e.target.value)} className="border border-beige rounded-lg px-3 py-2" rows={2} />
        <div className="grid sm:grid-cols-3 gap-4">
          <input placeholder="Facebook URL" value={form.socialFacebook} onChange={(e) => update("socialFacebook", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
          <input placeholder="Instagram URL" value={form.socialInstagram} onChange={(e) => update("socialInstagram", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
          <input placeholder="Twitter URL" value={form.socialTwitter} onChange={(e) => update("socialTwitter", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        </div>
        <textarea placeholder="Footer Text" value={form.footerText} onChange={(e) => update("footerText", e.target.value)} className="border border-beige rounded-lg px-3 py-2" rows={2} />
        <input placeholder="SEO Title" value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <textarea placeholder="SEO Description" value={form.seoDescription} onChange={(e) => update("seoDescription", e.target.value)} className="border border-beige rounded-lg px-3 py-2" rows={2} />
        <label className="flex items-center gap-2 text-sm font-semibold text-brown">
          <input type="checkbox" checked={form.earlyBirdEnabled} onChange={(e) => update("earlyBirdEnabled", e.target.checked)} />
          Show Early Bird Banner
        </label>
        <input placeholder="Early Bird Text" value={form.earlyBirdText} onChange={(e) => update("earlyBirdText", e.target.value)} className="border border-beige rounded-lg px-3 py-2" />

        <button type="submit" className="bg-orange text-white font-semibold px-6 py-3 rounded-full self-start">
          Save Settings
        </button>
      </form>
    </div>
  );
}
