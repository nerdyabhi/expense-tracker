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
import { getTransactions } from '@/app/actions';
import { useEffect, useState } from 'react';
import { Transaction } from '@/lib/schema';
import { format } from 'date-fns';

export function MonthlyBarChart() {
  const [data, setData] = useState<
    { month: string; amount: number; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    async function fetchData() {
      try {
        const transactions = await getTransactions();

        // Group transactions by month
        const monthlyData = transactions.reduce(
          (acc: { [key: string]: number }, transaction: Transaction) => {
            const month = format(new Date(transaction.date), 'MMM yyyy');
            acc[month] = (acc[month] || 0) + transaction.amount;
            return acc;
          },
          {}
        );

        // Convert to array format for Recharts with colors
        const chartData = Object.entries(monthlyData).map(
          ([month, amount], index) => ({
            month,
            amount,
            color: colorPalette[index % colorPalette.length],
          })
        );

        setData(chartData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="w-full h-full bg-white/50 dark:bg-slate-800/50 rounded-lg animate-pulse flex items-center justify-center backdrop-blur-sm">
        <div className="text-slate-500 dark:text-slate-400 text-sm">
          Loading chart...
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-full bg-white/50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
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
    <div className="w-full h-full bg-white/95 dark:bg-slate-900/95 rounded-lg p-3 backdrop-blur-sm border border-white/30 dark:border-slate-700/50">
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
                  <div className="bg-white/98 dark:bg-slate-800/98 p-3 rounded-lg border border-slate-200 dark:border-slate-600 shadow-lg backdrop-blur-sm">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                      {label}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: data.color }}
                      ></div>
                      <span className="text-slate-600 dark:text-slate-300 text-sm">
                        Amount:{' '}
                        <span className="font-bold">
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
