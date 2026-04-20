import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MOCK_SUBSCRIBER, type MockSession } from '@/lib/mock-data';
import { LogoutButton } from '@/components/LogoutButton';
import {
  MapPin, CreditCard, Clock, CheckCircle2, AlertCircle,
  Car, Calendar, LogOut, ChevronRight, Users, ListFilter
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getUnreadCount } from '@/actions/message';

const statusConfig: Record<string, {
  label: string; color: string; bg: string; icon: React.ReactNode; desc: string;
}> = {
  PENDING_APPROVAL: {
    label: 'Pending Review',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/30',
    icon: <Clock size={16} />,
    desc: 'Your application is being reviewed by our team. You will be notified once approved.',
  },
  APPROVED: {
    label: 'Active Member',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/30',
    icon: <CheckCircle2 size={16} />,
    desc: 'Welcome aboard! Your membership is active. Your route and payment details are below.',
  },
  WAITLISTED: {
    label: 'Waitlisted',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/30',
    icon: <ListFilter size={16} />,
    desc: 'You are on our waitlist. We will contact you as capacity opens in your area.',
  },
  REJECTED: {
    label: 'Not Approved',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/30',
    icon: <AlertCircle size={16} />,
    desc: 'Your application was not approved at this time. Please contact support.',
  },
};

