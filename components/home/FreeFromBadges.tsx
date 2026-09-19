const BADGES: { label: string; icon: React.ReactNode }[] = [
  {
    label: "No GMO",
    icon: (
      <path d="M9 4v16M15 4v16M9 8h6M9 16h6M4 20 20 4" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  {
    label: "Dairy Free",
    icon: (
      <path
        d="M9 3h6l1 4-1 2v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V9L8 7l1-4ZM4 20 20 4"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Egg Free",
    icon: (
      <path
        d="M12 3c4 4 6.5 9 6.5 12.5A6.5 6.5 0 0 1 12 22a6.5 6.5 0 0 1-6.5-6.5C5.5 12 8 7 12 3ZM4 20 20 4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    label: "Soy Free",
    icon: (
      <path
        d="M8 10c0-3 2-6 4-6s4 3 4 6-2 8-4 8-4-5-4-8Zm-2 8c2 2 4 2 6 0M4 20 20 4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    label: "Grain Free",
    icon: (
      <path
        d="M12 3v18M8 7c0 2 4 2 4 4s-4 2-4 4M16 7c0 2-4 2-4 4s4 2 4 4M4 20 20 4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    label: "No Refined Sugar",
    icon: (
      <path
        d="M5 8h14l-1.5 10a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2L5 8Zm2-4h10M4 20 20 4"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function FreeFromBadges() {
  return (
    <section className="bg-white py-14 border-y border-beige">
      <div className="container-page">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-brown text-center mb-10">
          Only the Best, Free From the Unwanted
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
          {BADGES.map((b) => (
            <div key={b.label} className="flex flex-col items-center text-center gap-3">
              <span className="w-16 h-16 rounded-full border-2 border-orange/70 flex items-center justify-center text-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
                  {b.icon}
                </svg>
              </span>
              <span className="text-sm font-semibold text-brown">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
