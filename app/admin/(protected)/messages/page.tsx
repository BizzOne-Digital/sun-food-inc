"use client";

import { useEffect, useState } from "react";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/messages");
    const data = await res.json();
    setMessages(data.messages || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Messages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m._id} className={`bg-white border rounded-xl p-4 ${m.read ? "border-beige" : "border-orange"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-brown">{m.subject}</h3>
                  <p className="text-xs text-brown/60">{m.name} · {m.email} {m.phone && `· ${m.phone}`}</p>
                </div>
                {!m.read && (
                  <button onClick={() => markRead(m._id)} className="text-orange text-sm font-semibold">Mark Read</button>
                )}
              </div>
              <p className="text-sm text-brown/80 mt-2">{m.message}</p>
              <p className="text-xs text-brown/50 mt-2">{new Date(m.createdAt).toLocaleString()}</p>
            </div>
          ))}
          {messages.length === 0 && <p className="text-brown/60">No messages yet.</p>}
        </div>
      )}
    </div>
  );
}
