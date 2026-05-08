import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Route, User, Car, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function AdminRoutesPage() {
  const subscribers = await prisma.subscriber.findMany({
    where: { status: 'APPROVED' },
    include: {
      user: true,
      assignedDriver: { include: { user: true } },
      zone: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const unassigned = subscribers.filter((s) => !s.assignedDriverId);
  const assigned = subscribers.filter((s) => s.assignedDriverId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Route Assignments</h1>
          <p className="text-[#A0A0A0] text-sm mt-1">Manage driver-to-member route density and assignment status.</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="px-3 py-1.5 bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 rounded-full font-bold">
            {assigned.length} Assigned
          </span>
          <span className="px-3 py-1.5 bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-full font-bold">
            {unassigned.length} Unassigned
          </span>
        </div>
      </div>

      {/* Route density matrix */}
      <div className="card-glass border-[#1e1e1e] overflow-hidden">
        <div className="px-8 py-5 border-b border-[#1e1e1e] flex items-center gap-3">
          <Route size={16} className="text-[#D4AF37]" />
          <h2 className="font-display font-bold text-base uppercase tracking-widest">Active Route Matrix</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e] text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold bg-black/30">
              <th className="px-8 py-4 text-left">Member</th>
              <th className="px-8 py-4 text-left">Pickup Zone</th>
              <th className="px-8 py-4 text-left">Direction</th>
              <th className="px-8 py-4 text-left">Assigned Driver</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0f0f0f]">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-16 text-center opacity-40">
                  <Route size={40} className="text-[#D4AF37] mx-auto mb-3" />
                  <p className="text-xs uppercase tracking-widest font-bold">No active approved members yet</p>
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                        {sub.user.firstName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-[#D4AF37] transition-colors">
                          {sub.user.firstName} {sub.user.lastName}
                        </p>
                        <p className="text-[10px] text-[#555]">{sub.pickupZip}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-sm text-[#A0A0A0]">{sub.zone?.name ?? 'Unzoned'}</p>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-xs font-bold text-[#A0A0A0] uppercase">{sub.direction.replace('_', ' ')}</span>
                  </td>
                  <td className="px-8 py-4">
                    {sub.assignedDriver ? (
                      <div className="flex items-center gap-2">
                        <Car size={14} className="text-[#D4AF37]" />
                        <span className="text-sm font-bold text-emerald-400">
                          {sub.assignedDriver.user.firstName} {sub.assignedDriver.user.lastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-400 font-bold">Unassigned</span>
                    )}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <Link href={`/admin/subscribers/${sub.id}`}
                      className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest hover:underline inline-flex items-center gap-1">
                      Manage <ArrowRight size={12} />
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
