"use client";

import { useState } from "react";
import SafeImage from "@/components/ui/SafeImage";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const list = images.length > 0 ? images : [""];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-soft-bg border border-beige mb-3">
        <SafeImage src={list[active]} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${
                i === active ? "border-orange" : "border-beige"
              }`}
            >
              <SafeImage src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
