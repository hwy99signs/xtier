import React from 'react';
import { Check, Plane, Clock, Shield, Star, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Executive Sedan',
      price: '45',
      desc: 'The standard for professional solo travelers.',
      features: ['Up to 3 passengers', 'Professional Chauffeur', 'Flight Tracking', 'Complimentary Bottled Water'],
      cta: 'Book Now',
      featured: false
    },
    {
      name: 'Luxury SUV',
      price: '85',
      desc: 'Maximum comfort for small groups and luggage.',
      features: ['Up to 6 passengers', 'Executive Leather Seating', 'Wi-Fi Access', 'Priority Booking', 'Terminal Meet & Greet'],
      cta: 'Apply for Elite Access',
      featured: true
    },
    {
      name: 'Corporate Fleet',
      price: 'Contact',
      desc: 'Bespoke solutions for Kingwood businesses.',
      features: ['Dedicated Account Manager', 'Monthly Billing', 'Unlimted Schedule Changes', 'Guaranteed Availability'],
      cta: 'Inquire Directly',
      featured: false
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 hero-bg">
      <div className="container-max px-6">
        <div className="text-center mb-16">
          <h1 className="section-title text-4xl mb-4">Elite Pricing Structure</h1>
          <div className="gold-line" />
          <p className="section-subtitle mx-auto">
            Transparent, fixed-rate executive transit between Kingwood and IAH. No surge pricing, no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div key={idx} className={cn(
              "card-glass flex flex-col p-10 border-[#222222] transition-all duration-500",
              tier.featured ? "border-[#D4AF37]/40 shadow-[0_0_40px_rgba(212,175,55,0.1)] scale-105 z-10" : "hover:border-[#D4AF37]/20"
            )}>
              {tier.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              <div className="mb-8">
                 <h3 className="font-display text-2xl font-bold mb-2">{tier.name}</h3>
                 <p className="text-[#A0A0A0] text-sm">{tier.desc}</p>
              </div>

              <div className="mb-10 flex items-baseline gap-1">
                 <span className="text-[#D4AF37] text-2xl font-display font-medium">$</span>
                 <span className="text-white text-6xl font-display font-bold">{tier.price}</span>
                 {tier.price !== 'Contact' && <span className="text-[#666666] text-sm lowercase tracking-widest font-bold">/way</span>}
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                 {tier.features.map((feature, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-[#A0A0A0]">
                      <Check className="text-[#D4AF37] shrink-0" size={18} />
                      {feature}
                   </li>
                 ))}
              </ul>

              <Link 
                href="/subscribe" 
                className={cn(
                  "w-full py-4 text-center text-xs font-black uppercase tracking-[0.2em] transition-all rounded-xl",
                  tier.featured ? "btn-gold" : "btn-outline-gold"
                )}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { icon: <Shield size={20} />, title: "Full Insurance", desc: "Commercial liability coverage for all executive transits." },
             { icon: <Clock size={20} />, title: "Wait Protection", desc: "15 minutes of complimentary wait time at all terminals." },
             { icon: <Plane size={20} />, title: "Flight Tracking", desc: "Automatic adjustment for delays or early arrivals." },
             { icon: <DollarSign size={20} />, title: "Fixed Fare", desc: "The price you see is the price you pay. Guaranteed." }
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-black/40 border border-[#222222] flex items-center justify-center text-[#D4AF37] mb-4">
                   {item.icon}
                </div>
                <h4 className="font-bold text-sm mb-2 uppercase tracking-widest">{item.title}</h4>
                <p className="text-[#666666] text-xs leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
