'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { BudgetForm } from '@/components/BudgetForm';
import { Budget } from '@/types/dashboard';

interface BudgetModalProps {
  isOpen: boolean;
  editingBudget: Budget | null;
  onClose: () => void;
  onSuccess: (budget: Budget) => void;
}

export function BudgetModal({
  isOpen,
  editingBudget,
  onClose,
  onSuccess,
}: BudgetModalProps) {
  if (!isOpen) return null;

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
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-slate-700 flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {editingBudget ? 'Edit' : 'Set'} Budget
                </CardTitle>
                <CardDescription>
                  Manage your monthly spending limits
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
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <BudgetForm
            budget={editingBudget}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
