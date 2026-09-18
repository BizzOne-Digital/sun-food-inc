"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export default function AdminAccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update password");
      showToast("Password updated", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update password", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">My Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md bg-white border border-beige rounded-2xl p-6">
        <h2 className="font-semibold text-brown">Change Password</h2>
        <input required type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <input required type="password" placeholder="New Password (min 6 characters)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border border-beige rounded-lg px-3 py-2" />
        <button type="submit" disabled={saving} className="bg-orange text-white font-semibold px-6 py-3 rounded-full disabled:opacity-60">
          {saving ? "Saving..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
