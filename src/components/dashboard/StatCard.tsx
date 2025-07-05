'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue: string | ReactNode;
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
      className={`group relative border-l-4 ${borderColor} bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg hover:shadow-slate-200/20 dark:hover:shadow-slate-900/40 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              {loading ? (
                <span className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-8 w-16 block"></span>
              ) : (
                value
              )}
            </p>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {subValue}
            </div>
          </div>
          <div
            className={`h-14 w-14 rounded-xl ${iconBgColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ease-out`}
          >
            <Icon className={`h-7 w-7 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
