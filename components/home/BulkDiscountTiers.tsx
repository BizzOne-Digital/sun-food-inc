import connectToDatabase from "@/lib/mongodb";
import Discount from "@/models/Discount";
import Link from "next/link";

async function getBulkDiscounts() {
  try {
    await connectToDatabase();
    const now = new Date();
    const discounts = await Discount.find({
      active: true,
      minQuantity: { $gt: 1 },
      $and: [
        { $or: [{ startDate: { $exists: false } }, { startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }] },
      ],
    })
      .sort({ minQuantity: 1 })
      .lean();
    return discounts.map((d) => ({
      _id: String(d._id),
      title: d.title,
      description: d.description,
      type: d.type,
      value: d.value,
      minQuantity: d.minQuantity,
    }));
  } catch {
    return [];
  }
}

export default async function BulkDiscountTiers() {
  const discounts = await getBulkDiscounts();
  if (discounts.length === 0) return null;

  return (
    <section className="bg-soft-bg py-16">
      <div className="container-page text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-brown mb-2">
          Save More When You Stock Up
        </h2>
        <p className="text-brown/70 mb-10">Active discounts on bulk orders</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {discounts.map((d) => (
            <div key={d._id} className="bg-white rounded-2xl border border-beige p-6 flex flex-col items-center gap-2">
              <span className="inline-block bg-leaf text-white font-bold text-sm rounded-full px-4 py-1">
                {d.type === "percentage" ? `Save ${d.value}%` : `Save $${d.value}`}
              </span>
              <p className="text-brown/70 text-sm mt-2">
                On orders of {d.minQuantity}+ {d.minQuantity === 1 ? "item" : "items"}
              </p>
              {d.description && <p className="text-brown/60 text-xs">{d.description}</p>}
            </div>
          ))}
        </div>
        <Link
          href="/products"
          className="inline-flex mt-10 bg-orange text-white font-semibold px-6 py-3 rounded-full hover:bg-saffron transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
