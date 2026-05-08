import React from 'react';
import { formatCurrency, formatDateTime, cn } from '@/lib/utils';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  Users, Car, Clock, CreditCard, AlertCircle, CheckCircle2,
  ArrowUpRight, ListFilter, Activity, DollarSign, ShieldCheck, ChevronRight
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const [
    pendingApprovals,
    approvedSubs,
    waitlisted,
    totalSubscribers,
    driversPending,
    totalDrivers,
    unpaidCount,
    recentLogs
  ] = await Promise.all([
    prisma.subscriber.count({ where: { status: 'PENDING_APPROVAL' } }),
    prisma.subscriber.count({ where: { status: 'APPROVED' } }),
    prisma.subscriber.count({ where: { status: 'WAITLISTED' } }),
    prisma.subscriber.count(),
    prisma.driver.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.driver.count(),
    prisma.subscriber.count({ where: { paymentStatus: 'UNPAID' } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  const statCards = [
    { label: 'Pending Requests', value: pendingApprovals, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', href: '/admin/subscribers' },
    { label: 'Approved Members', value: approvedSubs, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', href: '/admin/subscribers' },
    { label: 'Waitlisted', value: waitlisted, icon: ListFilter, color: 'text-blue-400', bg: 'bg-blue-400/10', href: '/admin/waitlist' },
    { label: 'Active Rides', value: totalSubscribers, icon: Users, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', href: '/admin/subscribers' },
    { label: 'Driver Apps', value: driversPending, icon: Car, color: 'text-purple-400', bg: 'bg-purple-400/10', href: '/admin/drivers' },
    { label: 'Pending Payments', value: unpaidCount, icon: CreditCard, color: 'text-red-400', bg: 'bg-red-400/10', href: '/admin/payments' },
    { label: 'Total Drivers', value: totalDrivers, icon: ShieldCheck, color: 'text-cyan-400', bg: 'bg-cyan-400/10', href: '/admin/drivers' },
    { label: 'Total Members', value: totalSubscribers, icon: Activity, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', href: '/admin/subscribers' },
  ];

  const quickActions = [
    { label: 'Review Pending', href: '/admin/subscribers', icon: Clock },
    { label: 'Approve Drivers', href: '/admin/drivers', icon: Car },
    { label: 'Update Pricing', href: '/admin/pricing', icon: DollarSign },
    { label: 'Manage Routes', href: '/admin/routes', icon: ArrowUpRight },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck },
    { label: 'Settings', href: '/admin/settings', icon: AlertCircle },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Logistics Oversight</h1>
          <p className="text-[#A0A0A0] text-sm mt-1">xtier operational command center.</p>
        </div>
        <Link href="/admin/subscribers" className="btn-gold text-xs py-2.5 px-6">
          Review Pending Applications
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Link key={i} href={s.href}
            className="card-glass p-5 border-[#1e1e1e] hover:border-[#D4AF37]/20 transition-all group">
            <div className={cn('inline-flex p-2.5 rounded-xl mb-3', s.bg)}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className="text-2xl font-display font-bold text-white group-hover:text-[#D4AF37] transition-colors">
              {s.value ?? 0}
            </p>
            <p className="text-[11px] text-[#666666] uppercase tracking-widest font-semibold mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 card-glass p-6 border-[#1e1e1e]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg uppercase tracking-widest">Recent Activity</h3>
            <Link href="/admin/audit-logs" className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:underline">
              View All
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <div className="text-center py-12 opacity-40">
              <Activity size={40} className="text-[#D4AF37] mx-auto mb-3" />
              <p className="text-xs uppercase tracking-widest font-bold">No activity recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-4 p-3 rounded-xl bg-black/20 border border-[#1e1e1e]">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <ShieldCheck size={14} className="text-[#D4AF37]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{log.action.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] text-[#555555]">
                      {log.adminName} · {formatDateTime(log.createdAt)}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                    {log.targetEntity ?? 'System'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card-glass p-6 border-[#1e1e1e]">
          <h3 className="font-display font-bold text-lg uppercase tracking-widest mb-6">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#1e1e1e] hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-[#222] flex items-center justify-center">
                  <action.icon size={14} className="text-[#D4AF37]" />
                </div>
                <span className="text-sm font-medium text-[#A0A0A0] group-hover:text-white transition-colors flex-1">
                  {action.label}
                </span>
                <ChevronRight size={14} className="text-[#333] group-hover:text-[#D4AF37] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
