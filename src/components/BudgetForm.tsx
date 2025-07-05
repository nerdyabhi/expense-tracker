'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Budget {
  category: string;
  budget: string | number;
  icon: string;
  spent?: number;
}

interface BudgetFormProps {
  budget?: Budget | null;
  onClose: () => void;
  onSave: (budget: Budget) => void;
}

export function BudgetForm({ budget, onClose, onSave }: BudgetFormProps) {
  const [formData, setFormData] = useState<Budget>({
    category: '',
    budget: '',
    icon: '',
  });

  useEffect(() => {
    if (budget) {
      setFormData(budget);
    }
  }, [budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.budget || !formData.icon) {
      toast.error('Please fill out all fields');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          placeholder="e.g., Food, Shopping"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
          disabled={!!budget} // Disable if editing
        />
      </div>
      <div>
        <Label htmlFor="budget">Monthly Budget ($)</Label>
        <Input
          id="budget"
          type="number"
          step="10"
          placeholder="500"
          value={formData.budget as number}
          onChange={(e) =>
            setFormData({
              ...formData,
              budget: parseFloat(e.target.value) || 0,
            })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="icon">Icon (Emoji)</Label>
        <Input
          id="icon"
          placeholder="e.g., 🍽️, 🛍️"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          required
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Budget
        </Button>
      </div>
    </form>
  );
}
