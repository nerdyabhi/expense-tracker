import mongoose, { Document, model, models, Schema } from 'mongoose';

// Define the Mongoose document interface
interface ITransaction extends Document {
  description: string;
  category?: string;
  amount: number;
  date: string;
  type?: 'income' | 'expense';
}

// Define the Mongoose schema
const TransactionSchema = new Schema<ITransaction>(
  {
    description: { type: String, required: true },
    category: { type: String },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'] },
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
  return mongoose.connect(process.env.MONGODB_URI as string);
}

// Migration function to add missing fields
async function migrateTransactions() {
  try {
    await connectToDatabase();
    console.log('🔄 Starting transaction migration...');

    // Find all transactions that are missing type or category
    const transactionsToUpdate = await TransactionModel.find({
      $or: [
        { type: { $exists: false } },
        { category: { $exists: false } }
      ]
    });

    console.log(`📊 Found ${transactionsToUpdate.length} transactions to migrate`);

    for (const transaction of transactionsToUpdate) {
      const updates: any = {};

      // Add default type if missing (assume expense for negative amounts, income for positive)
      if (!transaction.type) {
        updates.type = transaction.amount < 0 ? 'income' : 'expense';
        // Convert negative amounts to positive for expenses
        if (updates.type === 'expense' && transaction.amount < 0) {
          updates.amount = Math.abs(transaction.amount);
        }
      }

      // Add default category if missing
      if (!transaction.category) {
        updates.category = transaction.type === 'income' || updates.type === 'income' ? 'other' : 'other';
      }

      if (Object.keys(updates).length > 0) {
        await TransactionModel.findByIdAndUpdate(transaction._id, updates);
        console.log(`✅ Updated transaction ${transaction._id}: ${JSON.stringify(updates)}`);
      }
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateTransactions();
