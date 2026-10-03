"use client";

import { useRef, useState, useEffect } from "react";

const STEPS = [
  {
    title: "Source",
    desc: "We start with urad dal, pure ghee, and simple, honest ingredients.",
    icon: <path d="M12 2v6m0 0 4-4m-4 4-4-4M5 12h14M7 16h10M9 20h6" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: "Handcraft",
    desc: "Every batch is roasted and shaped by hand, following the family recipe.",
    icon: <path d="M7 10c0-3 2-6 5-6s5 3 5 6-2 10-5 10-5-7-5-10Z" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: "Pack Fresh",
    desc: "Small batches mean every bar and pack ships fresh, not from a warehouse shelf.",
    icon: <path d="M4 8h16v12H4V8Zm0 0 2-5h12l2 5M9 12h6" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: "Deliver",
    desc: "Straight to your door across the Greater Toronto Area.",
    icon: <path d="M3 12h13l-4-4m4 4-4 4M20 6v12" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export default function ProcessSteps() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisibleCount(STEPS.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            STEPS.forEach((_, i) => {
              setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), i * 220);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-16" ref={sectionRef}>
      <div className="container-page">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-brown text-center mb-14">
          How SUNN Foods Gets Made
        </h2>
        <div className="relative grid grid-cols-1 sm:grid-cols-4 gap-10 sm:gap-6">
          <div className="hidden sm:block absolute top-9 left-[12.5%] right-[12.5%] h-0.5 bg-beige -z-0" />
          {STEPS.map((step, i) => {
            const isVisible = i < visibleCount;
            return (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center gap-3 transition-all duration-500 ease-out"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.92)",
                }}
              >
                <span className="relative z-10 w-[72px] h-[72px] shrink-0 rounded-full bg-soft-bg border-2 border-orange flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#D95A1A" strokeWidth="1.6" className="w-8 h-8">
                    {step.icon}
                  </svg>
                </span>
                <h3 className="font-heading text-lg font-bold text-brown">
                  {i + 1}. {step.title}
                </h3>
                <p className="text-brown/70 text-sm leading-relaxed max-w-[220px]">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
