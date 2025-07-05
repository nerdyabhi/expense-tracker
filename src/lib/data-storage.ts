import { promises as fs } from 'fs';
import path from 'path';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
  month: string;
}

export interface UserData {
  transactions: Transaction[];
  budgets: Budget[];
  settings: {
    currency: string;
    dateFormat: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USER_DATA_FILE = path.join(DATA_DIR, 'user-data.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Initialize with default data if file doesn't exist
async function initializeUserData(): Promise<UserData> {
  const defaultData: UserData = {
    transactions: [
      {
        id: '1',
        type: 'expense',
        amount: 25.50,
        description: 'Coffee and breakfast',
        category: 'food',
        date: '2025-01-03',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'expense',
        amount: 120.00,
        description: 'Grocery shopping',
        category: 'food',
        date: '2025-01-02',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'income',
        amount: 3500.00,
        description: 'Monthly salary',
        category: 'salary',
        date: '2025-01-01',
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        type: 'expense',
        amount: 60.00,
        description: 'Gas station',
        category: 'transport',
        date: '2025-01-01',
        createdAt: new Date().toISOString(),
      },
    ],
    budgets: [
      { category: 'food', limit: 1000, spent: 847, month: '2025-01' },
      { category: 'transport', limit: 600, spent: 543, month: '2025-01' },
      { category: 'shopping', limit: 350, spent: 421, month: '2025-01' },
      { category: 'entertainment', limit: 400, spent: 312, month: '2025-01' },
    ],
    settings: {
      currency: 'USD',
      dateFormat: 'YYYY-MM-DD',
    },
  };

  await ensureDataDir();
  await fs.writeFile(USER_DATA_FILE, JSON.stringify(defaultData, null, 2));
  return defaultData;
}

// Read user data
export async function getUserData(): Promise<UserData> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(USER_DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with default data
    return await initializeUserData();
  }
}

// Save user data
export async function saveUserData(data: UserData): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(USER_DATA_FILE, JSON.stringify(data, null, 2));
}

// Add a new transaction
export async function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
  const userData = await getUserData();
  
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  userData.transactions.unshift(newTransaction);
  await saveUserData(userData);
  
  return newTransaction;
}

// Update a transaction
export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
  const userData = await getUserData();
  const index = userData.transactions.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  userData.transactions[index] = { ...userData.transactions[index], ...updates };
  await saveUserData(userData);
  
  return userData.transactions[index];
}

// Delete a transaction
export async function deleteTransaction(id: string): Promise<boolean> {
  const userData = await getUserData();
  const index = userData.transactions.findIndex(t => t.id === id);
  
  if (index === -1) return false;
  
  userData.transactions.splice(index, 1);
  await saveUserData(userData);
  
  return true;
}

// Get transactions with filters
export async function getTransactions(filters?: {
  type?: 'income' | 'expense';
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}): Promise<Transaction[]> {
  const userData = await getUserData();
  let transactions = userData.transactions;

  if (filters) {
    if (filters.type) {
      transactions = transactions.filter(t => t.type === filters.type);
    }
    
    if (filters.category) {
      transactions = transactions.filter(t => t.category === filters.category);
    }
    
    if (filters.dateFrom) {
      transactions = transactions.filter(t => t.date >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      transactions = transactions.filter(t => t.date <= filters.dateTo!);
    }
    
    if (filters.limit) {
      transactions = transactions.slice(0, filters.limit);
    }
  }

  return transactions;
}

// Get spending by category
export async function getSpendingByCategory(month?: string): Promise<Record<string, number>> {
  const userData = await getUserData();
  const currentMonth = month || new Date().toISOString().slice(0, 7);
  
  const expenses = userData.transactions.filter(
    t => t.type === 'expense' && t.date.startsWith(currentMonth)
  );

  const spending: Record<string, number> = {};
  expenses.forEach(transaction => {
    spending[transaction.category] = (spending[transaction.category] || 0) + transaction.amount;
  });

  return spending;
}

// Update budget
export async function updateBudget(category: string, limit: number, month: string): Promise<Budget> {
  const userData = await getUserData();
  const existingBudget = userData.budgets.find(b => b.category === category && b.month === month);
  
  if (existingBudget) {
    existingBudget.limit = limit;
  } else {
    const spending = await getSpendingByCategory(month);
    userData.budgets.push({
      category,
      limit,
      spent: spending[category] || 0,
      month,
    });
  }
  
  await saveUserData(userData);
  return userData.budgets.find(b => b.category === category && b.month === month)!;
}
