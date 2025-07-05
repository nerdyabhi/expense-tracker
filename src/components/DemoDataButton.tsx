'use client';

import { addTransaction } from '@/app/actions';
import { Transaction } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DEMO_TRANSACTIONS: Omit<Transaction, 'id'>[] = [
  { description: 'Coffee at Starbucks', amount: 5.5, date: new Date() },
  {
    description: 'Grocery shopping',
    amount: 67.89,
    date: new Date(Date.now() - 86400000),
  },
  {
    description: 'Gas station',
    amount: 45.0,
    date: new Date(Date.now() - 172800000),
  },
  {
    description: 'Netflix subscription',
    amount: 15.99,
    date: new Date(Date.now() - 259200000),
  },
  {
    description: 'Dinner at restaurant',
    amount: 32.5,
    date: new Date(Date.now() - 345600000),
  },
];

interface DemoDataButtonProps {
  onDataAdded?: () => void;
}

export function DemoDataButton({ onDataAdded }: DemoDataButtonProps) {
  const handleAddDemoData = async () => {
    try {
      const promises = DEMO_TRANSACTIONS.map((transaction) =>
        addTransaction(transaction)
      );

      await Promise.all(promises);

      toast.success('Demo data added successfully!');
      onDataAdded?.();
    } catch (error) {
      toast.error('Failed to add demo data');
    }
  };

  return (
    <Button variant="outline" onClick={handleAddDemoData} className="mt-4">
      Add Demo Data
    </Button>
  );
}
