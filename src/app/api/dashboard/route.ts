import { NextResponse } from 'next/server';
import { transactions, budgets } from '@/lib/data';

export async function GET() {
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome + totalExpenses; // expenses are negative

  const spendingByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) - t.amount;
      return acc;
    }, {} as { [key: string]: number });

  const savingsRate = totalIncome > 0 ? ((totalIncome - (totalExpenses * -1)) / totalIncome) * 100 : 0;

  return NextResponse.json({
    summary: {
      balance: balance,
      totalExpenses: totalExpenses * -1,
      transactionCount: transactions.length,
      savingsRate: Math.round(savingsRate),
    },
    spendingByCategory,
    budgets
  });
}
