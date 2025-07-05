import { NextResponse } from 'next/server';
import { getTransactions, getBudgets } from '@/app/actions';

export async function GET() {
  try {
    const [transactions, budgets] = await Promise.all([
      getTransactions(),
      getBudgets()
    ]);

    const totalExpenses = transactions
      .filter(t => !t.type || t.type === 'expense') // Treat missing type as expense
      .reduce((acc, t) => acc + t.amount, 0);

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const spendingByCategory = transactions
      .filter(t => !t.type || t.type === 'expense') // Treat missing type as expense
      .reduce((acc, t) => {
        const category = t.category || 'Other'; // Default category for missing category
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return NextResponse.json({
      summary: {
        balance: balance,
        totalExpenses: totalExpenses,
        transactionCount: transactions.length,
        savingsRate: Math.round(savingsRate),
      },
      spendingByCategory,
      budgets
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({
      summary: {
        balance: 0,
        totalExpenses: 0,
        transactionCount: 0,
        savingsRate: 0,
      },
      spendingByCategory: {},
      budgets: []
    }, { status: 500 });
  }
}
