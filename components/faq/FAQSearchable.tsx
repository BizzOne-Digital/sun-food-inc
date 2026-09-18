"use client";

import { useMemo, useState } from "react";
import FAQAccordion, { FAQItem } from "@/components/ui/FAQAccordion";

export default function FAQSearchable({ faqs }: { faqs: FAQItem[] }) {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const filtered = faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(query.toLowerCase()) ||
        f.answer.toLowerCase().includes(query.toLowerCase())
    );
    const groups: Record<string, FAQItem[]> = {};
    for (const f of filtered) {
      const cat = f.category || "General";
      groups[cat] = groups[cat] || [];
      groups[cat].push(f);
    }
    return groups;
  }, [faqs, query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search FAQs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-beige rounded-full px-4 py-3 mb-8"
      />
      {Object.keys(grouped).length === 0 && <p className="text-brown/70">No matching questions found.</p>}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="font-heading text-xl font-bold text-brown mb-3">{category}</h2>
          <FAQAccordion items={items} />
        </div>
      ))}
    </div>
  );
}
