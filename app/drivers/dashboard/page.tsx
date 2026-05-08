import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import {
  Car, ShieldCheck, Users, CheckCircle2, Clock,
  AlertCircle, MapPin, Briefcase, Phone, MessageSquare,
  Navigation, Calendar, ChevronRight, Power, Info,
  CheckCircle, MoreHorizontal
} from 'lucide-react';
import { cn, formatDateTime } from '@/lib/utils';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { DriverAvailabilityToggle } from '@/components/DriverAvailabilityToggle';
import { DriverBookingStatus } from '@/components/DriverBookingStatus';
import { LogoutButton } from '@/components/LogoutButton';

const statusConfig: Record<string, {
  label: string; color: string; bg: string; icon: React.ReactNode;
}> = {
  PENDING_REVIEW: {
    label: 'Application Under Review',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/30',
    icon: <Clock size={16} />,
  },
  ACTIVE: {
    label: 'Active Driver',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/30',
    icon: <CheckCircle2 size={16} />,
  },
  INACTIVE: {
    label: 'Currently Inactive',
    color: 'text-[#666]',
    bg: 'bg-white/5 border-white/10',
    icon: <AlertCircle size={16} />,
  },
};

export default async function DriverDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/dashboard');
  if (session.user.role === 'CUSTOMER') redirect('/dashboard');

  const driver = await prisma.driver.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      bookings: {
        include: {
          subscriber: {
            include: { user: true }
          }
        },
        orderBy: { scheduledAt: 'asc' }
      },
      subscribers: {
        include: { user: true }
      }
    }
  });

  if (!driver) {
    // Should not happen for DRIVER role, but safety check
    redirect('/login');
  }

  const bookings = driver.bookings;

  // Fetch unread message counts for each unique subscriber (both those with bookings and those assigned)
  const bookingSubIds = bookings.map(b => b.subscriber.userId);
  const assignedSubIds = driver.subscribers.map(s => s.userId);
  const uniqueSubscriberIds = Array.from(new Set([...bookingSubIds, ...assignedSubIds]));
  
  const unreadCountsMap: Record<string, number> = {};
  
  for (const subId of uniqueSubscriberIds) {
    unreadCountsMap[subId] = await prisma.chatMessage.count({
      where: {
        receiverId: session.user.id,
        senderId: subId,
        readAt: null
      }
    });
  }

  const alerts = []; // Future: Fetch real driver alerts
  const sc = statusConfig[driver.status] ?? statusConfig.PENDING_REVIEW;

  // Derive stats for "At a Glance"
  const completedTrips = bookings.filter(b => b.status === 'COMPLETED').length;
  const totalTrips = bookings.length;
  const remainingTrips = totalTrips - completedTrips;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navbar */}
      <header className="border-b border-[#1a1a1a] bg-[#080808]/80 backdrop-blur-md sticky top-0 z-30 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo variant="mark" className="h-8" />
          <div>
            <span className="font-display font-bold text-sm tracking-wider text-white block leading-none">xtier</span>
            <span className="text-[9px] text-[#D4AF37] font-bold tracking-[0.3em] uppercase">Driver Portal</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none">{session.user?.name}</p>
            <p className="text-[9px] text-[#D4AF37] uppercase tracking-[0.25em] font-bold mt-0.5">Chauffeur</p>
          </div>
          <LogoutButton
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#EF4444]/60 hover:text-[#EF4444] hover:bg-[#EF4444]/5 border border-[#1e1e1e] rounded-xl transition-all cursor-pointer"
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* ─── Header & Availability Control ─────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Driver Command</h1>
            <p className="text-[#A0A0A0] text-sm mt-1">Hello, {driver.user.firstName}. Manage your active fleet operations.</p>
          </div>
          
          <DriverAvailabilityToggle 
            driverId={driver.id} 
            initialAvailability={driver.isAvailable} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ─── LEFT COLUMN: Main Ops ────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Today's Status Banner */}
            {/* Today's Status Banner */}
            <div className={cn('flex items-center justify-between p-5 rounded-2xl border backdrop-blur-sm', sc.bg)}>
              <div className="flex items-start gap-4">
                <div className={cn('mt-0.5', sc.color)}>{sc.icon}</div>
                <div>
                  <p className={cn('font-bold text-sm uppercase tracking-widest', sc.color)}>{sc.label}</p>
                  <p className="text-[#A0A0A0] text-xs mt-1">
                    {driver.status === 'PENDING_REVIEW' 
                      ? "The xtier Review Board is currently validating your application. We will contact you shortly."
                      : driver.isAvailable ? "Receiving route updates. Your system is live." : "System set to offline. Resume to receive trips."}
                  </p>
                </div>
              </div>
              {driver.status === 'PENDING_REVIEW' && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">In Queue</span>
                </div>
              )}
            </div>

            {/* Board Review Progress (Only shown if pending) */}
            {driver.status === 'PENDING_REVIEW' && (
              <div className="card-glass border-amber-400/20 bg-gradient-to-br from-amber-400/[0.03] to-transparent p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Application Roadmap</h3>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Est. 2-3 Business Days</span>
                </div>
                
                <div className="relative pt-2">
                  <div className="absolute top-[26px] left-0 right-0 h-[2px] bg-[#1a1a1a]" />
                  <div className="absolute top-[26px] left-0 w-[40%] h-[2px] bg-[#D4AF37]" />
                  
                  <div className="relative flex justify-between">
                    {[
                      { step: 'Applied', status: 'COMPLETED', date: 'Done' },
                      { step: 'Verification', status: 'ACTIVE', date: 'In Progress' },
                      { step: 'Background', status: 'PENDING', date: 'Pending' },
                      { step: 'Activation', status: 'PENDING', date: 'Final' },
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-3 text-center z-10">
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 border-[#050505] flex items-center justify-center transition-all",
                          step.status === 'COMPLETED' ? "bg-emerald-500" :
                          step.status === 'ACTIVE' ? "bg-[#D4AF37] ring-4 ring-[#D4AF37]/10" : "bg-[#1a1a1a]"
                        )}>
                          {step.status === 'COMPLETED' && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <div>
                          <p className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            step.status === 'PENDING' ? "text-[#444]" : "text-white"
                          )}>{step.step}</p>
                          <p className="text-[9px] text-[#555] font-medium mt-0.5">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-4">
                  <Info size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#888] leading-relaxed">
                    Our team is currently reviewing your <strong>Texas Class C</strong> license and vehicle registration for the <strong>{driver.vehicleYear} {driver.vehicleMake} {driver.vehicleModel}</strong>. No further action is required from you at this time.
                  </p>
                </div>
              </div>
            )}

            {/* Operational Metrics (At a Glance) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Today's Trips", value: totalTrips, sub: "Total Assignments", color: "text-white" },
                { label: "Completed", value: completedTrips, sub: "Sucessful Drop-offs", color: "text-emerald-400" },
                { label: "Remaining", value: remainingTrips, sub: "Active Schedule", color: "text-[#D4AF37]" },
              ].map((stat, i) => (
                <div key={i} className="card-glass p-5 border-[#1a1a1a]">
                  <p className="text-[10px] text-[#555] font-black uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                  <div className="flex items-end gap-2">
                    <p className={cn("text-3xl font-display font-bold leading-none", stat.color)}>{stat.value}</p>
                    <p className="text-[11px] text-[#444] font-bold mb-1">UNITS</p>
                  </div>
                  <p className="text-[10px] text-[#333] font-bold mt-2 italic">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Assigned Riders Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="font-display font-bold text-lg uppercase tracking-widest flex items-center gap-2">
                  <Users className="text-[#D4AF37]" size={20} />
                  Assigned Riders
                </h2>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold text-[#D4AF37] px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-md">TODAY</span>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="card-glass p-16 md:p-24 flex flex-col items-center text-center bg-gradient-to-b from-[#0A0A0A] to-transparent border-[#1a1a1a]">
                  <div className="w-20 h-20 rounded-full bg-black/50 border border-[#D4AF37]/20 flex items-center justify-center mb-6 shadow-2xl shadow-[#D4AF37]/5">
                    <Briefcase size={32} className="text-[#D4AF37] opacity-60" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2 uppercase tracking-widest">Standby Active</h3>
                  <p className="text-xs text-[#555] max-w-xs leading-loose font-medium px-4">
                    Your account is fully active and verified. We are currently calibrating today's logistics. You will be notified immediately when a route is assigned.
                  </p>
                  <div className="mt-8 flex gap-3">
                    <div className="px-4 py-2 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-full flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                      <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest">Awaiting Logistics</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="card-glass overflow-hidden border-[#1a1a1a] hover:border-[#D4AF37]/30 transition-all flex flex-col group">
                      <div className="p-5 flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#111] to-[#050505] border border-[#222] flex items-center justify-center font-bold text-[#D4AF37] uppercase">
                              {booking.subscriber.user.firstName[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                                  {booking.subscriber.user.firstName} {booking.subscriber.user.lastName}
                                </p>
                                {unreadCountsMap[booking.subscriber.userId] > 0 && (
                                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-black">
                                    {unreadCountsMap[booking.subscriber.userId]}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#666] font-bold uppercase tracking-widest">{booking.direction.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <span className={cn(
                            "text-[9px] font-black px-2 py-0.5 rounded-full border tracking-tighter",
                            booking.status === 'COMPLETED' ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" :
                            booking.status === 'EN_ROUTE' ? "bg-blue-400/10 text-blue-400 border-blue-400/20" :
                            "bg-amber-400/10 text-amber-400 border-amber-400/20"
                          )}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="space-y-3 pt-2">
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5 border border-[#1a1a1a]">
                              <MapPin size={10} className="text-[#D4AF37]" />
                            </div>
                            <div>
                              <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest">Pickup at {formatDateTime(booking.scheduledAt)}</p>
                              <p className="text-[13px] text-[#A0A0A0] leading-tight">{booking.pickupAddress}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5 border border-[#1a1a1a]">
                              <Navigation size={10} className="text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest">Drop off</p>
                              <p className="text-[13px] text-[#A0A0A0] leading-tight">{booking.dropoffAddress}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 py-4 bg-black/40 border-t border-[#1a1a1a] flex justify-between items-center gap-2">
                        <DriverBookingStatus bookingId={booking.id} currentStatus={booking.status} />
                        <div className="flex gap-2">
                          <Link href={`/drivers/chat/${booking.subscriber.userId}`} className="p-2 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl text-[#D4AF37] transition-all group/btn relative">
                            <MessageSquare size={14} className="group-hover/btn:scale-110 transition-transform" />
                            {unreadCountsMap[booking.subscriber.userId] > 0 && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D4AF37] border-2 border-black" />
                            )}
                          </Link>
                          <a href={`tel:${booking.subscriber.user.phone}`} className="p-2 bg-[#111] hover:bg-[#1a1a1a] border border-[#222] rounded-xl text-[#A0A0A0] hover:text-white transition-all">
                            <Phone size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inbox (All assigned members) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="font-display font-bold text-lg uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="text-[#D4AF37]" size={20} />
                  Inbox
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">Direct Messages</span>
                </div>
              </div>

              {driver.subscribers.length === 0 ? (
                <div className="card-glass p-8 text-center border-[#1a1a1a] opacity-50">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#444]">No permanent member assignments</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {driver.subscribers.map((sub) => (
                    <Link 
                      key={sub.id} 
                      href={`/drivers/chat/${sub.userId}`}
                      className="card-glass p-4 border-[#1a1a1a] hover:border-[#D4AF37]/30 transition-all group flex items-center justify-between bg-black/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-sm uppercase group-hover:bg-[#D4AF37]/10 transition-colors">
                          {sub.user.firstName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                            {sub.user.firstName} {sub.user.lastName}
                          </p>
                          <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest">
                            {sub.pickupCity} · {sub.direction}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {unreadCountsMap[sub.userId] > 0 && (
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF37] text-black text-[11px] font-black shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            {unreadCountsMap[sub.userId]}
                          </div>
                        )}
                        <ChevronRight size={14} className="text-[#333] group-hover:text-[#D4AF37] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Schedule & Profile ────────────────────────────── */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Daily Timeline */}
            <div className="card-glass border-[#1a1a1a] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1a1a1a] bg-[#0A0A0A]/50 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-2">
                  <Clock size={14} /> Today's Timeline
                </h3>
              </div>
              <div className="p-6">
                {bookings.length === 0 ? (
                  <div className="py-10 text-center space-y-3">
                    <Clock size={24} className="text-[#333] mx-auto" />
                    <p className="text-[10px] text-[#444] font-bold uppercase tracking-widest leading-relaxed px-4">
                      Daily schedule timeline will populate once routes are finalized
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-[#D4AF37]/50 before:to-transparent">
                    {bookings.map((b, idx) => (
                      <div key={idx} className="relative pl-8 group">
                        <div className={cn(
                          "absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-black z-10 transition-colors",
                          b.status === 'COMPLETED' ? "bg-emerald-500" : 
                          b.status === 'EN_ROUTE' ? "bg-blue-500 animate-pulse" : "bg-[#222]"
                        )} />
                        <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest">
                          {formatDateTime(b.scheduledAt)}
                        </p>
                        <h4 className="text-sm font-bold text-white mt-1">{b.subscriber.user.firstName} {b.subscriber.user.lastName}</h4>
                        <p className="text-[11px] text-[#666] line-clamp-1 mt-0.5">{b.pickupAddress}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Admin Alerts */}
            <div className="card-glass border-[#1a1a1a] bg-gradient-to-br from-[#080808] to-black">
              <div className="px-6 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Active Alerts</h3>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="p-5 space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className="flex gap-4 group">
                    <div className={cn(
                      "mt-1 p-1.5 rounded-lg border shrink-0",
                      alert.type === 'URGENT' ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                    )}>
                      <Info size={14} />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#A0A0A0] leading-relaxed italic">{alert.message}</p>
                      <p className="text-[9px] text-[#333] font-bold mt-1">SENT 12:45 PM</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Profile Card */}
            <div className="card-glass p-6 border-[#1a1a1a]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-xl shadow-inner uppercase font-display italic">
                  {driver.user.firstName[0]}{driver.user.lastName[0]}
                </div>
                <div>
                  <p className="font-bold text-white tracking-tight">{driver.user.firstName} {driver.user.lastName}</p>
                  <p className="text-[10px] text-[#A0A0A0] flex items-center gap-1 font-bold uppercase tracking-widest">
                    <ShieldCheck size={10} className="text-[#D4AF37]" /> Verified Chauffeur
                  </p>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#555] font-bold uppercase tracking-widest">License</span>
                  <span className="text-white font-medium">{driver.licenseNumber}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#555] font-bold uppercase tracking-widest">Vehicle</span>
                  <span className="text-white font-medium">{driver.vehicleYear} {driver.vehicleMake}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#555] font-bold uppercase tracking-widest">Plate</span>
                  <span className="text-[#D4AF37] font-bold">{driver.vehiclePlate}</span>
                </div>
              </div>
            </div>

            <LogoutButton
              label="End Shift & Sign Out"
              iconSize={16}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 text-xs font-bold text-[#EF4444]/60 hover:text-[#EF4444] hover:bg-[#EF4444]/5 border border-[#1e1e1e] rounded-2xl transition-all cursor-pointer uppercase tracking-[0.2em]"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
