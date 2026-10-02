import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

async function getServiceArea() {
  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne().lean();
    return settings?.serviceArea || "Currently serving the Greater Toronto Area.";
  } catch {
    return "Currently serving the Greater Toronto Area.";
  }
}

const ITEMS = [
  {
    label: "Where We Deliver",
    icon: <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  },
  {
    label: "Handcrafted to Order",
    icon: <path d="M4 12l5-8 5 8-5 8-5-8Zm10 0 3-5 3 5-3 5-3-5Z" />,
  },
  {
    label: "Questions? We're Here",
    icon: <path d="M21 11.5a8.5 8.5 0 1 1-4-7.2M21 4v6h-6" />,
  },
];

export default async function ShippingInfo() {
  const serviceArea = await getServiceArea();

  return (
    <section className="bg-white py-14 border-y border-beige">
      <div className="container-page grid md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="#496F2E" strokeWidth="1.6" className="w-8 h-8">
            {ITEMS[0].icon}
          </svg>
          <h3 className="font-heading text-lg font-bold text-brown">{ITEMS[0].label}</h3>
          <p className="text-brown/70 text-sm">{serviceArea}</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="#496F2E" strokeWidth="1.6" className="w-8 h-8">
            {ITEMS[1].icon}
          </svg>
          <h3 className="font-heading text-lg font-bold text-brown">{ITEMS[1].label}</h3>
          <p className="text-brown/70 text-sm">Every order is prepared fresh in small batches.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="#496F2E" strokeWidth="1.6" className="w-8 h-8">
            {ITEMS[2].icon}
          </svg>
          <h3 className="font-heading text-lg font-bold text-brown">{ITEMS[2].label}</h3>
          <p className="text-brown/70 text-sm">
            Reach out anytime through our{" "}
            <a href="/contact" className="text-orange font-semibold underline">
              contact page
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
