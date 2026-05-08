'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, ChevronRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Invalid admin credentials. Access denied.');
        return;
      }

      // Success - Redirect to admin dashboard
      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6 relative overflow-hidden">
      {/* Background glows - more subtle/serious for admin */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37] rounded-full blur-[160px] opacity-[0.04]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#D4AF37] rounded-full blur-[160px] opacity-[0.04]" />
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center mb-8">
            <Logo variant="full" className="h-36" />
          </Link>
          <h1 className="font-display text-3xl font-bold text-white tracking-wide mb-2">
            Terminal Access
          </h1>
          <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.5em] font-black">
            Administrative Control Portal
          </p>
        </div>

        {/* Login card */}
        <div className="card-glass p-8 md:p-10 border-[#D4AF37]/20 bg-black/40">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="input-label flex items-center gap-2 text-[#666]">
                <Mail size={13} /> Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field border-[#1a1a1a] focus:border-[#D4AF37]/50"
                placeholder="admin@xtier.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="input-label flex items-center gap-2 text-[#666]">
                <Lock size={13} /> Security Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field border-[#1a1a1a] focus:border-[#D4AF37]/50 pr-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#333] hover:text-[#D4AF37] transition-colors p-1 z-20"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
                <AlertCircle className="text-red-400 shrink-0" size={16} />
                <p className="text-xs text-red-400 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full h-14 text-sm group mt-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] border-none text-black font-black uppercase tracking-widest"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Initialize Session <ChevronRight className="transition-transform group-hover:translate-x-1" size={16} />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-black/60 border border-[#1a1a1a] rounded-xl">
            <ShieldCheck className="text-[#D4AF37]" size={14} />
            <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">
              Restricted Area • Personnel Only
            </span>
          </div>
          <p>
            <Link href="/" className="text-[#333] hover:text-[#D4AF37] text-[10px] uppercase tracking-widest font-black transition-all">
              ← Return to Secure Perimeter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
