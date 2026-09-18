import mongoose, { Schema, models, model } from "mongoose";

export interface IPageContent extends mongoose.Document {
  page: string; // "home" | "about" | "contact"
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  ourStoryHeading?: string;
  ourStoryBody?: string;
  ourStoryImage?: string;
  sectionsVisible: Record<string, boolean>;
  blocks: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>(
  {
    page: { type: String, required: true, unique: true },
    heroHeading: { type: String, default: "" },
    heroSubheading: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    ctaPrimaryText: { type: String, default: "" },
    ctaPrimaryLink: { type: String, default: "" },
    ctaSecondaryText: { type: String, default: "" },
    ctaSecondaryLink: { type: String, default: "" },
    ourStoryHeading: { type: String, default: "" },
    ourStoryBody: { type: String, default: "" },
    ourStoryImage: { type: String, default: "" },
    sectionsVisible: { type: Schema.Types.Mixed, default: {} },
    blocks: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default models.PageContent || model<IPageContent>("PageContent", PageContentSchema);
