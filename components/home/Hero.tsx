import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  heading?: string;
  subheading?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
}

export default function Hero({
  heading = "Nourishing Tradition, Made for Today.",
  subheading = "Plant-based protein bars, traditional sunnundalu, and kids bars — crafted in small batches for families who care what they eat.",
  ctaPrimaryText = "Shop Now",
  ctaPrimaryLink = "/products",
  ctaSecondaryText = "Explore Products",
  ctaSecondaryLink = "/products",
}: HeroProps) {
  const parts = heading.split("Made for Today.");
  return (
    <section className="relative overflow-hidden min-h-[560px] flex items-center">
      <Image
        src="/mobile-hero.png"
        alt="SUN Foods Inc products"
        fill
        priority
        className="object-cover md:hidden"
        sizes="100vw"
      />
      <Image
        src="/hero.png"
        alt="SUN Foods Inc products"
        fill
        priority
        className="object-cover hidden md:block"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-brown/55 via-brown/20 to-transparent"
        aria-hidden="true"
      />

      <div className="container-page py-20 md:py-32 relative">
        <div className="max-w-xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {parts[0]}
            <span className="text-orange">Made for Today.</span>
          </h1>
          <p className="mt-6 text-lg text-white/85 max-w-xl">{subheading}</p>
          <p className="mt-4 italic text-saffron text-lg" style={{ fontFamily: "cursive" }}>
            Small Bites. Brighter Lives.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={ctaPrimaryLink}
              className="bg-orange text-white font-semibold px-6 py-3 rounded-full hover:bg-saffron transition-colors"
            >
              {ctaPrimaryText}
            </Link>
            <Link
              href={ctaSecondaryLink}
              className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-brown transition-colors"
            >
              {ctaSecondaryText}
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6">
            <BenefitIcon label="Plant-Based Protein" icon="leaf" />
            <BenefitIcon label="Family Recipes" icon="home" />
            <BenefitIcon label="Made Fresh in Toronto" icon="pin" />
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitIcon({ label, icon }: { label: string; icon: "leaf" | "home" | "pin" }) {
  const paths: Record<string, React.ReactNode> = {
    leaf: <path d="M12 2C6 8 4 14 12 22C20 14 18 8 12 2Z" />,
    home: <path d="M4 12L12 4L20 12M6 10V20H18V10" fill="none" />,
    pin: <path d="M12 22C12 22 20 14 20 9A8 8 0 0 0 4 9C4 14 12 22 12 22Z" />,
  };
  return (
    <div className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#E99719" stroke="#E99719" strokeWidth="1">
        {paths[icon]}
      </svg>
      <span className="text-sm font-semibold text-white">{label}</span>
    </div>
  );
}
