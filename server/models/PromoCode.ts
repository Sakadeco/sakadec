import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  discountPercentage: number;
  applyToAllProducts: boolean;
  applicableProducts: mongoose.Types.ObjectId[];
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  applyToAllProducts: {
    type: Boolean,
    default: false
  },
  applicableProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    min: 1
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index pour recherche rapide
PromoCodeSchema.index({ code: 1 });
PromoCodeSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

export const PromoCode = mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);

