'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { List, Filter, Calendar, Plus } from 'lucide-react';
import { TransactionItem } from './TransactionItem';

interface Transaction {
  id?: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface TransactionsCardProps {
  transactions: Transaction[];
  loading: boolean;
  onAddTransaction: () => void;
  onEditTransaction: (index: number) => void;
  onDeleteTransaction: (index: number) => void;
}

export function TransactionsCard({
  transactions,
  loading,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <List className="h-5 w-5 text-slate-600" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Calendar className="h-3 w-3 mr-1" />
              Date
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
            >
              All Types
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900"
            >
              Income
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900"
            >
              Expenses
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              This Month
            </Badge>
          </div>
        </div>
        <div className="space-y-3">
          {/* Transaction Table Header */}
          <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {/* Transactions List */}
          <div className="h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-sm text-slate-500">
                    Loading transactions...
                  </div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                    No transactions yet
                  </div>
                  <div className="text-xs text-slate-500">
                    Start tracking your expenses and income
                  </div>
                  <Button
                    onClick={onAddTransaction}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Transaction
                  </Button>
                </div>
              ) : (
                transactions.map((transaction, index) => (
                  <TransactionItem
                    key={transaction.id || index}
                    transaction={transaction}
                    index={index}
                    onEdit={onEditTransaction}
                    onDelete={onDeleteTransaction}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
