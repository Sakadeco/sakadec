import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>({
  title: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export const GalleryItem = mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);
