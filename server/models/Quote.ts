import mongoose, { Schema, Document } from 'mongoose';

export interface IQuote extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  service?: string;
  serviceType?: string;
  description: string;
  eventDate?: Date;
  budget?: string;
  estimatedPrice?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: String,
  service: String,
  serviceType: String,
  description: { type: String, required: true },
  eventDate: Date,
  budget: String,
  estimatedPrice: Number,
  status: { type: String, default: 'pending' },
}, { timestamps: true });

export const Quote = mongoose.model<IQuote>('Quote', QuoteSchema);
