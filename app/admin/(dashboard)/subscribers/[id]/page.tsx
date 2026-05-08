import React from 'react';
import { prisma } from '@/lib/prisma';
import { updateSubscriberStatus, assignDriverToSubscriber, saveSubscriberNotes } from '@/actions/admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Calendar, CreditCard, FileText,
  Car, User, CheckCircle2, XCircle, Clock, ShieldCheck, AlertCircle
} from 'lucide-react';
import { cn, formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import TermsAcceptanceDetail from '@/components/admin/TermsAcceptanceDetail';

export default async function SubscriberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sub = await prisma.subscriber.findUnique({
    where: { id },
    include: {
      user: true,
      zone: true,
      termsAcceptance: true,
      assignedDriver: { include: { user: true } },
    },
  });

  if (!sub) notFound();

  const drivers = await prisma.driver.findMany({
    where: { status: 'ACTIVE' },
    include: { user: true },
    take: 20,
  });

  const statusColor: Record<string, string> = {
    PENDING_APPROVAL: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    APPROVED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    WAITLISTED: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    REJECTED: 'text-red-400 bg-red-400/10 border-red-400/30',
    SUSPENDED: 'text-[#666] bg-white/5 border-white/10',
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/subscribers" className="p-2 border border-[#1e1e1e] rounded-xl hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold">
            {sub.user.firstName} {sub.user.lastName}
          </h1>
          <p className="text-[#A0A0A0] text-sm mt-1">{sub.user.email}</p>
        </div>
        <div className={cn('ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border', statusColor[sub.status] ?? statusColor.SUSPENDED)}>
          {sub.status.replace('_', ' ')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left – Profile & Route */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Info */}
          <div className="card-glass p-6 border-[#1e1e1e] space-y-5">
            <h2 className="font-display font-bold text-lg tracking-widest uppercase border-b border-[#1e1e1e] pb-4">Route Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Pickup Address</p>
                <p className="text-sm text-white font-medium">{sub.pickupAddress}</p>
                <p className="text-xs text-[#666]">{sub.pickupCity}, {sub.pickupState} {sub.pickupZip}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Destination</p>
                <p className="text-sm text-white font-medium">{sub.dropoffAddress}</p>
                <p className="text-xs text-[#666]">{sub.dropoffCity}, {sub.dropoffState} {sub.dropoffZip}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Direction</p>
                <p className="text-sm text-white font-medium">{sub.direction}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Zone</p>
                <p className="text-sm text-white font-medium">{sub.zone?.name ?? 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Distance</p>
                <p className="text-sm text-white font-medium">{sub.distanceMiles ? `${sub.distanceMiles.toFixed(1)} mi` : '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Est. Price</p>
                <p className="text-sm text-[#D4AF37] font-bold">{formatCurrency(sub.estimatedPrice ?? 0)}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card-glass p-6 border-[#1e1e1e] space-y-5">
            <h2 className="font-display font-bold text-lg tracking-widest uppercase border-b border-[#1e1e1e] pb-4">Payment Status</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Payment Status</p>
                <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-bold border',
                  sub.paymentStatus === 'PAID_IN_FULL' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' :
                  sub.paymentStatus === 'UNPAID' ? 'text-red-400 bg-red-400/10 border-red-400/30' :
                  'text-amber-400 bg-amber-400/10 border-amber-400/30'
                )}>
                  {sub.paymentStatus.replace('_', ' ')}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Commitment Paid</p>
                <p className="text-sm text-white font-medium">{formatCurrency(sub.commitmentPaid ?? 0)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Balance Due</p>
                <p className="text-sm text-red-400 font-bold">{formatCurrency(sub.balanceDue ?? 0)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Commitment Paid At</p>
                <p className="text-sm text-[#A0A0A0]">{sub.commitmentPaidAt ? formatDate(sub.commitmentPaidAt) : '—'}</p>
              </div>
            </div>
          </div>

          {/* Terms Acceptance */}
          <div className="card-glass p-6 border-[#1e1e1e]">
            <h2 className="font-display font-bold text-lg tracking-widest uppercase border-b border-[#1e1e1e] pb-4 mb-5">Terms Acceptance</h2>
            {sub.termsAcceptance ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 size={16} />
                  <span>Terms accepted on {formatDateTime(sub.termsAcceptance.acceptedAt)}</span>
                </div>
                <p className="text-[11px] text-[#555]">IP: {sub.termsAcceptance.ipAddress ?? '—'}</p>
                <TermsAcceptanceDetail 
                  checkboxResponses={sub.termsAcceptance.checkboxResponses} 
                  className="mt-4"
                />
              </div>
            ) : (
              <p className="text-[#555] text-sm italic">No terms acceptance on record.</p>
            )}
          </div>
        </div>

        {/* Right – Actions */}
        <div className="space-y-6">
          {/* Assign Driver */}
          <div className="card-glass p-6 border-[#1e1e1e]">
            <h3 className="font-display font-bold text-base uppercase tracking-widest mb-4">Assigned Driver</h3>
            {sub.assignedDriver ? (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold">{sub.assignedDriver.user.firstName[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-bold">{sub.assignedDriver.user.firstName} {sub.assignedDriver.user.lastName}</p>
                  <p className="text-[10px] text-[#555]">{sub.assignedDriver.vehicleMake} {sub.assignedDriver.vehicleModel}</p>
                </div>
              </div>
            ) : (
              <p className="text-[#666] text-xs mb-4 italic">No driver assigned yet.</p>
            )}

            {drivers.length > 0 && (
              <form action={async (fd) => {
                'use server';
                const driverId = fd.get('driverId') as string;
                if (driverId) await assignDriverToSubscriber(sub.id, driverId);
              }}>
                <select name="driverId" className="input-field text-sm mb-3">
                  <option value="">Select a driver...</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user.firstName} {d.user.lastName} — {d.vehicleMake} {d.vehicleModel}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn-gold w-full text-xs py-2.5">Assign Driver</button>
              </form>
            )}
          </div>

          {/* Status Actions */}
          <div className="card-glass p-6 border-[#1e1e1e] space-y-3">
            <h3 className="font-display font-bold text-base uppercase tracking-widest mb-4">Status Actions</h3>
            <form action={async () => { 'use server'; await updateSubscriberStatus(sub.id, 'APPROVED'); }}>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 text-sm font-bold hover:bg-emerald-400/20 transition-all">
                <CheckCircle2 size={16} /> Approve
              </button>
            </form>
            <form action={async () => { 'use server'; await updateSubscriberStatus(sub.id, 'WAITLISTED'); }}>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-400/10 text-blue-400 border border-blue-400/30 text-sm font-bold hover:bg-blue-400/20 transition-all">
                <Clock size={16} /> Waitlist
              </button>
            </form>
            <form action={async () => { 'use server'; await updateSubscriberStatus(sub.id, 'REJECTED'); }}>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-400/10 text-red-400 border border-red-400/30 text-sm font-bold hover:bg-red-400/20 transition-all">
                <XCircle size={16} /> Reject
              </button>
            </form>
          </div>

          {/* Dates */}
          <div className="card-glass p-6 border-[#1e1e1e] space-y-3">
            <h3 className="font-display font-bold text-base uppercase tracking-widest mb-2">Timeline</h3>
            <div>
              <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Applied</p>
              <p className="text-sm text-[#A0A0A0]">{formatDate(sub.createdAt)}</p>
            </div>
            {sub.approvedAt && (
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Approved</p>
                <p className="text-sm text-emerald-400">{formatDate(sub.approvedAt)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
