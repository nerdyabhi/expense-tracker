'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Transaction } from '@/types/dashboard';
import { addTransaction, editTransaction } from '@/app/actions';

interface SimpleTransactionFormProps {
  onClose?: () => void;
  transaction?: Transaction | null;
  onSuccess?: (transaction: Transaction) => void;
}

const expenseCategories = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transportation' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'bills', label: 'Bills & Utilities' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'housing', label: 'Housing & Rent' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other' },
];

const incomeCategories = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investments', label: 'Investments' },
  { value: 'gifts', label: 'Gifts' },
  { value: 'refunds', label: 'Refunds' },
  { value: 'business', label: 'Business' },
  { value: 'other', label: 'Other' },
];

export function SimpleTransactionForm({
  onClose,
  transaction = null,
  onSuccess,
}: SimpleTransactionFormProps) {
  const isEditing = !!transaction;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Initialize form with transaction data when editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        id: transaction.id || '',
        type: transaction.type || 'expense',
        amount: String(transaction.amount || ''),
        description: transaction.description || '',
        category: transaction.category || '',
        date: transaction.date || new Date().toISOString().split('T')[0],
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert form data to transaction object
      const transactionData: Transaction = {
        description: formData.description,
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        type: formData.type as 'income' | 'expense',
      };

      if (isEditing && formData.id) {
        transactionData.id = formData.id;
        // Call server action to edit transaction
        const result = await editTransaction(formData.id, transactionData);

        if (result.success) {
          toast.success('Transaction updated successfully!');
        } else {
          toast.error(result.message || 'Failed to update transaction');
          return;
        }
      } else {
        // Call server action to add transaction
        const result = await addTransaction(transactionData);

        if (result.success) {
          toast.success(
            `${formData.type === 'expense' ? 'Expense' : 'Income'} of $${
              formData.amount
            } added successfully!`
          );
        } else {
          toast.error(result.message || 'Failed to add transaction');
          return;
        }
      }

      // Call success callback with updated data
      if (onSuccess) {
        onSuccess(transactionData);
      }

      // Reset form and close modal
      if (!isEditing) {
        setFormData({
          id: '',
          type: 'expense',
          amount: '',
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
        });
      }

      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} transaction`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get appropriate categories based on transaction type
  const categories =
    formData.type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                type: value,
                // Reset category when changing type
                category: '',
              }))
            }
            disabled={isLoading}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">
            Amount <span className="text-red-500">*</span>
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            required
            className="h-10"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">
          Description <span className="text-red-500">*</span>
        </Label>
        <Input
          id="description"
          placeholder="What was this transaction for?"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
          className="h-10"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            disabled={isLoading}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date">
            Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            required
            className="h-10"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className={`flex-1 ${
            isEditing
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
          }`}
        >
          {isLoading
            ? isEditing
              ? 'Updating...'
              : 'Adding...'
            : isEditing
            ? 'Update Transaction'
            : 'Add Transaction'}
        </Button>
      </div>
    </form>
  );
}
