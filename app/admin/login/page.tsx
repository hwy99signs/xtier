'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { adminLoginSchema, type AdminLoginFormData } from '@/lib/validations';
import { Lock, Mail, AlertCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials or insufficient permissions');
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected system error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#D4AF37] rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#D4AF37] rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center mb-8">
            <Logo variant="full" className="h-16" />
          </Link>
          <h1 className="font-display text-3xl font-bold text-white tracking-widest uppercase mb-2">
            Terminal Access
          </h1>
          <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-bold">
            Administrative Control Panel
          </p>
        </div>

        <div className="card-glass p-8 md:p-10 border-[#D4AF37]/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="input-label flex items-center gap-2">
                <Mail size={14} /> Security Email
              </label>
              <input
                {...register('email')}
                className={cn('input-field', errors.email && 'error')}
                placeholder="admin@erantt-transit.com"
                type="email"
              />
              {errors.email && <p className="input-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="input-label flex items-center gap-2">
                <Lock size={14} /> Access Key
              </label>
              <input
                {...register('password')}
                className={cn('input-field', errors.password && 'error')}
                placeholder="••••••••"
                type="password"
              />
              {errors.password && <p className="input-error">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3 animate-fade-in">
                <AlertCircle className="text-error shrink-0" size={18} />
                <p className="text-xs text-error font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full h-12 text-sm group"
            >
              {isLoading ? (
                'Decrypting...'
              ) : (
                <>
                  Initialize Session <ChevronRight className="transition-transform group-hover:translate-x-1" size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 border border-[#222222] rounded-full">
              <ShieldCheck className="text-[#D4AF37]" size={14} />
              <span className="text-[10px] text-white/40 uppercase tracking-widest">
                256-bit AES RSA Encryption Active
              </span>
           </div>
           <p className="mt-8">
              <Link href="/" className="text-[#666666] hover:text-[#D4AF37] text-[10px] uppercase tracking-widest transition-colors font-bold">
                ← Return to Public Terminal
              </Link>
           </p>
        </div>
      </div>
    </div>
  );
}
