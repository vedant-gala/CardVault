import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRewardSchema, type InsertReward, type Reward, type Card } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface EditRewardDialogProps {
  reward: Reward;
  cards: Card[];
  onEdit: (id: string, updates: Partial<InsertReward>) => void;
}

export function EditRewardDialog({ reward, cards, onEdit }: EditRewardDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<InsertReward>({
    resolver: zodResolver(insertRewardSchema),
    defaultValues: {
      cardId: reward.cardId,
      rewardType: reward.rewardType,
      rewardValue: reward.rewardValue,
      condition: reward.condition,
      threshold: reward.threshold,
      isActive: reward.isActive,
      expiryDate: reward.expiryDate ?? undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        cardId: reward.cardId,
        rewardType: reward.rewardType,
        rewardValue: reward.rewardValue,
        condition: reward.condition,
        threshold: reward.threshold,
        isActive: reward.isActive,
        expiryDate: reward.expiryDate ?? undefined,
      });
    }
  }, [open, reward, form]);

  const onSubmit = (data: InsertReward) => {
    onEdit(reward.id, data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" data-testid={`button-edit-reward-${reward.id}`}>
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-edit-reward">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Reward</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Card</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-reward-card">
                        <SelectValue placeholder="Choose a card" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.cardName} ({card.bankName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rewardType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward Type</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Cashback, Reward Points" 
                      data-testid="input-reward-type"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rewardValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward Value</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 5%, 1000 points" 
                      data-testid="input-reward-value"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Online Shopping, Groceries" 
                      data-testid="input-reward-condition"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="5000" 
                      data-testid="input-reward-threshold"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" data-testid="button-submit-edit-reward">
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
