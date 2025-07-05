'use server';

import { z } from 'zod';
import { transactionSchema, Transaction } from '@/lib/schema';
import mongoose, { Document, model, models, Schema } from 'mongoose';

// Define the Mongoose document interface
interface ITransaction extends Transaction, Document {}

// Define the Mongoose schema
const TransactionSchema = new Schema<ITransaction>(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

// Create the Mongoose model
const TransactionModel = models.Transaction || model<ITransaction>('Transaction', TransactionSchema);

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  // Ensure you have MONGODB_URI in your .env.local file
  return mongoose.connect(process.env.MONGODB_URI as string);
}

// Server Action to add a transaction
export async function addTransaction(data: Transaction) {
  try {
    await connectToDatabase();
    const validatedData = transactionSchema.parse(data);
    const transaction = new TransactionModel(validatedData);
    await transaction.save();
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten() };
    }
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

// Server Action to get all transactions
export async function getTransactions() {
  try {
    await connectToDatabase();
    const transactions = await TransactionModel.find().sort({ date: -1 });
    return JSON.parse(JSON.stringify(transactions)) as Transaction[];
  } catch (error) {
    return [];
  }
}

// Server Action to delete a transaction
export async function deleteTransaction(id: string) {
  try {
    await connectToDatabase();
    await TransactionModel.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to delete transaction.' };
  }
}

// Server Action to edit a transaction
export async function editTransaction(id: string, data: Transaction) {
  try {
    await connectToDatabase();
    const validatedData = transactionSchema.parse(data);
    await TransactionModel.findByIdAndUpdate(id, validatedData);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten() };
    }
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
