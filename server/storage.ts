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
  type User, type UpsertUser,
  cards, rewards, transactions, notifications, smsMessages, bills, payments, autopaySettings, creditScores, users
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  getCards(userId: string): Promise<Card[]>;
  getCard(id: string, userId: string): Promise<Card | undefined>;
  createCard(userId: string, card: InsertCard): Promise<Card>;
  updateCard(id: string, userId: string, updates: Partial<InsertCard>): Promise<Card | undefined>;
  deleteCard(id: string, userId: string): Promise<boolean>;
  updateCardBalance(id: string, userId: string, balance: string): Promise<Card | undefined>;

  getRewards(userId: string): Promise<Reward[]>;
  getRewardsByCard(cardId: string, userId: string): Promise<Reward[]>;
  createReward(reward: InsertReward, userId: string): Promise<Reward>;
  updateReward(id: string, userId: string, updates: Partial<InsertReward>): Promise<Reward | undefined>;
  updateRewardProgress(id: string, userId: string, progress: string): Promise<Reward | undefined>;
  deleteReward(id: string, userId: string): Promise<boolean>;

  getTransactions(userId: string): Promise<Transaction[]>;
  getTransactionsByCard(cardId: string, userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction, userId: string): Promise<Transaction>;
  updateTransaction(id: string, userId: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string, userId: string): Promise<boolean>;

  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification, userId: string): Promise<Notification>;
  markNotificationAsRead(id: string, userId: string): Promise<Notification | undefined>;

  getSmsMessages(): Promise<SmsMessage[]>;
  createSmsMessage(sms: InsertSmsMessage): Promise<SmsMessage>;
  updateSmsProcessed(id: string, extractedData: string): Promise<SmsMessage | undefined>;

  getBills(userId: string): Promise<Bill[]>;
  getBillsByCard(cardId: string, userId: string): Promise<Bill[]>;
  createBill(bill: InsertBill, userId: string): Promise<Bill>;
  updateBillStatus(id: string, userId: string, status: string): Promise<Bill | undefined>;

  getPayments(userId: string): Promise<Payment[]>;
  getPaymentsByBill(billId: string, userId: string): Promise<Payment[]>;
  getPaymentsByCard(cardId: string, userId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment, userId: string): Promise<Payment>;

  getAutopaySettings(userId: string): Promise<AutopaySettings[]>;
  getAutopayByCard(cardId: string, userId: string): Promise<AutopaySettings | undefined>;
  createAutopaySettings(settings: InsertAutopaySettings, userId: string): Promise<AutopaySettings>;
  updateAutopaySettings(id: string, userId: string, settings: Partial<InsertAutopaySettings>): Promise<AutopaySettings | undefined>;

  getCreditScores(userId: string): Promise<CreditScore[]>;
  getLatestCreditScore(userId: string): Promise<CreditScore | undefined>;
  createCreditScore(userId: string, score: InsertCreditScore): Promise<CreditScore>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cards: Map<string, Card>;
  private rewards: Map<string, Reward>;
  private transactions: Map<string, Transaction>;
  private notifications: Map<string, Notification>;
  private smsMessages: Map<string, SmsMessage>;
  private bills: Map<string, Bill>;
  private payments: Map<string, Payment>;
  private autopaySettings: Map<string, AutopaySettings>;
  private creditScores: Map<string, CreditScore>;

  constructor() {
    this.users = new Map();
    this.cards = new Map();
    this.rewards = new Map();
    this.transactions = new Map();
    this.notifications = new Map();
    this.smsMessages = new Map();
    this.bills = new Map();
    this.payments = new Map();
    this.autopaySettings = new Map();
    this.creditScores = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.get(userData.id!);
    const user: User = {
      id: userData.id!,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: existing?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id!, user);
    return user;
  }

  async getCards(userId: string): Promise<Card[]> {
    return Array.from(this.cards.values()).filter(c => c.userId === userId);
  }

  async getCard(id: string, userId: string): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (card && card.userId === userId) {
      return card;
    }
    return undefined;
  }

  async createCard(userId: string, insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const card: Card = { 
      ...insertCard,
      userId,
      id,
      currentBalance: "0",
      dueDate: insertCard.dueDate ?? null,
      billingCycle: insertCard.billingCycle ?? null,
      cardColor: insertCard.cardColor ?? null
    };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: string, userId: string, updates: Partial<InsertCard>): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (card && card.userId === userId) {
      const updatedCard = { ...card, ...updates };
      this.cards.set(id, updatedCard);
      return updatedCard;
    }
    return undefined;
  }

  async deleteCard(id: string, userId: string): Promise<boolean> {
    const card = this.cards.get(id);
    if (card && card.userId === userId) {
      return this.cards.delete(id);
    }
    return false;
  }

  async updateCardBalance(id: string, userId: string, balance: string): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (card && card.userId === userId) {
      card.currentBalance = balance;
      this.cards.set(id, card);
      return card;
    }
    return undefined;
  }

  async getRewards(userId: string): Promise<Reward[]> {
    const userCards = Array.from(this.cards.values()).filter(c => c.userId === userId);
    const userCardIds = new Set(userCards.map(c => c.id));
    return Array.from(this.rewards.values()).filter(r => userCardIds.has(r.cardId));
  }

  async getRewardsByCard(cardId: string, userId: string): Promise<Reward[]> {
    const card = this.cards.get(cardId);
    if (!card || card.userId !== userId) {
      return [];
    }
    return Array.from(this.rewards.values()).filter(r => r.cardId === cardId);
  }

  async createReward(insertReward: InsertReward, userId: string): Promise<Reward> {
    const card = this.cards.get(insertReward.cardId);
    if (!card || card.userId !== userId) {
      throw new Error("Card not found or unauthorized");
    }
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

  async updateReward(id: string, userId: string, updates: Partial<InsertReward>): Promise<Reward | undefined> {
    const reward = this.rewards.get(id);
    if (!reward) {
      return undefined;
    }
    const card = this.cards.get(reward.cardId);
    if (!card || card.userId !== userId) {
      return undefined;
    }
    const updatedReward = { ...reward, ...updates };
    this.rewards.set(id, updatedReward);
    return updatedReward;
  }

  async updateRewardProgress(id: string, userId: string, progress: string): Promise<Reward | undefined> {
    const reward = this.rewards.get(id);
    if (!reward) {
      return undefined;
    }
    const card = this.cards.get(reward.cardId);
    if (!card || card.userId !== userId) {
      return undefined;
    }
    reward.currentProgress = progress;
    this.rewards.set(id, reward);
    return reward;
  }

  async deleteReward(id: string, userId: string): Promise<boolean> {
    const reward = this.rewards.get(id);
    if (!reward) {
      return false;
    }
    const card = this.cards.get(reward.cardId);
    if (!card || card.userId !== userId) {
      return false;
    }
    this.rewards.delete(id);
    return true;
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    const userCards = Array.from(this.cards.values()).filter(c => c.userId === userId);
    const userCardIds = new Set(userCards.map(c => c.id));
    return Array.from(this.transactions.values())
      .filter(t => userCardIds.has(t.cardId))
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }

  async getTransactionsByCard(cardId: string, userId: string): Promise<Transaction[]> {
    const card = this.cards.get(cardId);
    if (!card || card.userId !== userId) {
      return [];
    }
    return Array.from(this.transactions.values())
      .filter(t => t.cardId === cardId)
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction, userId: string): Promise<Transaction> {
    const card = this.cards.get(insertTransaction.cardId);
    if (!card || card.userId !== userId) {
      throw new Error("Card not found or unauthorized");
    }
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

  async updateTransaction(id: string, userId: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) {
      return undefined;
    }
    const card = this.cards.get(transaction.cardId);
    if (!card || card.userId !== userId) {
      return undefined;
    }
    const updated = { ...transaction, ...updates };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    const transaction = this.transactions.get(id);
    if (!transaction) {
      return false;
    }
    const card = this.cards.get(transaction.cardId);
    if (!card || card.userId !== userId) {
      return false;
    }
    this.transactions.delete(id);
    return true;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    const userCards = Array.from(this.cards.values()).filter(c => c.userId === userId);
    const userCardIds = new Set(userCards.map(c => c.id));
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId || (n.cardId && userCardIds.has(n.cardId)))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNotification(insertNotification: InsertNotification, userId: string): Promise<Notification> {
    if (insertNotification.cardId) {
      const card = this.cards.get(insertNotification.cardId);
      if (!card || card.userId !== userId) {
        throw new Error("Card not found or unauthorized");
      }
    }
    const id = randomUUID();
    const notification: Notification = { 
      ...insertNotification, 
      id,
      userId,
      isRead: false,
      createdAt: new Date(),
      cardId: insertNotification.cardId ?? null,
      metadata: insertNotification.metadata ?? null
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string, userId: string): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) {
      return undefined;
    }
    // Verify ownership: either notification.userId matches OR notification's card belongs to user
    if (notification.userId !== userId) {
      if (notification.cardId) {
        const card = this.cards.get(notification.cardId);
        if (!card || card.userId !== userId) {
          return undefined;
        }
      } else {
        return undefined;
      }
    }
    notification.isRead = true;
    this.notifications.set(id, notification);
    return notification;
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

  async getBills(userId: string): Promise<Bill[]> {
    const userCards = Array.from(this.cards.values()).filter(c => c.userId === userId);
    const userCardIds = new Set(userCards.map(c => c.id));
    return Array.from(this.bills.values())
      .filter(b => userCardIds.has(b.cardId))
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  }

  async getBillsByCard(cardId: string, userId: string): Promise<Bill[]> {
    const card = this.cards.get(cardId);
    if (!card || card.userId !== userId) {
      return [];
    }
    return Array.from(this.bills.values())
      .filter(b => b.cardId === cardId)
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  }

  async createBill(insertBill: InsertBill, userId: string): Promise<Bill> {
    const card = this.cards.get(insertBill.cardId);
    if (!card || card.userId !== userId) {
      throw new Error("Card not found or unauthorized");
    }
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

  async updateBillStatus(id: string, userId: string, status: string): Promise<Bill | undefined> {
    const bill = this.bills.get(id);
    if (!bill) {
      return undefined;
    }
    const card = this.cards.get(bill.cardId);
    if (!card || card.userId !== userId) {
      return undefined;
    }
    bill.status = status;
    this.bills.set(id, bill);
    return bill;
  }

  async getPayments(userId: string): Promise<Payment[]> {
    const userCards = Array.from(this.cards.values()).filter(c => c.userId === userId);
    const userCardIds = new Set(userCards.map(c => c.id));
    return Array.from(this.payments.values())
      .filter(p => userCardIds.has(p.cardId))
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }

  async getPaymentsByBill(billId: string, userId: string): Promise<Payment[]> {
    const bill = this.bills.get(billId);
    if (!bill) {
      return [];
    }
    const card = this.cards.get(bill.cardId);
    if (!card || card.userId !== userId) {
      return [];
    }
    return Array.from(this.payments.values())
      .filter(p => p.billId === billId)
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }

  async getPaymentsByCard(cardId: string, userId: string): Promise<Payment[]> {
    const card = this.cards.get(cardId);
    if (!card || card.userId !== userId) {
      return [];
    }
    return Array.from(this.payments.values())
      .filter(p => p.cardId === cardId)
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }

  async createPayment(insertPayment: InsertPayment, userId: string): Promise<Payment> {
    const card = this.cards.get(insertPayment.cardId);
    if (!card || card.userId !== userId) {
      throw new Error("Card not found or unauthorized");
    }
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

  async getAutopaySettings(userId: string): Promise<AutopaySettings[]> {
    const userCards = Array.from(this.cards.values()).filter(c => c.userId === userId);
    const userCardIds = new Set(userCards.map(c => c.id));
    return Array.from(this.autopaySettings.values()).filter(a => userCardIds.has(a.cardId));
  }

  async getAutopayByCard(cardId: string, userId: string): Promise<AutopaySettings | undefined> {
    const card = this.cards.get(cardId);
    if (!card || card.userId !== userId) {
      return undefined;
    }
    return Array.from(this.autopaySettings.values()).find(a => a.cardId === cardId);
  }

  async createAutopaySettings(insertSettings: InsertAutopaySettings, userId: string): Promise<AutopaySettings> {
    const card = this.cards.get(insertSettings.cardId);
    if (!card || card.userId !== userId) {
      throw new Error("Card not found or unauthorized");
    }
    const id = randomUUID();
    const settings: AutopaySettings = { 
      ...insertSettings, 
      id,
      enabled: insertSettings.enabled ?? false,
      paymentType: insertSettings.paymentType ?? "minimum",
      daysBefore: insertSettings.daysBefore ?? 3,
      fixedAmount: insertSettings.fixedAmount ?? null,
      paymentMethod: insertSettings.paymentMethod ?? "bank_account",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.autopaySettings.set(id, settings);
    return settings;
  }

  async updateAutopaySettings(id: string, userId: string, updates: Partial<InsertAutopaySettings>): Promise<AutopaySettings | undefined> {
    const settings = this.autopaySettings.get(id);
    if (!settings) {
      return undefined;
    }
    const card = this.cards.get(settings.cardId);
    if (!card || card.userId !== userId) {
      return undefined;
    }
    Object.assign(settings, updates, { updatedAt: new Date() });
    this.autopaySettings.set(id, settings);
    return settings;
  }

  async getCreditScores(userId: string): Promise<CreditScore[]> {
    return Array.from(this.creditScores.values())
      .filter(cs => cs.userId === userId)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  }

  async getLatestCreditScore(userId: string): Promise<CreditScore | undefined> {
    const scores = Array.from(this.creditScores.values())
      .filter(cs => cs.userId === userId)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    return scores[0];
  }

  async createCreditScore(userId: string, insertScore: InsertCreditScore): Promise<CreditScore> {
    const id = randomUUID();
    const creditScore: CreditScore = {
      ...insertScore,
      userId,
      id,
      provider: insertScore.provider ?? "CIBIL",
      recordedAt: new Date(),
      factors: insertScore.factors ?? null,
      suggestions: insertScore.suggestions ?? null,
    };
    this.creditScores.set(id, creditScore);
    return creditScore;
  }
}

export class PgStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getCards(userId: string): Promise<Card[]> {
    return await db.select().from(cards).where(eq(cards.userId, userId));
  }

  async getCard(id: string, userId: string): Promise<Card | undefined> {
    const result = await db.select().from(cards).where(and(eq(cards.id, id), eq(cards.userId, userId)));
    return result[0];
  }

  async createCard(userId: string, insertCard: InsertCard): Promise<Card> {
    const result = await db.insert(cards).values({ ...insertCard, userId }).returning();
    return result[0];
  }

  async updateCard(id: string, userId: string, updates: Partial<InsertCard>): Promise<Card | undefined> {
    const result = await db.update(cards)
      .set(updates)
      .where(and(eq(cards.id, id), eq(cards.userId, userId)))
      .returning();
    return result[0];
  }

  async deleteCard(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(cards).where(and(eq(cards.id, id), eq(cards.userId, userId))).returning();
    return result.length > 0;
  }

  async updateCardBalance(id: string, userId: string, balance: string): Promise<Card | undefined> {
    const result = await db.update(cards)
      .set({ currentBalance: balance })
      .where(and(eq(cards.id, id), eq(cards.userId, userId)))
      .returning();
    return result[0];
  }

  async getRewards(userId: string): Promise<Reward[]> {
    return await db
      .select({ 
        id: rewards.id,
        cardId: rewards.cardId,
        rewardType: rewards.rewardType,
        rewardValue: rewards.rewardValue,
        condition: rewards.condition,
        threshold: rewards.threshold,
        currentProgress: rewards.currentProgress,
        isActive: rewards.isActive,
        expiryDate: rewards.expiryDate,
      })
      .from(rewards)
      .innerJoin(cards, eq(rewards.cardId, cards.id))
      .where(eq(cards.userId, userId));
  }

  async getRewardsByCard(cardId: string, userId: string): Promise<Reward[]> {
    const card = await db.select().from(cards).where(and(eq(cards.id, cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return [];
    }
    return await db.select().from(rewards).where(eq(rewards.cardId, cardId));
  }

  async createReward(insertReward: InsertReward, userId: string): Promise<Reward> {
    const card = await db.select().from(cards).where(and(eq(cards.id, insertReward.cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      throw new Error("Card not found or unauthorized");
    }
    const result = await db.insert(rewards).values(insertReward).returning();
    return result[0];
  }

  async updateReward(id: string, userId: string, updates: Partial<InsertReward>): Promise<Reward | undefined> {
    const reward = await db.select().from(rewards).where(eq(rewards.id, id));
    if (!reward[0]) {
      return undefined;
    }
    const card = await db.select().from(cards).where(and(eq(cards.id, reward[0].cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return undefined;
    }
    const result = await db.update(rewards)
      .set(updates)
      .where(eq(rewards.id, id))
      .returning();
    return result[0];
  }

  async updateRewardProgress(id: string, userId: string, progress: string): Promise<Reward | undefined> {
    const reward = await db.select().from(rewards).where(eq(rewards.id, id));
    if (!reward[0]) {
      return undefined;
    }
    const card = await db.select().from(cards).where(and(eq(cards.id, reward[0].cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return undefined;
    }
    const result = await db.update(rewards)
      .set({ currentProgress: progress })
      .where(eq(rewards.id, id))
      .returning();
    return result[0];
  }

  async deleteReward(id: string, userId: string): Promise<boolean> {
    const reward = await db.select().from(rewards).where(eq(rewards.id, id));
    if (!reward[0]) {
      return false;
    }
    const card = await db.select().from(cards).where(and(eq(cards.id, reward[0].cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return false;
    }
    await db.delete(rewards).where(eq(rewards.id, id));
    return true;
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select({
        id: transactions.id,
        cardId: transactions.cardId,
        merchantName: transactions.merchantName,
        amount: transactions.amount,
        category: transactions.category,
        transactionDate: transactions.transactionDate,
        description: transactions.description,
        source: transactions.source,
      })
      .from(transactions)
      .innerJoin(cards, eq(transactions.cardId, cards.id))
      .where(eq(cards.userId, userId))
      .orderBy(desc(transactions.transactionDate));
  }

  async getTransactionsByCard(cardId: string, userId: string): Promise<Transaction[]> {
    const card = await db.select().from(cards).where(and(eq(cards.id, cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return [];
    }
    return await db.select()
      .from(transactions)
      .where(eq(transactions.cardId, cardId))
      .orderBy(desc(transactions.transactionDate));
  }

  async createTransaction(insertTransaction: InsertTransaction, userId: string): Promise<Transaction> {
    const card = await db.select().from(cards).where(and(eq(cards.id, insertTransaction.cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      throw new Error("Card not found or unauthorized");
    }
    const result = await db.insert(transactions).values(insertTransaction).returning();
    return result[0];
  }

  async updateTransaction(id: string, userId: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = await db.select().from(transactions).where(eq(transactions.id, id));
    if (!transaction[0]) {
      return undefined;
    }
    const card = await db.select().from(cards).where(and(eq(cards.id, transaction[0].cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return undefined;
    }
    const result = await db.update(transactions)
      .set(updates)
      .where(eq(transactions.id, id))
      .returning();
    return result[0];
  }

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    const transaction = await db.select().from(transactions).where(eq(transactions.id, id));
    if (!transaction[0]) {
      return false;
    }
    const card = await db.select().from(cards).where(and(eq(cards.id, transaction[0].cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return false;
    }
    await db.delete(transactions).where(eq(transactions.id, id));
    return true;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select({
        id: notifications.id,
        userId: notifications.userId,
        cardId: notifications.cardId,
        title: notifications.title,
        message: notifications.message,
        type: notifications.type,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
        metadata: notifications.metadata,
      })
      .from(notifications)
      .leftJoin(cards, eq(notifications.cardId, cards.id))
      .where(
        or(
          eq(notifications.userId, userId),
          eq(cards.userId, userId)
        )
      )
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(insertNotification: InsertNotification, userId: string): Promise<Notification> {
    if (insertNotification.cardId) {
      const card = await db.select().from(cards).where(and(eq(cards.id, insertNotification.cardId), eq(cards.userId, userId)));
      if (!card[0]) {
        throw new Error("Card not found or unauthorized");
      }
    }
    const result = await db.insert(notifications).values({
      ...insertNotification,
      userId
    }).returning();
    return result[0];
  }

  async markNotificationAsRead(id: string, userId: string): Promise<Notification | undefined> {
    const notification = await db.select().from(notifications).where(eq(notifications.id, id));
    if (!notification[0]) {
      return undefined;
    }
    // Verify ownership: either notification.userId matches OR notification's card belongs to user
    if (notification[0].userId !== userId) {
      if (notification[0].cardId) {
        const card = await db.select().from(cards).where(and(eq(cards.id, notification[0].cardId), eq(cards.userId, userId)));
        if (!card[0]) {
          return undefined;
        }
      } else {
        // Notification has no userId and no cardId - unauthorized
        return undefined;
      }
    }
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

  async getBills(userId: string): Promise<Bill[]> {
    return await db
      .select({
        id: bills.id,
        cardId: bills.cardId,
        amount: bills.amount,
        dueDate: bills.dueDate,
        billMonth: bills.billMonth,
        minimumDue: bills.minimumDue,
        status: bills.status,
        createdAt: bills.createdAt,
      })
      .from(bills)
      .innerJoin(cards, eq(bills.cardId, cards.id))
      .where(eq(cards.userId, userId))
      .orderBy(desc(bills.dueDate));
  }

  async getBillsByCard(cardId: string, userId: string): Promise<Bill[]> {
    const card = await db.select().from(cards).where(and(eq(cards.id, cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return [];
    }
    return await db.select()
      .from(bills)
      .where(eq(bills.cardId, cardId))
      .orderBy(desc(bills.dueDate));
  }

  async createBill(insertBill: InsertBill, userId: string): Promise<Bill> {
    const card = await db.select().from(cards).where(and(eq(cards.id, insertBill.cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      throw new Error("Card not found or unauthorized");
    }
    const result = await db.insert(bills).values(insertBill).returning();
    return result[0];
  }

  async updateBillStatus(id: string, userId: string, status: string): Promise<Bill | undefined> {
    const bill = await db.select().from(bills).where(eq(bills.id, id));
    if (!bill[0]) {
      return undefined;
    }
    const card = await db.select().from(cards).where(and(eq(cards.id, bill[0].cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return undefined;
    }
    const result = await db.update(bills)
      .set({ status })
      .where(eq(bills.id, id))
      .returning();
    return result[0];
  }

  async getPayments(userId: string): Promise<Payment[]> {
    return await db
      .select({
        id: payments.id,
        billId: payments.billId,
        cardId: payments.cardId,
        amount: payments.amount,
        paymentDate: payments.paymentDate,
        paymentMethod: payments.paymentMethod,
        status: payments.status,
        transactionId: payments.transactionId,
      })
      .from(payments)
      .innerJoin(cards, eq(payments.cardId, cards.id))
      .where(eq(cards.userId, userId))
      .orderBy(desc(payments.paymentDate));
  }

  async getPaymentsByBill(billId: string, userId: string): Promise<Payment[]> {
    const bill = await db.select().from(bills).where(eq(bills.id, billId));
    if (!bill[0]) {
      return [];
    }
    const card = await db.select().from(cards).where(and(eq(cards.id, bill[0].cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return [];
    }
    return await db.select()
      .from(payments)
      .where(eq(payments.billId, billId))
      .orderBy(desc(payments.paymentDate));
  }

  async getPaymentsByCard(cardId: string, userId: string): Promise<Payment[]> {
    const card = await db.select().from(cards).where(and(eq(cards.id, cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return [];
    }
    return await db.select()
      .from(payments)
      .where(eq(payments.cardId, cardId))
      .orderBy(desc(payments.paymentDate));
  }

  async createPayment(insertPayment: InsertPayment, userId: string): Promise<Payment> {
    const card = await db.select().from(cards).where(and(eq(cards.id, insertPayment.cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      throw new Error("Card not found or unauthorized");
    }
    const result = await db.insert(payments).values(insertPayment).returning();
    return result[0];
  }

  async getAutopaySettings(userId: string): Promise<AutopaySettings[]> {
    return await db
      .select({
        id: autopaySettings.id,
        cardId: autopaySettings.cardId,
        enabled: autopaySettings.enabled,
        paymentType: autopaySettings.paymentType,
        daysBefore: autopaySettings.daysBefore,
        fixedAmount: autopaySettings.fixedAmount,
        paymentMethod: autopaySettings.paymentMethod,
        createdAt: autopaySettings.createdAt,
        updatedAt: autopaySettings.updatedAt,
      })
      .from(autopaySettings)
      .innerJoin(cards, eq(autopaySettings.cardId, cards.id))
      .where(eq(cards.userId, userId));
  }

  async getAutopayByCard(cardId: string, userId: string): Promise<AutopaySettings | undefined> {
    const card = await db.select().from(cards).where(and(eq(cards.id, cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return undefined;
    }
    const result = await db.select()
      .from(autopaySettings)
      .where(eq(autopaySettings.cardId, cardId));
    return result[0];
  }

  async createAutopaySettings(insertSettings: InsertAutopaySettings, userId: string): Promise<AutopaySettings> {
    const card = await db.select().from(cards).where(and(eq(cards.id, insertSettings.cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      throw new Error("Card not found or unauthorized");
    }
    const result = await db.insert(autopaySettings).values(insertSettings).returning();
    return result[0];
  }

  async updateAutopaySettings(id: string, userId: string, settings: Partial<InsertAutopaySettings>): Promise<AutopaySettings | undefined> {
    const autopay = await db.select().from(autopaySettings).where(eq(autopaySettings.id, id));
    if (!autopay[0]) {
      return undefined;
    }
    const card = await db.select().from(cards).where(and(eq(cards.id, autopay[0].cardId), eq(cards.userId, userId)));
    if (!card[0]) {
      return undefined;
    }
    const result = await db.update(autopaySettings)
      .set(settings)
      .where(eq(autopaySettings.id, id))
      .returning();
    return result[0];
  }

  async getCreditScores(userId: string): Promise<CreditScore[]> {
    return await db
      .select()
      .from(creditScores)
      .where(eq(creditScores.userId, userId))
      .orderBy(desc(creditScores.recordedAt));
  }

  async getLatestCreditScore(userId: string): Promise<CreditScore | undefined> {
    const result = await db
      .select()
      .from(creditScores)
      .where(eq(creditScores.userId, userId))
      .orderBy(desc(creditScores.recordedAt))
      .limit(1);
    return result[0];
  }

  async createCreditScore(userId: string, insertScore: InsertCreditScore): Promise<CreditScore> {
    const result = await db.insert(creditScores).values({ ...insertScore, userId }).returning();
    return result[0];
  }
}

export const storage = new PgStorage();
