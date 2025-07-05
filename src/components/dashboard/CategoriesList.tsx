'use client';

interface CategoriesListProps {
  spendingByCategory: Record<string, number> | undefined;
}

export function CategoriesList({ spendingByCategory }: CategoriesListProps) {
  if (!spendingByCategory || Object.keys(spendingByCategory).length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-sm text-slate-500">No category data available</div>
      </div>
    );
  }

  const totalSpending = Object.values(spendingByCategory).reduce(
    (sum, val) => sum + (val as number),
    0
  );

  return (
    <div className="h-80 space-y-3 overflow-y-auto">
      {Object.entries(spendingByCategory)
        .sort(([, a], [, b]) => (b as number) - (a as number)) // Sort by amount
        .map(([category, amount], index) => {
          const percentage =
            totalSpending > 0 ? ((amount as number) / totalSpending) * 100 : 0;
          const colors = [
            'bg-blue-500',
            'bg-emerald-500',
            'bg-amber-500',
            'bg-red-500',
            'bg-purple-500',
          ];
          const color = colors[index % colors.length];

          return (
            <div
              key={category}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${color}`}></div>
                </div>
                <div>
                  <p className="text-sm font-medium">{category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  ${(amount as number).toFixed(2)}
                </p>
                <p className="text-xs text-slate-500">
                  {percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
