import mongoose, { Schema, models, model } from "mongoose";

export type DiscountType = "percentage" | "fixed";

export interface IDiscount extends mongoose.Document {
  title: string;
  description?: string;
  type: DiscountType;
  value: number;
  minQuantity?: number;
  minSubtotal?: number;
  applicableProducts?: mongoose.Types.ObjectId[];
  applicableCategories?: mongoose.Types.ObjectId[];
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DiscountSchema = new Schema<IDiscount>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true },
    minQuantity: { type: Number, default: 1 },
    minSubtotal: { type: Number, default: 0 },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    startDate: Date,
    endDate: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Discount || model<IDiscount>("Discount", DiscountSchema);
