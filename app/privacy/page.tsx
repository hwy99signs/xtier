import React from 'react';
import { Shield, Lock, Eye, Server, RefreshCcw, Bell } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Lock className="text-[#D4AF37]" />,
      title: "1. Data Collection & Ethics",
      content: "xtier collects only the data necessary to provide safe, reliable, and premium transportation. This includes name, contact details, employer information (for corridor verification), and precise route requirements. We do not participate in broader data brokerage markets."
    },
    {
      icon: <Eye className="text-[#D4AF37]" />,
      title: "2. Surveillance & Geolocation",
      content: "For the safety of our passengers and chauffeurs, real-time GPS coordinates are monitored during active transits. This data is used solely for operational oversight, punctuality auditing, and emergency response activation. Historical location data is encrypted and purged after 90 days."
    },
    {
      icon: <Shield className="text-[#D4AF37]" />,
      title: "3. Information Safeguarding",
      content: "Our infrastructure utilizes industry-standard 256-bit SSL/TLS encryption for data in transit and AES-256 for data at rest. Access to passenger profiles is strictly limited to authorized dispatch and administrative personnel via multi-factor authentication."
    },
    {
      icon: <Server className="text-[#D4AF37]" />,
      title: "4. Third-Party Integration",
      content: "We utilize Stripe for PCI-compliant payment processing. Your full credit card details never touch our servers. We may share basic contact info with verified insurance partners solely for the purpose of maintaining our executive coverage standards."
    },
    {
      icon: <RefreshCcw className="text-[#D4AF37]" />,
      title: "5. Data Portability & Deletion",
      content: "Active members have the right to request a full export of their data or permanent account deletion. Note that certain billing and audit logs must be retained for a period of 7 years to comply with federal tax and transportation regulations."
    },
    {
      icon: <Bell className="text-[#D4AF37]" />,
      title: "6. Notification Protocols",
      content: "By subscribing, you agree to receive essential service-related communications via SMS and Email. You may opt-out of marketing communications at any time, but operational alerts (pickup confirmations, route changes) are mandatory for active transits."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 hero-bg">
      <div className="container-max px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="section-title text-4xl md:text-5xl mb-4">Privacy Doctrine</h1>
            <div className="gold-line" />
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
              <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-bold px-4 py-1.5 border border-[#D4AF37]/30 rounded-full bg-black/40">
                Tier-1 Security Protocol
              </p>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">
                Last Audit: April 15, 2026
              </p>
            </div>
          </div>

          {/* Privacy Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, idx) => (
              <div 
                key={idx} 
                className="card-glass p-8 border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex flex-col gap-6">
                  <div className="p-4 rounded-xl bg-black/60 border border-[#222222] group-hover:border-[#D4AF37]/40 transition-colors w-fit">
                    {section.icon}
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-lg font-display font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors uppercase">
                      {section.title}
                    </h2>
                    <p className="text-[#A0A0A0] text-sm leading-relaxed font-medium">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact for Privacy */}
          <div className="mt-16 p-10 bg-black/40 border border-[#222] rounded-3xl text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />
             <p className="text-white-dim text-sm italic relative z-10 leading-loose">
               "Your privacy is our baseline. Every byte of data is treated with the same commitment as our physical transit security."
             </p>
             <div className="mt-8 flex flex-col items-center gap-4 relative z-10">
               <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">
                 Direct Privacy Inquiries to:
               </p>
               <p className="text-[#D4AF37] font-bold text-xs">
                 privacy@xtier-transit.com
               </p>
             </div>
          </div>

          {/* Back Link */}
          <div className="mt-12 text-center">
            <Link href="/" className="text-[#555] hover:text-[#D4AF37] transition-colors text-[11px] uppercase tracking-[0.3em] font-bold">
              ← Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
