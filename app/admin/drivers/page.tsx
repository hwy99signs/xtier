import React from 'react';
import { prisma } from '@/lib/prisma';
import { 
  Car, 
  ShieldCheck, 
  MapPin, 
  Star,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminDriversPage() {
  const drivers = await prisma.driver.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Elite Fleet Directory</h1>
          <p className="text-[#A0A0A0] text-sm mt-1">Vett and manager professional executive chauffeurs.</p>
        </div>
        <button className="btn-gold text-xs py-2.5 px-6">Manual Addition</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-40">
             <Car size={64} className="text-[#D4AF37] mx-auto mb-4" />
             <p className="text-sm uppercase tracking-widest font-bold">No Driver Applications Found</p>
          </div>
        ) : (
          drivers.map((driver) => (
            <div key={driver.id} className="card-glass p-0 border-[#222222] group hover:border-[#D4AF37]/30 transition-all overflow-hidden">
               <div className="p-6 border-b border-[#222222] bg-gradient-to-br from-black to-[#0A0A0A]">
                  <div className="flex items-center justify-between mb-4">
                     <div className="w-12 h-12 rounded-full bg-[#111111] border border-[#222222] flex items-center justify-center overflow-hidden">
                        <span className="font-bold text-[#D4AF37] text-lg">
                           {driver.user.firstName[0]}
                        </span>
                     </div>
                     <DriverStatusBadge status={driver.status} />
                  </div>
                  <h3 className="font-display font-bold text-lg group-hover:text-[#D4AF37] transition-colors">
                     {driver.user.firstName} {driver.user.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-[#666666] text-[10px] uppercase font-bold tracking-widest mt-1">
                     <ShieldCheck size={12} className="text-success" />
                     {driver.licenseNumber} • TX License
                  </div>
               </div>
               
               <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                     <Car className="text-[#D4AF37]" size={16} />
                     <div>
                        <p className="text-xs font-bold text-white uppercase tracking-tighter">
                           {driver.vehicleYear} {driver.vehicleMake} {driver.vehicleModel}
                        </p>
                        <p className="text-[10px] text-[#A0A0A0] uppercase">Plate: {driver.vehiclePlate} • Capacity: {driver.vehicleCapacity}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <Briefcase className="text-[#D4AF37]" size={16} />
                     <div>
                        <p className="text-xs font-bold text-white uppercase tracking-tighter">
                           {driver.yearsExperience} Years Experience
                        </p>
                        <p className="text-[10px] text-[#A0A0A0] uppercase">Professional Rating: 5.0 ⭐</p>
                     </div>
                  </div>
               </div>
               
               <div className="p-4 bg-black/40 flex items-center justify-between border-t border-[#222222]">
                  <button className="text-[10px] uppercase font-bold text-[#666666] hover:text-[#D4AF37] transition-colors">
                     Audit Docs
                  </button>
                  <div className="flex gap-2">
                     <button className="p-2 hover:bg-white/5 rounded-lg text-[#666666] hover:text-white transition-all">
                        <MoreVertical size={16} />
                     </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DriverStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-success/10 text-success border-success/30',
    PENDING_REVIEW: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30',
    INACTIVE: 'bg-white/10 text-[#666666] border-white/10',
    SUSPENDED: 'bg-error/10 text-error border-error/30',
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border",
      styles[status] || styles.INACTIVE
    )}>
      {status.replace('_', ' ')}
    </div>
  );
}
