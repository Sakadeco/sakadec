import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  role: { type: String, default: 'user' },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
