import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-center px-6">
      <h1 className="font-heading text-5xl font-bold text-brown mb-4">404</h1>
      <p className="text-brown/70 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="bg-orange text-white font-semibold px-6 py-3 rounded-full">
        Back to Home
      </Link>
    </div>
  );
}
