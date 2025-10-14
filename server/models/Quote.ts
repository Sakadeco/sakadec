import mongoose, { Schema, Document } from 'mongoose';

export interface IQuote extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  service: string;
  description: string;
  eventDate?: Date;
  estimatedPrice?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: String,
  service: { type: String, required: true },
  description: { type: String, required: true },
  eventDate: Date,
  estimatedPrice: Number,
  status: { type: String, default: 'pending' },
}, { timestamps: true });

export const Quote = mongoose.model<IQuote>('Quote', QuoteSchema);
