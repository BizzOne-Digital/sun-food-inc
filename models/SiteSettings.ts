import mongoose, { Schema, models, model } from "mongoose";

export interface ISiteSettings extends mongoose.Document {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  serviceArea: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  footerText?: string;
  seoTitle?: string;
  seoDescription?: string;
  earlyBirdEnabled: boolean;
  earlyBirdText: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: "SUN Foods Inc" },
    email: { type: String, default: "hello@sunfoodsinc.com" },
    phone: { type: String, default: "" },
    address: { type: String, default: "Toronto, Ontario, Canada" },
    serviceArea: { type: String, default: "Currently serving the Greater Toronto Area." },
    socialFacebook: { type: String, default: "" },
    socialInstagram: { type: String, default: "" },
    socialTwitter: { type: String, default: "" },
    footerText: { type: String, default: "Nourishing tradition, made for today." },
    seoTitle: { type: String, default: "SUN Foods Inc | Plant-Based Protein Bars & Sunnundalu" },
    seoDescription: {
      type: String,
      default:
        "SUN Foods Inc makes plant-based protein bars, traditional sunnundalu, and kids bars, proudly serving Toronto.",
    },
    earlyBirdEnabled: { type: Boolean, default: true },
    earlyBirdText: {
      type: String,
      default: "Early Bird Special: Buy 3 boxes and save 30%. Limited time offer.",
    },
  },
  { timestamps: true }
);

export default models.SiteSettings || model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
