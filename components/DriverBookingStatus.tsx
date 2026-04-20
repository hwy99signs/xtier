'use client';

import React, { useTransition } from 'react';
import { CheckCircle, AlertCircle, Clock, Navigation, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateBookingStatus } from '@/actions/driver';

const STATUS_FLOW = [
  'PENDING',
  'EN_ROUTE',
  'ARRIVED',
  'COMPLETED'
];

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Awaiting Pickup',
  EN_ROUTE: 'En Route',
  ARRIVED: 'Arrived at Pickup',
  COMPLETED: 'Trip Completed',
  CANCELLED: 'Cancelled'
};

const STATUS_ICONS: Record<string, any> = {
  PENDING: Clock,
  EN_ROUTE: Navigation,
  ARRIVED: AlertCircle,
  COMPLETED: CheckCircle2,
  CANCELLED: AlertCircle
};

interface DriverBookingStatusProps {
  bookingId: string;
  currentStatus: string;
}

export function DriverBookingStatus({
  bookingId,
  currentStatus,
}: DriverBookingStatusProps) {
  const [isPending, startTransition] = useTransition();

  const getNextStatus = (current: string) => {
    const currentIndex = STATUS_FLOW.indexOf(current);
    if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[currentIndex + 1];
  };

  const nextStatus = getNextStatus(currentStatus);

  const handleUpdate = () => {
    if (!nextStatus || isPending) return;

    startTransition(async () => {
      await updateBookingStatus(bookingId, nextStatus);
    });
  };

  if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
    return (
      <div className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest text-[#555] flex items-center justify-center gap-2 bg-black/20 border border-white/5 rounded-xl">
        {currentStatus === 'COMPLETED' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} className="text-red-500" />}
        {STATUS_LABELS[currentStatus]}
      </div>
    );
  }

  return (
    <button
      onClick={handleUpdate}
      disabled={isPending}
      className={cn(
        "flex-1 btn-gold py-2 text-[10px] flex items-center justify-center gap-1.5 shadow-none transition-all",
        isPending && "opacity-50 cursor-not-allowed"
      )}
    >
      {isPending ? (
        <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      ) : (
        <CheckCircle size={14} />
      )}
      {nextStatus ? `Move to ${STATUS_LABELS[nextStatus]}` : 'Status Finalized'}
    </button>
  );
}
