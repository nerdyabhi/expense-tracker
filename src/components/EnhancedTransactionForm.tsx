'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { transactionSchema, Transaction } from '@/lib/schema';
import { DatePicker } from './DatePicker';


const CATEGORY_KEYWORDS = {
  groceries: ['grocery', 'supermarket', 'walmart', 'target', 'food', 'market'],
  gas: ['gas', 'fuel', 'shell', 'bp', 'exxon', 'chevron', 'station'],
  dining: [
    'restaurant',
    'coffee',
    'starbucks',
    'mcdonald',
    'pizza',
    'cafe',
    'dinner',
    'lunch',
  ],
  entertainment: ['movie', 'cinema', 'netflix', 'spotify', 'game', 'concert'],
  utilities: ['electric', 'water', 'internet', 'phone', 'cable'],
  healthcare: ['doctor', 'hospital', 'pharmacy', 'medicine', 'clinic'],
  shopping: ['amazon', 'clothing', 'shoes', 'electronics'],
  transport: ['uber', 'taxi', 'bus', 'train', 'metro'],
  subscription: ['netflix', 'spotify', 'subscription', 'monthly', 'annual'],
};

// Quick amount suggestions
const QUICK_AMOUNTS = [5, 10, 20, 50];

interface TransactionFormProps {
  onSubmit: (data: Transaction) => void;
  defaultValues?: Transaction;
}

export function EnhancedTransactionForm({
  onSubmit,
  defaultValues,
}: TransactionFormProps) {
  const [suggestedCategory, setSuggestedCategory] = useState<string>('');
  const [showQuickAmounts, setShowQuickAmounts] = useState(true);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues || {
      description: '',
      category: '',
      amount: 0,
      date: new Date().toISOString(),
      type: 'expense',
    },
  });

  const description = form.watch('description');

  // Smart category suggestion based on description
  useEffect(() => {
    if (description) {
      const lowerDesc = description.toLowerCase();
      for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
          setSuggestedCategory(category);
          return;
        }
      }
    }
    setSuggestedCategory('');
  }, [description]);

  // Handle quick amount selection
  const handleQuickAmount = (amount: number) => {
    form.setValue('amount', amount);
    setShowQuickAmounts(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input placeholder="e.g. Coffee at Starbucks" {...field} />
                  {suggestedCategory && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Suggested category:
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {suggestedCategory}
                      </Badge>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Input
                    type="number"
                    placeholder="e.g. 10.50"
                    {...field}
                    onFocus={() => setShowQuickAmounts(true)}
                  />
                  {showQuickAmounts && (
                    <div className="flex gap-2">
                      <span className="text-xs text-muted-foreground self-center">
                        Quick add:
                      </span>
                      {QUICK_AMOUNTS.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAmount(amount)}
                          className="h-8 px-3 text-xs"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date: Date | undefined) => {
                  field.onChange(date ? date.toISOString() : '');
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Transaction
        </Button>
      </form>
    </Form>
  );
}
