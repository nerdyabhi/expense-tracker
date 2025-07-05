'use client';

import { StatCard } from './StatCard';
import { Wallet, TrendingUp, PieChart, Target } from 'lucide-react';
import { useMemo } from 'react';

interface Transaction {
  id?: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface StatsGridProps {
  transactions: Transaction[];
  loading: boolean;
}

export function StatsGrid({ transactions, loading }: StatsGridProps) {
  // Calculate real-time statistics from transactions
  const stats = useMemo(() => {
    // console.log('🔢 StatsGrid - Recalculating stats');
    // console.log('🔢 Transactions count:', transactions?.length || 0);
    // console.log('🔢 Sample transaction:', transactions?.[0]);
    // console.log('🔢 Loading state:', loading);

    if (!transactions || transactions.length === 0) {
      console.log('🔢 No transactions found, returning zeros');
      return {
        totalBalance: 0,
        totalExpenses: 0,
        totalIncome: 0,
        transactionCount: 0,
        categoriesCount: 0,
        topCategory: 'None',
        savingsRate: 0,
      };
    }

    // Handle transactions that might not have type or category fields (fallback for existing data)
    const totalExpenses = transactions
      .filter((t) => !t.type || t.type === 'expense') // Treat missing type as expense
      .reduce((acc, t) => acc + t.amount, 0);

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalBalance = totalIncome - totalExpenses;

    console.log('🔢 Total Expenses:', totalExpenses);
    console.log('🔢 Total Income:', totalIncome);
    console.log('🔢 Total Balance:', totalBalance);

    // Calculate spending by category
    const spendingByCategory = transactions
      .filter((t) => !t.type || t.type === 'expense') // Treat missing type as expense
      .reduce((acc, t) => {
        const category = t.category || 'Other'; // Default category for missing category
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });

    const categoriesCount = Object.keys(spendingByCategory).length;

    // Get top spending category
    const topCategoryEntry = Object.entries(spendingByCategory).sort(
      ([, a], [, b]) => b - a
    )[0];
    const topCategory = topCategoryEntry
      ? `${topCategoryEntry[0]} ($${Math.round(topCategoryEntry[1])})`
      : 'None';

    // Calculate savings rate
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      totalBalance,
      totalExpenses,
      totalIncome,
      transactionCount: transactions.length,
      categoriesCount,
      topCategory,
      savingsRate: Math.round(savingsRate),
    };
  }, [transactions, loading]);

  // Calculate this month's data
  const thisMonthStats = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { expenses: 0, count: 0 };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const thisMonthExpenses = thisMonthTransactions
      .filter((t) => !t.type || t.type === 'expense') // Treat missing type as expense
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      expenses: thisMonthExpenses,
      count: thisMonthTransactions.length,
    };
  }, [transactions]);

  const statCards = useMemo(
    () => [
      {
        title: 'Total Balance',
        value: `$${stats.totalBalance.toLocaleString()}`,
        subValue: (
          <>
            <span
              className={
                stats.totalBalance >= 0 ? 'text-emerald-600' : 'text-red-600'
              }
            >
              {stats.totalBalance >= 0 ? '+' : ''}
              {((stats.totalBalance / (stats.totalIncome || 1)) * 100).toFixed(
                1
              )}
              %
            </span>{' '}
            vs total income
          </>
        ),
        icon: Wallet,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        borderColor: 'border-l-emerald-500',
        loading: loading,
      },
      {
        title: 'This Month',
        value: `$${thisMonthStats.expenses.toLocaleString()}`,
        subValue: (
          <>
            <span className="text-blue-600">{thisMonthStats.count}</span>{' '}
            transactions
          </>
        ),
        icon: TrendingUp,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-l-blue-500',
        loading: loading,
      },
      {
        title: 'Categories',
        value: stats.categoriesCount,
        subValue: (
          <>
            Top:{' '}
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {loading ? '...' : stats.topCategory}
            </span>
          </>
        ),
        icon: PieChart,
        iconColor: 'text-slate-600 dark:text-slate-400',
        iconBgColor: 'bg-slate-50 dark:bg-slate-800/50',
        borderColor: 'border-l-slate-500',
        loading: loading,
      },
      {
        title: 'Savings Rate',
        value: `${stats.savingsRate}%`,
        subValue: (
          <>
            <span
              className={
                stats.savingsRate > 20
                  ? 'text-emerald-600'
                  : stats.savingsRate > 10
                  ? 'text-amber-600'
                  : 'text-red-600'
              }
            >
              {stats.savingsRate > 20
                ? 'Excellent'
                : stats.savingsRate > 10
                ? 'Good'
                : 'Needs work'}
            </span>{' '}
            savings rate
          </>
        ),
        icon: Target,
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-l-amber-500',
        loading: loading,
      },
    ],
    [stats, thisMonthStats, loading]
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {statCards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          subValue={card.subValue}
          icon={card.icon}
          iconColor={card.iconColor}
          iconBgColor={card.iconBgColor}
          borderColor={card.borderColor}
          loading={card.loading}
        />
      ))}
    </div>
  );
}
