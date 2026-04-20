'use client';
import Link from 'next/link';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  Car, 
  FileText,
  Briefcase,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { driverApplicationSchema, type DriverApplicationFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';
import { applyAsDriverAction } from '@/actions/driver';

export default function DriverPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DriverApplicationFormData>({
    resolver: zodResolver(driverApplicationSchema) as any,
    mode: 'onChange',
    defaultValues: {
      yearsExperience: 5,
      vehicleCapacity: 4,
      vehicleYear: 2022,
      conductAccepted: false,
      backgroundCheckAccepted: false,
      insuranceAccepted: false,
      termsAccepted: false,
      privacyAccepted: false
    }
  });

  const watchCheckboxes = watch([
    'conductAccepted',
    'backgroundCheckAccepted',
    'insuranceAccepted',
    'termsAccepted',
    'privacyAccepted'
  ]);

  const allChecked = watchCheckboxes.every(val => val === true);

  const onSubmit = async (data: DriverApplicationFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await applyAsDriverAction(data);

      if (result && 'error' in result && result.error) {
        throw new Error(result.error as string);
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background glows for success state */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-success/10 rounded-full blur-[160px] opacity-[0.15] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px]" />
        </div>

        <div className="w-full max-w-xl z-10 animate-fade-in-up">
          <div className="card-glass p-8 md:p-16 text-center border-success/30 shadow-2xl shadow-success/5">
            <div className="w-24 h-24 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-10 relative">
              <div className="absolute inset-0 rounded-full bg-success/20 animate-ping opacity-20" />
              <ShieldCheck className="text-success" size={48} strokeWidth={1.5} />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
              Application <br className="md:hidden" /> Dispatched
            </h1>
            
            <div className="gold-line mx-auto w-16 mb-8" />
            
            <div className="space-y-6 text-white-muted text-sm md:text-base leading-relaxed max-w-md mx-auto">
              <p>
                Your professional chauffeur application has been received and queued for manual background verification.
              </p>
              <p className="border-t border-white/5 pt-6 text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                Executive Vetting Phase: ACTIVE
              </p>
              <p className="text-xs text-white/40">
                Our vetting department typically completes initial record reviews within 3-5 business days. You will be notified of the board's decision via your registered email.
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/'} 
                className="btn-gold px-10 h-14 text-sm"
              >
                Return to Home
              </button>
              <Link 
                href="/terms" 
                className="btn-outline-gold px-10 h-14 text-xs flex items-center justify-center"
              >
                Driver Guidelines
              </Link>
            </div>
          </div>
          
          <p className="text-center mt-10 text-[10px] text-[#444] uppercase tracking-[0.4em] font-bold">
            ERANTT TRANSIT · Partner Recruitment Portal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 hero-bg">
      <div className="container-max px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="section-title text-4xl mb-4 text-center">Join the Elite</h1>
            <div className="gold-line" />
            <p className="section-subtitle mx-auto">
              Become part of the ERANTT TRANSIT professional fleet. We hire only the most reliable, professional, and safety-conscious executive drivers.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* ─── Identity ─────────────────────────────────────────────── */}
            <div className="card-glass p-8 md:p-10 border-[#D4AF37]/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-[#222222] flex items-center justify-center text-[#D4AF37]">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-display uppercase tracking-widest text-[#D4AF37]">Professional Info</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">First Name</label>
                  <input {...register('firstName')} className={cn("input-field", errors.firstName && "error")} placeholder="First Name" />
                  {errors.firstName && <p className="input-error">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="input-label">Last Name</label>
                  <input {...register('lastName')} className={cn("input-field", errors.lastName && "error")} placeholder="Last Name" />
                  {errors.lastName && <p className="input-error">{errors.lastName.message}</p>}
                </div>
                <div>
                  <label className="input-label">Email Address</label>
                  <input {...register('email')} className={cn("input-field", errors.email && "error")} placeholder="Email" />
                  {errors.email && <p className="input-error">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="input-label">Contact Phone</label>
                  <input {...register('phone')} className={cn("input-field", errors.phone && "error")} placeholder="Phone" />
                  {errors.phone && <p className="input-error">{errors.phone.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="input-label">Access Password</label>
                  <input type="password" {...register('password')} className={cn("input-field", errors.password && "error")} placeholder="••••••••" />
                </div>
              </div>
            </div>

            {/* ─── Licensing ────────────────────────────────────────────── */}
            <div className="card-glass p-8 md:p-10 border-[#D4AF37]/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-[#222222] flex items-center justify-center text-[#D4AF37]">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-xl font-display uppercase tracking-widest text-[#D4AF37]">Licensing & Experience</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <div className="md:col-span-2">
                  <label className="input-label">License Number</label>
                  <input {...register('licenseNumber')} className={cn("input-field", errors.licenseNumber && "error")} placeholder="License #" />
                </div>
                <div>
                  <label className="input-label">License State</label>
                  <input {...register('licenseState')} className={cn("input-field", errors.licenseState && "error")} placeholder="TX" maxLength={2} />
                </div>
                <div className="md:col-span-2">
                  <label className="input-label">Expiration Date</label>
                  <input type="date" {...register('licenseExpiry')} className={cn("input-field", errors.licenseExpiry && "error")} />
                </div>
                <div>
                  <label className="input-label">Years of Pro Experience</label>
                  <input type="number" {...register('yearsExperience')} className={cn("input-field", errors.yearsExperience && "error")} />
                </div>
              </div>
            </div>

            {/* ─── Vehicle Details ───────────────────────────────────────── */}
            <div className="card-glass p-8 md:p-10 border-[#D4AF37]/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-[#222222] flex items-center justify-center text-[#D4AF37]">
                  <Car size={20} />
                </div>
                <h2 className="text-xl font-display uppercase tracking-widest text-[#D4AF37]">Executive Vehicle</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                  <label className="input-label">Vehicle Make</label>
                  <input {...register('vehicleMake')} className={cn("input-field", errors.vehicleMake && "error")} placeholder="e.g. Cadillac" />
                </div>
                <div className="lg:col-span-2">
                  <label className="input-label">Model</label>
                  <input {...register('vehicleModel')} className={cn("input-field", errors.vehicleModel && "error")} placeholder="e.g. Escalade" />
                </div>
                <div>
                  <label className="input-label">Year</label>
                  <input type="number" {...register('vehicleYear')} className={cn("input-field", errors.vehicleYear && "error")} />
                </div>
                <div>
                  <label className="input-label">Color</label>
                  <input {...register('vehicleColor')} className={cn("input-field", errors.vehicleColor && "error")} placeholder="Black" />
                </div>
                <div>
                  <label className="input-label">Plate #</label>
                  <input {...register('vehiclePlate')} className={cn("input-field", errors.vehiclePlate && "error")} placeholder="Plate" />
                </div>
                <div>
                  <label className="input-label">Capacity</label>
                  <input type="number" {...register('vehicleCapacity')} className={cn("input-field", errors.vehicleCapacity && "error")} />
                </div>
              </div>
            </div>

            {/* ─── Terms & Compliance ────────────────────────────────────── */}
            <div className="card-glass p-8 md:p-10 border-[#D4AF37]/10">
              <div className="flex items-center gap-4 mb-8 text-white">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-[#222222] flex items-center justify-center text-[#D4AF37]">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-xl font-display uppercase tracking-widest text-[#D4AF37]">Professional Compliance</h2>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div className="space-y-3">
                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('conductAccepted')} />
                    <span className="text-sm">I agree to the <span className="font-bold text-white uppercase tracking-tighter">Gold Standard Conduct Code</span>.</span>
                  </label>
                  
                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('backgroundCheckAccepted')} />
                    <span className="text-sm">I authorize ERANTT TRANSIT to perform an exhaustive background and criminal check.</span>
                  </label>

                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('insuranceAccepted')} />
                    <span className="text-sm">I certify that I hold current, high-limit executive commercial insurance.</span>
                  </label>

                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('termsAccepted')} />
                    <span className="text-sm">I accept the Driver Master Service Agreement.</span>
                  </label>

                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('privacyAccepted')} />
                    <span className="text-sm">I accept the Professional Privacy Policy.</span>
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-error" size={20} />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <div className="flex flex-col items-center gap-4">
              {!allChecked && !isSubmitting && (
                <p className="text-xs text-[#D4AF37] uppercase tracking-[0.15em] font-bold animate-pulse">
                  Please check all agreements to enable application
                </p>
              )}
              <button
                type="submit"
                disabled={!allChecked || isSubmitting}
                className={cn(
                  "btn-gold w-full md:w-80 h-14 text-lg",
                  (!allChecked || isSubmitting) && "opacity-40 cursor-not-allowed"
                )}
              >
                {isSubmitting ? 'Submitting...' : 'Apply as Driver'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
