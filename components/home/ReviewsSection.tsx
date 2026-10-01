function StarRow({ filled = 0 }: { filled?: number }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill={i < filled ? "#E99719" : "none"}
          stroke="#E99719"
          strokeWidth="1.5"
        >
          <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.7 2.9-6.1Z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="bg-soft-bg py-16">
      <div className="container-page text-center">
        <h2 className="font-heading text-2xl md:text-4xl font-bold text-brown mb-10">
          Be the First to Review SUNN Foods
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-beige p-8 flex flex-col items-center gap-3 text-center"
            >
              <StarRow filled={0} />
              <p className="text-brown/50 italic">Your review could be here.</p>
              <span className="text-xs font-semibold text-brown/40 uppercase tracking-wide">
                No reviews yet
              </span>
            </div>
          ))}
        </div>
        <p className="text-brown/60 text-sm mt-8">
          We're just getting started — real customer reviews will appear here soon.
        </p>
      </div>
    </section>
  );
}
