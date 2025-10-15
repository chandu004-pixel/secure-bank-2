// This file implements the fraud detection flow.

'use server';

/**
 * @fileOverview An AI agent for detecting fraudulent transactions.
 *
 * - fraudDetection - A function that handles the fraud detection process.
 * - FraudDetectionInput - The input type for the fraudDetection function.
 * - FraudDetectionOutput - The return type for the fraudDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FraudDetectionInputSchema = z.object({
  transactionAmount: z.number().describe('The amount of the transaction.'),
  transactionFrequency: z
    .number()
    .describe(
      'The frequency of transactions for the user within a specific time period.'
    ),
  recipientHistory: z
    .string()
    .describe(
      'The history of the recipient, including the number of transactions and any flags.'
    ),
});

export type FraudDetectionInput = z.infer<typeof FraudDetectionInputSchema>;

const FraudDetectionOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the transaction is potentially fraudulent.'),
  fraudExplanation:
    z.string().describe('Explanation of why the transaction is flagged as fraudulent.'),
});

export type FraudDetectionOutput = z.infer<typeof FraudDetectionOutputSchema>;

export async function fraudDetection(
  input: FraudDetectionInput
): Promise<FraudDetectionOutput> {
  return fraudDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fraudDetectionPrompt',
  input: {schema: FraudDetectionInputSchema},
  output: {schema: FraudDetectionOutputSchema},
  prompt: `You are an expert in fraud detection for banking transactions.

You will analyze the provided transaction details to determine if the transaction is potentially fraudulent. Consider transaction amount, frequency, and recipient history to make your determination.

Transaction Amount: {{{transactionAmount}}}
Transaction Frequency: {{{transactionFrequency}}}
Recipient History: {{{recipientHistory}}}

Based on this information, determine if the transaction is fraudulent and provide a brief explanation.
Set the isFraudulent field to true if you believe the transaction is fraudulent, otherwise set it to false.  Provide a fraudExplanation in either case.
`,
});

const fraudDetectionFlow = ai.defineFlow(
  {
    name: 'fraudDetectionFlow',
    inputSchema: FraudDetectionInputSchema,
    outputSchema: FraudDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
