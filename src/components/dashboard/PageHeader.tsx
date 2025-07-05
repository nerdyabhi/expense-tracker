'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  onAddTransaction: () => void;
}

export function PageHeader({ onAddTransaction }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Financial Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Monitor your expenses and income
        </p>
      </div>
      <Button
        onClick={onAddTransaction}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Transaction
        <kbd className="ml-2 px-1.5 py-0.5 bg-blue-700/50 rounded text-xs font-mono border border-blue-500/50">
          A
        </kbd>
      </Button>
    </div>
  );
}
