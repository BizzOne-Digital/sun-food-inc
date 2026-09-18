"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  unreadMessages: number;
  revenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => setStats(d.stats || null))
      .catch(() => setStats(null));
  }, []);

  const cards = [
    { label: "Total Products", value: stats?.totalProducts ?? "-" },
    { label: "Total Orders", value: stats?.totalOrders ?? "-" },
    { label: "Revenue", value: stats ? `$${stats.revenue.toFixed(2)}` : "-" },
    { label: "Customers", value: stats?.totalCustomers ?? "-" },
    { label: "Pending Orders", value: stats?.pendingOrders ?? "-" },
    { label: "Messages", value: stats?.unreadMessages ?? "-" },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-beige p-6">
            <div className="text-sm text-brown/60 mb-1">{c.label}</div>
            <div className="text-3xl font-bold text-orange">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
