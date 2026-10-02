import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FreeFromBadges from "@/components/home/FreeFromBadges";
import EarlyBirdBanner from "@/components/home/EarlyBirdBanner";
import IngredientSpotlight from "@/components/home/IngredientSpotlight";
import OurStory from "@/components/home/OurStory";
import FounderNote from "@/components/home/FounderNote";
import ShippingInfo from "@/components/home/ShippingInfo";
import ComparisonTable from "@/components/home/ComparisonTable";
import QuoteCards from "@/components/home/QuoteCards";
import ReviewsSection from "@/components/home/ReviewsSection";
import BulkDiscountTiers from "@/components/home/BulkDiscountTiers";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import FAQPreview from "@/components/home/FAQPreview";
import SocialCTA from "@/components/home/SocialCTA";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import ScrollReveal from "@/components/ui/ScrollReveal";

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
      {visible.earlyBird !== false && (
        <ScrollReveal>
          <EarlyBirdBanner />
        </ScrollReveal>
      )}
      {visible.featured !== false && (
        <ScrollReveal>
          <FeaturedProducts />
        </ScrollReveal>
      )}
      <ScrollReveal>
        <FreeFromBadges />
      </ScrollReveal>
      <ScrollReveal>
        <ShippingInfo />
      </ScrollReveal>
      <ScrollReveal>
        <IngredientSpotlight />
      </ScrollReveal>
      {visible.ourStory !== false && (
        <ScrollReveal>
          <OurStory heading={content?.ourStoryHeading || undefined} body={content?.ourStoryBody || undefined} />
        </ScrollReveal>
      )}
      <ScrollReveal>
        <FounderNote />
      </ScrollReveal>
      <ScrollReveal>
        <QuoteCards />
      </ScrollReveal>
      <ScrollReveal>
        <ReviewsSection />
      </ScrollReveal>
      <ScrollReveal>
        <ComparisonTable />
      </ScrollReveal>
      {visible.whyChooseUs !== false && (
        <ScrollReveal>
          <WhyChooseUs />
        </ScrollReveal>
      )}
      {visible.categories !== false && (
        <ScrollReveal>
          <CategoriesGrid />
        </ScrollReveal>
      )}
      <ScrollReveal>
        <BulkDiscountTiers />
      </ScrollReveal>
      {visible.faq !== false && (
        <ScrollReveal>
          <FAQPreview />
        </ScrollReveal>
      )}
      <ScrollReveal>
        <SocialCTA />
      </ScrollReveal>
      {visible.newsletter !== false && (
        <ScrollReveal>
          <NewsletterSignup />
        </ScrollReveal>
      )}
    </>
  );
}
