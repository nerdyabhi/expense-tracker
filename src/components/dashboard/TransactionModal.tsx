'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit3 } from 'lucide-react';
import { SimpleTransactionForm } from '@/components/SimpleTransactionForm';
import { Transaction } from '@/types/dashboard';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
  onSuccess?: (transaction: Transaction) => void;
}

export function TransactionModal({
  isOpen,
  onClose,
  editingTransaction = null,
  onSuccess,
}: TransactionModalProps) {
  if (!isOpen) return null;

  const isEditing = !!editingTransaction;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="relative w-full max-w-lg shadow-2xl border-0 bg-white dark:bg-slate-900">
        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  isEditing
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                    : 'bg-gradient-to-r from-blue-600 to-slate-700'
                }`}
              >
                {isEditing ? (
                  <Edit3 className="h-5 w-5 text-white" />
                ) : (
                  <Plus className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {isEditing ? 'Edit Transaction' : 'Add Transaction'}
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? 'Update your transaction details'
                    : 'Record a new expense or income entry'}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <SimpleTransactionForm
            onClose={onClose}
            transaction={editingTransaction}
            onSuccess={onSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
