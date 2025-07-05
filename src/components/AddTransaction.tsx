'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MovingBorderButton } from '@/components/ui/moving-border';
import { EnhancedTransactionForm as TransactionForm } from './EnhancedTransactionForm';
import { addTransaction } from '@/app/actions';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function AddTransaction() {
  const [open, setOpen] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'a',
      action: () => setOpen(true),
    },
    {
      key: 'Escape',
      action: () => setOpen(false),
    },
  ]);

  const handleSubmit = async (data: any) => {
    const result = await addTransaction(data);
    if (result.success) {
      toast.success('Transaction added successfully');
      setOpen(false);
      // Refresh the page to update the data
      window.location.reload();
    } else {
      toast.error('Failed to add transaction');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MovingBorderButton
          borderRadius="1.75rem"
          className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
          containerClassName="h-12 w-48"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Start Tracking
          </div>
        </MovingBorderButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new transaction</DialogTitle>
          <DialogDescription>
            Fill in the details of your transaction below.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
