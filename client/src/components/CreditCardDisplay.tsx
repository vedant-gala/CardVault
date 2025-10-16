import { Card as CardType } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiVisa, SiMastercard } from "react-icons/si";
import { CreditCard, Trash2, Pencil } from "lucide-react";

interface CreditCardDisplayProps {
  card: CardType;
  onClick?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function CreditCardDisplay({ card, onClick, onDelete, onEdit }: CreditCardDisplayProps) {
  const CardNetworkIcon = card.cardNetwork.toLowerCase() === 'visa' ? SiVisa : 
                          card.cardNetwork.toLowerCase() === 'mastercard' ? SiMastercard : 
                          CreditCard;

  const cardColor = card.cardColor || "#8B5CF6";

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(card.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(card.id);
    }
  };

  return (
    <Card 
      className="relative overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-all duration-300 group"
      style={{ 
        aspectRatio: '1.586',
        background: `linear-gradient(135deg, ${cardColor}15, ${cardColor}30)`,
        borderColor: `${cardColor}50`
      }}
      onClick={onClick}
      data-testid={`card-${card.id}`}
    >
      <div className="absolute inset-0 bg-gradient-purple opacity-10" />
      
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {onEdit && (
          <Button
            size="icon"
            variant="ghost"
            className="bg-primary/10 hover:bg-primary/20 text-primary"
            onClick={handleEdit}
            data-testid={`button-edit-card-${card.id}`}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            size="icon"
            variant="ghost"
            className="bg-destructive/10 hover:bg-destructive/20 text-destructive"
            onClick={handleDelete}
            data-testid={`button-delete-card-${card.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="relative h-full p-6 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="text-sm font-semibold text-muted-foreground">
            {card.bankName}
          </div>
          <div className="w-12 h-12 rounded-full bg-card/50 flex items-center justify-center backdrop-blur-sm">
            <CardNetworkIcon className="w-6 h-6" style={{ color: cardColor }} />
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
