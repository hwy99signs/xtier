import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Route,
  DollarSign,
  CreditCard,
  FileText,
  Shield,
  Settings,
  LogOut,
  Bell,
  Search,
  ListFilter,
  Map
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { MockSession } from '@/lib/mock-data';
import { LogoutButton } from '@/components/LogoutButton';

const sidebarLinks = [
  { name: 'Dashboard',    icon: LayoutDashboard, href: '/admin/dashboard' },
  { name: 'Subscribers',  icon: Users,            href: '/admin/subscribers' },
  { name: 'Drivers',      icon: Car,              href: '/admin/drivers' },
  { name: 'Routes',       icon: Route,            href: '/admin/routes' },
  { name: 'Zones',        icon: Map,              href: '/admin/zones' },
  { name: 'Pricing',      icon: DollarSign,       href: '/admin/pricing' },
  { name: 'Payments',     icon: CreditCard,       href: '/admin/payments' },
  { name: 'Waitlist',     icon: ListFilter,       href: '/admin/waitlist' },
  { name: 'Terms',        icon: FileText,         href: '/admin/terms' },
  { name: 'Audit Logs',   icon: Shield,           href: '/admin/audit-logs' },
  { name: 'Settings',     icon: Settings,         href: '/admin/settings' },
];

import { auth } from '@/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className="w-64 border-r border-[#1a1a1a] bg-[#080808] flex flex-col fixed h-full z-30">
        {/* Logo */}
        <div className="px-6 pt-8 pb-6 border-b border-[#1a1a1a]">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Logo variant="mark" className="h-8" />
            <div>
              <span className="font-display font-bold text-base tracking-wider text-white block">ERANTT</span>
              <span className="text-[10px] text-[#D4AF37] font-bold tracking-[0.3em] uppercase">Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {sidebarLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#A0A0A0] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 rounded-xl transition-all group"
            >
              <item.icon size={16} className="group-hover:text-[#D4AF37] transition-colors shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#1a1a1a]">
          <LogoutButton
            label="Logout Session"
            iconSize={16}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#EF4444]/60 hover:text-[#EF4444] hover:bg-[#EF4444]/5 rounded-xl transition-all w-full cursor-pointer"
          />
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-[#1a1a1a] bg-[#080808]/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 bg-black/40 border border-[#1e1e1e] px-4 py-2 rounded-xl w-80">
            <Search className="text-[#555555]" size={14} />
            <input
              type="text"
              placeholder="Search subscribers, drivers..."
              className="bg-transparent border-none outline-none text-xs w-full text-[#A0A0A0] placeholder:text-[#444444]"
            />
          </div>

          <div className="flex items-center gap-5">
            <button className="p-2 rounded-full border border-[#1e1e1e] text-[#666666] hover:text-[#D4AF37] transition-all relative">
              <Bell size={16} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#EF4444] rounded-full border border-[#080808]" />
            </button>
            <Link href="/" className="text-[10px] text-[#555555] hover:text-[#D4AF37] uppercase tracking-widest font-bold transition-colors">
              Public Site ↗
            </Link>
            <div className="flex items-center gap-3 pl-5 border-l border-[#1e1e1e]">
              <div className="text-right">
                <p className="text-sm font-bold text-white leading-none">{session?.user?.name}</p>
                <p className="text-[9px] text-[#D4AF37] uppercase tracking-[0.25em] font-black mt-0.5">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center">
                <Shield className="text-[#D4AF37]" size={16} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
