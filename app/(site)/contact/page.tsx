import type { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | SUNN Foods",
  description: "Get in touch with SUNN Foods, serving the Greater Toronto Area.",
};

async function getSettings() {
  try {
    await connectToDatabase();
    return await SiteSettings.findOne().lean();
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="container-page py-16">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="font-heading text-4xl font-bold text-brown mb-3">Get in Touch</h1>
        <p className="text-brown/70">
          Questions about our products, orders, or wholesale? We would love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-10 max-w-4xl mx-auto">
        <ContactForm />
        <div className="bg-soft-bg rounded-2xl p-6 flex flex-col gap-4 h-fit">
          <div>
            <h3 className="font-semibold text-brown">Email</h3>
            <p className="text-brown/70 text-sm">{settings?.email || "info@sunnfoods.ca"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-brown">Phone</h3>
            <p className="text-brown/70 text-sm">{settings?.phone || "Available on request"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-brown">Service Area</h3>
            <p className="text-brown/70 text-sm">
              {settings?.serviceArea || "Currently serving the Greater Toronto Area."}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-brown">Social</h3>
            <div className="flex gap-3 mt-1 text-sm text-brown/70">
              {settings?.socialInstagram && <a href={settings.socialInstagram}>Instagram</a>}
              {settings?.socialFacebook && <a href={settings.socialFacebook}>Facebook</a>}
              {settings?.socialTwitter && <a href={settings.socialTwitter}>Twitter</a>}
              {!settings?.socialInstagram && !settings?.socialFacebook && !settings?.socialTwitter && (
                <span>Coming soon</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
