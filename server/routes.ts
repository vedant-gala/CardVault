import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCardSchema, 
  insertRewardSchema, 
  insertTransactionSchema,
  insertNotificationSchema,
  insertSmsMessageSchema,
  insertBillSchema,
  insertPaymentSchema,
  insertAutopaySettingsSchema,
  insertCreditScoreSchema
} from "@shared/schema";
import { extractTransactionFromSms, analyzeEmailForCreditCard, generateOfferRecommendations } from "./openai";
import { fetchCreditCardEmails } from "./gmail";
import { setupWebSocket, broadcastNotification } from "./websocket";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth user route
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    res.json(user);
  });
  
  app.get("/api/cards", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const cards = await storage.getCards(userId);
    res.json(cards);
  });

  app.post("/api/cards", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cardData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(userId, cardData);
      res.json(card);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/cards/:id", isAuthenticated, async (req: any, res) => {
    const deleted = await storage.deleteCard(req.params.id);
    res.json({ success: deleted });
  });

  app.get("/api/rewards", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const rewards = await storage.getRewards(userId);
    res.json(rewards);
  });

  app.post("/api/rewards", isAuthenticated, async (req: any, res) => {
    try {
      const rewardData = insertRewardSchema.parse(req.body);
      const reward = await storage.createReward(rewardData);
      res.json(reward);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/transactions", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const transactions = await storage.getTransactions(userId);
    res.json(transactions);
  });

  app.post("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);

      // Broadcast transaction notification
      const card = await storage.getCard(transaction.cardId);
      if (card) {
        const transactionNotif = await storage.createNotification({
          cardId: transaction.cardId,
          title: "New Transaction",
          message: `₹${transaction.amount} spent at ${transaction.merchantName}`,
          type: "transaction",
          metadata: JSON.stringify({ transactionId: transaction.id })
        });
        broadcastNotification({
          id: transactionNotif.id,
          type: transactionNotif.type,
          title: transactionNotif.title,
          message: transactionNotif.message,
          cardId: transactionNotif.cardId || undefined,
          read: transactionNotif.isRead,
          createdAt: transactionNotif.createdAt.toISOString(),
        });
      }

      const rewards = await storage.getRewardsByCard(transaction.cardId);
      for (const reward of rewards) {
        const newProgress = Number(reward.currentProgress) + Number(transaction.amount);
        await storage.updateRewardProgress(reward.id, newProgress.toString());

        if (newProgress >= Number(reward.threshold) && Number(reward.currentProgress) < Number(reward.threshold)) {
          const rewardNotif = await storage.createNotification({
            cardId: transaction.cardId,
            title: "Reward Unlocked! 🎉",
            message: `You've unlocked ${reward.rewardValue} on your ${card?.cardName || 'card'}!`,
            type: "reward",
            metadata: JSON.stringify({ rewardId: reward.id })
          });
          broadcastNotification({
            id: rewardNotif.id,
            type: rewardNotif.type,
            title: rewardNotif.title,
            message: rewardNotif.message,
            cardId: rewardNotif.cardId || undefined,
            read: rewardNotif.isRead,
            createdAt: rewardNotif.createdAt.toISOString(),
          });
        }
      }

      if (card) {
        const newBalance = Number(card.currentBalance) + Number(transaction.amount);
        await storage.updateCardBalance(card.id, newBalance.toString());
      }

      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/parse-sms", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const smsData = insertSmsMessageSchema.parse(req.body);
      const sms = await storage.createSmsMessage(smsData);

      const extracted = await extractTransactionFromSms(smsData.message);

      if (!extracted) {
        res.status(400).json({ error: "Could not extract transaction from SMS" });
        return;
      }

      await storage.updateSmsProcessed(sms.id, JSON.stringify(extracted));

      let matchedCard = null;
      if (extracted.lastFourDigits) {
        const cards = await storage.getCards(userId);
        matchedCard = cards.find(c => c.lastFourDigits === extracted.lastFourDigits);
      }

      if (!matchedCard) {
        const cards = await storage.getCards(userId);
        matchedCard = cards[0];
      }

      if (matchedCard) {
        const transaction = await storage.createTransaction({
          cardId: matchedCard.id,
          merchantName: extracted.merchantName,
          amount: extracted.amount,
          category: extracted.category,
          description: extracted.description || `Parsed from SMS: ${smsData.phoneNumber}`,
          source: "sms"
        });

        // Broadcast transaction notification for SMS-parsed transactions
        const transactionNotif = await storage.createNotification({
          cardId: matchedCard.id,
          title: "New Transaction",
          message: `₹${transaction.amount} spent at ${transaction.merchantName}`,
          type: "transaction",
          metadata: JSON.stringify({ transactionId: transaction.id })
        });
        broadcastNotification({
          id: transactionNotif.id,
          type: transactionNotif.type,
          title: transactionNotif.title,
          message: transactionNotif.message,
          cardId: transactionNotif.cardId || undefined,
          read: transactionNotif.isRead,
          createdAt: transactionNotif.createdAt.toISOString(),
        });

        const rewards = await storage.getRewardsByCard(matchedCard.id);
        for (const reward of rewards) {
          const oldProgress = Number(reward.currentProgress);
          const newProgress = oldProgress + Number(extracted.amount);
          const threshold = Number(reward.threshold);
          
          console.log(`Reward progress update: ${reward.id}, old: ${oldProgress}, new: ${newProgress}, threshold: ${threshold}`);
          
          await storage.updateRewardProgress(reward.id, newProgress.toString());

          if (newProgress >= threshold && oldProgress < threshold) {
            console.log(`Creating reward unlock notification for reward ${reward.id}`);
            const rewardNotif = await storage.createNotification({
              cardId: matchedCard.id,
              title: "Reward Unlocked! 🎉",
              message: `You've unlocked ${reward.rewardValue} on your ${matchedCard.cardName}!`,
              type: "reward",
              metadata: JSON.stringify({ rewardId: reward.id })
            });
            broadcastNotification({
              id: rewardNotif.id,
              type: rewardNotif.type,
              title: rewardNotif.title,
              message: rewardNotif.message,
              cardId: rewardNotif.cardId || undefined,
              read: rewardNotif.isRead,
              createdAt: rewardNotif.createdAt.toISOString(),
            });
          }
        }

        const newBalance = Number(matchedCard.currentBalance) + Number(extracted.amount);
        await storage.updateCardBalance(matchedCard.id, newBalance.toString());

        res.json({ success: true, transaction });
      } else {
        res.status(400).json({ error: "No card found to associate transaction with" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/parse-emails", isAuthenticated, async (req: any, res) => {
    try {
      const emails = await fetchCreditCardEmails();
      let processedCount = 0;

      for (const email of emails) {
        try {
          const analysis = await analyzeEmailForCreditCard(email.subject, email.body);

          if (analysis && analysis.type !== "other") {
            let title = "";
            let message = analysis.summary;

            if (analysis.type === "bill") {
              title = "Credit Card Bill";
              if (analysis.billAmount && analysis.dueDate) {
                message = `Bill of ₹${analysis.billAmount} due on ${analysis.dueDate}. ${analysis.summary}`;
              }
            } else if (analysis.type === "offer") {
              title = "New Offer Available";
            } else if (analysis.type === "statement") {
              title = "Monthly Statement";
            }

            await storage.createNotification({
              cardId: undefined,
              title,
              message,
              type: analysis.type,
              metadata: JSON.stringify({ 
                emailId: email.id, 
                changes: analysis.changes,
                from: email.from
              })
            });

            processedCount++;
          }
        } catch (analysisError) {
          console.error(`Error analyzing email ${email.id}:`, analysisError);
        }
      }

      res.json({ success: true, count: processedCount, total: emails.length });
    } catch (error: any) {
      console.error("Error in parse-emails:", error);
      
      if (error.message?.includes('insufficient authentication scopes')) {
        return res.status(403).json({ 
          error: "Gmail requires additional permissions. The current Gmail connection has limited access. Email parsing is currently unavailable.",
          scopeError: true
        });
      }
      
      res.status(500).json({ error: error.message || "Failed to parse emails" });
    }
  });

  app.get("/api/notifications", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const notifications = await storage.getNotifications(userId);
    res.json(notifications);
  });

  app.post("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", isAuthenticated, async (req: any, res) => {
    const notification = await storage.markNotificationAsRead(req.params.id);
    if (notification) {
      res.json(notification);
    } else {
      res.status(404).json({ error: "Notification not found" });
    }
  });

  app.get("/api/bills", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const bills = await storage.getBills(userId);
    res.json(bills);
  });

  app.get("/api/bills/card/:cardId", isAuthenticated, async (req: any, res) => {
    const bills = await storage.getBillsByCard(req.params.cardId);
    res.json(bills);
  });

  app.post("/api/bills", isAuthenticated, async (req: any, res) => {
    try {
      const billData = insertBillSchema.parse(req.body);
      const bill = await storage.createBill(billData);
      
      const card = await storage.getCard(bill.cardId);
      if (card) {
        await storage.createNotification({
          cardId: bill.cardId,
          title: "New Bill Generated",
          message: `Your ${card.cardName} bill of ₹${bill.amount} is due on ${new Date(bill.dueDate).toLocaleDateString()}`,
          type: "bill",
          metadata: JSON.stringify({ billId: bill.id })
        });
      }
      
      res.json(bill);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/bills/:id/status", isAuthenticated, async (req: any, res) => {
    const { status } = req.body;
    const bill = await storage.updateBillStatus(req.params.id, status);
    if (bill) {
      res.json(bill);
    } else {
      res.status(404).json({ error: "Bill not found" });
    }
  });

  app.get("/api/payments", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const payments = await storage.getPayments(userId);
    res.json(payments);
  });

  app.get("/api/payments/card/:cardId", isAuthenticated, async (req: any, res) => {
    const payments = await storage.getPaymentsByCard(req.params.cardId);
    res.json(payments);
  });

  app.post("/api/payments", isAuthenticated, async (req: any, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      
      await storage.updateBillStatus(payment.billId, "paid");
      
      const bill = await storage.getBillsByCard(payment.cardId);
      const paidBill = bill.find(b => b.id === payment.billId);
      const card = await storage.getCard(payment.cardId);
      
      if (card && paidBill) {
        await storage.createNotification({
          cardId: payment.cardId,
          title: "Payment Successful",
          message: `Your payment of ₹${payment.amount} for ${card.cardName} has been processed successfully`,
          type: "payment",
          metadata: JSON.stringify({ paymentId: payment.id, billId: payment.billId })
        });
      }
      
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/autopay", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const settings = await storage.getAutopaySettings(userId);
    res.json(settings);
  });

  app.get("/api/autopay/card/:cardId", isAuthenticated, async (req: any, res) => {
    const settings = await storage.getAutopayByCard(req.params.cardId);
    if (settings) {
      res.json(settings);
    } else {
      res.status(404).json({ error: "Autopay settings not found" });
    }
  });

  app.post("/api/autopay", isAuthenticated, async (req: any, res) => {
    try {
      const autopayData = insertAutopaySettingsSchema.parse(req.body);
      const settings = await storage.createAutopaySettings(autopayData);
      res.json(settings);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/autopay/:id", isAuthenticated, async (req: any, res) => {
    try {
      const updates = req.body;
      const settings = await storage.updateAutopaySettings(req.params.id, updates);
      if (settings) {
        res.json(settings);
      } else {
        res.status(404).json({ error: "Autopay settings not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/credit-scores", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const scores = await storage.getCreditScores(userId);
    res.json(scores);
  });

  app.get("/api/credit-scores/latest", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const score = await storage.getLatestCreditScore(userId);
    if (score) {
      res.json(score);
    } else {
      res.status(404).json({ error: "No credit scores found" });
    }
  });

  app.post("/api/credit-scores", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const scoreData = insertCreditScoreSchema.parse(req.body);
      const score = await storage.createCreditScore(userId, scoreData);
      res.json(score);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/offer-recommendations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getTransactions(userId);
      const cards = await storage.getCards(userId);

      if (transactions.length === 0) {
        return res.json({ recommendations: [] });
      }

      const categoryTotals: Record<string, number> = {};
      transactions.forEach(t => {
        const amt = Number(t.amount);
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
      });

      const topCategories = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat]) => cat);

      const totalSpending = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
      const monthlyAverage = totalSpending / (new Set(transactions.map(t => new Date(t.transactionDate).toISOString().slice(0, 7))).size || 1);

      const recommendations = await generateOfferRecommendations({
        categoryTotals,
        topCategories,
        totalSpending,
        monthlyAverage,
        cardNames: cards.map(c => c.cardName),
      });

      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket for real-time push notifications
  setupWebSocket(httpServer);

  return httpServer;
}
