import { 
  type Card, type InsertCard,
  type Reward, type InsertReward,
  type Transaction, type InsertTransaction,
  type Notification, type InsertNotification,
  type SmsMessage, type InsertSmsMessage,
  type Bill, type InsertBill,
  type Payment, type InsertPayment,
  type AutopaySettings, type InsertAutopaySettings,
  type CreditScore, type InsertCreditScore,
  cards, rewards, transactions, notifications, smsMessages, bills, payments, autopaySettings, creditScores
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getCards(): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  deleteCard(id: string): Promise<boolean>;
  updateCardBalance(id: string, balance: string): Promise<Card | undefined>;

  getRewards(): Promise<Reward[]>;
  getRewardsByCard(cardId: string): Promise<Reward[]>;
  createReward(reward: InsertReward): Promise<Reward>;
  updateRewardProgress(id: string, progress: string): Promise<Reward | undefined>;

  getTransactions(): Promise<Transaction[]>;
  getTransactionsByCard(cardId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  getNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;

  getSmsMessages(): Promise<SmsMessage[]>;
  createSmsMessage(sms: InsertSmsMessage): Promise<SmsMessage>;
  updateSmsProcessed(id: string, extractedData: string): Promise<SmsMessage | undefined>;

  getBills(): Promise<Bill[]>;
  getBillsByCard(cardId: string): Promise<Bill[]>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBillStatus(id: string, status: string): Promise<Bill | undefined>;

  getPayments(): Promise<Payment[]>;
  getPaymentsByBill(billId: string): Promise<Payment[]>;
  getPaymentsByCard(cardId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;

  getAutopaySettings(): Promise<AutopaySettings[]>;
  getAutopayByCard(cardId: string): Promise<AutopaySettings | undefined>;
  createAutopaySettings(settings: InsertAutopaySettings): Promise<AutopaySettings>;
  updateAutopaySettings(id: string, settings: Partial<InsertAutopaySettings>): Promise<AutopaySettings | undefined>;

  getCreditScores(): Promise<CreditScore[]>;
  getLatestCreditScore(): Promise<CreditScore | undefined>;
  createCreditScore(score: InsertCreditScore): Promise<CreditScore>;
}

export class MemStorage implements IStorage {
  private cards: Map<string, Card>;
  private rewards: Map<string, Reward>;
  private transactions: Map<string, Transaction>;
  private notifications: Map<string, Notification>;
  private smsMessages: Map<string, SmsMessage>;
  private bills: Map<string, Bill>;
  private payments: Map<string, Payment>;
  private autopaySettings: Map<string, AutopaySettings>;

  constructor() {
    this.cards = new Map();
    this.rewards = new Map();
    this.transactions = new Map();
    this.notifications = new Map();
    this.smsMessages = new Map();
    this.bills = new Map();
    this.payments = new Map();
    this.autopaySettings = new Map();
  }

  async getCards(): Promise<Card[]> {
    return Array.from(this.cards.values());
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const card: Card = { 
      ...insertCard, 
      id,
      currentBalance: "0",
      dueDate: insertCard.dueDate ?? null,
      billingCycle: insertCard.billingCycle ?? null,
      cardColor: insertCard.cardColor ?? null
    };
    this.cards.set(id, card);
    return card;
  }

  async deleteCard(id: string): Promise<boolean> {
    return this.cards.delete(id);
  }

  async updateCardBalance(id: string, balance: string): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (card) {
      card.currentBalance = balance;
      this.cards.set(id, card);
      return card;
    }
    return undefined;
  }

  async getRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values());
  }

  async getRewardsByCard(cardId: string): Promise<Reward[]> {
    return Array.from(this.rewards.values()).filter(r => r.cardId === cardId);
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = randomUUID();
    const reward: Reward = { 
      ...insertReward, 
      id,
      currentProgress: "0",
      isActive: insertReward.isActive ?? true,
      expiryDate: insertReward.expiryDate ?? null
    };
    this.rewards.set(id, reward);
    return reward;
  }

  async updateRewardProgress(id: string, progress: string): Promise<Reward | undefined> {
    const reward = this.rewards.get(id);
    if (reward) {
      reward.currentProgress = progress;
      this.rewards.set(id, reward);
      return reward;
    }
    return undefined;
  }

  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
    );
  }

  async getTransactionsByCard(cardId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.cardId === cardId)
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      transactionDate: new Date(),
      description: insertTransaction.description ?? null,
      source: insertTransaction.source ?? "manual"
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = { 
      ...insertNotification, 
      id,
      isRead: false,
      createdAt: new Date(),
      cardId: insertNotification.cardId ?? null,
      metadata: insertNotification.metadata ?? null
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
      return notification;
    }
    return undefined;
  }

  async getSmsMessages(): Promise<SmsMessage[]> {
    return Array.from(this.smsMessages.values());
  }

  async createSmsMessage(insertSms: InsertSmsMessage): Promise<SmsMessage> {
    const id = randomUUID();
    const sms: SmsMessage = { 
      ...insertSms, 
      id,
      receivedAt: new Date(),
      processed: false,
      extractedData: null
    };
    this.smsMessages.set(id, sms);
    return sms;
  }

  async updateSmsProcessed(id: string, extractedData: string): Promise<SmsMessage | undefined> {
    const sms = this.smsMessages.get(id);
    if (sms) {
      sms.processed = true;
      sms.extractedData = extractedData;
      this.smsMessages.set(id, sms);
      return sms;
    }
    return undefined;
  }

  async getBills(): Promise<Bill[]> {
    return Array.from(this.bills.values()).sort((a, b) => 
      new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );
  }

  async getBillsByCard(cardId: string): Promise<Bill[]> {
    return Array.from(this.bills.values())
      .filter(b => b.cardId === cardId)
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const id = randomUUID();
    const bill: Bill = { 
      ...insertBill, 
      id,
      status: insertBill.status ?? "pending",
      createdAt: new Date()
    };
    this.bills.set(id, bill);
    return bill;
  }

  async updateBillStatus(id: string, status: string): Promise<Bill | undefined> {
    const bill = this.bills.get(id);
    if (bill) {
      bill.status = status;
      this.bills.set(id, bill);
      return bill;
    }
    return undefined;
  }

  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values()).sort((a, b) => 
      new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
  }

  async getPaymentsByBill(billId: string): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(p => p.billId === billId)
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }

  async getPaymentsByCard(cardId: string): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(p => p.cardId === cardId)
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = { 
      ...insertPayment, 
      id,
      status: insertPayment.status ?? "completed",
      paymentDate: new Date(),
      transactionId: insertPayment.transactionId ?? null
    };
    this.payments.set(id, payment);
    return payment;
  }

  async getAutopaySettings(): Promise<AutopaySettings[]> {
    return Array.from(this.autopaySettings.values());
  }

  async getAutopayByCard(cardId: string): Promise<AutopaySettings | undefined> {
    return Array.from(this.autopaySettings.values()).find(a => a.cardId === cardId);
  }

  async createAutopaySettings(insertSettings: InsertAutopaySettings): Promise<AutopaySettings> {
    const id = randomUUID();
    const settings: AutopaySettings = { 
      ...insertSettings, 
      id,
      enabled: insertSettings.enabled ?? false,
      paymentType: insertSettings.paymentType ?? "minimum",
      daysBefore: insertSettings.daysBefore ?? 3,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.autopaySettings.set(id, settings);
    return settings;
  }

  async updateAutopaySettings(id: string, updates: Partial<InsertAutopaySettings>): Promise<AutopaySettings | undefined> {
    const settings = this.autopaySettings.get(id);
    if (settings) {
      Object.assign(settings, updates, { updatedAt: new Date() });
      this.autopaySettings.set(id, settings);
      return settings;
    }
    return undefined;
  }
}

