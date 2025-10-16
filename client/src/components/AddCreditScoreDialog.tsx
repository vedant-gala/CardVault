import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCreditScoreSchema, type InsertCreditScore } from "@shared/schema";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddCreditScoreDialogProps {
  onAdd: (score: InsertCreditScore) => void;
  children?: React.ReactNode;
}

export function AddCreditScoreDialog({ onAdd, children }: AddCreditScoreDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<InsertCreditScore>({
    resolver: zodResolver(insertCreditScoreSchema),
    defaultValues: {
      score: 0,
      provider: "",
      recordedAt: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: InsertCreditScore) => {
    onAdd(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" data-testid="button-add-credit-score">
            <Plus className="w-4 h-4 mr-2" />
            Add Credit Score
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]" data-testid="dialog-add-credit-score">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Credit Score</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Score</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="300"
                      max="900"
                      placeholder="750" 
                      data-testid="input-credit-score"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., CIBIL, Experian" 
                      data-testid="input-credit-score-provider"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recordedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      data-testid="input-credit-score-date"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" data-testid="button-submit-credit-score">
              Add Score
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
