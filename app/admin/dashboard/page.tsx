import React from 'react';
import { 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight,
  ArrowDownRight,
  PlaneTakeoff,
  AlertCircle,
  Car
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  // Fetch real data (mocking for now due to empty DB)
  const subscriberCount = await prisma.subscriber.count();
  const driverCount = await prisma.driver.count();
  const pendingApprovals = await prisma.subscriber.count({ where: { status: 'PENDING_APPROVAL' } });
  
  const stats = [
    { 
      label: 'Active Subscribers', 
      value: subscriberCount || '24', 
      change: '+12%', 
      isPositive: true,
      icon: <Users className="text-blue-400" /> 
    },
    { 
      label: 'Elite Drivers', 
      value: driverCount || '8', 
      change: '+2', 
      isPositive: true,
      icon: <TrendingUp className="text-[#D4AF37]" /> 
    },
    { 
      label: 'Pending Reviews', 
      value: pendingApprovals || '7', 
      change: 'Urgent', 
      isPositive: false,
      icon: <AlertCircle className="text-error" /> 
    },
    { 
      label: 'Monthly Revenue', 
      value: formatCurrency(12450), 
      change: '+18.4%', 
      isPositive: true,
      icon: <PlaneTakeoff className="text-success" /> 
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-display font-bold">Logistics Oversight</h1>
            <p className="text-[#A0A0A0] text-sm mt-1">Real-time status of ERANTT TRANSIT Terminal operations.</p>
         </div>
         <div className="flex gap-4">
            <button className="btn-outline-gold text-xs py-2 px-6">Generate Report</button>
            <Link href="/admin/subscribers" className="btn-gold text-xs py-2 px-6">View Waitlist</Link>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card-glass p-6 border-[#222222] hover:border-[#D4AF37]/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-black/40 border border-[#222222]">
                 {stat.icon}
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                stat.isPositive ? "text-success bg-success/10" : "text-error bg-error/10"
              )}>
                {stat.isPositive ? <ArrowUpRight size={10} /> : <AlertCircle size={10} />}
                {stat.change}
              </div>
            </div>
            <p className="text-[#A0A0A0] text-xs uppercase tracking-widest font-semibold">{stat.label}</p>
            <p className="text-3xl font-display font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Live Operations Feed (Placeholder) */}
         <div className="lg:col-span-2 card-glass p-8 border-[#222222]">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-display font-bold text-xl uppercase tracking-widest">Active Transits</h3>
               <Link href="#" className="text-[#D4AF37] text-xs font-bold hover:underline">VIEW MAPS</Link>
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-[#222222]/50">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#222222] flex items-center justify-center">
                        <Car size={18} className="text-[#D4AF37]" />
                     </div>
                     <div>
                        <p className="text-sm font-bold">Member #ER-0{i}84</p>
                        <p className="text-[10px] text-[#666666] uppercase tracking-tighter">Kingwood Central ➔ Terminal C</p>
                     </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#D4AF37]">IN TRANSIT</p>
                    <p className="text-[10px] text-[#444444]">ETA: 14 MINS</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-4 border border-dashed border-[#222222] text-[#666666] text-xs hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all rounded-xl">
               EXPAND OPERATIONS FEED
            </button>
         </div>

         {/* Approval Queue (Placeholder) */}
         <div className="card-glass p-8 border-[#222222]">
            <h3 className="font-display font-bold text-xl uppercase tracking-widest mb-8">Review Queue</h3>
            <div className="space-y-6">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="flex items-center gap-4 py-2 border-b border-[#222222] last:border-0 pb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#222222] to-[#111111] flex items-center justify-center text-[10px] font-bold">
                       {String.fromCharCode(64 + i)}
                    </div>
                    <div className="flex-1">
                       <p className="text-xs font-bold">Application Rev: 0{i*23}</p>
                       <p className="text-[10px] text-[#A0A0A0]">Submitted 2h ago</p>
                    </div>
                    <Link href="/admin/subscribers" className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors">
                       <ArrowUpRight size={16} />
                    </Link>
                 </div>
               ))}
            </div>
            <Link href="/admin/subscribers" className="btn-gold w-full mt-8 py-3 text-xs">
               Manage All Pending
            </Link>
         </div>
      </div>
    </div>
  );
}

// Sub-component for stats conditional styling
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
