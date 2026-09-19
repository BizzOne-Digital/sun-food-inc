import Image from "next/image";

interface OurStoryProps {
  heading?: string;
  body?: string;
}

export default function OurStory({
  heading = "Our Story",
  body = "SUNN Foods began with a simple family recipe for sunnundalu, passed down through generations in South India. Founder Kumar Padmanabhuni brought that same warmth and care to Toronto, blending heritage flavors with modern plant-based nutrition — so every bar and bite feels like home, wherever you are.",
}: OurStoryProps) {
  return (
    <section className="bg-white">
      <div className="container-page py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1">
          <h2 className="font-heading text-3xl font-bold text-brown mb-4">{heading}</h2>
          <p className="text-brown/80 leading-relaxed">{body}</p>
        </div>
        <div className="order-1 md:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden border border-beige">
          <Image
            src="/ourstory.png"
            alt="SUNN Foods traditional ingredients"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
