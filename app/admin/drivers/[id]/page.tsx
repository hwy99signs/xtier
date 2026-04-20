import React from 'react';
import { prisma } from '@/lib/prisma';
import { updateDriverStatus } from '@/actions/admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Car, ShieldCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn, formatDate, formatDateTime } from '@/lib/utils';
import TermsAcceptanceDetail from '@/components/admin/TermsAcceptanceDetail';

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: {
      user: true,
      termsAcceptance: true,
      subscribers: { include: { user: true }, take: 5 },
    },
  });

  if (!driver) notFound();

  const statusColor: Record<string, string> = {
    PENDING_REVIEW: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    ACTIVE: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    INACTIVE: 'text-[#666] bg-white/5 border-white/10',
    REJECTED: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/drivers" className="p-2 border border-[#1e1e1e] rounded-xl hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold">{driver.user.firstName} {driver.user.lastName}</h1>
          <p className="text-[#A0A0A0] text-sm mt-1">{driver.user.email} · {driver.user.phone}</p>
        </div>
        <div className={cn('ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border', statusColor[driver.status] ?? statusColor.INACTIVE)}>
          {driver.status.replace('_', ' ')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* License Info */}
          <div className="card-glass p-6 border-[#1e1e1e]">
            <h2 className="font-display font-bold text-lg uppercase tracking-widest border-b border-[#1e1e1e] pb-4 mb-5">License Details</h2>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'License Number', val: driver.licenseNumber },
                { label: 'License State', val: driver.licenseState },
                { label: 'License Expiry', val: formatDate(driver.licenseExpiry) },
                { label: 'Years Experience', val: `${driver.yearsExperience} yrs` },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">{label}</p>
                  <p className="text-sm text-white font-medium">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="card-glass p-6 border-[#1e1e1e]">
            <h2 className="font-display font-bold text-lg uppercase tracking-widest border-b border-[#1e1e1e] pb-4 mb-5">
              <Car size={18} className="inline mr-2 text-[#D4AF37]" />Vehicle Details
            </h2>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Make', val: driver.vehicleMake },
                { label: 'Model', val: driver.vehicleModel },
                { label: 'Year', val: driver.vehicleYear.toString() },
                { label: 'Color', val: driver.vehicleColor },
                { label: 'Plate', val: driver.vehiclePlate },
                { label: 'Capacity', val: `${driver.vehicleCapacity} passengers` },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">{label}</p>
                  <p className="text-sm text-white font-medium">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="card-glass p-6 border-[#1e1e1e]">
            <h2 className="font-display font-bold text-lg uppercase tracking-widest border-b border-[#1e1e1e] pb-4 mb-5">Compliance</h2>
            {driver.termsAcceptance ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-emerald-400 text-sm">
                  <ShieldCheck size={16} />
                  Terms accepted {formatDateTime(driver.termsAcceptance.acceptedAt)}
                </div>
                <TermsAcceptanceDetail 
                  checkboxResponses={driver.termsAcceptance.checkboxResponses} 
                  className="mt-4"
                />
              </div>
            ) : (
              <p className="text-[#555] text-sm italic">No terms record found.</p>
            )}
          </div>

          {/* Assigned Subscribers */}
          {driver.subscribers.length > 0 && (
            <div className="card-glass p-6 border-[#1e1e1e]">
              <h2 className="font-display font-bold text-lg uppercase tracking-widest border-b border-[#1e1e1e] pb-4 mb-5">Assigned Members</h2>
              <div className="space-y-3">
                {driver.subscribers.map((s) => (
                  <Link key={s.id} href={`/admin/subscribers/${s.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-[#1e1e1e] hover:border-[#D4AF37]/30 transition-all">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                      {s.user.firstName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{s.user.firstName} {s.user.lastName}</p>
                      <p className="text-[10px] text-[#555]">{s.pickupZip} → IAH</p>
                    </div>
                    <span className={cn('ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border', statusColor[s.status] ?? 'text-[#666] bg-white/5 border-white/10')}>
                      {s.status.replace('_', ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right – Actions */}
        <div className="space-y-6">
          <div className="card-glass p-6 border-[#1e1e1e] space-y-3">
            <h3 className="font-display font-bold text-base uppercase tracking-widest mb-4">Status Actions</h3>
            <form action={async () => { 'use server'; await updateDriverStatus(driver.id, 'ACTIVE'); }}>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 text-sm font-bold hover:bg-emerald-400/20 transition-all">
                <CheckCircle2 size={16} /> Approve Driver
              </button>
            </form>
            <form action={async () => { 'use server'; await updateDriverStatus(driver.id, 'INACTIVE'); }}>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 text-sm font-bold hover:bg-amber-400/20 transition-all">
                <Clock size={16} /> Set Inactive
              </button>
            </form>
            <form action={async () => { 'use server'; await updateDriverStatus(driver.id, 'REJECTED'); }}>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-400/10 text-red-400 border border-red-400/30 text-sm font-bold hover:bg-red-400/20 transition-all">
                <XCircle size={16} /> Reject Application
              </button>
            </form>
          </div>

          <div className="card-glass p-6 border-[#1e1e1e] space-y-3">
            <h3 className="font-display font-bold text-base uppercase tracking-widest mb-2">Timeline</h3>
            <div>
              <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Applied</p>
              <p className="text-sm text-[#A0A0A0]">{formatDate(driver.createdAt)}</p>
            </div>
            {driver.approvedAt && (
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Approved</p>
                <p className="text-sm text-emerald-400">{formatDate(driver.approvedAt)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
