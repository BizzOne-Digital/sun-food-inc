import mongoose, { Schema, models, model } from "mongoose";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface IOrderItem {
  product?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface ICustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface IShippingAddress {
  address: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends mongoose.Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  customerInfo: ICustomerInfo;
  shippingAddress: IShippingAddress;
  orderNotes?: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: OrderStatus;
  paymentProvider: string;
  providerReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    image: String,
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: { type: [OrderItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    customerInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      address: { type: String, required: true },
      apartment: String,
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: "Canada" },
    },
    orderNotes: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Preparing", "Ready", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentProvider: { type: String, default: "manual" },
    providerReference: String,
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", OrderSchema);
