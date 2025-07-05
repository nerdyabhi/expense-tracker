'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIPS = [
  {
    title: 'Quick Start',
    content:
      'Add your first transaction to see your spending visualized instantly!',
  },
  {
    title: 'Smart Categories',
    content:
      "Type 'coffee' and we'll automatically suggest the 'Dining' category.",
  },
  {
    title: 'Keyboard Shortcuts',
    content: "Press 'A' to quickly add a transaction, 'ESC' to close dialogs.",
  },
  {
    title: 'Monthly Insights',
    content: 'Click on chart bars to filter transactions by specific months.',
  },
  {
    title: 'Quick Amounts',
    content: 'Use quick-add buttons for common amounts like $5, $10, $20.',
  },
];

export function HelpfulTipsCarousel() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % TIPS.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + TIPS.length) % TIPS.length);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <span className="font-medium text-sm">Helpful Tips</span>
      </div>

      <div className="relative h-16 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              {TIPS[currentTip].title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {TIPS[currentTip].content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-1">
          {TIPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTip(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentTip
                  ? 'bg-primary-500'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={prevTip}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextTip}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
