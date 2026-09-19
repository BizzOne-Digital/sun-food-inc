import Link from "next/link";
import Logo from "./Logo";
import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

async function getSettings() {
  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne().lean();
    return settings;
  } catch {
    return null;
  }
}

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="bg-brown text-cream mt-auto">
      <div className="container-page py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <Logo className="[&_span]:text-cream" showTagline />
          <p className="mt-4 text-sm text-beige">
            {settings?.footerText || "Nourishing tradition, made for today."}
          </p>
        </div>

        <div>
          <h4 className="font-heading text-lg mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-beige">
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-beige">
            <li><Link href="/account/login">Sign In</Link></li>
            <li><Link href="/account/register">Register</Link></li>
            <li><Link href="/account/orders">Order History</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-beige">
            <li>{settings?.email || "info@sunfoods.ca"}</li>
            <li>{settings?.phone || "Phone available on request"}</li>
            <li>{settings?.address || "Toronto, Ontario, Canada"}</li>
            <li>{settings?.serviceArea || "Currently serving the Greater Toronto Area."}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-beige">
        &copy; {new Date().getFullYear()} SUN Foods. All rights reserved.
      </div>
    </footer>
  );
}
