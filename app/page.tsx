import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Star, 
  ArrowRight,
  Plane,
  Car
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="hero-bg">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="container-max px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#D4AF37]/30 mb-8 blur-none backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                The Future of Executive Travel
              </span>
            </div>
            <h1 className="section-title mb-6 bg-gradient-to-r from-white via-[#F5E9B8] to-white bg-clip-text text-transparent">
              Elevated Transit <br /> 
              <span className="gold-shimmer">Kingwood to IAH</span>
            </h1>
            <p className="section-subtitle mb-10">
              Experience the distinction of a scheduled, fixed-route premium transit service. 
              Reliable, secure, and exclusively executive — designed for the discerning traveler.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/subscribe" className="btn-gold group">
                Apply for Membership
                <ChevronRight className="transition-transform group-hover:translate-x-1" size={18} />
              </Link>
              <Link href="/drivers" className="btn-outline-gold">
                Partner with us
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square rounded-full border border-[#D4AF37]/10 flex items-center justify-center">
              <div className="absolute inset-0 animate-pulse-gold rounded-full" />
              <div className="w-[85%] h-[85%] rounded-full border border-[#D4AF37]/20 flex items-center justify-center p-8 bg-[#161616] card-glass overflow-hidden">
                <div className="text-center">
                   <div className="gold-line w-12 h-1 bg-gradient-gold mx-auto mb-6" />
                   <p className="italic font-display text-2xl text-white/90 leading-relaxed">
                    "Precision scheduling meets unparalleled comfort. ERANTT TRANSIT redefined my airport arrivals."
                   </p>
                   <p className="mt-6 text-[#D4AF37] font-bold tracking-widest text-xs uppercase">
                    Premium Member Experience
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Section ────────────────────────────────────────────────── */}
      <section className="bg-black/50 py-12 border-y border-[#222222]">
        <div className="container-max px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Reliability', value: '100%' },
            { label: 'Minutes to IAH', value: '25-35' },
            { label: 'Elite Drivers', value: '50+' },
            { label: 'Destinations', value: 'Kingwood ↔ IAH' }
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-[#D4AF37] font-display text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-white-dim text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────────────────────── */}
      <section className="section-padding container-max px-6">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="section-title mb-4">Uncompromising Excellence</h2>
          <div className="gold-line" />
          <p className="section-subtitle mx-auto">
            ERANTT TRANSIT is not a rideshare. We are a specialized, scheduled transit service 
            focused on the Kingwood to IAH corridor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Clock className="text-[#D4AF37]" size={32} />,
              title: "Fixed-Route Precision",
              desc: "Optimized scheduling that guarantees punctual arrival at your terminal, every single time."
            },
            {
              icon: <ShieldCheck className="text-[#D4AF37]" size={32} />,
              title: "Exceptional Safety",
              desc: "Our drivers are vetted experts, and our executive vehicles undergo rigorous safety inspections weekly."
            },
            {
              icon: <Star className="text-[#D4AF37]" size={32} />,
              title: "Elite Fleet",
              desc: "Travel in comfort and style within our curated selection of black executive sedans and SUVs."
            }
          ].map((feature, idx) => (
            <div key={idx} className="card-glass p-10 flex flex-col items-center text-center group">
              <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-[#222222] group-hover:border-[#D4AF37]/30 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl mb-4 tracking-wide group-hover:text-[#D4AF37] transition-colors">{feature.title}</h3>
              <p className="text-sm text-white-muted leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Route Highlight ─────────────────────────────────────────────── */}
      <section className="bg-[#111111] section-padding">
        <div className="container-max px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div>
              <h2 className="section-title mb-8">Serving the <span className="text-gold">Kingwood Hub</span></h2>
              <p className="text-[#A0A0A0] leading-relaxed mb-8">
                Our operations are precisely tuned to the Kingwood community. We understand the commute patterns and terminal logistics of IAH better than anyone. 
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Point-to-Point Service", icon: <MapPin size={20} /> },
                  { title: "Terminal-Specific Drops", icon: <Plane size={20} /> },
                  { title: "Real-time Vehicle Tracking", icon: <Car size={20} /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full border border-[#222222] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                      {item.icon}
                    </div>
                    <span className="text-white font-medium">{item.title}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/subscribe" className="inline-flex items-center gap-2 text-[#D4AF37] font-bold mt-12 hover:gap-4 transition-all">
                CHECK SERVICE ZONES <ArrowRight size={20} />
              </Link>
           </div>
           
           <div className="relative">
              <div className="card-glass aspect-video overflow-hidden group">
                 <div className="absolute inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center p-12 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                       <ShieldCheck className="text-[#D4AF37]/20" size={120} />
                    </div>
                    <h3 className="font-display text-4xl mb-4 text-center z-10 font-bold uppercase tracking-widest italic">Fixed Price</h3>
                    <p className="text-[#D4AF37] font-display text-6xl font-black italic">$45</p>
                    <p className="text-xs tracking-[0.4em] uppercase text-white/40 mt-4">One way • Central Zone</p>
                 </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#D4AF37] text-black px-6 py-4 font-bold text-xs uppercase tracking-widest shadow-2xl">
                Flat Rate Guarantee
              </div>
           </div>
        </div>
      </section>

      {/* ─── CTA Section ─────────────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-to-b from-[#111111] to-[#0A0A0A]">
        <div className="container-max px-6">
           <div className="card-glass border-[#D4AF37]/20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px]" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px]" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                 <h2 className="section-title text-4xl md:text-5xl mb-6">Ready to Experience <br />Superior Transit?</h2>
                 <p className="section-subtitle mx-auto mb-10">
                    Join our exclusive subscriber group and secure your transit requirements with the best in the business.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/subscribe" className="btn-gold w-full sm:w-auto">
                      Become a Subscriber
                    </Link>
                    <Link href="/contact" className="btn-outline-gold w-full sm:w-auto">
                      Inquire Directly
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
