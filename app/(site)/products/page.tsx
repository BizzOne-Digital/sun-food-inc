import type { Metadata } from "next";
import ProductsBrowser from "@/components/products/ProductsBrowser";

export const metadata: Metadata = {
  title: "Shop Products | SUNN Foods",
  description: "Shop plant-based protein bars, traditional sunnundalu, and kids bars.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  return <ProductsBrowser initialCategory={params.category} />;
}
