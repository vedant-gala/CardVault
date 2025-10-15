import { Notification } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle, TrendingUp, Gift, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const typeIcons: Record<string, any> = {
  bill: AlertCircle,
  reward: Gift,
  offer: TrendingUp,
  transaction: CheckCircle,
};

const typeColors: Record<string, string> = {
  bill: "warning",
  reward: "success",
  offer: "primary",
  transaction: "secondary",
};

export function NotificationPanel({ notifications, onMarkAsRead }: NotificationPanelProps) {
  const unreadNotifications = notifications.filter(n => !n.isRead);

  if (notifications.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
        <p className="text-sm text-muted-foreground">
          You're all caught up! We'll notify you about bills, offers, and rewards
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3" data-testid="notification-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        {unreadNotifications.length > 0 && (
          <Badge variant="default" data-testid="notification-count">
            {unreadNotifications.length} new
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => {
          const Icon = typeIcons[notification.type] || Bell;
          const isUnread = !notification.isRead;

          return (
            <Card 
              key={notification.id}
              className={`p-4 ${isUnread ? 'border-primary/50' : ''}`}
              data-testid={`notification-${notification.id}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${typeColors[notification.type] || 'muted'}/20`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold">{notification.title}</h4>
                    {isUnread && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                    {isUnread && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                        data-testid={`button-mark-read-${notification.id}`}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
