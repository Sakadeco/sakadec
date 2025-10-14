// Import models from their individual files
import { User, type IUser } from "./models/User";
import OrderModel from "./models/Order";
import { OrderItem, type IOrderItem } from "./models/OrderItem";
import { Rental, type IRental } from "./models/Rental";
import { Quote, type IQuote } from "./models/Quote";
import { NewsletterSubscription, type INewsletterSubscription } from "./models/NewsletterSubscription";
import { Review, type IReview } from "./models/Review";
import { GalleryItem, type IGalleryItem } from "./models/GalleryItem";
import { db } from "./db";

// Type definitions for compatibility
export type User = IUser;
// Order type definition (to avoid conflicts with new Order model)
export interface IOrder {
  _id: string;
  user?: string;
  items: any[];
  status: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  createdAt: Date;
  updatedAt: Date;
  isRental: boolean;
}

export type Order = IOrder;
export type OrderItem = IOrderItem;
export type Rental = IRental;
export type Quote = IQuote;
export type NewsletterSubscription = INewsletterSubscription;
export type Review = IReview;
export type GalleryItem = IGalleryItem;

// Product type definition (to avoid conflicts with new Product model)
export interface IProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  subcategory?: string;
  imageUrl?: string;
  isCustomizable?: boolean;
  isRentable?: boolean;
  stockQuantity?: number;
  dailyRentalPrice?: number;
  customizationOptions?: any;
  createdAt: Date;
  updatedAt: Date;
}

export type Product = IProduct;

