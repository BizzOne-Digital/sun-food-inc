"use client";

import { useEffect, useState } from "react";

interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/newsletter")
      .then((r) => r.json())
      .then((d) => setSubscribers(d.subscribers || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Newsletter Subscribers</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-beige overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-beige">
                <th className="p-4">Email</th>
                <th className="p-4">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s._id} className="border-b border-beige/60">
                  <td className="p-4 font-semibold text-brown">{s.email}</td>
                  <td className="p-4">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr><td colSpan={2} className="p-6 text-center text-brown/60">No subscribers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
