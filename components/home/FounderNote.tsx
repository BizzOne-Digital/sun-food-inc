export default function FounderNote() {
  return (
    <section className="bg-brown py-16">
      <div className="container-page max-w-3xl mx-auto text-center">
        <span className="inline-block w-14 h-14 rounded-full bg-orange/20 border-2 border-orange flex items-center justify-center mx-auto mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="#E99719" strokeWidth="1.6" className="w-7 h-7">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" />
          </svg>
        </span>
        <p className="font-heading text-xl md:text-2xl text-cream leading-snug mb-6">
          Founder Kumar Padmanabhuni started SUNN Foods to bring his family's recipe out of the
          kitchen and into a quick, honest snack for everyday life.
        </p>
        <span className="text-orange font-semibold">Kumar Padmanabhuni</span>
        <span className="block text-cream/60 text-sm mt-1">Founder, SUNN Foods</span>
      </div>
    </section>
  );
}
