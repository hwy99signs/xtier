'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

const links = [
  { name: 'Home', href: '/' },
  { name: 'Subscribe', href: '/subscribe' },
  { name: 'Drive with Us', href: '/drivers' },
  { name: 'Terms', href: '/terms' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Hide the public navbar on all portal pages — they have their own headers
  const isPortalPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/drivers') ||
    pathname.startsWith('/admin') ||
    pathname === '/login';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isPortalPage) return null;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'nav-glass py-3' : 'bg-transparent py-6'
      )}
    >
      <div className="container-max flex items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Logo variant="full" className="h-8 md:h-10 transition-all duration-300" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'text-[15px] font-medium tracking-wide transition-colors hover:text-[#D4AF37]',
                pathname === link.href ? 'text-[#D4AF37]' : 'text-[#A0A0A0]'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            id="nav-login-btn"
            className="btn-gold py-2 px-6 text-xs flex items-center gap-2"
          >
            <LogIn size={14} /> Login
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="inline-flex md:hidden text-white z-50 p-2 items-center justify-center rounded-md hover:bg-white/10"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/95 z-40 md:hidden transition-all duration-300 flex flex-col items-center justify-center gap-8',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'text-2xl font-display font-semibold transition-colors hover:text-[#D4AF37]',
              pathname === link.href ? 'text-[#D4AF37]' : 'text-white'
            )}
            onClick={() => setIsOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        <Link
          href="/login"
          className="btn-gold mt-4 flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <LogIn size={16} /> Login
        </Link>
      </div>
    </nav>
  );
}
