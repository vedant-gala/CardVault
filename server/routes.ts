import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCardSchema, 
  insertRewardSchema, 
  insertTransactionSchema,
  insertNotificationSchema,
  insertSmsMessageSchema 
} from "@shared/schema";
import { extractTransactionFromSms, analyzeEmailForCreditCard } from "./openai";
import { fetchCreditCardEmails } from "./gmail";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/cards", async (_req, res) => {
    const cards = await storage.getCards();
    res.json(cards);
  });

  app.post("/api/cards", async (req, res) => {
    try {
      const cardData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(cardData);
      res.json(card);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/cards/:id", async (req, res) => {
    const deleted = await storage.deleteCard(req.params.id);
    res.json({ success: deleted });
  });

  app.get("/api/rewards", async (_req, res) => {
    const rewards = await storage.getRewards();
    res.json(rewards);
  });

  app.post("/api/rewards", async (req, res) => {
    try {
      const rewardData = insertRewardSchema.parse(req.body);
      const reward = await storage.createReward(rewardData);
      res.json(reward);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/transactions", async (_req, res) => {
    const transactions = await storage.getTransactions();
    res.json(transactions);
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);

      const rewards = await storage.getRewardsByCard(transaction.cardId);
      for (const reward of rewards) {
        const newProgress = Number(reward.currentProgress) + Number(transaction.amount);
        await storage.updateRewardProgress(reward.id, newProgress.toString());

        if (newProgress >= Number(reward.threshold) && Number(reward.currentProgress) < Number(reward.threshold)) {
          await storage.createNotification({
            cardId: transaction.cardId,
            title: "Reward Unlocked! 🎉",
            message: `You've unlocked ${reward.rewardValue} on your ${(await storage.getCard(transaction.cardId))?.cardName || 'card'}!`,
            type: "reward",
            metadata: JSON.stringify({ rewardId: reward.id })
          });
        }
      }

      const card = await storage.getCard(transaction.cardId);
      if (card) {
        const newBalance = Number(card.currentBalance) + Number(transaction.amount);
        await storage.updateCardBalance(card.id, newBalance.toString());
      }

      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/parse-sms", async (req, res) => {
    try {
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
        const cards = await storage.getCards();
        matchedCard = cards.find(c => c.lastFourDigits === extracted.lastFourDigits);
      }

      if (!matchedCard) {
        const cards = await storage.getCards();
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

        const rewards = await storage.getRewardsByCard(matchedCard.id);
        for (const reward of rewards) {
          const newProgress = Number(reward.currentProgress) + Number(extracted.amount);
          await storage.updateRewardProgress(reward.id, newProgress.toString());

          if (newProgress >= Number(reward.threshold) && Number(reward.currentProgress) < Number(reward.threshold)) {
            await storage.createNotification({
              cardId: matchedCard.id,
              title: "Reward Unlocked! 🎉",
              message: `You've unlocked ${reward.rewardValue} on your ${matchedCard.cardName}!`,
              type: "reward",
              metadata: JSON.stringify({ rewardId: reward.id })
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

  app.post("/api/parse-emails", async (_req, res) => {
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
      res.status(500).json({ error: error.message || "Failed to parse emails" });
    }
  });

  app.get("/api/notifications", async (_req, res) => {
    const notifications = await storage.getNotifications();
    res.json(notifications);
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    const notification = await storage.markNotificationAsRead(req.params.id);
    if (notification) {
      res.json(notification);
    } else {
      res.status(404).json({ error: "Notification not found" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
