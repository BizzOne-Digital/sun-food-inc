import Link from "next/link";

export default function CheckoutCancelledPage() {
  return (
    <div className="container-page py-20 text-center">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D95A1A" strokeWidth="2" className="mx-auto mb-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
      </svg>
      <h1 className="font-heading text-3xl font-bold text-brown mb-2">Order Not Completed</h1>
      <p className="text-brown/70 mb-6">Something went wrong placing your order. Please try again.</p>
      <Link href="/checkout" className="bg-orange text-white font-semibold px-6 py-3 rounded-full">
        Back to Checkout
      </Link>
    </div>
  );
}
