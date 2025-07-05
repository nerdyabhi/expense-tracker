'use client';

import Link from 'next/link';
import { ArrowLeft, DollarSign, Keyboard, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DemoDataButton } from '@/components/DemoDataButton';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900 dark:text-white">
                  Financial Dashboard
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Expense Tracker
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <Keyboard className="h-3 w-3" />
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-[10px] font-mono border border-slate-300 dark:border-slate-600">
                A
              </kbd>
              <span>add transaction</span>
            </div>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Search className="h-4 w-4" />
            </Button>
            <DemoDataButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
