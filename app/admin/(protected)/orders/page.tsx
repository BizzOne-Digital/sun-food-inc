"use client";

import { useEffect, useState } from "react";

const STATUSES = ["Pending", "Confirmed", "Preparing", "Ready", "Shipped", "Delivered", "Cancelled"];

interface AdminOrder {
  _id: string;
  orderNumber: string;
  customerInfo: { firstName: string; lastName: string; email: string };
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, orderStatus: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-beige overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-beige">
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-beige/60">
                  <td className="p-4 font-semibold text-brown">{o.orderNumber}</td>
                  <td className="p-4">{o.customerInfo?.firstName} {o.customerInfo?.lastName}<br /><span className="text-xs text-brown/60">{o.customerInfo?.email}</span></td>
                  <td className="p-4">${o.total.toFixed(2)}</td>
                  <td className="p-4">{o.paymentStatus}</td>
                  <td className="p-4">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="border border-beige rounded-lg px-2 py-1"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-brown/60">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
