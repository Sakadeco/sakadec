import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem extends Document {
  orderId: string;
  productId?: string;
  quantity: number;
  unitPrice: number;
  customization?: any;
  rentalStartDate?: Date;
  rentalEndDate?: Date;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  orderId: { type: String, required: true },
  productId: String,
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  customization: Schema.Types.Mixed,
  rentalStartDate: Date,
  rentalEndDate: Date,
}, { timestamps: true });

export const OrderItem = mongoose.model<IOrderItem>('OrderItem', OrderItemSchema);
