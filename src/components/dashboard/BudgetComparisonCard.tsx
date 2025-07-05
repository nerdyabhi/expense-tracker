'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface Budget {
  category: string;
  budget: number;
  spent: number;
}

interface BudgetComparisonCardProps {
  budgets: Budget[];
}

interface ChartData {
  name: string;
  spent: number;
  budget: number;
  percentSpent: number;
  overBudget: boolean;
}

export function BudgetComparisonCard({ budgets }: BudgetComparisonCardProps) {
  // Prepare data for chart
  const chartData = budgets.map((budget) => {
    const percentSpent = (budget.spent / budget.budget) * 100;
    return {
      name: budget.category,
      spent: budget.spent,
      budget: budget.budget,
      percentSpent: Math.min(percentSpent, 150), // Cap at 150% for visual clarity
      overBudget: percentSpent > 100,
    };
  });

  // Color mapping
  const getBarColor = (entry: ChartData) => {
    if (entry.overBudget) return '#ef4444'; // Red for over budget
    if (entry.percentSpent > 80) return '#f59e0b'; // Amber for close to limit
    return '#10b981'; // Green for under budget
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Budget Overview</CardTitle>
        <CardDescription>
          Compare spending against budget targets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                barSize={20}
                layout="vertical"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.3}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `$${value}`}
                  domain={[0, 'dataMax']}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'budget') return [`$${value}`, 'Budget'];
                    if (name === 'spent') return [`$${value}`, 'Spent'];
                    return [value, name];
                  }}
                  labelFormatter={(value) => `Category: ${value}`}
                />
                <Legend />
                <ReferenceLine x={0} stroke="#666" />
                <Bar
                  dataKey="budget"
                  fill="#94a3b8"
                  name="Budget"
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-budget-${index}`} fillOpacity={0.5} />
                  ))}
                </Bar>
                <Bar
                  dataKey="spent"
                  fill="#4f46e5"
                  name="Spent"
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-spent-${index}`}
                      fill={getBarColor(entry)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-slate-500 mb-2">No budget data available</p>
                <p className="text-sm text-slate-400">
                  Set up your first budget to see the comparison
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t pt-2 border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Over Budget</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
            <span>Near Budget</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></div>
            <span>Under Budget</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
