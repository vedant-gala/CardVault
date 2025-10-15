import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, Reward, Transaction, Notification, InsertCard, InsertReward, InsertTransaction } from "@shared/schema";
import { DashboardStats } from "@/components/DashboardStats";
import { CreditCardDisplay } from "@/components/CreditCardDisplay";
import { RewardProgressCard } from "@/components/RewardProgressCard";
import { TransactionList } from "@/components/TransactionList";
import { NotificationPanel } from "@/components/NotificationPanel";
import { AddCardDialog } from "@/components/AddCardDialog";
import { AddRewardDialog } from "@/components/AddRewardDialog";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { SmsParsingDialog } from "@/components/SmsParsingDialog";
import { CardLoadingSkeleton, RewardLoadingSkeleton, TransactionLoadingSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Gift, Receipt, Bell, Mail, Sparkles } from "lucide-react";
import { Card as CardComponent } from "@/components/ui/card";

export default function Dashboard() {
  const { toast } = useToast();

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
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PATCH", `/api/notifications/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
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
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="cards" data-testid="tab-cards">
                <CreditCard className="w-4 h-4 mr-2" />
                Cards
              </TabsTrigger>
              <TabsTrigger value="rewards" data-testid="tab-rewards">
                <Gift className="w-4 h-4 mr-2" />
                Rewards
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
                    <CreditCardDisplay key={card.id} card={card} />
                  ))}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rewards.map((reward) => {
                    const card = cards.find(c => c.id === reward.cardId);
                    return (
                      <RewardProgressCard 
                        key={reward.id} 
                        reward={reward} 
                        cardColor={card?.cardColor}
                      />
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-bold">Transactions</h2>
                <div className="flex items-center gap-2">
                  <SmsParsingDialog 
                    onParse={(sms) => parsSmsMutation.mutateAsync(sms)}
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
