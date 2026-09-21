import type { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import FAQSearchable from "@/components/faq/FAQSearchable";

export const metadata: Metadata = {
  title: "FAQ | SUNN Foods",
  description: "Frequently asked questions about SUNN Foods products and orders.",
};

export const dynamic = "force-dynamic";

async function getFaqs() {
  try {
    await connectToDatabase();
    const faqs = await FAQ.find({ active: true }).sort({ order: 1 }).lean();
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

export default async function FAQPage() {
  const faqs = await getFaqs();

  return (
    <div className="container-page py-16 max-w-3xl mx-auto">
      <h1 className="font-heading text-4xl font-bold text-brown mb-8 text-center">
        Frequently Asked Questions
      </h1>
      <FAQSearchable faqs={faqs} />
    </div>
  );
}
