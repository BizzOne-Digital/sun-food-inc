import mongoose, { Schema, models, model } from "mongoose";

export interface IProduct extends mongoose.Document {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  salePrice?: number;
  category?: mongoose.Types.ObjectId;
  sku?: string;
  stock: number;
  packSize?: string;
  ingredients?: string;
  nutritionInformation?: string;
  featured: boolean;
  active: boolean;
  badges: string[];
  mainImage: string;
  galleryImages: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    sku: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    packSize: { type: String, default: "" },
    ingredients: { type: String, default: "Ingredient list coming soon. Contact us for details." },
    nutritionInformation: { type: String, default: "Nutrition information coming soon." },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    badges: { type: [String], default: [] },
    mainImage: { type: String, default: "" },
    galleryImages: { type: [String], default: [] },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

ProductSchema.index({ featured: 1 });
ProductSchema.index({ category: 1 });

export default models.Product || model<IProduct>("Product", ProductSchema);
