'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, ChevronRight, Car, Users, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
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
        setError('Invalid email or password. Please try again.');
        return;
      }

      // Success - Redirect manually to let the server-side redirects in dashboard handle role routing
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37] rounded-full blur-[160px] opacity-[0.06]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#D4AF37] rounded-full blur-[160px] opacity-[0.06]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37] rounded-full blur-[200px] opacity-[0.03]" />
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center mb-8">
            <Logo variant="full" className="h-14" />
          </Link>
          <h1 className="font-display text-3xl font-bold text-white tracking-wide mb-2">
            Member Access
          </h1>
          <p className="text-[#D4AF37] text-[11px] uppercase tracking-[0.4em] font-bold">
            Member &amp; Driver Portal
          </p>
        </div>

        {/* Role indicators */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/15">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <Users size={14} className="text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white uppercase tracking-widest">Member</p>
              <p className="text-[10px] text-[#555]">View your booking</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/15">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <Car size={14} className="text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white uppercase tracking-widest">Driver</p>
              <p className="text-[10px] text-[#555]">Manage your routes</p>
            </div>
          </div>
        </div>

        {/* Login card */}
        <div className="card-glass p-8 md:p-10 border-[#D4AF37]/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label flex items-center gap-2">
                <Mail size={13} /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="input-label flex items-center gap-2">
                <Lock size={13} /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#D4AF37] transition-colors p-1 z-20"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              id="login-submit"
              disabled={isLoading}
              className="btn-gold w-full h-12 text-sm group mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ChevronRight className="transition-transform group-hover:translate-x-1" size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1e1e1e] text-center">
            <p className="text-xs text-[#555]">
              Not a member yet?{' '}
              <Link href="/subscribe" className="text-[#D4AF37] hover:underline font-bold">
                Subscribe as Member
              </Link>
              {' '}or{' '}
              <Link href="/drivers" className="text-[#D4AF37] hover:underline font-bold">
                Apply as Driver
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 border border-[#222] rounded-full">
            <ShieldCheck className="text-[#D4AF37]" size={13} />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">
              Secure Encrypted Connection
            </span>
          </div>
          <p className="block">
            <Link href="/" className="text-[#555] hover:text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold transition-colors">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
