import { 
  type Card, type InsertCard,
  type Reward, type InsertReward,
  type Transaction, type InsertTransaction,
  type Notification, type InsertNotification,
  type SmsMessage, type InsertSmsMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private cards: Map<string, Card>;
  private rewards: Map<string, Reward>;
  private transactions: Map<string, Transaction>;
  private notifications: Map<string, Notification>;
  private smsMessages: Map<string, SmsMessage>;

  constructor() {
    this.cards = new Map();
    this.rewards = new Map();
    this.transactions = new Map();
    this.notifications = new Map();
    this.smsMessages = new Map();
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
      currentBalance: "0"
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
      currentProgress: "0"
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
      transactionDate: new Date()
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
      createdAt: new Date()
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
}

export const storage = new MemStorage();
