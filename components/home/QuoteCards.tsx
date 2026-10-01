const QUOTES = [
  {
    text: "We wanted a snack that tasted like home — not something off a factory shelf.",
    source: "SUNN Foods Kitchen",
  },
  {
    text: "Three ingredients, one recipe, generations of tradition. That's the whole idea.",
    source: "SUNN Foods Kitchen",
  },
  {
    text: "If you can't pronounce it, it's probably not in our bar.",
    source: "SUNN Foods Kitchen",
  },
];

export default function QuoteCards() {
  return (
    <section className="bg-soft-bg py-16">
      <div className="container-page">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-brown text-center mb-10">
          What We Believe
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {QUOTES.map((q) => (
            <div
              key={q.text}
              className="bg-white rounded-2xl border border-beige shadow-sm p-8 flex flex-col items-center text-center gap-4"
            >
              <p className="font-heading text-lg text-brown leading-snug">&ldquo;{q.text}&rdquo;</p>
              <span className="text-xs font-bold uppercase tracking-wide text-brown/50">{q.source}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
