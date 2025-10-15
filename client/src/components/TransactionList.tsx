import { Transaction, Card as CardType } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  ShoppingBag, 
  Utensils, 
  Plane, 
  Fuel, 
  ShoppingCart,
  Zap,
  DollarSign 
} from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  cards: CardType[];
}

const categoryIcons: Record<string, any> = {
  shopping: ShoppingBag,
  food: Utensils,
  travel: Plane,
  fuel: Fuel,
  groceries: ShoppingCart,
  utilities: Zap,
  other: DollarSign,
};

export function TransactionList({ transactions, cards }: TransactionListProps) {
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const card = cards.find(c => c.id === transaction.cardId);
    const cardName = card?.cardName || "Unknown Card";
    if (!acc[cardName]) {
      acc[cardName] = { transactions: [], card };
    }
    acc[cardName].transactions.push(transaction);
    return acc;
  }, {} as Record<string, { transactions: Transaction[], card?: CardType }>);

  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
        <p className="text-sm text-muted-foreground">
          Your transactions will appear here once they're parsed from SMS or added manually
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="transaction-list">
      {Object.entries(groupedTransactions).map(([cardName, { transactions, card }]) => (
        <div key={cardName} className="space-y-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: card?.cardColor || "#8B5CF6" }}
            />
            <h3 className="font-semibold text-lg">{cardName}</h3>
            <Badge variant="secondary" className="ml-auto">
              {transactions.length} transactions
            </Badge>
          </div>

          <Card className="divide-y divide-border">
            {transactions.map((transaction) => {
              const Icon = categoryIcons[transaction.category.toLowerCase()] || DollarSign;
              return (
                <div 
                  key={transaction.id} 
                  className="p-4 flex items-center gap-4 hover-elevate"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${card?.cardColor || "#8B5CF6"}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: card?.cardColor || "#8B5CF6" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{transaction.merchantName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span>{format(new Date(transaction.transactionDate), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg tabular-nums">
                      ₹{Number(transaction.amount).toLocaleString()}
                    </div>
                    {transaction.source !== 'manual' && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {transaction.source}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      ))}
    </div>
  );
}
