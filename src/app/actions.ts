"use server";

import { fraudDetection, FraudDetectionInput } from "@/ai/flows/fraud-detection";
import { z } from "zod";

const TransferSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  recipientAccount: z.string().min(8, "Invalid account number"),
  reason: z.string().optional(),
});

// This is a simplified server action.
// In a real application, you would fetch user-specific data from your database.
export async function checkFraud(data: z.infer<typeof TransferSchema>) {
  // Mock data for the fraud detection model
  const mockData = {
    transactionFrequency: Math.floor(Math.random() * 10) + 1, // Random frequency between 1 and 10
    recipientHistory: Math.random() > 0.5 ? "New recipient" : "Existing recipient, 5 previous transactions",
  };

  const fraudCheckInput: FraudDetectionInput = {
    transactionAmount: data.amount,
    transactionFrequency: mockData.transactionFrequency,
    recipientHistory: mockData.recipientHistory,
  };
  
  try {
    const result = await fraudDetection(fraudCheckInput);
    return { success: true, ...result };
  } catch (error) {
    console.error("Fraud detection failed:", error);
    return { success: false, isFraudulent: true, fraudExplanation: 'Could not perform fraud check. Proceed with caution.' };
  }
}
