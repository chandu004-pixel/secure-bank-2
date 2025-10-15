"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { user } from "@/lib/data";
import { checkFraud } from "@/app/actions";
import type { FraudDetectionOutput } from "@/ai/flows/fraud-detection";

const transferFormSchema = z.object({
  recipientAccount: z
    .string()
    .min(10, { message: "Account number must be at least 10 digits." })
    .max(16, { message: "Account number must be no more than 16 digits." }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be greater than zero." })
    .max(user.balance, { message: "Amount exceeds your available balance." }),
  reason: z.string().max(100).optional(),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

export default function TransferPage() {
  const { toast } = useToast();
  const [isCheckingFraud, setIsCheckingFraud] = useState(false);
  const [fraudResult, setFraudResult] = useState<FraudDetectionOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      recipientAccount: "",
      amount: 0,
      reason: "",
    },
  });

  async function onSubmit(data: TransferFormValues) {
    setIsCheckingFraud(true);
    setIsDialogOpen(true);
    const result = await checkFraud(data);
    if (result.success) {
      setFraudResult(result);
    } else {
      setFraudResult({ isFraudulent: true, fraudExplanation: result.fraudExplanation });
    }
    setIsCheckingFraud(false);
  }

  function handleConfirmTransfer() {
    setIsDialogOpen(false);
    toast({
      title: "Transfer Successful",
      description: `Successfully transferred $${form.getValues("amount")} to account ${form.getValues("recipientAccount")}.`,
    });
    form.reset();
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Transfer Funds</CardTitle>
          <CardDescription>
            Send money to another account securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm">
            <span className="text-muted-foreground">Available Balance:</span>{" "}
            <span className="font-semibold">${user.balance.toLocaleString()}</span>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="recipientAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Dinner last night"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isCheckingFraud} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                {isCheckingFraud ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Review Transfer"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          {isCheckingFraud ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Analyzing transaction...</p>
            </div>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Your Transfer</AlertDialogTitle>
                <AlertDialogDescription>
                  Please review the details before confirming.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold text-lg">${form.getValues("amount").toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To Account</p>
                  <p className="font-semibold">{form.getValues("recipientAccount")}</p>
                </div>
                {fraudResult?.isFraudulent && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Potential Fraud Detected</AlertTitle>
                      <AlertDescription>
                        {fraudResult.fraudExplanation}
                      </AlertDescription>
                    </Alert>
                  )}
                  {!fraudResult?.isFraudulent && fraudResult?.fraudExplanation && (
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Transaction Analysis</AlertTitle>
                        <AlertDescription>{fraudResult.fraudExplanation}</AlertDescription>
                    </Alert>
                  )}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmTransfer} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Confirm Transfer
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
