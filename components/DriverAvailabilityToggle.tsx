'use client';

import React, { useState, useTransition } from 'react';
import { Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateDriverAvailability } from '@/actions/driver';

interface DriverAvailabilityToggleProps {
  driverId: string;
  initialAvailability: boolean;
}

export function DriverAvailabilityToggle({
  driverId,
  initialAvailability,
}: DriverAvailabilityToggleProps) {
  const [isAvailable, setIsAvailable] = useState(initialAvailability);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (newAvailability: boolean) => {
    if (newAvailability === isAvailable) return;

    // Optimistic update
    setIsAvailable(newAvailability);

    startTransition(async () => {
      const result = await updateDriverAvailability(driverId, newAvailability);
      if (!result.success) {
        // Rollback on failure
        setIsAvailable(!newAvailability);
      }
    });
  };

  return (
    <div className="flex bg-[#0A0A0A] border border-[#1a1a1a] rounded-2xl p-1.5 w-fit">
      <button
        onClick={() => handleToggle(true)}
        disabled={isPending}
        className={cn(
          "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
          isAvailable
            ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
            : "text-[#555] hover:text-[#A0A0A0]"
        )}
      >
        <Power size={14} /> Available
      </button>
      <button
        onClick={() => handleToggle(false)}
        disabled={isPending}
        className={cn(
          "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
          !isAvailable
            ? "bg-red-500/20 text-red-500 border border-red-500/30"
            : "text-[#555] hover:text-red-400/60"
        )}
      >
        Offline
      </button>
    </div>
  );
}
