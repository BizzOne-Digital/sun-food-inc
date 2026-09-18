import connectToDatabase from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import FAQAccordion from "@/components/ui/FAQAccordion";
import Link from "next/link";

async function getFaqs() {
  try {
    await connectToDatabase();
    const faqs = await FAQ.find({ active: true }).sort({ order: 1 }).limit(5).lean();
    return faqs.map((f) => ({
      _id: String(f._id),
      question: f.question,
      answer: f.answer,
      category: f.category,
    }));
  } catch {
    return [];
  }
}

export default async function FAQPreview() {
  const faqs = await getFaqs();
  if (faqs.length === 0) return null;

  return (
    <section className="container-page py-16">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-brown text-center mb-8">
          Frequently Asked Questions
        </h2>
        <FAQAccordion items={faqs} />
        <div className="text-center mt-6">
          <Link href="/faq" className="text-orange font-semibold">
            View all FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}
