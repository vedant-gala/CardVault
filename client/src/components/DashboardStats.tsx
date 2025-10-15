import { Card as CardType, Reward, Notification } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { TrendingUp, CreditCard, Gift, Bell } from "lucide-react";

interface DashboardStatsProps {
  cards: CardType[];
  rewards: Reward[];
  notifications: Notification[];
}

export function DashboardStats({ cards, rewards, notifications }: DashboardStatsProps) {
  const totalCreditLimit = cards.reduce((sum, card) => sum + Number(card.creditLimit), 0);
  const activeRewards = rewards.filter(r => r.isActive).length;
  const unlockedRewards = rewards.filter(r => {
    const progress = (Number(r.currentProgress) / Number(r.threshold)) * 100;
    return progress >= 100;
  }).length;
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const stats = [
    {
      icon: CreditCard,
      label: "Total Cards",
      value: cards.length.toString(),
      subtext: `₹${totalCreditLimit.toLocaleString()} total limit`,
      color: "#8B5CF6",
    },
    {
      icon: Gift,
      label: "Active Rewards",
      value: activeRewards.toString(),
      subtext: `${unlockedRewards} unlocked`,
      color: "#10B981",
    },
    {
      icon: Bell,
      label: "Notifications",
      value: notifications.length.toString(),
      subtext: `${unreadNotifications} unread`,
      color: "#F59E0B",
    },
    {
      icon: TrendingUp,
      label: "This Month",
      value: "₹0",
      subtext: "Total spending",
      color: "#3B82F6",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
          <div className="text-xs text-muted-foreground">{stat.subtext}</div>
        </Card>
      ))}
    </div>
  );
}
