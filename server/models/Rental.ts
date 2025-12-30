import mongoose from 'mongoose';

const rentalItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  dailyPrice: {
    type: Number,
    required: true
  },
  rentalStartDate: {
    type: Date,
    required: true
  },
  rentalEndDate: {
    type: Date,
    required: true
  },
  rentalDays: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  customizations: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  customMessage: String
});

const rentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  items: [rentalItemSchema],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'cash'],
    default: 'stripe'
  },
  stripePaymentIntentId: String,
  stripeSessionId: String,
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  deposit: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  notes: String,
  customerEmail: {
    type: String,
    required: true
  },
  orderNumber: {
    type: String,
    unique: true
  },
  promoCode: {
    type: String,
    default: null
  },
  promoDiscount: {
    type: Number,
    default: 0
  },
  subtotalAfterDiscount: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Générer automatiquement le numéro de commande
rentalSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Rental').countDocuments();
    this.orderNumber = `RENT-${Date.now()}-${count + 1}`;
  }
  next();
});

export const Rental = mongoose.model('Rental', rentalSchema);