export class PgStorage implements IStorage {
  async getCards(): Promise<Card[]> {
    return await db.select().from(cards);
  }

  async getCard(id: string): Promise<Card | undefined> {
    const result = await db.select().from(cards).where(eq(cards.id, id));
    return result[0];
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const result = await db.insert(cards).values(insertCard).returning();
    return result[0];
  }

  async deleteCard(id: string): Promise<boolean> {
    const result = await db.delete(cards).where(eq(cards.id, id)).returning();
    return result.length > 0;
  }

  async updateCardBalance(id: string, balance: string): Promise<Card | undefined> {
    const result = await db.update(cards)
      .set({ currentBalance: balance })
      .where(eq(cards.id, id))
      .returning();
    return result[0];
  }

  async getRewards(): Promise<Reward[]> {
    return await db.select().from(rewards);
  }

  async getRewardsByCard(cardId: string): Promise<Reward[]> {
    return await db.select().from(rewards).where(eq(rewards.cardId, cardId));
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const result = await db.insert(rewards).values(insertReward).returning();
    return result[0];
  }

  async updateRewardProgress(id: string, progress: string): Promise<Reward | undefined> {
    const result = await db.update(rewards)
      .set({ currentProgress: progress })
      .where(eq(rewards.id, id))
      .returning();
    return result[0];
  }

  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.transactionDate));
  }

  async getTransactionsByCard(cardId: string): Promise<Transaction[]> {
    return await db.select()
      .from(transactions)
      .where(eq(transactions.cardId, cardId))
      .orderBy(desc(transactions.transactionDate));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(insertTransaction).returning();
    return result[0];
  }

  async getNotifications(): Promise<Notification[]> {
    return await db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(insertNotification).returning();
    return result[0];
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const result = await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return result[0];
  }

  async getSmsMessages(): Promise<SmsMessage[]> {
    return await db.select().from(smsMessages);
  }

  async createSmsMessage(insertSms: InsertSmsMessage): Promise<SmsMessage> {
    const result = await db.insert(smsMessages).values(insertSms).returning();
    return result[0];
  }

  async updateSmsProcessed(id: string, extractedData: string): Promise<SmsMessage | undefined> {
    const result = await db.update(smsMessages)
      .set({ processed: true, extractedData })
      .where(eq(smsMessages.id, id))
      .returning();
    return result[0];
  }

  async getBills(): Promise<Bill[]> {
    return await db.select().from(bills).orderBy(desc(bills.dueDate));
  }

  async getBillsByCard(cardId: string): Promise<Bill[]> {
    return await db.select()
      .from(bills)
      .where(eq(bills.cardId, cardId))
      .orderBy(desc(bills.dueDate));
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const result = await db.insert(bills).values(insertBill).returning();
    return result[0];
  }

  async updateBillStatus(id: string, status: string): Promise<Bill | undefined> {
    const result = await db.update(bills)
      .set({ status })
      .where(eq(bills.id, id))
      .returning();
    return result[0];
  }

  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.paymentDate));
  }

  async getPaymentsByBill(billId: string): Promise<Payment[]> {
    return await db.select()
      .from(payments)
      .where(eq(payments.billId, billId))
      .orderBy(desc(payments.paymentDate));
  }

  async getPaymentsByCard(cardId: string): Promise<Payment[]> {
    return await db.select()
      .from(payments)
      .where(eq(payments.cardId, cardId))
      .orderBy(desc(payments.paymentDate));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(insertPayment).returning();
    return result[0];
  }

  async getAutopaySettings(): Promise<AutopaySettings[]> {
    return await db.select().from(autopaySettings);
  }

  async getAutopayByCard(cardId: string): Promise<AutopaySettings | undefined> {
    const result = await db.select()
      .from(autopaySettings)
      .where(eq(autopaySettings.cardId, cardId));
    return result[0];
  }

  async createAutopaySettings(insertSettings: InsertAutopaySettings): Promise<AutopaySettings> {
    const result = await db.insert(autopaySettings).values(insertSettings).returning();
    return result[0];
  }

  async updateAutopaySettings(id: string, settings: Partial<InsertAutopaySettings>): Promise<AutopaySettings | undefined> {
    const result = await db.update(autopaySettings)
      .set(settings)
      .where(eq(autopaySettings.id, id))
      .returning();
    return result[0];
  }

  async getCreditScores(): Promise<CreditScore[]> {
    return await db.select().from(creditScores).orderBy(desc(creditScores.recordedAt));
  }

  async getLatestCreditScore(): Promise<CreditScore | undefined> {
    const result = await db.select()
      .from(creditScores)
      .orderBy(desc(creditScores.recordedAt))
      .limit(1);
    return result[0];
  }

  async createCreditScore(insertScore: InsertCreditScore): Promise<CreditScore> {
    const result = await db.insert(creditScores).values(insertScore).returning();
    return result[0];
  }
}

export const storage = new PgStorage();
