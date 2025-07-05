'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface CategoryPieChartProps {
  data?: Record<string, number>;
}

export function CategoryPieChart({ data = {} }: CategoryPieChartProps) {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#F97316', // orange
    '#06B6D4', // cyan
    '#84CC16', // lime
  ];

  const chartData: PieChartData[] = Object.entries(data).map(
    ([category, amount], index) => ({
      name: category,
      value: amount,
      color: colors[index % colors.length],
    })
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium text-slate-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            ${data.value.toFixed(2)} (
            {(
              (data.value /
                chartData.reduce((acc, item) => acc + item.value, 0)) *
              100
            ).toFixed(1)}
            %)
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-slate-100 dark:from-blue-900/20 dark:to-slate-800 flex items-center justify-center">
            <PieChartIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              No Data Available
            </h3>
            <p className="text-sm text-slate-500">
              Add some transactions to see category distribution
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => (
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {value} (${entry.payload.value.toFixed(0)})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
