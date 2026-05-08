import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CreditCard, AlertCircle, CheckCircle2, Clock, ArrowRight, DollarSign } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export default async function AdminPaymentsPage() {
  const subscribers = await prisma.subscriber.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });

  const unpaid = subscribers.filter((s) => s.paymentStatus === 'UNPAID');
  const commitmentPaid = subscribers.filter((s) => s.paymentStatus === 'COMMITMENT_PAID');
  const balanceDue = subscribers.filter((s) => s.paymentStatus === 'BALANCE_DUE');
  const paidInFull = subscribers.filter((s) => s.paymentStatus === 'PAID_IN_FULL');

  const summaryCards = [
    { label: 'Unpaid', count: unpaid.length, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
    { label: 'Commitment Paid', count: commitmentPaid.length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
    { label: 'Balance Due', count: balanceDue.length, icon: CreditCard, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
    { label: 'Paid in Full', count: paidInFull.length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  ];

  const statusStyle: Record<string, string> = {
    UNPAID: 'text-red-400 bg-red-400/10 border-red-400/30',
    COMMITMENT_PAID: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    BALANCE_DUE: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    PAID_IN_FULL: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    REFUNDED: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    FAILED: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Payment Tracking</h1>
        <p className="text-[#A0A0A0] text-sm mt-1">Monitor commitment deposits and outstanding balances per member.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className={cn('card-glass p-5 border', c.bg)}>
            <c.icon size={20} className={cn('mb-3', c.color)} />
            <p className="text-2xl font-display font-bold text-white">{c.count}</p>
            <p className="text-[11px] text-[#666] uppercase tracking-widest font-semibold mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card-glass border-[#1e1e1e] overflow-hidden">
        <div className="px-8 py-5 border-b border-[#1e1e1e]">
          <h2 className="font-display font-bold text-base uppercase tracking-widest">All Payment Records</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e] text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold bg-black/30">
              <th className="px-8 py-4 text-left">Member</th>
              <th className="px-8 py-4 text-left">Est. Fare</th>
              <th className="px-8 py-4 text-left">Commitment</th>
              <th className="px-8 py-4 text-left">Balance Due</th>
              <th className="px-8 py-4 text-left">Status</th>
              <th className="px-8 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0f0f0f]">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-16 text-center opacity-40">
                  <DollarSign size={40} className="text-[#D4AF37] mx-auto mb-3" />
                  <p className="text-xs uppercase tracking-widest font-bold">No payment records yet</p>
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-4">
                    <p className="text-sm font-bold group-hover:text-[#D4AF37] transition-colors">
                      {sub.user.firstName} {sub.user.lastName}
                    </p>
                    <p className="text-[10px] text-[#555]">{sub.user.email}</p>
                  </td>
                  <td className="px-8 py-4 text-sm font-bold text-white">{formatCurrency(sub.estimatedPrice ?? 0)}</td>
                  <td className="px-8 py-4 text-sm text-[#A0A0A0]">{formatCurrency(sub.commitmentPaid ?? 0)}</td>
                  <td className="px-8 py-4 text-sm">
                    <span className={sub.balanceDue && sub.balanceDue > 0 ? 'text-red-400 font-bold' : 'text-[#555]'}>
                      {formatCurrency(sub.balanceDue ?? 0)}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border', statusStyle[sub.paymentStatus] ?? 'text-[#666] bg-white/5 border-white/10')}>
                      {sub.paymentStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <Link href={`/admin/subscribers/${sub.id}`}
                      className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest hover:underline inline-flex items-center gap-1">
                      View <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