// Helper function to check database connection
const checkConnection = () => {
  if (db.connection.readyState !== 1) {
    throw new Error('Database not connected. Please check your MongoDB connection.');
  }
};

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: { id: string; email?: string; firstName?: string; lastName?: string; profileImageUrl?: string }): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: { name: string; description?: string; price: number; category: string; subcategory?: string; imageUrl?: string; isCustomizable?: boolean; isRentable?: boolean; stockQuantity?: number; dailyRentalPrice?: number; customizationOptions?: any }): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Order operations
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: { userId?: string; customerEmail: string; customerName: string; customerPhone?: string; total: number; orderType: string; eventDate?: Date; notes?: string; stripePaymentIntentId?: string }): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  addOrderItem(item: { orderId: string; productId?: string; quantity: number; unitPrice: number; customization?: any; rentalStartDate?: Date; rentalEndDate?: Date }): Promise<OrderItem>;

  // Rental operations
  getRentalAvailability(productId: string, startDate: Date, endDate: Date): Promise<boolean>;
  createRental(rental: { productId: string; orderId: string; startDate: Date; endDate: Date }): Promise<Rental>;
  getActiveRentals(): Promise<Rental[]>;

  // Quote operations
  getQuotes(): Promise<Quote[]>;
  createQuote(quote: { customerName: string; customerEmail: string; customerPhone?: string; service: string; description: string; eventDate?: Date; estimatedPrice?: number }): Promise<Quote>;
  updateQuoteStatus(id: string, status: string, estimatedPrice?: number): Promise<Quote>;

  // Newsletter operations
  subscribeToNewsletter(subscription: { email: string }): Promise<NewsletterSubscription>;
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  
  // Review operations
  getReviews(): Promise<Review[]>;
  getPublishedReviews(): Promise<Review[]>;
  createReview(review: { customerName: string; customerEmail: string; rating: number; comment: string; service: string }): Promise<Review>;
  updateReviewStatus(id: string, isPublished: boolean): Promise<Review>;
  
  // Gallery operations
  getGalleryItems(category?: string): Promise<GalleryItem[]>;
  getPublishedGalleryItems(category?: string): Promise<GalleryItem[]>;
  createGalleryItem(item: { title: string; description?: string; imageUrl: string; category: string }): Promise<GalleryItem>;
  updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem>;
  deleteGalleryItem(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    checkConnection();
    const user = await User.findOne({ id });
    return user || undefined;
  }

  async upsertUser(userData: { id: string; email?: string; firstName?: string; lastName?: string; profileImageUrl?: string }): Promise<User> {
    checkConnection();
    const user = await User.findOneAndUpdate(
      { id: userData.id },
      { ...userData, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    if (!user) throw new Error('Failed to upsert user');
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    checkConnection();
    const user = await User.findOneAndUpdate(
      { id: userId },
      { stripeCustomerId, stripeSubscriptionId, updatedAt: new Date() },
      { new: true }
    );
    if (!user) throw new Error('User not found');
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    checkConnection();
    return await Product.find();
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    checkConnection();
    return await Product.find({ category });
  }

  async getProduct(id: string): Promise<Product | undefined> {
    checkConnection();
    const product = await Product.findById(id);
    return product || undefined;
  }

  async createProduct(productData: any): Promise<Product> {
    checkConnection();
    const product = new Product(productData);
    return await product.save();
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    checkConnection();
    const product = await Product.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
    if (!product) throw new Error('Product not found');
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    checkConnection();
    await Product.findByIdAndDelete(id);
  }

  // Order operations
  async getOrders(userId?: string): Promise<Order[]> {
    checkConnection();
    if (userId) {
      return await Order.find({ userId });
    }
    return await Order.find();
  }

  async getOrder(id: string): Promise<Order | undefined> {
    checkConnection();
    const order = await Order.findById(id);
    return order || undefined;
  }

  async createOrder(orderData: any): Promise<Order> {
    checkConnection();
    const order = new Order(orderData);
    return await order.save();
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    checkConnection();
    const order = await Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
    if (!order) throw new Error('Order not found');
    return order;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    checkConnection();
    return await OrderItem.find({ orderId });
  }

  async addOrderItem(itemData: any): Promise<OrderItem> {
    checkConnection();
    const item = new OrderItem(itemData);
    return await item.save();
  }

  // Rental operations
  async getRentalAvailability(productId: string, startDate: Date, endDate: Date): Promise<boolean> {
    checkConnection();
    const conflictingRentals = await Rental.find({
      productId,
      status: 'active',
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $gte: startDate, $lte: endDate } }
      ]
    });
    return conflictingRentals.length === 0;
  }

  async createRental(rentalData: any): Promise<Rental> {
    checkConnection();
    const rental = new Rental(rentalData);
    return await rental.save();
  }

  async getActiveRentals(): Promise<Rental[]> {
    checkConnection();
    return await Rental.find({ status: 'active' });
  }

  // Quote operations
  async getQuotes(): Promise<Quote[]> {
    checkConnection();
    return await Quote.find();
  }

  async createQuote(quoteData: any): Promise<Quote> {
    checkConnection();
    const quote = new Quote(quoteData);
    return await quote.save();
  }

  async updateQuoteStatus(id: string, status: string, estimatedPrice?: number): Promise<Quote> {
    checkConnection();
    const updates: any = { status, updatedAt: new Date() };
    if (estimatedPrice !== undefined) {
      updates.estimatedPrice = estimatedPrice;
    }
    const quote = await Quote.findByIdAndUpdate(id, updates, { new: true });
    if (!quote) throw new Error('Quote not found');
    return quote;
  }

  // Newsletter operations
  async subscribeToNewsletter(subscriptionData: { email: string }): Promise<NewsletterSubscription> {
    checkConnection();
    return await NewsletterSubscription.findOneAndUpdate(
      { email: subscriptionData.email },
      { ...subscriptionData, isActive: true },
      { upsert: true, new: true }
    );
  }

  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    checkConnection();
    return await NewsletterSubscription.find({ isActive: true });
  }

  // Review operations
  async getReviews(): Promise<Review[]> {
    checkConnection();
    return await Review.find();
  }

  async getPublishedReviews(): Promise<Review[]> {
    checkConnection();
    return await Review.find({ isPublished: true });
  }

  async createReview(reviewData: any): Promise<Review> {
    checkConnection();
    const review = new Review(reviewData);
    return await review.save();
  }

  async updateReviewStatus(id: string, isPublished: boolean): Promise<Review> {
    checkConnection();
    const review = await Review.findByIdAndUpdate(id, { isPublished, updatedAt: new Date() }, { new: true });
    if (!review) throw new Error('Review not found');
    return review;
  }

  // Gallery operations
  async getGalleryItems(category?: string): Promise<GalleryItem[]> {
    checkConnection();
    if (category) {
      return await GalleryItem.find({ category });
    }
    return await GalleryItem.find();
  }

  async getPublishedGalleryItems(category?: string): Promise<GalleryItem[]> {
    checkConnection();
    if (category) {
      return await GalleryItem.find({ category, isPublished: true });
    }
    return await GalleryItem.find({ isPublished: true });
  }

  async createGalleryItem(itemData: any): Promise<GalleryItem> {
    checkConnection();
    const item = new GalleryItem(itemData);
    return await item.save();
  }

  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem> {
    checkConnection();
    const item = await GalleryItem.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
    if (!item) throw new Error('Gallery item not found');
    return item;
  }

  async deleteGalleryItem(id: string): Promise<void> {
    checkConnection();
    await GalleryItem.findByIdAndDelete(id);
  }
}

export const storage = new DatabaseStorage();
