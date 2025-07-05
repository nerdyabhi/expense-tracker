'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Transaction {
  id?: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface TransactionItemProps {
  transaction: Transaction;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function TransactionItem({
  transaction,
  index,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  return (
    <div className="group grid grid-cols-12 gap-4 px-4 py-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50">
      <div className="col-span-5 flex items-center gap-3">
        <div
          className={`h-3 w-3 rounded-full shadow-sm ${
            transaction.type === 'income'
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-emerald-200'
              : 'bg-gradient-to-r from-red-400 to-red-500 shadow-red-200'
          }`}
        ></div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {transaction.description}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
            {transaction.category}
          </p>
        </div>
      </div>
      <div className="col-span-2 text-right">
        <p
          className={`text-sm font-semibold ${
            transaction.type === 'income'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {transaction.type === 'income' ? '+' : '-'}$
          {Math.abs(transaction.amount).toFixed(2)}
        </p>
      </div>
      <div className="col-span-3 flex items-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
      <div className="col-span-2 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200 rounded-lg"
          onClick={() => onEdit(index)}
        >
          <svg
            className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400"
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
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:scale-110 transition-all duration-200 rounded-lg"
          onClick={() => onDelete(index)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
