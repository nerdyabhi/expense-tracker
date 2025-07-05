'use client';

import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { Budget } from '@/types/dashboard';
import { addOrUpdateBudget } from '@/app/actions';

interface BudgetFormProps {
  onClose?: () => void;
  budget?: Budget | null;
  onSuccess?: (budget: Budget) => void;
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

export function BudgetForm({
  onClose,
  budget = null,
  onSuccess,
}: BudgetFormProps) {
  const isEditing = !!budget;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    category: '',
    budget: '',
  });

  // Initialize form with budget data when editing
  useEffect(() => {
    if (budget) {
      setFormData({
        id: budget.id || '',
        category: budget.category || '',
        budget: String(budget.budget || ''),
      });
    }
  }, [budget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert form data to budget object
      const budgetData: Budget = {
        category: formData.category,
        budget: parseFloat(formData.budget),
        spent: 0, // Will be calculated server-side
      };

      if (isEditing && formData.id) {
        budgetData.id = formData.id;
      }

      // Call server action to add/update budget
      const result = await addOrUpdateBudget(budgetData);

      if (result.success) {
        toast.success(
          `Budget ${isEditing ? 'updated' : 'created'} successfully!`
        );

        // Call success callback with updated data
        if (onSuccess && result.budget) {
          onSuccess(result.budget);
        }

        // Reset form and close modal
        if (!isEditing) {
          setFormData({
            id: '',
            category: '',
            budget: '',
          });
        }

        onClose?.();
      } else {
        toast.error(
          result.message ||
            `Failed to ${isEditing ? 'update' : 'create'} budget`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} budget`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            {expenseCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="budget">
          Monthly Budget Amount <span className="text-red-500">*</span>
        </Label>
        <Input
          id="budget"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.budget}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, budget: e.target.value }))
          }
          required
          className="h-10"
          disabled={isLoading}
        />
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
          disabled={isLoading || !formData.category || !formData.budget}
          className={`flex-1 ${
            isEditing
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
          }`}
        >
          {isLoading
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
            ? 'Update Budget'
            : 'Create Budget'}
        </Button>
      </div>
    </form>
  );
}
