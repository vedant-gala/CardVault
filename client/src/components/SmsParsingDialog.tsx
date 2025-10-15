import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";

const smsSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type SmsFormData = z.infer<typeof smsSchema>;

interface SmsParsingDialogProps {
  onParse: (data: SmsFormData) => Promise<void>;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function SmsParsingDialog({ onParse, isLoading = false, children }: SmsParsingDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<SmsFormData>({
    resolver: zodResolver(smsSchema),
    defaultValues: {
      phoneNumber: "",
      message: "",
    },
  });

  const onSubmit = async (data: SmsFormData) => {
    await onParse(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" data-testid="button-parse-sms">
            <MessageSquare className="w-4 h-4 mr-2" />
            Parse SMS
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Parse Transaction SMS</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., +91-HDFCBK" 
                      data-testid="input-phone-number"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    The phone number or sender ID of the bank SMS
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMS Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste the transaction SMS here..."
                      className="min-h-[150px] resize-none"
                      data-testid="input-sms-message"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Example: "Your HDFC Bank Credit Card XX1234 has been used for INR 1,500.00 at Amazon on 15-Oct-2025"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="button-submit-sms"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Parsing...
                </>
              ) : (
                "Parse Transaction"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
