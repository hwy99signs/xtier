import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from '@/components/Logo';

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#111111] pt-20 pb-10 border-t border-[#222222]">
      <div className="container-max px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
             <Link href="/" className="mb-6 inline-block">
              <Logo variant="full" className="h-10" />
            </Link>
             <p className="text-[#A0A0A0] text-base leading-relaxed mb-8">
              Premium executive transportation connecting Kingwood and George Bush Intercontinental Airport with elite service and reliability. Operated by ERANTT TRANSIT.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 rounded-full border border-[#222222] text-[#A0A0A0] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <InstagramIcon size={18} />
              </Link>
              <Link href="#" className="p-2 rounded-full border border-[#222222] text-[#A0A0A0] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <FacebookIcon size={18} />
              </Link>
              <Link href="#" className="p-2 rounded-full border border-[#222222] text-[#A0A0A0] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <LinkedinIcon size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-base mb-6 tracking-wide">QUICK LINKS</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-[#A0A0A0] text-[15px] hover:text-[#D4AF37] transition-colors">Home</Link></li>
              <li><Link href="/subscribe" className="text-[#A0A0A0] text-[15px] hover:text-[#D4AF37] transition-colors">Subscribe Now</Link></li>
              <li><Link href="/drivers" className="text-[#A0A0A0] text-[15px] hover:text-[#D4AF37] transition-colors">Drive With Us</Link></li>
              <li><Link href="/terms" className="text-[#A0A0A0] text-[15px] hover:text-[#D4AF37] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-base mb-6 tracking-wide">CONTACT</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[#A0A0A0] text-[15px]">
                <MapPin className="text-[#D4AF37] shrink-0" size={18} />
                <span>Kingwood, TX & IAH Airport Area</span>
              </li>
              <li className="flex items-center gap-3 text-[#A0A0A0] text-[15px]">
                <Phone className="text-[#D4AF37] shrink-0" size={18} />
                <span>(832) 555-ERANTT-TRANSIT</span>
              </li>
              <li className="flex items-center gap-3 text-[#A0A0A0] text-[15px]">
                <Mail className="text-[#D4AF37] shrink-0" size={18} />
                <span>service@erantt-transit.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-base mb-6 tracking-wide">NEWSLETTER</h4>
            <p className="text-[#A0A0A0] text-sm mb-4">Subscribe to receive updates and exclusive offers.</p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="input-field py-2 text-sm"
              />
              <button className="btn-gold py-2 text-xs">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-[#222222] flex flex-col md:flex-row items-center justify-between gap-4 text-[#666666] text-sm">
          <p>© {new Date().getFullYear()} ERANTT TRANSIT Services LLC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
