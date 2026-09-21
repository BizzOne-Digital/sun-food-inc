import type { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | SUNN Foods",
  description: "The story, tradition, and wellness philosophy behind SUNN Foods.",
};

export const dynamic = "force-dynamic";

async function getAboutContent() {
  try {
    await connectToDatabase();
    return await PageContent.findOne({ page: "about" }).lean();
  } catch {
    return null;
  }
}

const VALUES = [
  {
    title: "Rooted in Tradition",
    text: "Every recipe traces back to a South Indian family kitchen, made fresh for today.",
    icon: (
      <path d="M12 3c-2 3-2 5 0 8s2 5 0 8M4 12h16" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  {
    title: "Honest Ingredients",
    text: "We keep ingredient lists clear and simple, updated on every product page.",
    icon: (
      <path
        d="M5 13c0-4.5 3-8 7-8s7 3.5 7 8-3 8-7 8-7-3.5-7-8Zm3-2h8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Family First",
    text: "From kids bars to family-size boxes, we design for every generation at the table.",
    icon: (
      <path
        d="M9 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm6 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM4 19c0-2.5 2-4.5 5-4.5s5 2 5 4.5m1-4.5c2.5 0 4.5 2 4.5 4.5"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Made for Toronto",
    text: "Starting right here in Toronto, bringing familiar flavors to our local community.",
    icon: <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" strokeWidth="1.6" strokeLinecap="round" />,
  },
];

export default async function AboutPage() {
  const content = await getAboutContent();
  const blocks = (content?.blocks as Record<string, string>) || {};

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-soft-bg">
        <div className="container-page py-16 md:py-20 text-center max-w-2xl mx-auto">
          <ScrollReveal>
            <span className="inline-block text-orange font-semibold tracking-wide text-sm uppercase mb-4">
              Our Story
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-brown mb-5 leading-tight">
              {content?.heroHeading || "Rooted in Tradition. Crafted for Today."}
            </h1>
            <p className="text-brown/80 text-lg leading-relaxed">
              {content?.heroSubheading ||
                "SUNN Foods was founded by Kumar Padmanabhuni to bring the warmth of South Indian family kitchens to modern, plant-based nutrition — starting right here in Toronto."}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Origin & Tradition */}
      <section className="container-page py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <ScrollReveal className="relative aspect-[4/3] rounded-3xl overflow-hidden order-2 md:order-1">
            <Image
              src="/about1.png"
              alt="Urad dal, ghee and dates used in traditional sunnundalu"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ScrollReveal>
          <ScrollReveal className="order-1 md:order-2">
            <h2 className="font-heading text-3xl font-bold text-brown mb-4">Origin & Tradition</h2>
            <p className="text-brown/80 leading-relaxed text-lg">
              {blocks.origin ||
                "Sunnundalu has been a staple sweet in South Indian households for generations — a urad dal and ghee treat made with love and shared at every family gathering. SUNN Foods keeps that tradition alive, made fresh for the Toronto community."}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Wellness Approach */}
      <section className="bg-soft-bg py-16 md:py-20">
        <div className="container-page grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold text-brown mb-4">Our Wellness Approach</h2>
            <p className="text-brown/80 leading-relaxed text-lg">
              {blocks.wellness ||
                "We believe good nutrition shouldn't mean giving up flavor or heritage. Our plant-based protein bars combine natural ingredients with recipes inspired by tradition, built for people on the go."}
            </p>
          </ScrollReveal>
          <ScrollReveal className="relative aspect-[4/3] rounded-3xl overflow-hidden">
            <Image
              src="/about2.png"
              alt="Plant-based protein bars and natural wellness ingredients"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Ingredient Philosophy + Family Focus */}
      <section className="container-page py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <ScrollReveal className="relative aspect-[4/3] rounded-3xl overflow-hidden order-2 md:order-1">
            <Image
              src="/about3.png"
              alt="Fresh natural ingredients laid out for preparation"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ScrollReveal>
          <ScrollReveal className="order-1 md:order-2 flex flex-col gap-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-brown mb-3">Ingredient Philosophy</h2>
              <p className="text-brown/80 leading-relaxed">
                {blocks.ingredients ||
                  "We source thoughtfully and keep our ingredient lists honest. Detailed ingredient and nutrition information is available on every product page and is updated as our recipes evolve."}
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-brown mb-3">Family Focus</h2>
              <p className="text-brown/80 leading-relaxed">
                {blocks.family ||
                  "From kids bars to family-size sunnundalu boxes, everything we make is designed with families in mind — because that's who we're feeding first."}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values grid */}
      <section className="bg-soft-bg py-16 md:py-20">
        <div className="container-page">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl font-bold text-brown mb-3">What We Stand For</h2>
            <p className="text-brown/70">Good food. A brighter you.</p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <ScrollReveal
                key={v.title}
                className="bg-white rounded-2xl p-6 text-center border border-beige flex flex-col items-center gap-3"
              >
                <span className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center text-green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                    {v.icon}
                  </svg>
                </span>
                <h3 className="font-heading text-lg font-bold text-brown">{v.title}</h3>
                <p className="text-brown/70 text-sm leading-relaxed">{v.text}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission CTA */}
      <section className="container-page py-16 md:py-20">
        <ScrollReveal className="bg-brown rounded-3xl px-8 md:px-16 py-14 text-center max-w-4xl mx-auto relative overflow-hidden">
          <svg
            className="absolute -bottom-8 -right-8 w-48 h-48 text-orange/10 pointer-events-none"
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            <path d="M40 100c0-33 27-60 60-60s60 27 60 60-27 60-60 60-60-27-60-60Z" />
          </svg>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-cream mb-4">Our Mission</h2>
          <p className="text-cream/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            {blocks.mission ||
              "To make wholesome, heritage-inspired food accessible to every family in Toronto and beyond — one small bite at a time."}
          </p>
          <Link
            href="/products"
            className="inline-flex bg-orange text-white font-semibold px-8 py-3 rounded-full hover:bg-saffron transition-colors"
          >
            Shop Our Products
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
