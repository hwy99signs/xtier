import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock, Globe } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 hero-bg">
      <div className="container-max px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="section-title text-4xl md:text-5xl mb-4">Executive Inquiries</h1>
            <div className="gold-line mx-auto" />
            <p className="section-subtitle mx-auto mt-6">
              Our concierge team is available for bespoke transit requests and membership vetting inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1 space-y-8 animate-fade-in-left">
              <div className="card-glass p-8 border-[#D4AF37]/10">
                <h3 className="text-[#D4AF37] font-display font-bold text-lg mb-8 uppercase tracking-widest italic">Direct Channels</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-lg bg-black/40 border border-[#222222] group-hover:border-[#D4AF37]/40 transition-colors">
                      <Phone className="text-[#D4AF37]" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1 font-bold">Concierge Line</p>
                      <p className="text-white font-bold group-hover:text-[#D4AF37] transition-colors">(832) 555-ERANTT</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-lg bg-black/40 border border-[#222222] group-hover:border-[#D4AF37]/40 transition-colors">
                      <Mail className="text-[#D4AF37]" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1 font-bold">Executive Email</p>
                      <p className="text-white font-bold group-hover:text-[#D4AF37] transition-colors">service@erantt-transit.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-lg bg-black/40 border border-[#222222] group-hover:border-[#D4AF37]/40 transition-colors">
                      <MapPin className="text-[#D4AF37]" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1 font-bold">HQ Operations</p>
                      <p className="text-white font-bold group-hover:text-[#D4AF37] transition-colors">Kingwood, TX Corridor</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-glass p-8 border-[#D4AF37]/10 bg-gradient-to-br from-[#111] to-black">
                <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                  <Clock size={18} />
                  <h4 className="text-xs uppercase tracking-widest font-black">Dispatch Hours</h4>
                </div>
                <div className="space-y-2 text-sm text-[#A0A0A0]">
                  <div className="flex justify-between">
                    <span>Mon - Fri</span>
                    <span className="text-white font-medium">04:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sat - Sun</span>
                    <span className="text-white font-medium">06:00 - 20:00</span>
                  </div>
                  <p className="mt-4 text-[10px] italic border-t border-white/5 pt-4">
                    Active transits are monitored 24/7 by our flight-aware dispatch board.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 animate-fade-in-right">
              <div className="card-glass p-8 md:p-12 border-[#D4AF37]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                  <Globe className="text-[#D4AF37]" size={200} />
                </div>
                
                <h3 className="text-2xl font-display font-bold text-white mb-2 relative z-10">Briefing Request</h3>
                <p className="text-white-dim text-sm mb-10 relative z-10 italic">
                  Complete the form below for specialist assistance or enterprise fleet inquiries.
                </p>

                <form className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="input-label">Full Name</label>
                      <input type="text" className="input-field" placeholder="e.g. David Wentworth" />
                    </div>
                    <div className="space-y-2">
                      <label className="input-label">Corporate Email</label>
                      <input type="email" className="input-field" placeholder="d.wentworth@enterprise.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="input-label">Subject</label>
                    <select className="input-field">
                      <option>Membership Vetting Inquiry</option>
                      <option>Enterprise Fleet Partnership</option>
                      <option>Technical Support</option>
                      <option>Media & Press Inquiries</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="input-label">Message Brief</label>
                    <textarea 
                      className="input-field min-h-[150px] py-4" 
                      placeholder="Please provide specific details regarding your inquiry..."
                    />
                  </div>

                  <button className="btn-gold w-full md:w-auto px-12 h-14 uppercase tracking-widest font-black text-xs shadow-xl shadow-[#D4AF37]/10">
                    Submit Briefing
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Link or Return */}
          <div className="mt-16 text-center">
            <p className="text-white/40 text-sm mb-6 uppercase tracking-widest">Applying for membership?</p>
            <Link href="/subscribe" className="btn-outline-gold inline-flex px-10 h-12 text-xs">
              Begin Subscription Process
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
