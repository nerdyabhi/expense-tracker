'use client';

import { Button } from '@/components/ui/button';
import { Target, Download } from 'lucide-react';

interface Budget {
  category: string;
  budget: number;
  spent: number;
}

interface BudgetListProps {
  budgets: Budget[];
  onEditBudget: (category: string) => void;
  onSetBudget: () => void;
  onExportData: () => void;
}

export function BudgetList({
  budgets,
  onEditBudget,
  onSetBudget,
  onExportData,
}: BudgetListProps) {
  return (
    <div className="h-80 space-y-4 overflow-y-auto">
      {budgets.map((budget) => {
        const percentage = (budget.spent / budget.budget) * 100;
        const isOverBudget = percentage > 100;

        return (
          <div
            key={budget.category}
            className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {budget.category}
                  </span>
                  <p className="text-xs text-slate-500">Monthly budget</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${
                    isOverBudget
                      ? 'text-red-600'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ${budget.spent} / ${budget.budget}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onEditBudget(budget.category)}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-2">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isOverBudget
                    ? 'bg-red-500'
                    : percentage > 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <p
                className={`text-xs ${
                  isOverBudget
                    ? 'text-red-600'
                    : percentage > 80
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {isOverBudget
                  ? `${(percentage - 100).toFixed(1)}% over budget`
                  : `${(100 - percentage).toFixed(1)}% remaining`}
              </p>
              <span className="text-xs text-slate-500">
                ${(budget.budget - budget.spent).toFixed(0)} left
              </span>
            </div>
          </div>
        );
      })}

      <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onSetBudget}
          >
            <Target className="h-4 w-4 mr-2" />
            Set New Budget
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Budgets
          </Button>
        </div>
      </div>
    </div>
  );
}
