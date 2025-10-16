import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, AutopaySettings, InsertAutopaySettings } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

interface AutopaySettingsDialogProps {
  card: Card;
}

export function AutopaySettingsDialog({ card }: AutopaySettingsDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [paymentType, setPaymentType] = useState<"minimum" | "full" | "fixed">("minimum");
  const [daysBefore, setDaysBefore] = useState(3);
  const [fixedAmount, setFixedAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_account");

  const { data: existingSettings } = useQuery<AutopaySettings | undefined>({
    queryKey: ["/api/autopay/card", card.id],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/autopay/card/${card.id}`);
        if (response.status === 404) return undefined;
        return response.json();
      } catch {
        return undefined;
      }
    },
    enabled: open,
  });

  const createAutopayMutation = useMutation({
    mutationFn: async (settings: InsertAutopaySettings) => {
      return await apiRequest("POST", "/api/autopay", settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/autopay"] });
      queryClient.invalidateQueries({ queryKey: ["/api/autopay/card", card.id] });
      toast({
        title: "Autopay Enabled",
        description: "Autopay settings have been configured successfully",
      });
      setOpen(false);
    },
  });

  const updateAutopayMutation = useMutation({
    mutationFn: async (settings: Partial<InsertAutopaySettings>) => {
      return await apiRequest("PATCH", `/api/autopay/${existingSettings?.id}`, settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/autopay"] });
      queryClient.invalidateQueries({ queryKey: ["/api/autopay/card", card.id] });
      toast({
        title: "Autopay Updated",
        description: "Autopay settings have been updated successfully",
      });
      setOpen(false);
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && existingSettings) {
      setEnabled(existingSettings.enabled);
      setPaymentType(existingSettings.paymentType as "minimum" | "full" | "fixed");
      setDaysBefore(existingSettings.daysBefore);
      setFixedAmount(existingSettings.fixedAmount?.toString() || "");
      setPaymentMethod(existingSettings.paymentMethod);
    }
  };

  const handleSubmit = () => {
    const settings: InsertAutopaySettings = {
      cardId: card.id,
      enabled,
      paymentType,
      daysBefore,
      fixedAmount: paymentType === "fixed" ? fixedAmount : null,
      paymentMethod,
    };

    if (existingSettings) {
      updateAutopayMutation.mutate(settings);
    } else {
      createAutopayMutation.mutate(settings);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          data-testid={`button-autopay-${card.id}`}
        >
          <Settings className="w-4 h-4 mr-2" />
          Autopay
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-autopay-settings">
        <DialogHeader>
          <DialogTitle>Autopay Settings - {card.cardName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autopay-enabled">Enable Autopay</Label>
              <p className="text-sm text-muted-foreground">
                Automatically pay bills for this card
              </p>
            </div>
            <Switch
              id="autopay-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
              data-testid="switch-autopay-enabled"
            />
          </div>

          {enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="payment-type">Payment Type</Label>
                <Select value={paymentType} onValueChange={(value) => setPaymentType(value as any)}>
                  <SelectTrigger id="payment-type" data-testid="select-payment-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimum">Minimum Payment</SelectItem>
                    <SelectItem value="full">Full Balance</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentType === "fixed" && (
                <div className="space-y-2">
                  <Label htmlFor="fixed-amount">Fixed Amount ($)</Label>
                  <Input
                    id="fixed-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={fixedAmount}
                    onChange={(e) => setFixedAmount(e.target.value)}
                    data-testid="input-fixed-amount"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="days-before">Days Before Due Date</Label>
                <Input
                  id="days-before"
                  type="number"
                  min="1"
                  max="15"
                  value={daysBefore}
                  onChange={(e) => setDaysBefore(parseInt(e.target.value))}
                  data-testid="input-days-before"
                />
                <p className="text-xs text-muted-foreground">
                  Payment will be scheduled {daysBefore} day{daysBefore !== 1 ? 's' : ''} before the due date
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-autopay">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createAutopayMutation.isPending || updateAutopayMutation.isPending}
            data-testid="button-save-autopay"
          >
            {createAutopayMutation.isPending || updateAutopayMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
