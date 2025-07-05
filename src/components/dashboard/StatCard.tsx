'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  borderColor: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  subValue,
  icon: Icon,
  iconColor,
  iconBgColor,
  borderColor,
  loading = false,
}: StatCardProps) {
  return (
    <Card
      className={`border-l-4 ${borderColor} hover:shadow-md transition-shadow`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading ? '...' : value}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subValue}
            </p>
          </div>
          <div
            className={`h-12 w-12 rounded-lg ${iconBgColor} flex items-center justify-center`}
          >
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
