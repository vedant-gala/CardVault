import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cards = pgTable("cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardName: text("card_name").notNull(),
  bankName: text("bank_name").notNull(),
  lastFourDigits: varchar("last_four_digits", { length: 4 }).notNull(),
  cardNetwork: varchar("card_network", { length: 20 }).notNull(),
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }).notNull(),
  currentBalance: decimal("current_balance", { precision: 12, scale: 2 }).notNull().default("0"),
  dueDate: integer("due_date"),
  billingCycle: integer("billing_cycle"),
  cardColor: varchar("card_color", { length: 7 }).default("#8B5CF6"),
});

export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").notNull().references(() => cards.id),
  rewardType: text("reward_type").notNull(),
  rewardValue: text("reward_value").notNull(),
  condition: text("condition").notNull(),
  threshold: decimal("threshold", { precision: 12, scale: 2 }).notNull(),
  currentProgress: decimal("current_progress", { precision: 12, scale: 2 }).notNull().default("0"),
  isActive: boolean("is_active").notNull().default(true),
  expiryDate: timestamp("expiry_date"),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").notNull().references(() => cards.id),
  merchantName: text("merchant_name").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  category: text("category").notNull(),
  transactionDate: timestamp("transaction_date").notNull().default(sql`now()`),
  description: text("description"),
  source: varchar("source", { length: 10 }).notNull().default("manual"),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").references(() => cards.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  metadata: text("metadata"),
});

export const smsMessages = pgTable("sms_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull(),
  message: text("message").notNull(),
  receivedAt: timestamp("received_at").notNull().default(sql`now()`),
  processed: boolean("processed").notNull().default(false),
  extractedData: text("extracted_data"),
});

export const bills = pgTable("bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").notNull().references(() => cards.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  billMonth: varchar("bill_month", { length: 7 }).notNull(),
  minimumDue: decimal("minimum_due", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billId: varchar("bill_id").notNull().references(() => bills.id),
  cardId: varchar("card_id").notNull().references(() => cards.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").notNull().default(sql`now()`),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  transactionId: text("transaction_id"),
});

export const autopaySettings = pgTable("autopay_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").notNull().references(() => cards.id),
  enabled: boolean("enabled").notNull().default(false),
  paymentType: varchar("payment_type", { length: 20 }).notNull().default("minimum"),
  daysBefore: integer("days_before").notNull().default(3),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertCardSchema = createInsertSchema(cards).omit({ id: true, currentBalance: true });
export const insertRewardSchema = createInsertSchema(rewards).omit({ id: true, currentProgress: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, transactionDate: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertSmsMessageSchema = createInsertSchema(smsMessages).omit({ id: true, receivedAt: true, processed: true, extractedData: true });
export const insertBillSchema = createInsertSchema(bills).omit({ id: true, createdAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, paymentDate: true });
export const insertAutopaySettingsSchema = createInsertSchema(autopaySettings).omit({ id: true, createdAt: true, updatedAt: true });

export type Card = typeof cards.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type SmsMessage = typeof smsMessages.$inferSelect;
export type InsertSmsMessage = z.infer<typeof insertSmsMessageSchema>;
export type Bill = typeof bills.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type AutopaySettings = typeof autopaySettings.$inferSelect;
export type InsertAutopaySettings = z.infer<typeof insertAutopaySettingsSchema>;
