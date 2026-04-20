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
  Car,
  Waypoints,
  ListChecks,
  CalendarCheck
} from 'lucide-react';
import { launchConfig } from '@/lib/launch-config';

export default function HomePage() {
  const { hero, stats, rules, flow } = launchConfig;

  // Icon mapper for the rules
  const renderRuleIcon = (iconType: string) => {
    switch (iconType) {
      case 'Route': return <Waypoints className="text-[#D4AF37]" size={32} />;
      case 'Schedule': return <CalendarCheck className="text-[#D4AF37]" size={32} />;
      case 'Exclusive': return <ShieldCheck className="text-[#D4AF37]" size={32} />;
      default: return <Star className="text-[#D4AF37]" size={32} />;
    }
  };

  return (
    <div className="hero-bg">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-40 lg:pt-48 pb-24 overflow-hidden">
        <div className="container-max px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/40 border border-[#D4AF37]/30 mb-8 blur-none backdrop-blur-md shadow-lg shadow-black/50">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                {hero.badge}
              </span>
            </div>
            <h1 className="section-title mb-6 bg-gradient-to-r from-white via-[#F5E9B8] to-white bg-clip-text text-transparent">
              {hero.title} <br /> 
              <span className="gold-shimmer">{hero.titleHighlight}</span>
            </h1>
            <p className="section-subtitle mb-10">
              {hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
              <Link href="/subscribe" className="btn-gold group px-8 py-4 text-[15px] shadow-lg shadow-[#D4AF37]/10 hover:shadow-[#D4AF37]/30">
                Apply for Membership
                <ChevronRight className="transition-transform group-hover:translate-x-1" size={18} />
              </Link>
              <Link href="/drivers" className="btn-outline-gold px-8 py-4 text-[15px]">
                Partner with us
              </Link>
            </div>
            <p className="mt-8 text-[#A0A0A0] text-sm uppercase tracking-widest font-bold">
              {hero.primaryRoute}
            </p>
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
                   <p className="mt-6 text-[#D4AF37] font-bold tracking-widest text-sm uppercase">
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
          {stats.map((stat) => (
            <div key={stat.label} className="p-4">
              <p className="text-[#D4AF37] font-display text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-white-dim text-sm uppercase tracking-wider font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Business Rules Section (Replaces Features) ───────────────────── */}
      <section className="section-padding container-max px-6">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="section-title mb-4">{rules.title}</h2>
          <div className="gold-line" />
          <p className="section-subtitle mx-auto">
            {rules.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rules.items.map((feature, idx) => (
            <div key={idx} className="card-glass p-10 flex flex-col items-center text-center group">
              <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-[#222222] group-hover:border-[#D4AF37]/30 transition-all duration-300">
                {renderRuleIcon(feature.iconType)}
              </div>
              <h3 className="text-xl mb-4 tracking-wide group-hover:text-[#D4AF37] transition-colors">{feature.title}</h3>
              <p className="text-sm text-white-muted leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Launch Flow (Replaces Route Highlight) ───────────────────────── */}
      <section className="bg-[#111111] section-padding border-y border-[#222222]">
        <div className="container-max px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div>
              <h2 className="section-title mb-8">{flow.title}</h2>
              <p className="text-[#A0A0A0] leading-relaxed mb-8">
                {flow.subtitle}
              </p>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#333333] before:to-transparent">
                {flow.steps.map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#222222] bg-[#111111] text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <span className="font-bold text-sm">{item.step}</span>
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg bg-black/40 border border-[#222222] shadow">
                      <h4 className="font-bold text-white mb-2 text-lg group-hover:text-[#D4AF37] transition-colors">{item.title}</h4>
                      <p className="text-[15px] leading-relaxed text-[#A0A0A0]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/subscribe" className="inline-flex items-center gap-2 text-[#D4AF37] font-bold mt-16 text-[15px] hover:gap-4 transition-all uppercase tracking-widest">
                SUBMIT YOUR REQUEST <ArrowRight size={20} />
              </Link>
           </div>
           
           <div className="relative pb-6 pl-6 mt-12 md:mt-0">
              <div className="card-glass aspect-video overflow-hidden group">
                 <div className="absolute inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center p-8 md:p-12 pb-16 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                       <ListChecks className="text-[#D4AF37]/20" size={120} />
                    </div>
                    <h3 className="font-display text-2xl mb-4 text-center z-10 font-bold uppercase tracking-widest italic text-white/80">Application Required</h3>
                    <p className="text-[#D4AF37] font-display text-3xl md:text-4xl font-black italic mt-2 text-center z-10">No Automatic Approvals</p>
                    <p className="text-[11px] md:text-[13px] tracking-[0.4em] uppercase text-white/50 mt-6 text-center font-semibold z-10">Quality & Reliability Guaranteed</p>
                 </div>
              </div>
              <div className="absolute bottom-0 left-0 bg-[#D4AF37] text-black px-6 md:px-8 py-4 font-bold text-xs md:text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(212,175,55,0.3)] z-20 border border-[#bfa238]">
                Manual Verification
              </div>
           </div>
        </div>
      </section>

      {/* ─── Rollout Strategy Section ────────────────────────────────────── */}
      <section className="section-padding container-max px-6 border-t border-[#222222]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-6 font-display">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37]">The Expansion Blueprint</span>
            </div>
            <h2 className="section-title mb-6 text-left">Controlled Stage-Based Rollout</h2>
            <p className="text-[#A0A0A0] leading-relaxed mb-8">
              To maintain our uncompromising standard of reliability, ERANTT TRANSIT expands using a strict density-first model. We do not open new corridors until existing routes reach 100% operational stability.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-lg bg-black/40 border border-[#D4AF37]/20 flex items-center justify-center shrink-0 font-display font-bold text-[#D4AF37]">01</div>
                <div>
                  <h4 className="text-white font-bold mb-1 tracking-wide uppercase">Current: Kingwood Corridor</h4>
                  <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">Active & Accepting Subscriber Applications</p>
                </div>
              </div>
              <div className="flex gap-4 items-center opacity-50">
                <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0 font-display font-bold text-white/40">02</div>
                <div>
                  <h4 className="text-white/60 font-bold mb-1 tracking-wide uppercase">Upcoming: Atascocita Loop</h4>
                  <p className="text-[10px] text-[#666666] uppercase tracking-widest">In Feasibility Assessment</p>
                </div>
              </div>
              <div className="flex gap-4 items-center opacity-25">
                <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0 font-display font-bold text-white/40">03</div>
                <div>
                  <h4 className="text-white/40 font-bold mb-1 tracking-wide uppercase">Future: Humble Express</h4>
                  <p className="text-[10px] text-[#666666] uppercase tracking-widest">Waitlist Data Collection Only</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-glass p-10 border-[#D4AF37]/10 relative overflow-hidden group animate-fade-in-up transition-all duration-500 hover:border-[#D4AF37]/30">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <ShieldCheck className="text-[#D4AF37]" size={150} />
            </div>
            <h3 className="font-display text-xl mb-4 text-[#D4AF37] uppercase tracking-widest font-bold">Route Stability Commitment</h3>
            <p className="text-sm text-[#A0A0A0] leading-relaxed mb-8 relative z-10">
              Our business model wins through route density. We do not operate dynamic "on-the-fly" routes. Every subscription contributes to the stabilization of a permanent transit pillar in your community.
            </p>
            <div className="p-6 bg-black/60 rounded-xl border border-white/5 relative z-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] mb-3 font-black">Operational Rule</p>
              <p className="text-sm italic text-white/80 leading-relaxed">
                "Consistency is the only metric that matters in executive transit. We launch slow to finish first."
              </p>
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
                    Apply for our exclusive subscriber group and secure your structured transit schedule with the best professionals in Kingwood.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                    <Link href="/subscribe" className="btn-gold w-full sm:w-auto px-8 py-4 text-[15px] shadow-lg shadow-[#D4AF37]/10 hover:shadow-[#D4AF37]/30">
                      Submit Route Request
                    </Link>
                    <Link href="/contact" className="btn-outline-gold w-full sm:w-auto px-8 py-4 text-[15px]">
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
