import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import Link from "next/link";

async function getSettings() {
  try {
    await connectToDatabase();
    return await SiteSettings.findOne().lean();
  } catch {
    return null;
  }
}

export default async function EarlyBirdBanner() {
  const settings = await getSettings();
  if (settings && settings.earlyBirdEnabled === false) return null;

  const text =
    settings?.earlyBirdText ||
    "Buy 3 or more products in one order and save 10% automatically. Or use code EARLYBIRD for $5 off.";

  return (
    <section className="bg-orange text-white">
      <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <span className="font-semibold">{text}</span>
        <Link href="/products" className="underline font-bold">
          Shop the Offer
        </Link>
      </div>
    </section>
  );
}
