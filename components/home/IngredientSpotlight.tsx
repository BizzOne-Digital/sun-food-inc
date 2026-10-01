"use client";

import { useEffect, useRef, useState } from "react";

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

const COUNT = INGREDIENTS.length;
// Three looping copies so the track can slide seamlessly in either direction.
const TRACK = [...INGREDIENTS, ...INGREDIENTS, ...INGREDIENTS];

export default function IngredientSpotlight() {
  const [index, setIndex] = useState(COUNT);
  const [withTransition, setWithTransition] = useState(true);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function goTo(newIndex: number) {
    setWithTransition(true);
    setIndex(newIndex);
  }

  function prev() {
    goTo(index - 1);
  }
  function next() {
    goTo(index + 1);
  }

  // Once we slide past one full loop, snap back to the equivalent position
  // in the middle copy without a transition so it looks infinite.
  useEffect(() => {
    if (index >= COUNT * 2 || index < COUNT) {
      resetTimeout.current = setTimeout(() => {
        setWithTransition(false);
        setIndex(COUNT + (((index - COUNT) % COUNT) + COUNT) % COUNT);
      }, 500);
    }
    return () => {
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
    };
  }, [index]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;
    const timer = setInterval(() => {
      setWithTransition(true);
      setIndex((i) => i + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const activeDot = ((index % COUNT) + COUNT) % COUNT;

  return (
    <section className="bg-soft-bg py-16 relative overflow-hidden">
      <div className="container-page text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-brown leading-tight mb-2">
          Real, Recognizable Ingredient
          <br />
          Lists You Can <span className="text-orange">Actually Read</span>
        </h2>
        <p className="text-brown/70 mb-10">No confusing labels — just what's actually in your food.</p>

        <div className="relative">
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

          <div className="overflow-hidden">
            <div
              className={`flex ${withTransition ? "transition-transform duration-500 ease-out" : ""}`}
              style={{ transform: `translateX(-${index * (100 / 3)}%)` }}
            >
              {TRACK.map((ing, i) => (
                <div key={`${ing.name}-${i}`} className="w-full sm:w-1/3 flex-shrink-0 px-2.5">
                  <div className="bg-white rounded-2xl border border-beige p-6 flex flex-col items-center gap-3 shadow-sm h-full">
                    <h3 className="font-heading text-xl font-bold text-brown">{ing.name}</h3>
                    <span
                      className={`inline-block w-fit text-[11px] font-bold uppercase tracking-wide text-white ${ing.tagColor} rounded-full px-3 py-1`}
                    >
                      {ing.tag}
                    </span>
                    <p className="text-brown/70 text-sm leading-relaxed">{ing.note}</p>
                  </div>
                </div>
              ))}
            </div>
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
              onClick={() => goTo(COUNT + i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === activeDot ? "bg-brown" : "bg-beige"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
