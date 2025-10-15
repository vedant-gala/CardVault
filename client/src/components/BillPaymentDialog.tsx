import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, Bill } from "@shared/schema";
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
import { CreditCard, Loader2 } from "lucide-react";

const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface BillPaymentDialogProps {
  bill: Bill;
  card: Card;
  onPay: (data: { billId: string; cardId: string; amount: string; paymentMethod: string }) => void;
  isLoading?: boolean;
}

export function BillPaymentDialog({ bill, card, onPay, isLoading = false }: BillPaymentDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: bill.amount,
      paymentMethod: "bank_transfer",
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    onPay({
      billId: bill.id,
      cardId: bill.cardId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          disabled={bill.status === "paid"}
          data-testid={`button-pay-bill-${bill.id}`}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {bill.status === "paid" ? "Paid" : "Pay Bill"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Pay Bill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Paying for</p>
            <p className="text-lg font-semibold">{card.cardName} ••••{card.lastFourDigits}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Due: {new Date(bill.dueDate).toLocaleDateString()}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        {...field}
                        data-testid="input-payment-amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-payment-method">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="net_banking">Net Banking</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} data-testid="button-submit-payment">
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Pay ₹{form.watch("amount")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
