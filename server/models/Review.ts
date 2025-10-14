import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  service: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  service: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
