import React from 'react';
import { Shield, FileText, Scale, Lock, Clock, AlertTriangle, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const sections = [
    {
      icon: <Scale className="text-[#D4AF37]" />,
      title: "1. Executive Master Agreement",
      content: "This agreement governs the use of ERANTT TRANSIT services. By utilizing our platform, you acknowledge that ERANTT TRANSIT is a structured, pre-scheduled executive commuter provider. We ARE NOT a dynamic rideshare service (like Uber/Lyft). Our business model is built on fixed-route density and manual logistics verification. All membership applications and route requests are subject to manual audit and executive approval."
    },
    {
      icon: <Clock className="text-[#D4AF37]" />,
      title: "2. Punctuality & Reservation Window",
      content: "To maintain our 99% reliability standard for airport arrivals, all transits must be scheduled at least 24 hours in advance. Same-day modifications are not supported by the commuter platform. Chauffeurs will wait for exactly 10 minutes past the scheduled pickup time before the transit is marked as a 'Departure Skip', which remains non-refundable."
    },
    {
      icon: <AlertTriangle className="text-[#D4AF37]" />,
      title: "3. Cancellation & Refund Policy",
      content: "Our infrastructure is pre-allocated based on scheduled demand. Cancellations made within 24 hours of the scheduled pickup are non-refundable. Cancellations made outside this window will be credited to your account for future use. Direct cash refunds are only issued if ERANTT TRANSIT fails to provide a vehicle within 30 minutes of the scheduled time due to internal fleet failure."
    },
    {
      icon: <Shield className="text-[#D4AF37]" />,
      title: "4. Service Corridor Limitations",
      content: "ERANTT TRANSIT operates exclusively within defined transit corridors (primarily Kingwood ↔ IAH). We do not accept 'off-route' destination requests. If your residence or destination is outside our active Service Zones, your application will be waitlisted until corridor density allows for expansion."
    },
    {
      icon: <FileText className="text-[#D4AF37]" />,
      title: "5. Billing & Commitment Fees",
      content: "Membership requires a commitment deposit (up to 20% of the weekly fare) to secure your recurring slot. Invoices are generated every Sunday for the following week. Failure to settle the weekly advance by Monday at 08:00 AM CST will result in immediate suspension of your scheduled transits for that week."
    },
    {
      icon: <UserCheck className="text-[#D4AF37]" />,
      title: "6. Passenger Conduct Code",
      content: "ERANTT TRANSIT maintains an executive environment. Smoking, vaping, and loud audio are strictly prohibited. Chauffeurs reserve the right to terminate any transit without refund if a passenger becomes verbally or physically abusive, or if their behavior compromises the safety of the vehicle."
    },
    {
      icon: <Lock className="text-[#D4AF37]" />,
      title: "7. Security & Privacy",
      content: "We utilize 256-bit encryption for all data storage. PII (Personally Identifiable Information) including IP addresses and precise geolocation data is logged for every trip to ensure accountability and network security. We do not sell passenger data to third-party marketing firms."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 hero-bg">
      <div className="container-max px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="section-title text-4xl md:text-5xl mb-4">Executive Terms</h1>
            <div className="gold-line" />
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
              <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-bold px-4 py-1.5 border border-[#D4AF37]/30 rounded-full bg-black/40">
                Version 1.2 • Regulatory Compliant
              </p>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">
                Last Revised: April 15, 2026
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="grid grid-cols-1 gap-6">
            {sections.map((section, idx) => (
              <div 
                key={idx} 
                className="card-glass p-8 md:p-12 border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="p-4 rounded-2xl bg-black/60 border border-[#222222] group-hover:border-[#D4AF37]/40 transition-colors shrink-0 md:mt-1">
                    {section.icon}
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors">
                      {section.title}
                    </h2>
                    <p className="text-[#A0A0A0] text-[15px] leading-relaxed font-medium">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Acceptance Footer */}
          <div className="mt-16 p-10 bg-black/40 border border-[#222] rounded-3xl text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />
             <p className="text-white-dim text-sm md:text-base italic relative z-10 leading-loose">
               "Membership in ERANTT TRANSIT is a privilege granted upon executive review. Use of our services constitutes irrevocable acceptance of these professional standards and logistics protocols."
             </p>
             <div className="mt-8 flex flex-col items-center gap-4 relative z-10">
               <div className="h-[1px] w-20 bg-[#D4AF37]/50" />
               <p className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-[0.5em]">
                 ERANTT TRANSIT · Compliance Authority
               </p>
             </div>
          </div>

          {/* Back Link */}
          <div className="mt-12 text-center">
            <Link href="/" className="text-[#555] hover:text-[#D4AF37] transition-colors text-[11px] uppercase tracking-[0.3em] font-bold">
              ← Return to Executive Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
