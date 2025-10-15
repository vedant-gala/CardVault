import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRewardSchema, type InsertReward, type Card } from "@shared/schema";
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
import { Gift } from "lucide-react";

interface AddRewardDialogProps {
  cards: Card[];
  onAdd: (reward: InsertReward) => void;
  children?: React.ReactNode;
}

export function AddRewardDialog({ cards, onAdd, children }: AddRewardDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<InsertReward>({
    resolver: zodResolver(insertRewardSchema),
    defaultValues: {
      cardId: "",
      rewardType: "",
      rewardValue: "",
      condition: "",
      threshold: "0",
      isActive: true,
      expiryDate: undefined,
    },
  });

  const onSubmit = (data: InsertReward) => {
    onAdd(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" data-testid="button-add-reward">
            <Gift className="w-4 h-4 mr-2" />
            Add Reward
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Reward</DialogTitle>
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
                      placeholder="e.g., 5% Cashback, 1000 Points" 
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
                      placeholder="e.g., Spend ₹5000 this month" 
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
                  <FormLabel>Threshold Amount (₹)</FormLabel>
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

            <Button type="submit" className="w-full" data-testid="button-submit-reward">
              Add Reward
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
