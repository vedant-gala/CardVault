import { Card as CardType } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { SiVisa, SiMastercard } from "react-icons/si";
import { CreditCard } from "lucide-react";

interface CreditCardDisplayProps {
  card: CardType;
  onClick?: () => void;
}

export function CreditCardDisplay({ card, onClick }: CreditCardDisplayProps) {
  const CardNetworkIcon = card.cardNetwork.toLowerCase() === 'visa' ? SiVisa : 
                          card.cardNetwork.toLowerCase() === 'mastercard' ? SiMastercard : 
                          CreditCard;

  return (
    <Card 
      className="relative overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-all duration-300"
      style={{ 
        aspectRatio: '1.586',
        background: `linear-gradient(135deg, ${card.cardColor}15, ${card.cardColor}30)`,
        borderColor: `${card.cardColor}50`
      }}
      onClick={onClick}
      data-testid={`card-${card.id}`}
    >
      <div className="absolute inset-0 bg-gradient-purple opacity-10" />
      
      <div className="relative h-full p-6 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="text-sm font-semibold text-muted-foreground">
            {card.bankName}
          </div>
          <div className="w-12 h-12 rounded-full bg-card/50 flex items-center justify-center backdrop-blur-sm">
            <CardNetworkIcon className="w-6 h-6" style={{ color: card.cardColor }} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="font-mono text-2xl font-bold tracking-wider">
            •••• {card.lastFourDigits}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Card Name</div>
              <div className="text-sm font-semibold">{card.cardName}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Limit</div>
              <div className="text-sm font-semibold">₹{Number(card.creditLimit).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
