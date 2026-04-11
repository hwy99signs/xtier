import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Map, 
  Settings, 
  LogOut,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#222222] bg-[#0A0A0A] flex flex-col fixed h-full z-30">
        <div className="p-8">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Logo variant="mark" className="h-8" />
            <span className="font-display font-bold text-lg tracking-wider text-white">
              ADMIN
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {[
            { name: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/admin/dashboard' },
            { name: 'Subscribers', icon: <Users size={18} />, href: '/admin/subscribers' },
            { name: 'Drivers', icon: <Car size={18} />, href: '/admin/drivers' },
            { name: 'Service Zones', icon: <Map size={18} />, href: '/admin/zones' },
            { name: 'Pricing Rules', icon: <Settings size={18} />, href: '/admin/pricing' },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#A0A0A0] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 rounded-xl transition-all"
            >
              <span className="text-inherit">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#222222]">
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/admin/login' });
            }}
          >
            <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-error/70 hover:text-error hover:bg-error/5 rounded-xl transition-all w-full">
              <LogOut size={18} />
              Logout Session
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-[#222222] bg-[#0A0A0A]/50 backdrop-blur-md sticky top-0 z-20 px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 bg-black/40 border border-[#222222] px-4 py-2 rounded-xl w-96">
            <Search className="text-[#666666]" size={16} />
            <input 
              type="text" 
              placeholder="Search subscribers, drivers, or bookings..." 
              className="bg-transparent border-none outline-none text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 rounded-full border border-[#222222] text-[#A0A0A0] hover:text-[#D4AF37] transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-[#0A0A0A]" />
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-[#222222]">
               <div className="text-right">
                  <p className="text-sm font-bold text-white">{session?.user?.name}</p>
                  <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-black uppercase">Administrator</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#222222] to-[#111111] border border-[#333333] flex items-center justify-center">
                  <Users className="text-[#666666]" size={20} />
               </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
