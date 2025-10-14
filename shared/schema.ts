import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  uuid
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  role: varchar("role").default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(), // shop, crea, rent, events, home, co
  subcategory: varchar("subcategory"),
  imageUrl: varchar("image_url"),
  isCustomizable: boolean("is_customizable").default(false),
  isRentable: boolean("is_rentable").default(false),
  stockQuantity: integer("stock_quantity").default(0),
  dailyRentalPrice: decimal("daily_rental_price", { precision: 10, scale: 2 }),
  customizationOptions: jsonb("customization_options"), // colors, sizes, text options
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  customerEmail: varchar("customer_email").notNull(),
  customerName: varchar("customer_name").notNull(),
  customerPhone: varchar("customer_phone"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  orderType: varchar("order_type").notNull(), // purchase, rental, service
  eventDate: timestamp("event_date"),
  notes: text("notes"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id, { onDelete: "cascade" }),
  productId: varchar("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  customization: jsonb("customization"), // selected customization options
  rentalStartDate: timestamp("rental_start_date"),
  rentalEndDate: timestamp("rental_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Rentals table for tracking rental availability
export const rentals = pgTable("rentals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id),
  orderId: varchar("order_id").references(() => orders.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: varchar("status").default("active"), // active, returned, overdue
  createdAt: timestamp("created_at").defaultNow(),
});

// Quotes table for service requests
export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  customerPhone: varchar("customer_phone"),
  serviceType: varchar("service_type").notNull(), // events, home, co
  eventDate: timestamp("event_date"),
  budget: varchar("budget"),
  description: text("description").notNull(),
  status: varchar("status").default("pending"), // pending, reviewed, quoted, accepted, declined
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Newsletter subscriptions table
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  name: varchar("name"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table for customer testimonials
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email"),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  serviceType: varchar("service_type"), // events, home, shop, rent, crea, co
  orderId: varchar("order_id").references(() => orders.id),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gallery table for showcasing work (like Instagram feed)
export const galleryItems = pgTable("gallery_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url").notNull(),
  category: varchar("category").notNull(), // events, home, shop, rent, crea, co
  tags: jsonb("tags"), // array of tags
  isPublished: boolean("is_published").default(true),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  rentals: many(rentals),
}));

export const rentalsRelations = relations(rentals, ({ one }) => ({
  product: one(products, {
    fields: [rentals.productId],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [rentals.orderId],
    references: [orders.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Rental = typeof rentals.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
