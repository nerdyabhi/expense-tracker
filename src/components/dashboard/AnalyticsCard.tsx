'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, MoreHorizontal } from 'lucide-react';
import { MonthlyBarChart } from '@/components/MonthlyBarChart';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { BudgetList } from './BudgetList';
import { BudgetComparisonCard } from './BudgetComparisonCard';
import { CategoriesList } from './CategoriesList';
import { useMemo } from 'react';
import { Transaction, Budget, DashboardData } from '@/types/dashboard';

interface AnalyticsCardProps {
  dashboardData: DashboardData | null;
  budgets: Budget[];
  transactions: Transaction[];
  onEditBudget: (category: string) => void;
  onSetBudget: () => void;
  onExportData: () => void;
}

export function AnalyticsCard({
  dashboardData,
  budgets,
  transactions,
  onEditBudget,
  onSetBudget,
  onExportData,
}: AnalyticsCardProps) {
  // Calculate live spending by category from transactions
  const liveSpendingByCategory = useMemo(() => {
    console.log('📊 AnalyticsCard - Calculating spending by category');
    console.log('📊 Transactions received:', transactions?.length || 0);
    console.log('📊 Sample transaction:', transactions?.[0]);

    if (!transactions || transactions.length === 0) {
      return [];
    }

    const spendingMap = transactions
      .filter((t) => !t.type || t.type === 'expense') // Handle missing type
      .reduce((acc, t) => {
        const category = t.category || 'Other';
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });

    const result = Object.entries(spendingMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: 0, // Will be calculated by components
      }))
      .sort((a, b) => b.amount - a.amount);

    console.log('📊 Calculated spending by category:', result);
    return result;
  }, [transactions]);

  // Use live data if available, fallback to dashboard data
  const spendingData = useMemo(() => {
    if (liveSpendingByCategory.length > 0) {
      return liveSpendingByCategory;
    }

    // Ensure fallback data is always an array
    const fallbackData = dashboardData?.spendingByCategory;
    if (Array.isArray(fallbackData)) {
      return fallbackData;
    }

    return [];
  }, [liveSpendingByCategory, dashboardData?.spendingByCategory]);

  // Convert spending data to the format expected by CategoryPieChart
  const pieChartData = useMemo(() => {
    console.log('📊 Converting to pie chart data');
    console.log('📊 SpendingData:', spendingData);

    if (!Array.isArray(spendingData)) {
      console.log('📊 SpendingData is not an array');
      return {};
    }

    const result = spendingData.reduce(
      (
        acc: { [key: string]: number },
        item: { category: string; amount: number }
      ) => {
        if (
          item &&
          typeof item === 'object' &&
          item.category &&
          typeof item.amount === 'number'
        ) {
          acc[item.category] = item.amount;
        }
        return acc;
      },
      {}
    );

    console.log('📊 Pie chart data result:', result);
    return result;
  }, [spendingData]);

  return (
    <Card className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/25 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 transition-all duration-500 ease-out overflow-hidden">
      {/* Subtle animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="relative pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-lg font-semibold">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Analytics
            </CardTitle>
            <CardDescription className="mt-1 text-slate-500 dark:text-slate-400">
              Visual insights into your spending
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200 font-medium"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200 font-medium"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="pie-chart"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200 font-medium"
            >
              Pie Chart
            </TabsTrigger>
            <TabsTrigger
              value="budgets"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200 font-medium"
            >
              Budgets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="h-80 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50">
              <MonthlyBarChart transactions={transactions} />
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50">
              <CategoriesList spendingByCategory={pieChartData} />
            </div>
          </TabsContent>

          <TabsContent value="pie-chart" className="mt-6">
            <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50">
              <CategoryPieChart data={pieChartData} />
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="mt-6">
            <div className="grid gap-4">
              <div className="h-[300px] overflow-hidden rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 p-4">
                <BudgetComparisonCard budgets={budgets} />
              </div>
              <div className="rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 p-4">
                <BudgetList
                  budgets={budgets}
                  onEditBudget={onEditBudget}
                  onSetBudget={onSetBudget}
                  onExportData={onExportData}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
