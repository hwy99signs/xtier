import React from 'react';
import { CheckCircle2, ShieldCheck, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface PricingSnapshot {
  distanceMiles?: number;
  totalFare?: number;
  baseFare?: number;
  perMileFare?: number;
  commitmentAmount?: number;
  zoneName?: string;
  zoneId?: string;
  isWaitlistOnly?: boolean;
}

interface TermsAcceptanceDetailProps {
  checkboxResponses: any;
  className?: string;
}

const LABEL_MAP: Record<string, string> = {
  terms: 'Executive Service Agreement',
  privacy: 'Data & Privacy Policy',
  cancellation: 'Cancellation & No-Show Policy',
  sms: 'SMS & Text Notifications',
  age: 'Age Verification (21+)',
  conduct: 'Member Code of Conduct',
  commuter: 'Standard Commuter Verification',
};

export default function TermsAcceptanceDetail({ checkboxResponses, className }: TermsAcceptanceDetailProps) {
  if (!checkboxResponses) return null;

  const affirmations = Object.entries(checkboxResponses).filter(
    ([key, value]) => typeof value === 'boolean' && value === true
  );

  const pricingSnapshot = checkboxResponses.pricingSnapshot as PricingSnapshot | undefined;

  return (
    <div className={cn("space-y-6", className)}>
      {/* AFFIRMATIONS GRID */}
      <div>
        <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] font-bold mb-4">Affirmations & Consents</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {affirmations.length > 0 ? (
            affirmations.map(([key]) => (
              <div 
                key={key} 
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/10 group hover:border-emerald-400/20 transition-all"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                </div>
                <span className="text-xs text-white/90 font-medium">
                  {LABEL_MAP[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#555] italic">No affirmations recorded.</p>
          )}
        </div>
      </div>

      {/* PRICING SNAPSHOT (If applicable) */}
      {pricingSnapshot && (
        <div className="pt-2">
          <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] font-bold mb-4">Pricing & Route Snapshot</p>
          <div className="card-glass border-[#D4AF37]/20 bg-[#D4AF37]/5 overflow-hidden">
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-[9px] text-[#D4AF37]/60 uppercase tracking-widest font-bold mb-1">Service Zone</p>
                <div className="flex items-center gap-1.5">
                  <MapPin size={10} className="text-[#D4AF37]" />
                  <p className="text-xs text-white font-bold">{pricingSnapshot.zoneName || 'Standard'}</p>
                </div>
              </div>
              <div>
                <p className="text-[9px] text-[#D4AF37]/60 uppercase tracking-widest font-bold mb-1">Distance</p>
                <p className="text-xs text-white font-bold">{pricingSnapshot.distanceMiles?.toFixed(1) || '0.0'} mi</p>
              </div>
              <div>
                <p className="text-[9px] text-[#D4AF37]/60 uppercase tracking-widest font-bold mb-1">Est. Total</p>
                <div className="flex items-center gap-1">
                  <DollarSign size={10} className="text-[#D4AF37]" />
                  <p className="text-sm text-[#D4AF37] font-black">{pricingSnapshot.totalFare?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              <div>
                <p className="text-[9px] text-[#D4AF37]/60 uppercase tracking-widest font-bold mb-1">Commitment</p>
                <p className="text-xs text-emerald-400 font-bold">{formatCurrency(pricingSnapshot.commitmentAmount || 0)}</p>
              </div>
            </div>
            
            <div className="px-4 py-2 bg-black/40 border-t border-[#D4AF37]/10 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2 text-[#666]">
                <ShieldCheck size={12} />
                <span>Price locked at time of acceptance</span>
              </div>
              {pricingSnapshot.isWaitlistOnly && (
                <span className="text-blue-400 font-bold uppercase tracking-widest">Waitlist Active</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
