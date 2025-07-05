'use client';

import { MovingBorderButton } from '@/components/ui/moving-border';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AddTransaction() {
  const router = useRouter();

  const handleStartTracking = () => {
    router.push('/app');
  };

  return (
    <MovingBorderButton
      borderRadius="1.75rem"
      className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      containerClassName="h-12 w-48"
      onClick={handleStartTracking}
    >
      <div className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Start Tracking
      </div>
    </MovingBorderButton>
  );
}
