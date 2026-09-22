const ROWS = [
  "Traditional Family Recipe",
  "Handcrafted in Small Batches",
  "Made Fresh in Toronto",
  "Transparent Ingredient List",
];

export default function ComparisonTable() {
  return (
    <section className="bg-white py-16">
      <div className="container-page">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-brown text-center mb-10">
          SUNN Foods vs. Typical Store-Bought Snacks
        </h2>
        <div className="max-w-2xl mx-auto rounded-2xl border border-beige overflow-hidden">
          <div className="grid grid-cols-3 bg-soft-bg text-center font-bold text-brown text-sm">
            <div className="p-4 text-left">&nbsp;</div>
            <div className="p-4 border-l border-beige">SUNN Foods</div>
            <div className="p-4 border-l border-beige">Typical Snacks</div>
          </div>
          {ROWS.map((row, i) => (
            <div
              key={row}
              className={`grid grid-cols-3 text-center text-sm ${i % 2 === 0 ? "bg-white" : "bg-soft-bg/40"}`}
            >
              <div className="p-4 text-left font-semibold text-brown">{row}</div>
              <div className="p-4 border-l border-beige flex items-center justify-center text-leaf font-bold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2">
                  <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="p-4 border-l border-beige flex items-center justify-center text-brown/30 font-bold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
