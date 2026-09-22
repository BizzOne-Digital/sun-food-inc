const INGREDIENTS = [
  {
    name: "Urad Dal",
    tag: "Base Ingredient",
    note: "A traditional lentil, roasted and ground for our recipes.",
  },
  {
    name: "Pure Ghee",
    tag: "Traditional",
    note: "Clarified butter, valued in South Indian cooking for its rich flavour.",
  },
  {
    name: "Dates Paste",
    tag: "Sweetener Variant",
    note: "A natural alternative used in some of our recipe variants.",
  },
  {
    name: "Almonds & Cashews",
    tag: "Variant Add-In",
    note: "Used in select variants for texture and flavour.",
  },
];

export default function IngredientSpotlight() {
  return (
    <section className="bg-soft-bg py-16">
      <div className="container-page">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-brown text-center mb-2">
          Real Ingredients You Can Read
        </h2>
        <p className="text-brown/70 text-center mb-10">
          No confusing labels — just what's actually in your food.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {INGREDIENTS.map((ing) => (
            <div
              key={ing.name}
              className="bg-white rounded-2xl border border-beige p-5 flex flex-col gap-2"
            >
              <span className="inline-block w-fit text-[11px] font-bold uppercase tracking-wide text-orange bg-orange/10 rounded-full px-2.5 py-1">
                {ing.tag}
              </span>
              <h3 className="font-heading text-lg font-bold text-brown">{ing.name}</h3>
              <p className="text-brown/70 text-sm leading-relaxed">{ing.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
