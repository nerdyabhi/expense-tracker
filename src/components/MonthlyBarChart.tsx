'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState, useMemo } from 'react';
import { Transaction } from '@/types/dashboard';
import { format } from 'date-fns';

interface MonthlyBarChartProps {
  transactions?: Transaction[];
  demo?: boolean;
}

export function MonthlyBarChart({
  transactions = [],
  demo = false,
}: MonthlyBarChartProps) {
  const [data, setData] = useState<
    { month: string; amount: number; color: string }[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // Color palette for different months
  const colorPalette = [
    '#4f46e5', // Indigo
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#84cc16', // Lime
    '#f97316', // Orange
    '#6366f1', // Blue
    '#14b8a6', // Teal
    '#a855f7', // Purple
  ];

  const demoData = useMemo(
    () => [
      { month: 'Jan', amount: 1200, color: colorPalette[0] },
      { month: 'Feb', amount: 1500, color: colorPalette[1] },
      { month: 'Mar', amount: 1300, color: colorPalette[2] },
      { month: 'Apr', amount: 1800, color: colorPalette[3] },
      { month: 'May', amount: 1600, color: colorPalette[4] },
      { month: 'Jun', amount: 2100, color: colorPalette[5] },
    ],
    [colorPalette]
  );

  // Calculate chart data from transactions prop
  const chartData = useMemo(() => {
    console.log('📊 MonthlyBarChart - Calculating chart data');
    console.log('📊 Transactions received:', transactions?.length || 0);
    console.log('📊 Sample transaction:', transactions?.[0]);

    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Group transactions by month
    const monthlyData = transactions.reduce(
      (acc: { [key: string]: number }, transaction: Transaction) => {
        // Handle different date formats
        let transactionDate;
        try {
          transactionDate = new Date(transaction.date);
          // Check if the date is valid
          if (isNaN(transactionDate.getTime())) {
            console.warn('Invalid date:', transaction.date);
            return acc;
          }
        } catch (error) {
          console.warn('Error parsing date:', transaction.date, error);
          return acc;
        }

        const month = format(transactionDate, 'MMM yyyy');
        console.log('📊 Processing transaction:', {
          description: transaction.description,
          date: transaction.date,
          parsedDate: transactionDate,
          month,
          amount: transaction.amount,
          type: transaction.type,
        });

        // Only count expenses for the chart (treat missing type as expense)
        if (!transaction.type || transaction.type === 'expense') {
          acc[month] = (acc[month] || 0) + transaction.amount;
        }
        return acc;
      },
      {}
    );

    console.log('📊 Monthly data:', monthlyData);

    // Convert to array format for Recharts with colors
    const result = Object.entries(monthlyData)
      .map(([month, amount], index) => ({
        month,
        amount,
        color: colorPalette[index % colorPalette.length],
      }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );

    console.log('📊 Chart data result:', result);
    return result;
  }, [transactions]);

  useEffect(() => {
    setData(demo ? demoData : chartData);
  }, [chartData, demo, demoData]);

  // Handle bar click for filtering
  const handleBarClick = (data: any) => {
    if (data && data.month) {
      setSelectedMonth(selectedMonth === data.month ? null : data.month);
      // In a real app, this would filter the transaction list
      console.log('Filtering by month:', data.month);
    }
  };

  // Handle bar hover
  const handleBarHover = (data: any) => {
    if (data && data.month) {
      setHoveredMonth(data.month);
    }
  };

  const handleBarLeave = () => {
    setHoveredMonth(null);
  };

  // Custom bar component for individual colors and hover effects
  const CustomBar = (props: any) => {
    const { payload, x, y, width, height } = props;
    const isHovered = hoveredMonth === payload.month;
    const isSelected = selectedMonth === payload.month;

    const barColor = payload.color;
    const opacity = isSelected ? 1 : isHovered ? 0.8 : 0.9;
    const scale = isHovered ? 1.05 : 1;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={barColor}
          opacity={opacity}
          rx={4}
          ry={4}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center bottom',
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
            filter: isHovered
              ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
              : 'none',
          }}
          onClick={() => handleBarClick(payload)}
          onMouseEnter={() => handleBarHover(payload)}
          onMouseLeave={handleBarLeave}
        />
        {isHovered && (
          <text
            x={x + width / 2}
            y={y - 8}
            textAnchor="middle"
            fill={barColor}
            fontSize="12"
            fontWeight="bold"
          >
            ${payload.amount.toFixed(0)}
          </text>
        )}
      </g>
    );
  };

  if (data.length === 0) {
    return (
      <div className="w-full h-full rounded-lg flex items-center justify-center backdrop-blur-sm">
        <div className="text-center">
          <div className="text-slate-600 dark:text-slate-400 mb-1 font-medium">
            No data yet
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-500">
            Add your first transaction to see the chart
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg p-3 backdrop-blur-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 15, right: 15, left: 15, bottom: 25 }}
          barCategoryGap="25%"
          onMouseLeave={handleBarLeave}
        >
          <CartesianGrid
            strokeDasharray="2 2"
            stroke="#e2e8f0"
            opacity={0.4}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: '#475569',
              fontWeight: 500,
            }}
            height={25}
          />
          <YAxis hide />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-50/95 dark:bg-slate-900/95 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-xl backdrop-blur-md">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">
                      {label}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: data.color }}
                      ></div>
                      <span className="text-slate-600 dark:text-slate-300 text-sm">
                        Amount:{' '}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          ${data.amount.toFixed(2)}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="amount" shape={<CustomBar />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
