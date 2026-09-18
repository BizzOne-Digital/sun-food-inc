import Link from "next/link";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="container-page py-20 text-center">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#496F2E" strokeWidth="2" className="mx-auto mb-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h1 className="font-heading text-3xl font-bold text-brown mb-2">Order Confirmed</h1>
      <p className="text-brown/70 mb-1">Thank you for your order.</p>
      {order && <p className="text-brown/70 mb-6">Order number: <strong>{order}</strong></p>}
      <Link href="/products" className="bg-orange text-white font-semibold px-6 py-3 rounded-full">
        Continue Shopping
      </Link>
    </div>
  );
}
