import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, Reward, Transaction, Notification, InsertCard, InsertReward, InsertTransaction, Bill, Payment, CreditScore, InsertCreditScore } from "@shared/schema";
import { DashboardStats } from "@/components/DashboardStats";
import { CreditCardDisplay } from "@/components/CreditCardDisplay";
import { RewardProgressCard } from "@/components/RewardProgressCard";
import { TransactionList } from "@/components/TransactionList";
import { NotificationPanel } from "@/components/NotificationPanel";
import { AddCardDialog } from "@/components/AddCardDialog";
import { AddRewardDialog } from "@/components/AddRewardDialog";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { SmsParsingDialog } from "@/components/SmsParsingDialog";
import { BillPaymentDialog } from "@/components/BillPaymentDialog";
import { CardLoadingSkeleton, RewardLoadingSkeleton, TransactionLoadingSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Gift, Receipt, Bell, Mail, Sparkles, FileText, TrendingUp, BarChart3 } from "lucide-react";
import { Card as CardComponent } from "@/components/ui/card";

export default function Dashboard() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Array<{
    title: string;
    description: string;
    category: string;
    estimatedSavings: string;
  }>>([]);

  const { data: cards = [], isLoading: cardsLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
  });

  const { data: rewards = [], isLoading: rewardsLoading } = useQuery<Reward[]>({
    queryKey: ["/api/rewards"],
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const { data: bills = [], isLoading: billsLoading } = useQuery<Bill[]>({
    queryKey: ["/api/bills"],
  });

  const { data: creditScores = [], isLoading: creditScoresLoading } = useQuery<CreditScore[]>({
    queryKey: ["/api/credit-scores"],
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const addCardMutation = useMutation({
    mutationFn: async (card: InsertCard) => {
      return await apiRequest("POST", "/api/cards", card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Card Added",
        description: "Your credit card has been added successfully",
      });
    },
  });

  const addRewardMutation = useMutation({
    mutationFn: async (reward: InsertReward) => {
      return await apiRequest("POST", "/api/rewards", reward);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      toast({
        title: "Reward Added",
        description: "The reward has been configured successfully",
      });
    },
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (transaction: InsertTransaction) => {
      return await apiRequest("POST", "/api/transactions", transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Transaction Added",
        description: "Your transaction has been recorded",
      });
    },
  });

  const parsSmsMutation = useMutation({
    mutationFn: async (sms: { phoneNumber: string; message: string }) => {
      return await apiRequest("POST", "/api/parse-sms", sms);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "SMS Parsed",
        description: "Transaction extracted and added to your card",
      });
    },
  });

  const parseEmailMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/parse-emails", {});
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Emails Parsed",
        description: `Found ${data.count || 0} credit card related emails`,
      });
    },
    onError: (error: any) => {
      const errorData = error?.response?.data;
      if (errorData?.scopeError) {
        toast({
          title: "Gmail Permissions Required",
          description: "The Gmail integration needs additional permissions to read emails. Email parsing is currently unavailable.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: errorData?.error || "Failed to parse emails. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/cards/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Card Deleted",
        description: "The credit card has been removed successfully",
      });
    },
  });

  const payBillMutation = useMutation({
    mutationFn: async (payment: { billId: string; cardId: string; amount: string; paymentMethod: string }) => {
      return await apiRequest("POST", "/api/payments", payment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Payment Successful",
        description: "Your bill payment has been processed",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PATCH", `/api/notifications/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const getRecommendationsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/offer-recommendations", {});
    },
    onSuccess: (data: any) => {
      if (data?.recommendations) {
        setRecommendations(data.recommendations);
        toast({
          title: "Recommendations Ready",
          description: `Found ${data.recommendations.length} personalized offers for you`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isLoading = cardsLoading || rewardsLoading || transactionsLoading || notificationsLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-purple py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">CardVault</h1>
          <p className="text-lg text-white/90">
            Smart credit card management with intelligent rewards tracking
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
        <DashboardStats 
          cards={cards} 
          rewards={rewards} 
          notifications={notifications} 
        />

        <div className="mt-12">
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-8">
              <TabsTrigger value="cards" data-testid="tab-cards">
                <CreditCard className="w-4 h-4 mr-2" />
                Cards
              </TabsTrigger>
              <TabsTrigger value="credit-score" data-testid="tab-credit-score">
                <TrendingUp className="w-4 h-4 mr-2" />
                Credit Score
              </TabsTrigger>
              <TabsTrigger value="rewards" data-testid="tab-rewards">
                <Gift className="w-4 h-4 mr-2" />
                Rewards
              </TabsTrigger>
              <TabsTrigger value="bills" data-testid="tab-bills">
                <FileText className="w-4 h-4 mr-2" />
                Bills
              </TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="transactions" data-testid="tab-transactions">
                <Receipt className="w-4 h-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="notifications" data-testid="tab-notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cards" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Cards</h2>
                <AddCardDialog onAdd={(card) => addCardMutation.mutate(card)} />
              </div>

              {cardsLoading ? (
                <CardLoadingSkeleton />
              ) : cards.length === 0 ? (
                <CardComponent className="p-12 text-center">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Cards Added</h3>
                  <p className="text-muted-foreground mb-6">
                    Add your first credit card to start tracking rewards and transactions
                  </p>
                  <AddCardDialog onAdd={(card) => addCardMutation.mutate(card)}>
                    <Button data-testid="button-add-first-card">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Your First Card
                    </Button>
                  </AddCardDialog>
                </CardComponent>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((card) => (
                    <CreditCardDisplay 
                      key={card.id} 
                      card={card} 
                      onDelete={(id) => deleteCardMutation.mutate(id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="credit-score" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Credit Score</h2>
              </div>

              {creditScoresLoading ? (
                <CardLoadingSkeleton />
              ) : creditScores.length === 0 ? (
                <CardComponent className="p-12 text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Credit Score History</h3>
                  <p className="text-muted-foreground">
                    Your credit score history will appear here
                  </p>
                </CardComponent>
              ) : (
                <div className="space-y-6">
                  <CardComponent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">Current Credit Score</h3>
                      <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                        {creditScores[0]?.score}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {creditScores[0]?.provider} • Updated {new Date(creditScores[0]?.recordedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {creditScores[0]?.suggestions && (
                      <div className="mt-6 p-4 bg-purple-500/10 rounded-lg">
                        <h4 className="font-semibold mb-2 text-purple-400">Improvement Suggestions</h4>
                        <p className="text-sm text-muted-foreground">{creditScores[0].suggestions}</p>
                      </div>
                    )}
                  </CardComponent>

                  <CardComponent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Score History</h3>
                    <div className="space-y-3">
                      {creditScores.map((score) => (
                        <div key={score.id} className="flex items-center justify-between p-3 rounded-lg hover-elevate" data-testid={`score-${score.id}`}>
                          <div>
                            <div className="font-semibold text-2xl">{score.score}</div>
                            <div className="text-sm text-muted-foreground">{new Date(score.recordedAt).toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">{score.provider}</div>
                            {score.factors && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {score.factors.substring(0, 50)}...
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardComponent>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Rewards & Offers</h2>
                <AddRewardDialog 
                  cards={cards} 
                  onAdd={(reward) => addRewardMutation.mutate(reward)} 
                />
              </div>

              {rewardsLoading ? (
                <RewardLoadingSkeleton />
              ) : rewards.length === 0 ? (
                <CardComponent className="p-12 text-center">
                  <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Rewards Configured</h3>
                  <p className="text-muted-foreground mb-6">
                    Set up rewards to track your progress toward unlocking exclusive offers
                  </p>
                  <AddRewardDialog cards={cards} onAdd={(reward) => addRewardMutation.mutate(reward)}>
                    <Button disabled={cards.length === 0} data-testid="button-add-first-reward">
                      <Gift className="w-4 h-4 mr-2" />
                      Add Your First Reward
                    </Button>
                  </AddRewardDialog>
                </CardComponent>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rewards.map((reward) => {
                      const card = cards.find(c => c.id === reward.cardId);
                      return (
                        <RewardProgressCard 
                          key={reward.id} 
                          reward={reward} 
                          cardColor={card?.cardColor ?? undefined}
                        />
                      );
                    })}
                  </div>
                  
                  {transactions.length > 0 && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">AI-Powered Offer Recommendations</h3>
                        <Button 
                          onClick={() => getRecommendationsMutation.mutate()}
                          disabled={getRecommendationsMutation.isPending}
                          data-testid="button-get-recommendations"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          {getRecommendationsMutation.isPending ? "Analyzing..." : "Get Recommendations"}
                        </Button>
                      </div>
                      
                      {recommendations && recommendations.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {recommendations.map((rec, idx) => (
                            <CardComponent key={idx} className="p-5" data-testid={`recommendation-${idx}`}>
                              <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-2">{rec.title}</h4>
                                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded">{rec.category}</span>
                                    <span className="text-xs font-semibold text-green-500">{rec.estimatedSavings}</span>
                                  </div>
                                </div>
                              </div>
                            </CardComponent>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="bills" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Bills & Payments</h2>
              </div>

              {billsLoading ? (
                <CardLoadingSkeleton />
              ) : bills.length === 0 ? (
                <CardComponent className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Bills Yet</h3>
                  <p className="text-muted-foreground">
                    Bills will appear here when generated for your cards
                  </p>
                </CardComponent>
              ) : (
                <div className="space-y-4">
                  {bills.map((bill) => {
                    const card = cards.find(c => c.id === bill.cardId);
                    if (!card) return null;

                    return (
                      <CardComponent key={bill.id} className="p-6" data-testid={`bill-${bill.id}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <div>
                                <h3 className="text-lg font-semibold">{card.cardName} ••••{card.lastFourDigits}</h3>
                                <p className="text-sm text-muted-foreground">{bill.billMonth}</p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                bill.status === "paid" 
                                  ? "bg-green-500/10 text-green-500" 
                                  : "bg-orange-500/10 text-orange-500"
                              }`}>
                                {bill.status === "paid" ? "Paid" : "Pending"}
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Total Amount</p>
                                <p className="text-lg font-bold">₹{Number(bill.amount).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Minimum Due</p>
                                <p className="text-lg font-semibold">₹{Number(bill.minimumDue).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Due Date</p>
                                <p className="text-lg font-semibold">{new Date(bill.dueDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          <BillPaymentDialog 
                            bill={bill} 
                            card={card}
                            onPay={(payment) => payBillMutation.mutate(payment)}
                            isLoading={payBillMutation.isPending}
                          />
                        </div>
                      </CardComponent>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Spending Analytics</h2>
              </div>

              {transactionsLoading ? (
                <CardLoadingSkeleton />
              ) : transactions.length === 0 ? (
                <CardComponent className="p-12 text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Transaction Data</h3>
                  <p className="text-muted-foreground">
                    Analytics will appear here once you have transaction history
                  </p>
                </CardComponent>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CardComponent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
                    <div className="space-y-4">
                      {(() => {
                        const categoryTotals: Record<string, number> = {};
                        transactions.forEach(t => {
                          const amt = Number(t.amount);
                          categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
                        });
                        const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
                        
                        return Object.entries(categoryTotals)
                          .sort(([, a], [, b]) => b - a)
                          .map(([category, amount]) => {
                            const percentage = (amount / totalSpent) * 100;
                            return (
                              <div key={category} data-testid={`category-${category}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">{category}</span>
                                  <span className="text-muted-foreground">₹{amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}% of total</div>
                              </div>
                            );
                          });
                      })()}
                    </div>
                  </CardComponent>

                  <CardComponent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Monthly Comparison</h3>
                    <div className="space-y-4">
                      {(() => {
                        const monthlyTotals: Record<string, number> = {};
                        transactions.forEach(t => {
                          const month = new Date(t.transactionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                          const amt = Number(t.amount);
                          monthlyTotals[month] = (monthlyTotals[month] || 0) + amt;
                        });
                        
                        const maxAmount = Math.max(...Object.values(monthlyTotals));
                        
                        return Object.entries(monthlyTotals)
                          .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                          .slice(-6)
                          .map(([month, amount]) => {
                            const heightPercentage = (amount / maxAmount) * 100;
                            return (
                              <div key={month} data-testid={`month-${month}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">{month}</span>
                                  <span className="text-muted-foreground">₹{amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-8 relative">
                                  <div 
                                    className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full transition-all flex items-center justify-end px-3"
                                    style={{ width: `${heightPercentage}%` }}
                                  >
                                    {heightPercentage > 20 && (
                                      <span className="text-xs font-semibold text-white">{heightPercentage.toFixed(0)}%</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          });
                      })()}
                    </div>
                  </CardComponent>

                  <CardComponent className="p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Spending Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(() => {
                        const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
                        const avgTransaction = totalSpent / transactions.length;
                        const categoryCount = new Set(transactions.map(t => t.category)).size;
                        
                        return (
                          <>
                            <div className="p-4 bg-purple-500/10 rounded-lg">
                              <div className="text-sm text-muted-foreground mb-1">Total Spending</div>
                              <div className="text-2xl font-bold text-purple-400">₹{totalSpent.toLocaleString()}</div>
                            </div>
                            <div className="p-4 bg-purple-500/10 rounded-lg">
                              <div className="text-sm text-muted-foreground mb-1">Avg Transaction</div>
                              <div className="text-2xl font-bold text-purple-400">₹{avgTransaction.toLocaleString()}</div>
                            </div>
                            <div className="p-4 bg-purple-500/10 rounded-lg">
                              <div className="text-sm text-muted-foreground mb-1">Categories</div>
                              <div className="text-2xl font-bold text-purple-400">{categoryCount}</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </CardComponent>
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-bold">Transactions</h2>
                <div className="flex items-center gap-2">
                  <SmsParsingDialog 
                    onParse={async (sms) => {
                      await parsSmsMutation.mutateAsync(sms);
                    }}
                    isLoading={parsSmsMutation.isPending}
                  />
                  <AddTransactionDialog 
                    cards={cards} 
                    onAdd={(transaction) => addTransactionMutation.mutate(transaction)} 
                  />
                </div>
              </div>

              {transactionsLoading ? (
                <TransactionLoadingSkeleton />
              ) : (
                <TransactionList transactions={transactions} cards={cards} />
              )}
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Notifications</h2>
                <Button 
                  variant="outline"
                  onClick={() => parseEmailMutation.mutate()}
                  disabled={parseEmailMutation.isPending}
                  data-testid="button-parse-emails"
                >
                  {parseEmailMutation.isPending ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      Checking Emails...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Check Gmail
                    </>
                  )}
                </Button>
              </div>

              {notificationsLoading ? (
                <CardComponent className="p-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted rounded w-1/3 animate-pulse" />
                      <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted rounded w-1/2 animate-pulse" />
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    </div>
                  </div>
                </CardComponent>
              ) : (
                <NotificationPanel 
                  notifications={notifications}
                  onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
