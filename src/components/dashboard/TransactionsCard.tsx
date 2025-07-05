'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, List, Filter, Plus, X, Target } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import { BudgetForm } from '@/components/BudgetForm';
import {
  format,
  isThisMonth,
  subMonths,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';

import { Transaction, Budget } from '@/types/dashboard';

interface TransactionsCardProps {
  transactions: Transaction[];
  budgets: Budget[];
  loading: boolean;
  onAddTransaction: () => void;
  onEditTransaction: (index: number) => void;
  onDeleteTransaction: (index: number) => void;
  onBudgetUpdate: () => void;
}

export function TransactionsCard({
  transactions,
  budgets,
  loading,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onBudgetUpdate,
}: TransactionsCardProps) {
  // Filter state
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>(
    'all'
  );
  const [dateFilter, setDateFilter] = useState<'all' | 'thisMonth' | 'custom'>(
    'all'
  );
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

  // Budget state
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Filter transactions based on active filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Type filter
    if (typeFilter !== 'all' && transaction.type !== typeFilter) {
      return false;
    }

    // Date filter
    if (
      dateFilter === 'thisMonth' &&
      !isThisMonth(new Date(transaction.date))
    ) {
      return false;
    }

    if (dateFilter === 'custom' && dateRange.from && dateRange.to) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate < dateRange.from || transactionDate > dateRange.to) {
        return false;
      }
    }

    // Amount filter
    const transactionAmount = Math.abs(transaction.amount);
    if (minAmount && transactionAmount < parseFloat(minAmount)) {
      return false;
    }
    if (maxAmount && transactionAmount > parseFloat(maxAmount)) {
      return false;
    }

    // Category filter
    if (
      categoryFilter &&
      !transaction.category.toLowerCase().includes(categoryFilter.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Handler for the filter button
  const handleFilterClick = () => {
    setIsFilterPopoverOpen(true);
  };

  // Date range handler
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range) return;
    setDateRange(range);
    if (range.from && range.to) {
      setDateFilter('custom');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setTypeFilter('all');
    setDateFilter('all');
    setDateRange({ from: undefined, to: undefined });
    setMinAmount('');
    setMaxAmount('');
    setCategoryFilter('');
  };

  // Format date range for display
  const formatDateRange = () => {
    if (dateFilter === 'thisMonth') return 'This Month';
    if (dateFilter === 'custom' && dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d')} - ${format(
        dateRange.to,
        'MMM d'
      )}`;
    }
    return 'All Time';
  };

  // Preset date ranges
  const setThisMonth = () => {
    setDateFilter('thisMonth');
    setDateRange({ from: undefined, to: undefined });
  };

  const setLastMonth = () => {
    const lastMonth = subMonths(new Date(), 1);
    setDateRange({
      from: startOfMonth(lastMonth),
      to: endOfMonth(lastMonth),
    });
    setDateFilter('custom');
  };

  // Budget handlers
  const handleAddBudget = () => {
    setEditingBudget(null);
    setIsBudgetFormOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setIsBudgetFormOpen(true);
  };

  const handleBudgetSuccess = () => {
    setIsBudgetFormOpen(false);
    setEditingBudget(null);
    onBudgetUpdate();
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-lg font-semibold">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 group-hover:scale-110 transition-transform duration-300">
                <List className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              Transactions & Budgets
            </CardTitle>
            <CardDescription className="mt-1 text-slate-500 dark:text-slate-400">
              Manage your transactions and set budget targets
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative p-6">
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg backdrop-blur-sm">
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200 font-medium"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="budgets"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200 font-medium"
            >
              Budget Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-4">
            <div className="space-y-4">
              {/* Filter Controls */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {typeFilter !== 'all' ||
                  dateFilter !== 'all' ||
                  minAmount ||
                  maxAmount ||
                  categoryFilter
                    ? `Filtered: ${filteredTransactions.length} transaction${
                        filteredTransactions.length !== 1 ? 's' : ''
                      }`
                    : 'Your latest financial activity'}
                </div>
                <div className="flex items-center gap-2">
                  <Popover
                    open={isFilterPopoverOpen}
                    onOpenChange={setIsFilterPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={handleFilterClick}
                      >
                        <Filter className="h-3 w-3 mr-1" />
                        Filter
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm">
                          Filter Transactions
                        </h4>

                        <div className="space-y-2">
                          <Label>Amount Range</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Min"
                              type="number"
                              value={minAmount}
                              onChange={(e) => setMinAmount(e.target.value)}
                              className="w-full"
                            />
                            <span className="text-slate-500">to</span>
                            <Input
                              placeholder="Max"
                              type="number"
                              value={maxAmount}
                              onChange={(e) => setMaxAmount(e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input
                            placeholder="Filter by category"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div className="flex justify-between pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                          >
                            Reset Filters
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setIsFilterPopoverOpen(false)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => setIsDateDialogOpen(true)}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Date
                  </Button>

                  {/* Date Selection Dialog */}
                  <Dialog
                    open={isDateDialogOpen}
                    onOpenChange={setIsDateDialogOpen}
                  >
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Select Date Range</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex gap-2 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDateFilter('all');
                              setDateRange({ from: undefined, to: undefined });
                            }}
                          >
                            All Time
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={setThisMonth}
                          >
                            This Month
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={setLastMonth}
                          >
                            Last Month
                          </Button>
                        </div>
                        <CalendarComponent
                          mode="range"
                          selected={dateRange}
                          onSelect={handleDateRangeSelect}
                          className="rounded-md border"
                        />
                        <Button onClick={() => setIsDateDialogOpen(false)}>
                          Apply Date Range
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Filter Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={typeFilter === 'all' ? 'secondary' : 'outline'}
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                  onClick={() => setTypeFilter('all')}
                >
                  All Types
                </Badge>
                <Badge
                  variant={typeFilter === 'income' ? 'secondary' : 'outline'}
                  className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900"
                  onClick={() => setTypeFilter('income')}
                >
                  Income
                </Badge>
                <Badge
                  variant={typeFilter === 'expense' ? 'secondary' : 'outline'}
                  className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900"
                  onClick={() => setTypeFilter('expense')}
                >
                  Expenses
                </Badge>

                {/* Date filter badge */}
                {dateFilter !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer flex items-center gap-1"
                  >
                    {formatDateRange()}
                    <X
                      className="h-3 w-3 ml-1"
                      onClick={() => {
                        setDateFilter('all');
                        setDateRange({ from: undefined, to: undefined });
                      }}
                    />
                  </Badge>
                )}

                {/* Show reset button if any filter is active */}
                {(typeFilter !== 'all' ||
                  dateFilter !== 'all' ||
                  minAmount ||
                  maxAmount ||
                  categoryFilter) && (
                  <Badge
                    variant="outline"
                    className="cursor-pointer ml-auto hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Badge>
                )}
              </div>

              {/* Transactions List */}
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
                    ) : filteredTransactions.length === 0 ? (
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
                      filteredTransactions.map((transaction, index) => (
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
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Budget Management</h3>
                <Button size="sm" onClick={handleAddBudget}>
                  <Target className="h-4 w-4 mr-1" />
                  Add Budget
                </Button>
              </div>

              <div className="h-80 overflow-y-auto space-y-3">
                {budgets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                      No budgets set
                    </div>
                    <div className="text-xs text-slate-500">
                      Create your first budget to track spending
                    </div>
                    <Button
                      onClick={handleAddBudget}
                      variant="outline"
                      size="sm"
                      className="mt-3"
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Add Budget
                    </Button>
                  </div>
                ) : (
                  budgets.map((budget) => {
                    const percentage =
                      budget.budget > 0
                        ? (budget.spent / budget.budget) * 100
                        : 0;
                    const isOverBudget = percentage > 100;

                    return (
                      <div
                        key={budget.id}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                              {budget.category}
                            </span>
                            <p className="text-xs text-slate-500">
                              Monthly budget
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                isOverBudget
                                  ? 'text-red-600'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              ${budget.spent.toFixed(2)} / $
                              {budget.budget.toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleEditBudget(budget)}
                            >
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Button>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-2">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                              isOverBudget
                                ? 'bg-red-500'
                                : percentage > 80
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-xs ${
                              isOverBudget
                                ? 'text-red-600'
                                : percentage > 80
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {isOverBudget
                              ? `${(percentage - 100).toFixed(1)}% over budget`
                              : `${(100 - percentage).toFixed(1)}% remaining`}
                          </p>
                          <span className="text-xs text-slate-500">
                            ${(budget.budget - budget.spent).toFixed(2)} left
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Budget Form Dialog */}
        <Dialog open={isBudgetFormOpen} onOpenChange={setIsBudgetFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Create New Budget'}
              </DialogTitle>
            </DialogHeader>
            <BudgetForm
              budget={editingBudget}
              onClose={() => setIsBudgetFormOpen(false)}
              onSuccess={handleBudgetSuccess}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
