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
    settings?.earlyBirdText || "Early Bird Special: Buy 3 boxes and save 30%. Limited time offer.";

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
