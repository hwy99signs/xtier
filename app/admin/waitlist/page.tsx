import React from 'react';
import { prisma } from '@/lib/prisma';
import { updateSubscriberStatus } from '@/actions/admin';
import Link from 'next/link';
import { ListFilter, MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export default async function AdminWaitlistPage() {
  const waitlisted = await prisma.subscriber.findMany({
    where: { status: 'WAITLISTED' },
    include: { user: true, zone: true },
    orderBy: { createdAt: 'asc' }, // FIFO promotion
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Waitlist Management</h1>
          <p className="text-[#A0A0A0] text-sm mt-1">Out-of-capacity or out-of-zone requests queued for future consideration.</p>
        </div>
        <span className="px-4 py-2 bg-blue-400/10 text-blue-400 border border-blue-400/30 rounded-full font-bold text-sm">
          {waitlisted.length} in Queue
        </span>
      </div>

      {waitlisted.length === 0 ? (
        <div className="card-glass p-20 border-[#1e1e1e] flex flex-col items-center gap-4 opacity-40">
          <ListFilter size={48} className="text-[#D4AF37]" />
          <p className="text-sm uppercase tracking-widest font-bold">Waitlist is empty</p>
        </div>
      ) : (
        <div className="card-glass border-[#1e1e1e] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e1e] text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold bg-black/30">
                <th className="px-8 py-4 text-left">Queue #</th>
                <th className="px-8 py-4 text-left">Member</th>
                <th className="px-8 py-4 text-left">Route</th>
                <th className="px-8 py-4 text-left">Est. Price</th>
                <th className="px-8 py-4 text-left">Submitted</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0f0f0f]">
              {waitlisted.map((sub, idx) => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-4">
                    <span className="text-[#D4AF37] font-display font-bold text-lg">#{idx + 1}</span>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-sm font-bold group-hover:text-[#D4AF37] transition-colors">
                      {sub.user.firstName} {sub.user.lastName}
                    </p>
                    <p className="text-[10px] text-[#555]">{sub.user.email}</p>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2 text-[#A0A0A0]">
                      <MapPin size={12} className="text-[#D4AF37]" />
                      <span className="text-xs">{sub.pickupZip} → IAH</span>
                    </div>
                    <p className="text-[10px] text-[#555] mt-0.5">{sub.zone?.name ?? 'No zone'}</p>
                  </td>
                  <td className="px-8 py-4 text-sm font-bold text-white">{formatCurrency(sub.estimatedPrice ?? 0)}</td>
                  <td className="px-8 py-4 text-sm text-[#666]">
                    {formatDate(sub.createdAt)}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <form action={async () => { 'use server'; await updateSubscriberStatus(sub.id, 'APPROVED'); }}>
                        <button type="submit"
                          className="px-3 py-1.5 bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 rounded-lg text-xs font-bold hover:bg-emerald-400/20 transition-all">
                          Promote
                        </button>
                      </form>
                      <Link href={`/admin/subscribers/${sub.id}`}
                        className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest hover:underline inline-flex items-center gap-1">
                        View <ArrowRight size={12} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
