'use client';

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

// Import components
import { Header } from '@/components/dashboard/Header';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { AnalyticsCard } from '@/components/dashboard/AnalyticsCard';
import { TransactionsCard } from '@/components/dashboard/TransactionsCard';
import { BudgetModal } from '@/components/dashboard/BudgetModal';
import { TransactionModal } from '@/components/dashboard/TransactionModal';

// Import types
import { Transaction, Budget, DashboardData } from '@/types/dashboard';

export default function Dashboard() {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, transactionsRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/transactions?limit=10'),
        ]);

        const dashboard = await dashboardRes.json();
        const transactionsData = await transactionsRes.json();

        setDashboardData(dashboard);
        setTransactions(transactionsData.transactions || []);
        setBudgets(dashboard.budgets || []);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Professional keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'a',
      action: () => {
        setIsAddTransactionOpen(true);
        toast.success('Add Transaction', {
          description: 'Press A anytime to add a transaction',
          icon: '💼',
        });
      },
    },
    {
      key: 'e',
      action: () => {
        toast.success('Export Data', {
          description: 'Press E to export your data',
          icon: '📊',
        });
        handleExportData();
      },
    },
    {
      key: 'b',
      action: () => {
        toast.success('Budget Settings', {
          description: 'Press B to manage budgets',
          icon: '🎯',
        });
        handleSetBudget();
      },
    },
    {
      key: '/',
      action: () => {
        toast.info('Search', {
          description: 'Press / to search transactions',
          icon: '🔍',
        });
      },
    },
    {
      key: 'Escape',
      action: () => {
        if (isAddTransactionOpen) {
          setIsAddTransactionOpen(false);
          toast.info('Modal closed');
        } else if (isBudgetModalOpen) {
          setIsBudgetModalOpen(false);
          toast.info('Budget modal closed');
        }
      },
    },
  ]);

  const handleExportData = () => {
    toast.success('📊 Exporting your transaction data...', {
      description: 'Your CSV file will be ready shortly',
    });
  };

  const handleSetBudget = () => {
    setEditingBudget(null);
    setIsBudgetModalOpen(true);
  };

  const handleEditBudget = (category: string) => {
    const budgetToEdit = budgets.find((b) => b.category === category) || null;
    setEditingBudget(budgetToEdit);
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = (budgetData: Budget) => {
    const existingIndex = budgets.findIndex(
      (b) => b.category === budgetData.category
    );
    if (existingIndex > -1) {
      const updatedBudgets = [...budgets];
      updatedBudgets[existingIndex] = {
        ...updatedBudgets[existingIndex],
        ...budgetData,
      };
      setBudgets(updatedBudgets);
      toast.success('Budget updated successfully!');
    } else {
      setBudgets([...budgets, { ...budgetData, spent: 0 }]);
      toast.success('New budget set successfully!');
    }
    setIsBudgetModalOpen(false);
  };

  const handleDeleteTransaction = (index: number) => {
    const newTransactions = [...transactions];
    newTransactions.splice(index, 1);
    setTransactions(newTransactions);
    toast.success('Transaction deleted');
  };

  const handleEditTransaction = (index: number) => {
    // This would open a modal with the transaction data to edit
    toast.info('Editing transaction ' + (index + 1));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Page Header Section */}
        <div className="mb-6">
          <PageHeader onAddTransaction={() => setIsAddTransactionOpen(true)} />

          {/* Stats Grid */}
          <StatsGrid dashboardData={dashboardData} loading={loading} />
        </div>

        {/* Two Card Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Analytics Card with Tabs */}
          <AnalyticsCard
            dashboardData={dashboardData}
            budgets={budgets}
            onEditBudget={handleEditBudget}
            onSetBudget={handleSetBudget}
            onExportData={handleExportData}
          />

          {/* Transactions Card */}
          <TransactionsCard
            transactions={transactions}
            loading={loading}
            onAddTransaction={() => setIsAddTransactionOpen(true)}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>
      </main>

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        editingBudget={editingBudget}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
      />

      <Toaster richColors closeButton />
    </div>
  );
}
