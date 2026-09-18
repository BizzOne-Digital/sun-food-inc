import mongoose, { Schema, models, model } from "mongoose";

export type UploadFolder = "products" | "gallery" | "pages" | "misc";

export interface IStoredUpload extends mongoose.Document {
  folder: UploadFolder;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const StoredUploadSchema = new Schema<IStoredUpload>(
  {
    folder: {
      type: String,
      enum: ["products", "gallery", "pages", "misc"],
      required: true,
    },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export default models.StoredUpload || model<IStoredUpload>("StoredUpload", StoredUploadSchema);
