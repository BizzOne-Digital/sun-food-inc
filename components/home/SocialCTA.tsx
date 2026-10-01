import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

async function getInstagramUrl() {
  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne().lean();
    return settings?.socialInstagram || "";
  } catch {
    return "";
  }
}

export default async function SocialCTA() {
  const instagramUrl = await getInstagramUrl();

  return (
    <section className="bg-leaf py-14">
      <div className="container-page text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
          Share Your SUNN Moment
        </h2>
        <p className="text-white/85 mb-6">Tag us on Instagram and show us how you enjoy SUNN Foods.</p>
        {instagramUrl ? (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-leaf font-semibold px-6 py-3 rounded-full hover:bg-cream transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
            </svg>
            Follow on Instagram
          </a>
        ) : (
          <span className="text-white/70 text-sm italic">#SunnFoods</span>
        )}
      </div>
    </section>
  );
}
