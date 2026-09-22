import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FreeFromBadges from "@/components/home/FreeFromBadges";
import EarlyBirdBanner from "@/components/home/EarlyBirdBanner";
import IngredientSpotlight from "@/components/home/IngredientSpotlight";
import OurStory from "@/components/home/OurStory";
import ComparisonTable from "@/components/home/ComparisonTable";
import BulkDiscountTiers from "@/components/home/BulkDiscountTiers";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import FAQPreview from "@/components/home/FAQPreview";
import NewsletterSignup from "@/components/home/NewsletterSignup";

export const dynamic = "force-dynamic";

async function getHomeContent() {
  try {
    await connectToDatabase();
    const content = await PageContent.findOne({ page: "home" }).lean();
    return content;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const content = await getHomeContent();
  const visible = (content?.sectionsVisible as Record<string, boolean>) || {};

  return (
    <>
      <Hero
        heading={content?.heroHeading || undefined}
        subheading={content?.heroSubheading || undefined}
        ctaPrimaryText={content?.ctaPrimaryText || undefined}
        ctaPrimaryLink={content?.ctaPrimaryLink || undefined}
        ctaSecondaryText={content?.ctaSecondaryText || undefined}
        ctaSecondaryLink={content?.ctaSecondaryLink || undefined}
      />
      {visible.earlyBird !== false && <EarlyBirdBanner />}
      {visible.featured !== false && <FeaturedProducts />}
      <FreeFromBadges />
      <IngredientSpotlight />
      {visible.ourStory !== false && (
        <OurStory heading={content?.ourStoryHeading || undefined} body={content?.ourStoryBody || undefined} />
      )}
      <ComparisonTable />
      {visible.whyChooseUs !== false && <WhyChooseUs />}
      {visible.categories !== false && <CategoriesGrid />}
      <BulkDiscountTiers />
      {visible.faq !== false && <FAQPreview />}
      {visible.newsletter !== false && <NewsletterSignup />}
    </>
  );
}
