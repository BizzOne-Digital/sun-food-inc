"use client";

import { useState } from "react";

const INGREDIENTS = [
  {
    name: "Urad Dal",
    tag: "Base Ingredient",
    tagColor: "bg-orange",
    note: "A traditional lentil, roasted and ground for our recipes.",
  },
  {
    name: "Pure Ghee",
    tag: "Traditional",
    tagColor: "bg-leaf",
    note: "Clarified butter, valued in South Indian cooking for its rich flavour.",
  },
  {
    name: "Dates Paste",
    tag: "Sweetener Variant",
    tagColor: "bg-saffron",
    note: "A natural alternative used in some of our recipe variants.",
  },
  {
    name: "Almonds & Cashews",
    tag: "Variant Add-In",
    tagColor: "bg-deep-green",
    note: "Used in select variants for texture and flavour.",
  },
];

export default function IngredientSpotlight() {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i - 1 + INGREDIENTS.length) % INGREDIENTS.length);
  }
  function next() {
    setIndex((i) => (i + 1) % INGREDIENTS.length);
  }

  const visible = [0, 1, 2].map((offset) => INGREDIENTS[(index + offset) % INGREDIENTS.length]);

  return (
    <section className="bg-soft-bg py-16 relative overflow-hidden">
      <div className="container-page text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-brown leading-tight mb-2">
          Real, Recognizable Ingredient
          <br />
          Lists You Can <span className="text-orange">Actually Read</span>
        </h2>
        <p className="text-brown/70 mb-10">No confusing labels — just what's actually in your food.</p>

        <div className="relative max-w-4xl mx-auto">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous ingredient"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-11 h-11 rounded-full bg-white border-2 border-saffron text-saffron items-center justify-center hover:bg-saffron hover:text-white transition-colors z-10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {visible.map((ing) => (
              <div
                key={ing.name}
                className="bg-white rounded-2xl border border-beige p-6 flex flex-col items-center gap-3 shadow-sm"
              >
                <h3 className="font-heading text-xl font-bold text-brown">{ing.name}</h3>
                <span
                  className={`inline-block w-fit text-[11px] font-bold uppercase tracking-wide text-white ${ing.tagColor} rounded-full px-3 py-1`}
                >
                  {ing.tag}
                </span>
                <p className="text-brown/70 text-sm leading-relaxed">{ing.note}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next ingredient"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-11 h-11 rounded-full bg-white border-2 border-saffron text-saffron items-center justify-center hover:bg-saffron hover:text-white transition-colors z-10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {INGREDIENTS.map((ing, i) => (
            <button
              key={ing.name}
              type="button"
              aria-label={`Go to ${ing.name}`}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === index ? "bg-brown" : "bg-beige"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
