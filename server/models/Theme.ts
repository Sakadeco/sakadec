import mongoose, { Schema, Document } from 'mongoose';

export interface ITheme extends Document {
  title: string;
  imageUrl: string;
  isActive: boolean;
}

const ThemeSchema = new Schema<ITheme>({
  title: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Theme = mongoose.model<ITheme>('Theme', ThemeSchema);

