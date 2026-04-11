import React from 'react';
import { Shield, FileText, Scale, Lock, Clock } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      icon: <Scale className="text-[#D4AF37]" />,
      title: "1. Executive Master Agreement",
      content: "This agreement governs the use of ERANTT TRANSIT services between Kingwood and George Bush Intercontinental Airport (IAH). By using our service, you acknowledge that ERANTT TRANSIT is a scheduled executive transit provider, not a general rideshare service. All bookings are subject to manual approval and driver assignment."
    },
    {
      icon: <Clock className="text-[#D4AF37]" />,
      title: "2. Cancellation & No-Show Policy",
      content: "Due to the specialized nature of our transit schedules, cancellations made less than 12 hours before the scheduled pickup are non-refundable. 'No-shows' will be charged the full fare amount plus a $25 recovery fee. Changes to reservations must be made at least 6 hours in advance and are subject to availability."
    },
    {
      icon: <Shield className="text-[#D4AF37]" />,
      title: "3. Service Limitations",
      content: "Our primary service area is strictly defined by our established Service Zones within the Kingwood and IAH corridor. Pickups or drop-offs outside these zones may be rejected or subject to out-of-area premium surcharges. We reserve the right to refuse service for behavioral or safety violations."
    },
    {
      icon: <FileText className="text-[#D4AF37]" />,
      title: "4. Payment Terms",
      content: "Subscribers agree to an upfront commitment payment (up to 20%) at the time of booking confirmation. The month-end balance will be automatically processed via the secure card on file. Failed payments will result in immediate suspension of executive membership privileges."
    },
    {
      icon: <Lock className="text-[#D4AF37]" />,
      title: "5. Data & Privacy",
      content: "We collect IP addresses, timestamps, and geolocation data to ensure the security of our executive network and the punctuality of our service. Your data is encrypted and never sold to third parties. For full details, refer to our Privacy Policy."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 hero-bg">
      <div className="container-max px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="section-title text-4xl mb-4">Terms of Service</h1>
            <div className="gold-line" />
            <p className="text-[#A0A0A0] text-sm uppercase tracking-[0.3em] font-semibold">
              Version 1.0 • Effective April 10, 2026
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="card-glass p-8 md:p-10 border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-black/40 border border-[#222222]">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-display font-bold text-white tracking-wide">
                    {section.title}
                  </h2>
                </div>
                <p className="text-[#A0A0A0] leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-black/40 border border-[#222222] rounded-2xl text-center">
             <p className="text-white-dim text-sm italic">
               "By continuing to use ERANTT TRANSIT, you agree that you have read, understood, and agreed to be bound by these terms."
             </p>
             <p className="mt-4 text-[#D4AF37] font-bold text-xs uppercase tracking-widest">
               ERANTT TRANSIT legal department
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
