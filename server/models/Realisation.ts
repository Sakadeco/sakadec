import mongoose, { Schema, Document } from 'mongoose';

export interface IRealisation extends Document {
  title: string;
  category: string;
  date: Date;
  location: string;
  guests?: number;
  description: string;
  images: string[];
  highlights: string[];
  rating: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RealisationSchema = new Schema<IRealisation>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Mariage', 'Anniversaire', 'Baby Shower', 'Événement Corporate', 'Autre'],
    default: 'Autre'
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  guests: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  highlights: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Realisation = mongoose.model<IRealisation>('Realisation', RealisationSchema);



