import mongoose, { Schema, models, model } from "mongoose";

export interface ICategory extends mongoose.Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Category || model<ICategory>("Category", CategorySchema);
