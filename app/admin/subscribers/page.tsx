import React from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Users
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    include: {
      user: true,
      zone: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Member Directory</h1>
          <p className="text-[#A0A0A0] text-sm mt-1">Manage and audit ERANTT TRANSIT subscriber applications.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-4 bg-black/40 border border-[#222222] px-4 py-2 rounded-xl">
             <Search className="text-[#666666]" size={16} />
             <input type="text" placeholder="Search by name or email..." className="bg-transparent border-none outline-none text-xs w-48" />
          </div>
          <button className="p-2 border border-[#222222] rounded-xl hover:text-[#D4AF37] transition-all">
             <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="card-glass overflow-hidden border-[#222222]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/40 border-b border-[#222222] text-[10px] uppercase tracking-[0.2em] text-[#666666] font-bold">
              <th className="px-8 py-5">Identity</th>
              <th className="px-8 py-5">Service Area</th>
              <th className="px-8 py-5">Pricing</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111111]">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                   <div className="flex flex-col items-center gap-4 opacity-40">
                      <Users size={48} className="text-[#D4AF37]" />
                      <p className="text-sm uppercase tracking-widest font-bold">No Records Identified</p>
                      <Link href="/subscribe" className="text-xs text-[#D4AF37] hover:underline">Manual Addition Unavailable in Alpha</Link>
                   </div>
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#222222] to-[#111111] flex items-center justify-center font-bold text-xs">
                        {sub.user.firstName[0]}{sub.user.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                          {sub.user.firstName} {sub.user.lastName}
                        </p>
                        <p className="text-[10px] text-[#666666]">{sub.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={12} className="text-[#D4AF37]" />
                      <span className="text-xs font-medium text-[#A0A0A0]">{sub.pickupZip} ➔ IAH</span>
                    </div>
                    <p className="text-[10px] text-[#444444] uppercase">{sub.direction}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-white">{formatCurrency(sub.estimatedPrice || 0)}</p>
                    <p className="text-[10px] text-success font-bold">20% Deposit Req</p>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link href={`/admin/subscribers/${sub.id}`}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:underline">
                      <FileText size={14} /> Review
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {subscribers.length > 0 && (
         <div className="flex items-center justify-between text-[#666666] text-[10px] uppercase font-bold tracking-widest px-4">
            <p>Showing {subscribers.length} Executive members</p>
            <div className="flex gap-4">
               <button className="hover:text-[#D4AF37]">Previous</button>
               <button className="hover:text-[#D4AF37]">Next</button>
            </div>
         </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: 'bg-success/10 text-success border-success/30',
    PENDING_APPROVAL: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30',
    WAITLISTED: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
    REJECTED: 'bg-error/10 text-error border-error/30',
    INACTIVE: 'bg-white/10 text-[#666666] border-white/10',
  };

  const icons: Record<string, React.ReactNode> = {
    APPROVED: <CheckCircle2 size={12} />,
    PENDING_APPROVAL: <Clock size={12} />,
    WAITLISTED: <Calendar size={12} />,
    REJECTED: <AlertCircle size={12} />,
    INACTIVE: <AlertCircle size={12} />,
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border",
      styles[status] || styles.INACTIVE
    )}>
      {icons[status] || icons.INACTIVE}
      {status.replace('_', ' ')}
    </div>
  );
}
