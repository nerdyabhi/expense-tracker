import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { AddTransaction } from '@/components/AddTransaction';
import { MonthlyBarChart } from '@/components/MonthlyBarChart';
import { TransactionList } from '@/components/TransactionList';
import { TrustSignals } from '@/components/TrustSignals';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  BarChart3,
  Plus,
  List,
  TrendingUp,
  DollarSign,
  Calculator,
} from 'lucide-react';
import { Toaster } from 'sonner';

export default function Home() {
  return (
    <div className="relative">
      {/* Light Mode Background Animation */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(255, 255, 255)"
        gradientBackgroundEnd="rgb(248, 250, 252)"
        firstColor="99, 102, 241"
        secondColor="168, 85, 247"
        thirdColor="59, 130, 246"
        fourthColor="139, 92, 246"
        fifthColor="147, 51, 234"
        pointerColor="99, 102, 241"
        size="70%"
        blendingValue="multiply"
        containerClassName="fixed inset-0 -z-10 dark:hidden"
        interactive={true}
      />

      {/* Dark Mode Background Animation */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(108, 0, 162)"
        gradientBackgroundEnd="rgb(0, 17, 82)"
        firstColor="79, 70, 229"
        secondColor="139, 92, 246"
        thirdColor="59, 130, 246"
        fourthColor="147, 51, 234"
        fifthColor="168, 85, 247"
        pointerColor="79, 70, 229"
        size="80%"
        blendingValue="hard-light"
        containerClassName="fixed inset-0 -z-10 hidden dark:block"
        interactive={true}
      />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <main className="container mx-auto py-12 px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <TextGenerateEffect
              words="Your Money, Visualized"
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            />
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              See where your money goes in seconds with beautiful charts and
              insights
            </p>

            {/* Stats Counter */}
            <div className="flex justify-center items-center gap-2 text-white/60 mb-8">
              <DollarSign className="h-5 w-5" />
              <TextGenerateEffect
                words="$2,847 tracked this month"
                className="text-lg font-medium"
                filter={false}
                duration={0.3}
              />
            </div>

            <div className="flex justify-center">
              <AddTransaction />
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mb-16">
            <TrustSignals />
          </div>

          {/* Bento Grid Layout */}
          <BentoGrid className="max-w-5xl mx-auto gap-6">
            <BentoGridItem
              title="Monthly Expenses"
              description="Track your spending patterns with an interactive bar chart"
              header={
                <div className="w-full h-56 p-2 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm">
                  <MonthlyBarChart />
                </div>
              }
              icon={<BarChart3 className="h-4 w-4 text-indigo-500" />}
              className="md:col-span-2"
            />
            <BentoGridItem
              title="Smart Analytics"
              description="AI-powered insights into your spending habits"
              header={
                <div className="flex items-center justify-center h-48 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-400/5"></div>
                  <div className="text-center relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      +12%
                    </div>
                    <div className="text-sm text-emerald-600/70 dark:text-emerald-400/70 font-medium">
                      vs last month
                    </div>
                  </div>
                </div>
              }
              icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
            />
            <BentoGridItem
              title="Budget Calculator"
              description="Set budgets and track your progress"
              header={
                <div className="flex items-center justify-center h-48 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl border border-orange-100 dark:border-orange-800/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-orange-500/5 dark:bg-orange-400/5"></div>
                  <div className="text-center relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-full mx-auto mb-4">
                      <Calculator className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-1">
                      Smart Budgets
                    </div>
                    <div className="text-sm text-orange-600/70 dark:text-orange-400/70">
                      Coming soon
                    </div>
                  </div>
                </div>
              }
              icon={<Calculator className="h-4 w-4 text-orange-500" />}
            />
            <BentoGridItem
              title="Quick Add Transaction"
              description="Add transactions in seconds with our smart form"
              header={
                <div className="flex items-center justify-center h-48 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-100 dark:border-blue-800/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5"></div>
                  <div className="text-center relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-4">
                      <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
                      Instant Entry
                    </div>
                    <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                      One-click adding
                    </div>
                  </div>
                </div>
              }
              icon={<Plus className="h-4 w-4 text-blue-500" />}
            />
            <BentoGridItem
              title="Recent Transactions"
              description="View, edit, and manage all your transactions"
              header={
                <div className="w-full h-56 p-3 bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-950/30 dark:to-gray-950/30 rounded-xl border border-slate-100 dark:border-slate-800/50 overflow-hidden">
                  <div className="h-full">
                    <TransactionList />
                  </div>
                </div>
              }
              icon={<List className="h-4 w-4 text-slate-500" />}
              className="md:col-span-2"
            />
          </BentoGrid>

          {/* Feature Highlight */}
          <div className="text-center mt-16 text-white/80">
            <TextGenerateEffect
              words="Ready to take control of your finances?"
              className="text-2xl font-semibold mb-4"
              filter={false}
            />
            <p className="text-white/60">
            
              Join thousands of users who have transformed their financial
              habits
            </p>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
