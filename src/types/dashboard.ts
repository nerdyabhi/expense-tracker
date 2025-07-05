export interface Transaction {
  id?: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  category: string;
  budget: number;
  spent: number;
}

export interface DashboardSummary {
  balance: number;
  totalExpenses: number;
  transactionCount: number;
  savingsRate: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  spendingByCategory: Record<string, number>;
  budgets?: Budget[];
}
