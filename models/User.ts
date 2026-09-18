import mongoose, { Schema, models, model } from "mongoose";

export interface IAddress {
  label?: string;
  address: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: String,
    address: { type: String, required: true },
    apartment: String,
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "Canada" },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: String,
    passwordHash: { type: String, required: true },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
