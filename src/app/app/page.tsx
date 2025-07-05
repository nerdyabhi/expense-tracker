'use client';

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

// Import server actions
import { deleteTransaction } from '@/app/actions';

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
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  // Fetch dashboard data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, transactionsRes, allTransactionsRes] =
        await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/transactions?limit=10'), // For recent transactions display
          fetch('/api/transactions'), // All transactions for analytics
        ]);

      const dashboard = await dashboardRes.json();
      const transactionsData = await transactionsRes.json();
      const allTransactionsData = await allTransactionsRes.json();

      console.log('🔍 Dashboard data:', dashboard);
      console.log(
        '🔍 Limited transactions:',
        transactionsData.transactions?.length || 0
      );
      console.log(
        '🔍 All transactions:',
        allTransactionsData.transactions?.length || 0
      );
      console.log(
        '🔍 Sample transaction:',
        allTransactionsData.transactions?.[0]
      );

      setDashboardData(dashboard);
      setTransactions(transactionsData.transactions || []);
      setAllTransactions(allTransactionsData.transactions || []);
      setBudgets(dashboard.budgets || []);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Handler for adding a new transaction
  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  // Handler for editing a transaction
  const handleEditTransaction = (index: number) => {
    const transaction = transactions[index];
    if (transaction) {
      setEditingTransaction(transaction);
      setIsTransactionModalOpen(true);
    }
  };

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

  const handleDeleteTransaction = async (index: number) => {
    const transaction = transactions[index];
    if (!transaction || !transaction.id) {
      toast.error('Cannot delete transaction: Missing ID');
      return;
    }

    try {
      const result = await deleteTransaction(transaction.id);

      if (result.success) {
        // Remove from both transaction arrays
        const newTransactions = transactions.filter((_, i) => i !== index);
        const newAllTransactions = allTransactions.filter(
          (t) => t.id !== transaction.id
        );
        setTransactions(newTransactions);
        setAllTransactions(newAllTransactions);
        toast.success('Transaction deleted successfully');

        // Refresh dashboard data after deletion
        fetchData();
      } else {
        toast.error(result.message || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting the transaction');
    }
  };

  const handleTransactionSuccess = async (
    newOrUpdatedTransaction: Transaction
  ) => {
    if (editingTransaction) {
      // Optimistically update the list for an edited transaction
      setAllTransactions(
        allTransactions.map((t) =>
          t.id === newOrUpdatedTransaction.id ? newOrUpdatedTransaction : t
        )
      );
      setTransactions(
        transactions.map((t) =>
          t.id === newOrUpdatedTransaction.id ? newOrUpdatedTransaction : t
        )
      );
    } else {
      // Optimistically add the new transaction to the top of the list
      setAllTransactions([newOrUpdatedTransaction, ...allTransactions]);
      setTransactions([newOrUpdatedTransaction, ...transactions]);
    }

    // Fetch fresh data in the background to ensure consistency
    fetchData();

    // Reset editing state
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/50 to-slate-100/50 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-900/50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.15)_1px,transparent_0)] [background-size:20px_20px] pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Page Header Section */}
        <div className="mb-8">
          <PageHeader
            onAddTransaction={() => {
              setEditingTransaction(null);
              setIsTransactionModalOpen(true);
            }}
          />

          {/* Stats Grid */}
          <StatsGrid
            // dashboardData={dashboardData}
            transactions={allTransactions}
            loading={loading}
          />
        </div>

        {/* Two Card Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Analytics Card with Tabs */}
          <AnalyticsCard
            dashboardData={dashboardData}
            budgets={budgets}
            transactions={allTransactions}
            onEditBudget={handleEditBudget}
            onSetBudget={handleSetBudget}
            onExportData={handleExportData}
          />

          {/* Transactions Card */}
          <TransactionsCard
            transactions={transactions}
            budgets={budgets}
            loading={loading}
            onAddTransaction={() => {
              setEditingTransaction(null);
              setIsTransactionModalOpen(true);
            }}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onBudgetUpdate={fetchData}
          />
        </div>
      </main>

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        editingBudget={editingBudget}
        onClose={() => setIsBudgetModalOpen(false)}
        onSuccess={handleSaveBudget}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        editingTransaction={editingTransaction}
        onSuccess={handleTransactionSuccess}
      />

      <Toaster richColors closeButton />
    </div>
  );
}
