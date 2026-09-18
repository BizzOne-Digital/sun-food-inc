"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/layout/Logo";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/discounts", label: "Discounts" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/account", label: "My Account" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-64 bg-brown text-cream flex-shrink-0 min-h-screen flex flex-col">
      <div className="p-4 border-b border-white/10">
        <Logo className="[&_span]:text-cream" />
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 text-sm font-medium ${
                active ? "bg-orange text-white" : "text-beige hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button onClick={handleLogout} className="p-4 text-sm text-orange font-semibold border-t border-white/10 text-left">
        Log Out
      </button>
    </aside>
  );
}
