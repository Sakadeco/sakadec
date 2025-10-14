import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletterSubscription extends Document {
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriptionSchema = new Schema<INewsletterSubscription>({
  email: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const NewsletterSubscription = mongoose.model<INewsletterSubscription>('NewsletterSubscription', NewsletterSubscriptionSchema);
