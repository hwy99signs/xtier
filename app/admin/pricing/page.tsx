import React from 'react';
import { prisma } from '@/lib/prisma';
import { 
  Settings, 
  Plus, 
  DollarSign, 
  Percent, 
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminPricingPage() {
  const pricingRules = await prisma.pricingRule.findMany({
    include: { zone: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Revenue & Algorithms</h1>
          <p className="text-[#A0A0A0] text-sm mt-1">Configure base fares, mileage rates, and upfront commitment percentages.</p>
        </div>
        <button className="btn-gold text-xs py-2.5 px-6 flex items-center gap-2">
           <Plus size={16} /> New Pricing Rule
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pricingRules.length === 0 ? (
          <div className="py-20 text-center card-glass opacity-40">
             <Settings size={64} className="text-[#D4AF37] mx-auto mb-4" />
             <p className="text-sm uppercase tracking-widest font-bold">No High-Yield Rules Active</p>
          </div>
        ) : (
          pricingRules.map((rule) => (
            <div key={rule.id} className="card-glass border-[#222222] group hover:border-[#D4AF37]/20 transition-all overflow-hidden">
               <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-1 border-r border-[#222222] pr-8">
                     <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={20} className="text-[#D4AF37]" />
                        <h3 className="font-display font-medium text-xl">{rule.name}</h3>
                     </div>
                     <p className="text-[#666666] text-xs leading-relaxed">
                        {rule.description || "System default pricing logic for executive transits."}
                     </p>
                     <div className="mt-6 flex items-center gap-2">
                        <span className={cn(
                           "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest",
                           rule.isActive ? "text-success border-success/30 bg-success/5" : "text-error border-error/30 bg-error/5"
                        )}>
                           {rule.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                        <span className="text-[10px] text-[#444444] font-bold uppercase tracking-widest">
                           {rule.direction}
                        </span>
                     </div>
                  </div>

                  <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                     <div>
                        <p className="text-[10px] uppercase text-[#666666] tracking-widest font-bold mb-2 flex items-center gap-1">
                           <DollarSign size={10} /> Base Fare
                        </p>
                        <p className="text-2xl font-display font-bold text-white">{formatCurrency(rule.baseFare)}</p>
                     </div>
                     <div>
                        <p className="text-[10px] uppercase text-[#666666] tracking-widest font-bold mb-2 flex items-center gap-1">
                           <TrendingUp size={10} /> Per Mile
                        </p>
                        <p className="text-2xl font-display font-bold text-white">{formatCurrency(rule.perMileRate)}</p>
                     </div>
                     <div>
                        <p className="text-[10px] uppercase text-[#666666] tracking-widest font-bold mb-2 flex items-center gap-1">
                           <Percent size={10} /> Commitment
                        </p>
                        <p className="text-2xl font-display font-bold text-[#D4AF37]">{rule.commitmentPct}%</p>
                     </div>
                     <div className="text-right">
                        <button className="text-[10px] font-bold text-[#666666] hover:text-[#D4AF37] flex items-center gap-1 justify-end ml-auto transition-all">
                           EDIT PARAMETERS <ChevronRight size={14} />
                        </button>
                     </div>
                  </div>
               </div>
               
               <div className="bg-black/40 p-4 border-t border-[#222222] flex items-center justify-between text-[10px] text-[#444444] font-bold uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-4">
                     <span className="flex items-center gap-1"><Clock size={12} /> Effective From: {new Date(rule.effectiveFrom).toLocaleDateString()}</span>
                     <span className="flex items-center gap-1"><ShieldAlert size={12} /> Minimum Fare: {formatCurrency(rule.minFare)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     Applied to: <span className="text-[#D4AF37]">{rule.zone?.name || "Global / Universal"}</span>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 border border-dashed border-[#222222] rounded-2xl flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[#D4AF37]/5 text-[#D4AF37]">
               <Settings size={24} />
            </div>
            <div>
               <p className="font-bold text-sm">Dynamic Pricing Engine</p>
               <p className="text-[#666666] text-xs">Configure automatic surge multipliers based on terminal load and flight schedules.</p>
            </div>
         </div>
         <button className="btn-outline-gold text-[10px] py-2 px-6 opacity-50 cursor-not-allowed">
            MANAGE SURGE LOGIC
         </button>
      </div>
    </div>
  );
}
