"use client";

import { useState } from "react";

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0) {
    return <p className="text-brown/70">No FAQs available right now.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item._id;
        return (
          <div key={item._id} className="border border-beige rounded-xl bg-white overflow-hidden">
            <button
              className="w-full flex items-center justify-between text-left px-5 py-4 font-semibold text-brown"
              onClick={() => setOpenId(isOpen ? null : item._id)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D95A1A"
                strokeWidth="2"
                className={`transition-transform ${isOpen ? "rotate-45" : ""}`}
              >
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-brown/80 text-sm leading-relaxed">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