export default async function MemberDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/dashboard');
  if (session.user.role === 'DRIVER') redirect('/drivers/dashboard');

  const sub = await prisma.subscriber.findUnique({
    where: { userId: session.user.id },
    include: {
      zone: true,
      assignedDriver: {
        include: { user: true }
      },
      bookings: {
        orderBy: { scheduledAt: 'desc' },
        take: 10
      }
    }
  });

  if (!sub) {
    // If user is a CUSTOMER but has no subscriber record yet, redirect to subscribe
    redirect('/subscribe');
  }

  const unreadCount = sub.assignedDriver 
    ? await prisma.chatMessage.count({
        where: {
          receiverId: session.user.id,
          senderId: sub.assignedDriver.userId,
          readAt: null
        }
      })
    : 0;

  const sc = statusConfig[sub.status] ?? statusConfig.PENDING_APPROVAL;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navbar */}
      <header className="border-b border-[#1a1a1a] bg-[#080808]/80 backdrop-blur-md sticky top-0 z-20 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo variant="mark" className="h-8" />
          <div>
            <span className="font-display font-bold text-sm tracking-wider text-white block leading-none">ERANTT</span>
            <span className="text-[9px] text-[#D4AF37] font-bold tracking-[0.3em] uppercase">Member Portal</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none">{session.user.name}</p>
            <p className="text-[9px] text-[#D4AF37] uppercase tracking-[0.25em] font-bold mt-0.5">Member</p>
          </div>
          <LogoutButton
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#EF4444]/60 hover:text-[#EF4444] hover:bg-[#EF4444]/5 border border-[#1e1e1e] rounded-xl transition-all cursor-pointer"
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            Welcome, {session.user.name?.split(' ')[0]}
          </h1>
          <p className="text-[#A0A0A0] text-sm mt-1">Your ERANTT TRANSIT member dashboard.</p>
        </div>

        {/* Status Banner */}
        <div className={cn('flex items-start gap-4 p-5 rounded-2xl border', sc.bg)}>
          <div className={cn('mt-0.5', sc.color)}>{sc.icon}</div>
          <div>
            <p className={cn('font-bold text-sm uppercase tracking-widest', sc.color)}>{sc.label}</p>
            <p className="text-[#A0A0A0] text-xs mt-1">{sc.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Route */}
          <div className="card-glass p-6 border-[#1e1e1e] space-y-4">
            <h2 className="font-display font-bold text-base uppercase tracking-widest text-[#666] border-b border-[#1e1e1e] pb-3">
              My Route
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold">Pickup</p>
                  <p className="text-sm text-white font-medium">{sub.pickupAddress}</p>
                  <p className="text-[11px] text-[#666]">{sub.pickupCity}, {sub.pickupState} {sub.pickupZip}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold">Destination</p>
                  <p className="text-sm text-white font-medium">{sub.dropoffAddress}</p>
                  <p className="text-[11px] text-[#666]">IAH — George Bush Intercontinental</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#1e1e1e]">
                <Calendar size={13} className="text-[#D4AF37]" />
                <div>
                  <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold">Direction</p>
                  <p className="text-sm text-white">Both Ways (To &amp; From Airport)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <p className="text-xs text-[#A0A0A0]">Zone: <span className="text-[#D4AF37] font-bold">{sub.zone?.name || 'Standard'}</span></p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card-glass p-6 border-[#1e1e1e] space-y-4">
            <h2 className="font-display font-bold text-base uppercase tracking-widest text-[#666] border-b border-[#1e1e1e] pb-3">
              Payment Status
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#666] uppercase tracking-widest font-bold">Estimated Fare</span>
                <span className="text-2xl font-display font-bold text-white">{formatCurrency(sub.estimatedPrice || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#666] uppercase tracking-widest font-bold">Commitment Paid</span>
                <span className="text-emerald-400 font-bold text-lg">{formatCurrency(sub.commitmentPaid || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#666] uppercase tracking-widest font-bold">Balance Due</span>
                <span className="text-amber-400 font-bold text-lg">{formatCurrency(sub.balanceDue || 0)}</span>
              </div>
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[10px] text-[#555] mb-1.5">
                  <span>PAYMENT PROGRESS</span>
                  <span>{Math.round(((sub.commitmentPaid || 0) / (sub.estimatedPrice || 1)) * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5C842]"
                    style={{ width: `${((sub.commitmentPaid || 0) / (sub.estimatedPrice || 1)) * 100}%` }}
                  />
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30">
                <CreditCard size={11} /> Commitment Paid
              </span>
            </div>
          </div>

          {/* Assigned Driver */}
          <Link 
            href={sub.assignedDriver ? `/dashboard/chat/${sub.assignedDriver.userId}` : '#'}
            className={cn(
              "card-glass p-6 border-[#1e1e1e] block group transition-all",
              sub.assignedDriver ? "hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 cursor-pointer" : "cursor-default opacity-80"
            )}
          >
            <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-3 mb-4">
              <h2 className="font-display font-bold text-base uppercase tracking-widest text-[#666]">
                Your Driver
              </h2>
              {sub.assignedDriver && (
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-tighter">
                      {unreadCount} New Message{unreadCount > 1 ? 's' : ''}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    Tap to Chat
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-xl uppercase">
                {sub.assignedDriver?.user.firstName[0] || '?'}
              </div>
              <div>
                <p className="font-bold text-white text-base group-hover:text-[#D4AF37] transition-colors">
                  {sub.assignedDriver ? `${sub.assignedDriver.user.firstName} ${sub.assignedDriver.user.lastName}` : 'Unassigned'}
                </p>
                {sub.assignedDriver ? (
                  <>
                    <p className="text-xs text-[#A0A0A0] mt-0.5">
                      {sub.assignedDriver.vehicleYear} {sub.assignedDriver.vehicleMake} {sub.assignedDriver.vehicleModel}
                    </p>
                    <p className="text-[11px] text-[#555]">
                      {sub.assignedDriver.vehicleColor} · Plate: {sub.assignedDriver.vehiclePlate}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-[#555]">Awaiting chauffeur assignment</p>
                )}
              </div>
            </div>
          </Link>

          {/* Account Info */}
          <div className="card-glass p-6 border-[#1e1e1e]">
            <h2 className="font-display font-bold text-base uppercase tracking-widest text-[#666] border-b border-[#1e1e1e] pb-3 mb-4">
              Account Info
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Applied', value: formatDate(sub.createdAt), color: '' },
                { label: 'Approved', value: sub.approvedAt ? formatDate(sub.approvedAt) : 'Pending Review', color: sub.approvedAt ? 'text-emerald-400' : 'text-amber-400' },
                { label: 'Distance', value: `${sub.distanceMiles || 0} miles to IAH`, color: '' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-[10px] text-[#555] uppercase tracking-widest font-bold">{label}</span>
                  <span className={cn('text-sm font-medium', color || 'text-white')}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trip History */}
        <div className="card-glass border-[#1e1e1e] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e1e1e] flex items-center gap-3">
            <Calendar size={15} className="text-[#D4AF37]" />
            <h2 className="font-display font-bold text-base uppercase tracking-widest">Trip History</h2>
            <span className="ml-auto text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded-full">
              {sub.bookings.length} TRIPS
            </span>
          </div>
          <div className="divide-y divide-[#0f0f0f]">
            {sub.bookings.map((b) => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-sm font-bold text-white">{b.direction.replace('_', ' → ')}</p>
                  <p className="text-[11px] text-[#555] mt-0.5">
                    {formatDate(b.scheduledAt)}
                  </p>
                </div>
                <span className={cn(
                  'text-[10px] font-bold px-2.5 py-1 rounded-full border',
                  b.status === 'COMPLETED' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                  b.status === 'CANCELLED' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
                  'bg-amber-400/10 text-amber-400 border-amber-400/20'
                )}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
