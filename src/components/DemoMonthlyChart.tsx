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
import { useMemo } from 'react';

export function DemoMonthlyChart() {
  // Color palette for different months
  const colorPalette = useMemo(
    () => [
      '#4f46e5', // Indigo
      '#06b6d4', // Cyan
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#8b5cf6', // Violet
    ],
    []
  );

  const demoData = useMemo(
    () => [
      { month: 'Jan', amount: 1250, color: colorPalette[0] },
      { month: 'Feb', amount: 1480, color: colorPalette[1] },
      { month: 'Mar', amount: 1300, color: colorPalette[2] },
      { month: 'Apr', amount: 1780, color: colorPalette[3] },
      { month: 'May', amount: 1600, color: colorPalette[4] },
      { month: 'Jun', amount: 2100, color: colorPalette[5] },
    ],
    [colorPalette]
  );

  const CustomBar = (props: any) => {
    const { payload, x, y, width, height } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={payload.color}
          opacity={0.9}
          rx={4}
          ry={4}
          style={{
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
          }}
        />
      </g>
    );
  };

  return (
    <div className="w-full h-full rounded-lg p-3 backdrop-blur-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={demoData}
          margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
          barCategoryGap="25%"
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
