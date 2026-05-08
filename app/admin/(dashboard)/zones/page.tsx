import React from 'react';
import { prisma } from '@/lib/prisma';
import { 
  Map, 
  Plus, 
  ChevronRight, 
  MapPin, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminZonesPage() {
  const zones = await prisma.serviceZone.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Service Geography</h1>
          <p className="text-[#A0A0A0] text-sm mt-1">Define operational boundaries and base tier pricing for Kingwood and IAH.</p>
        </div>
        <Link href="/admin/zones/new" className="btn-gold text-xs py-2.5 px-6 flex items-center gap-2">
           <Plus size={16} /> New Service Zone
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {zones.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-40">
             <Map size={64} className="text-[#D4AF37] mx-auto mb-4" />
             <p className="text-sm uppercase tracking-widest font-bold">No High-Value Zones Defined</p>
          </div>
        ) : (
          zones.map((zone) => (
            <div key={zone.id} className="card-glass border-[#222222] group hover:border-[#D4AF37]/30 transition-all overflow-hidden flex flex-col">
               <div className="p-8 flex-1">
                  <div className="flex items-center justify-between mb-6">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37]">
                           {zone.type}
                        </span>
                     </div>
                     <span className="text-[10px] text-[#444444] font-bold">ZONE-0{zone.sortOrder}</span>
                  </div>
                  
                  <h3 className="font-display font-bold text-2xl mb-2">{zone.name}</h3>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed mb-6">
                     {zone.description || "No description provided for this sector."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#222222]">
                     <div>
                        <p className="text-[10px] uppercase text-[#666666] tracking-widest font-bold mb-1">Operational Range</p>
                        <p className="text-white font-bold">{zone.minMiles} – {zone.maxMiles} Miles</p>
                     </div>
                     <div>
                        <p className="text-[10px] uppercase text-[#666666] tracking-widest font-bold mb-1">Base Tier Price</p>
                        <p className="text-[#D4AF37] font-display font-bold text-xl">{formatCurrency(zone.basePrice)}</p>
                     </div>
                  </div>
               </div>
               
               <div className="p-4 bg-black/40 border-t border-[#222222] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Activity size={12} className={zone.isActive ? "text-success" : "text-error"} />
                     <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        zone.isActive ? "text-success" : "text-error"
                     )}>
                        {zone.isActive ? "Operational" : "Deactivated"}
                     </span>
                  </div>
                  <Link href={`/admin/zones/${zone.id}`} className="text-[10px] font-bold text-[#666666] hover:text-white flex items-center gap-1 transition-all">
                     MODIFY BOUNDARIES <ChevronRight size={14} />
                  </Link>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Visual map stub */}
      <div className="card-glass p-12 bg-black border-dashed border-[#222222] text-center">
         <div className="max-w-md mx-auto">
            <MapPin className="text-[#D4AF37]/20 mx-auto mb-6" size={80} />
            <h3 className="font-display font-bold text-xl mb-4">Interactive Geo-Fence Engine</h3>
            <p className="text-[#666666] text-sm leading-relaxed mb-8">
               Integrate Google Maps Platform to visually define Kingwood pickup perimeters and Terminal drop-off logistics.
            </p>
            <button className="btn-outline-gold text-xs py-2 px-8 opacity-50 cursor-not-allowed">
               ENABLE SPATIAL EDITOR
            </button>
         </div>
      </div>
    </div>
  );
}
