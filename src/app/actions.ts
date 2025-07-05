'use server';

import { z } from 'zod';
import { transactionSchema, budgetSchema, Transaction, Budget } from '@/lib/schema';
import mongoose, { Document, model, models, Schema } from 'mongoose';

// Define the Mongoose document interfaces
interface ITransaction extends Omit<Transaction, 'id'>, Document {}
interface IBudget extends Omit<Budget, 'id'>, Document {}

// Define the Mongoose schemas
const TransactionSchema = new Schema<ITransaction>(
  {
    description: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
  },
  { timestamps: true }
);

const BudgetSchema = new Schema<IBudget>(
  {
    category: { type: String, required: true, unique: true },
    budget: { type: Number, required: true },
    spent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create the Mongoose models
const TransactionModel = models.Transaction || model<ITransaction>('Transaction', TransactionSchema);
const BudgetModel = models.Budget || model<IBudget>('Budget', BudgetSchema);

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(process.env.MONGODB_URI as string);
}

// ============== TRANSACTION ACTIONS ==============

// Server Action to add a transaction
export async function addTransaction(data: Transaction) {
  try {
    await connectToDatabase();
    const validatedData = transactionSchema.parse(data);
    const transaction = new TransactionModel(validatedData);
    const savedTransaction = await transaction.save();
    
    // Update budget spent amount if it's an expense
    if (validatedData.type === 'expense') {
      await updateBudgetSpent(validatedData.category, validatedData.amount);
    }
    
    return { 
      success: true, 
      transaction: {
        ...validatedData,
        id: savedTransaction._id.toString()
      }
    };
  } catch (error) {
    console.error('Add transaction error:', error);
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
    
    return transactions.map(t => ({
      id: t._id.toString(),
      description: t.description,
      category: t.category,
      amount: t.amount,
      date: t.date,
      type: t.type as 'income' | 'expense',
    }));
  } catch (error) {
    console.error('Get transactions error:', error);
    return [];
  }
}

// Server Action to delete a transaction
export async function deleteTransaction(id: string) {
  try {
    await connectToDatabase();
    const transaction = await TransactionModel.findById(id);
    if (!transaction) {
      return { success: false, message: 'Transaction not found.' };
    }
    
    // Update budget spent amount if it was an expense
    if (transaction.type === 'expense') {
      await updateBudgetSpent(transaction.category, -transaction.amount);
    }
    
    await TransactionModel.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    console.error('Delete transaction error:', error);
    return { success: false, message: 'Failed to delete transaction.' };
  }
}

// Server Action to edit a transaction
export async function editTransaction(id: string, data: Transaction) {
  try {
    await connectToDatabase();
    const validatedData = transactionSchema.parse(data);
    const oldTransaction = await TransactionModel.findById(id);
    
    if (!oldTransaction) {
      return { success: false, message: 'Transaction not found.' };
    }
    
    // Revert old budget update if it was an expense
    if (oldTransaction.type === 'expense') {
      await updateBudgetSpent(oldTransaction.category, -oldTransaction.amount);
    }
    
    // Apply new budget update if it's an expense
    if (validatedData.type === 'expense') {
      await updateBudgetSpent(validatedData.category, validatedData.amount);
    }
    
    const result = await TransactionModel.findByIdAndUpdate(id, validatedData, { new: true });
    
    return { 
      success: true, 
      transaction: {
        ...validatedData,
        id: result._id.toString()
      }
    };
  } catch (error) {
    console.error('Edit transaction error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten() };
    }
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

// ============== BUDGET ACTIONS ==============

// Server Action to add or update a budget
export async function addOrUpdateBudget(data: Budget) {
  try {
    await connectToDatabase();
    const validatedData = budgetSchema.parse(data);
    
    // Calculate current spent amount for this category
    const currentSpent = await calculateCategorySpent(validatedData.category);
    
    const result = await BudgetModel.findOneAndUpdate(
      { category: validatedData.category },
      { 
        budget: validatedData.budget,
        spent: currentSpent
      },
      { upsert: true, new: true }
    );
    
    return { 
      success: true, 
      budget: {
        id: result._id.toString(),
        category: result.category,
        budget: result.budget,
        spent: result.spent,
      }
    };
  } catch (error) {
    console.error('Add/Update budget error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten() };
    }
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

// Server Action to get all budgets
export async function getBudgets() {
  try {
    await connectToDatabase();
    const budgets = await BudgetModel.find().sort({ category: 1 });
    
    return budgets.map(b => ({
      id: b._id.toString(),
      category: b.category,
      budget: b.budget,
      spent: b.spent,
    }));
  } catch (error) {
    console.error('Get budgets error:', error);
    return [];
  }
}

// Server Action to delete a budget
export async function deleteBudget(id: string) {
  try {
    await connectToDatabase();
    const result = await BudgetModel.findByIdAndDelete(id);
    if (!result) {
      return { success: false, message: 'Budget not found.' };
    }
    return { success: true };
  } catch (error) {
    console.error('Delete budget error:', error);
    return { success: false, message: 'Failed to delete budget.' };
  }
}

// ============== HELPER FUNCTIONS ==============

// Helper function to update budget spent amount
async function updateBudgetSpent(category: string, amountChange: number) {
  try {
    await BudgetModel.findOneAndUpdate(
      { category },
      { $inc: { spent: amountChange } },
      { upsert: false }
    );
  } catch (error) {
    console.error('Update budget spent error:', error);
  }
}

// Helper function to calculate total spent for a category
async function calculateCategorySpent(category: string): Promise<number> {
  try {
    const transactions = await TransactionModel.find({ 
      category, 
      type: 'expense' 
    });
    
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  } catch (error) {
    console.error('Calculate category spent error:', error);
    return 0;
  }
}

// Server Action to recalculate all budget spent amounts
export async function recalculateBudgetSpent() {
  try {
    await connectToDatabase();
    const budgets = await BudgetModel.find();
    
    for (const budget of budgets) {
      const spent = await calculateCategorySpent(budget.category);
      await BudgetModel.findByIdAndUpdate(budget._id, { spent });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Recalculate budget spent error:', error);
    return { success: false, message: 'Failed to recalculate budget amounts.' };
  }
}
