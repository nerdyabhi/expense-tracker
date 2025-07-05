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
import { CategoriesList } from './CategoriesList';

interface AnalyticsCardProps {
  dashboardData: any;
  budgets: any[];
  onEditBudget: (category: string) => void;
  onSetBudget: () => void;
  onExportData: () => void;
}

export function AnalyticsCard({
  dashboardData,
  budgets,
  onEditBudget,
  onSetBudget,
  onExportData,
}: AnalyticsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Analytics
            </CardTitle>
            <CardDescription>
              Visual insights into your spending
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="pie-chart">Pie Chart</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="h-80">
              <MonthlyBarChart />
            </div>
          </TabsContent>

          <TabsContent value="pie-chart" className="mt-4">
            <CategoryPieChart data={dashboardData?.spendingByCategory} />
          </TabsContent>

          <TabsContent value="budgets" className="mt-4">
            <BudgetList
              budgets={budgets}
              onEditBudget={onEditBudget}
              onSetBudget={onSetBudget}
              onExportData={onExportData}
            />
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <CategoriesList
              spendingByCategory={dashboardData?.spendingByCategory}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
