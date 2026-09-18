const FEATURES = [
  { title: "Plant-Based Protein", desc: "Wholesome protein bars made from natural ingredients.", icon: "M12 2C6 8 4 14 12 22C20 14 18 8 12 2Z" },
  { title: "Traditional Recipes", desc: "Family sunnundalu recipes passed down for generations.", icon: "M4 20C4 12 20 12 20 20" },
  { title: "Family Friendly", desc: "Kids bars made with families in mind.", icon: "M12 3L4 9V21H20V9L12 3Z" },
  { title: "Small Batch Quality", desc: "Made fresh, in small batches, in Toronto.", icon: "M6 3H18V9L12 15L6 9V3Z" },
  { title: "Community Rooted", desc: "Proudly serving the Toronto community.", icon: "M12 22C12 22 20 14 20 9A8 8 0 0 0 4 9C4 14 12 22 12 22Z" },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-soft-bg">
      <div className="container-page py-16">
        <h2 className="font-heading text-3xl font-bold text-brown text-center mb-10">
          Why Choose SUN Foods
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 flex flex-col items-center text-center border border-beige">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#496F2E" strokeWidth="1.5" className="mb-3">
                <path d={f.icon} />
              </svg>
              <h3 className="font-semibold text-brown mb-1">{f.title}</h3>
              <p className="text-sm text-brown/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
