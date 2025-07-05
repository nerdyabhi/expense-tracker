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
    <div className="grid grid-cols-12 gap-4 px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group">
      <div className="col-span-5 flex items-center gap-3">
        <div
          className={`h-2 w-2 rounded-full ${
            transaction.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        ></div>
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {transaction.description}
          </p>
          <p className="text-xs text-slate-500 capitalize">
            {transaction.category}
          </p>
        </div>
      </div>
      <div className="col-span-2 text-right">
        <p
          className={`text-sm font-semibold ${
            transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
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
      <div className="col-span-2 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          onClick={() => onEdit(index)}
        >
          <svg
            className="h-3 w-3 text-blue-600"
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
          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDelete(index)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
