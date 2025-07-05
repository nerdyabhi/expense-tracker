'use client';

import { StatCard } from './StatCard';
import { Wallet, TrendingUp, PieChart, Target } from 'lucide-react';

interface StatsGridProps {
  dashboardData: any;
  loading: boolean;
}

export function StatsGrid({ dashboardData, loading }: StatsGridProps) {
  // Calculate top spending category
  const getTopCategory = () => {
    if (loading || !dashboardData?.spendingByCategory) return 'None';

    const spending = dashboardData.spendingByCategory;
    const topCategory = Object.entries(spending).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )[0];
    return topCategory
      ? `${topCategory[0]} ($${Math.round(topCategory[1] as number)})`
      : 'None';
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatCard
        title="Total Balance"
        value={`$${dashboardData?.summary?.balance?.toLocaleString() || '0'}`}
        subValue={
          <>
            <span className="text-emerald-600">+8.2%</span> vs last month
          </>
        }
        icon={Wallet}
        iconColor="text-emerald-600 dark:text-emerald-400"
        iconBgColor="bg-emerald-50 dark:bg-emerald-900/20"
        borderColor="border-l-emerald-500"
        loading={loading}
      />

      <StatCard
        title="This Month"
        value={`$${
          dashboardData?.summary?.totalExpenses?.toLocaleString() || '0'
        }`}
        subValue={
          <>
            <span className="text-blue-600">
              {dashboardData?.summary?.transactionCount || 0}
            </span>{' '}
            transactions
          </>
        }
        icon={TrendingUp}
        iconColor="text-blue-600 dark:text-blue-400"
        iconBgColor="bg-blue-50 dark:bg-blue-900/20"
        borderColor="border-l-blue-500"
        loading={loading}
      />

      <StatCard
        title="Categories"
        value={
          loading
            ? '...'
            : Object.keys(dashboardData?.spendingByCategory || {}).length
        }
        subValue={
          <>
            Top:{' '}
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {loading ? '...' : getTopCategory()}
            </span>
          </>
        }
        icon={PieChart}
        iconColor="text-slate-600 dark:text-slate-400"
        iconBgColor="bg-slate-50 dark:bg-slate-800/50"
        borderColor="border-l-slate-500"
        loading={loading}
      />

      <StatCard
        title="Savings Rate"
        value={`${dashboardData?.summary?.savingsRate || 0}%`}
        subValue={
          <>
            <span className="text-amber-600">+3%</span> vs target
          </>
        }
        icon={Target}
        iconColor="text-amber-600 dark:text-amber-400"
        iconBgColor="bg-amber-50 dark:bg-amber-900/20"
        borderColor="border-l-amber-500"
        loading={loading}
      />
    </div>
  );
}
