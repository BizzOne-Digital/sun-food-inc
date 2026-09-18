import mongoose, { Schema, models, model } from "mongoose";

export interface IFAQ extends mongoose.Document {
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.FAQ || model<IFAQ>("FAQ", FAQSchema);
