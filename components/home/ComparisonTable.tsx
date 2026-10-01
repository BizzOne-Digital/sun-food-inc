interface Row {
  label: string;
  sunn: string;
  cookie: string;
  snackBar: string;
}

const ROWS: Row[] = [
  {
    label: "Ingredients",
    sunn: "Urad dal, ghee & sugar — nothing else",
    cookie: "Refined flour, butter & added preservatives",
    snackBar: "Processed grains, syrups & additives",
  },
  {
    label: "Recipe Origin",
    sunn: "Generations-old family recipe",
    cookie: "Mass-market recipe",
    snackBar: "Factory-formulated recipe",
  },
  {
    label: "Preparation",
    sunn: "Handcrafted in small batches",
    cookie: "Machine-baked at scale",
    snackBar: "Machine-extruded at scale",
  },
  {
    label: "Made In",
    sunn: "Toronto, Canada",
    cookie: "Varies by brand",
    snackBar: "Varies by brand",
  },
  {
    label: "GMO / Egg / Soy (original recipe)",
    sunn: "GMO-free, egg-free, soy-free",
    cookie: "Often contains egg or soy",
    snackBar: "Often contains GMO ingredients",
  },
];

export default function ComparisonTable() {
  return (
    <section className="bg-white py-16">
      <div className="container-page">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-brown text-center mb-2">
          What Makes SUNN Foods Different
        </h2>
        <p className="text-brown/70 text-center mb-10">
          A closer look at what's actually in your snack.
        </p>
        <div className="rounded-2xl border border-beige overflow-hidden overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-4 bg-brown text-cream text-center font-bold text-base">
              <div className="p-5 text-left">&nbsp;</div>
              <div className="p-5 border-l border-cream/20 text-orange">SUNN Foods</div>
              <div className="p-5 border-l border-cream/20">Traditional Cookie</div>
              <div className="p-5 border-l border-cream/20">Traditional Snack Bar</div>
            </div>
            {ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-4 text-base ${i % 2 === 0 ? "bg-white" : "bg-soft-bg/40"}`}
              >
                <div className="p-5 font-semibold text-brown">{row.label}</div>
                <div className="p-5 border-l border-beige text-leaf font-medium">{row.sunn}</div>
                <div className="p-5 border-l border-beige text-brown/60">{row.cookie}</div>
                <div className="p-5 border-l border-beige text-brown/60">{row.snackBar}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
