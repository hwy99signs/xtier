'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { 
  ChevronRight, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Info,
  CheckCircle2,
  AlertCircle,
  Calculator,
  ShieldCheck
} from 'lucide-react';
import { subscriberSchema, type SubscriberFormData } from '@/lib/validations';
import { estimateDistance, calculateFare, calculateCommitment, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { createSubscriberAction } from '@/actions/subscriber';

export default function SubscribePage() {
  const [step, setStep] = useState(1);
  const [distance, setDistance] = useState<number | null>(null);
  const [fare, setFare] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue
  } = useForm<SubscriberFormData>({
    resolver: zodResolver(subscriberSchema) as any,
    mode: 'onChange',
    defaultValues: {
      pickupState: 'TX',
      dropoffState: 'TX',
      direction: 'BOTH',
      termsAccepted: false,
      privacyAccepted: false,
      cancellationAccepted: false,
      smsConsentAccepted: false,
      ageConfirmed: false
    }
  });

  const watchPickupZip = watch('pickupZip');
  const watchCheckboxes = [
    watch('termsAccepted'),
    watch('privacyAccepted'),
    watch('cancellationAccepted'),
    watch('smsConsentAccepted'),
    watch('ageConfirmed')
  ];

  const allChecked = watchCheckboxes.every(val => val === true);

  // Recalculate price when ZIP changes
  useEffect(() => {
    if (watchPickupZip && watchPickupZip.length === 5) {
      const d = estimateDistance(watchPickupZip);
      const f = calculateFare(d);
      setDistance(d);
      setFare(f);
    } else {
      setDistance(null);
      setFare(null);
    }
  }, [watchPickupZip]);

  const onSubmit = async (data: SubscriberFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await createSubscriberAction(data);

      if (result.error) {
        throw new Error(result.error);
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 hero-bg flex items-center justify-center px-6">
        <div className="card-glass p-12 text-center max-w-lg w-full animate-fade-in-up">
           <div className="w-20 h-20 rounded-full bg-success/20 border border-success/40 flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="text-success" size={40} />
           </div>
           <h1 className="text-3xl font-display mb-4">Application Received</h1>
           <p className="text-white-muted mb-10">
              Thank you for applying to ERANTT TRANSIT. Our executive review board is processing your registration. 
              You will receive a confirmation email shortly.
           </p>
           <button 
              onClick={() => window.location.href = '/'} 
              className="btn-gold w-full"
            >
              Return Home
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 hero-bg">
      <div className="container-max px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="section-title text-4xl mb-4">Executive Membership</h1>
            <div className="gold-line" />
            <p className="section-subtitle mx-auto">
              Secure your place in the most exclusive transit network serving the Kingwood ↔ IAH route.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* ─── Personal Information ──────────────────────────────────── */}
            <div className="card-glass p-8 md:p-10 border-[#D4AF37]/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-[#222222] flex items-center justify-center text-[#D4AF37]">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-display uppercase tracking-widest text-[#D4AF37]">Identity & Access</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">First Name</label>
                  <input {...register('firstName')} className={cn("input-field", errors.firstName && "error")} placeholder="e.g. Jonathan" />
                  {errors.firstName && <p className="input-error">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="input-label">Last Name</label>
                  <input {...register('lastName')} className={cn("input-field", errors.lastName && "error")} placeholder="e.g. Sterling" />
                  {errors.lastName && <p className="input-error">{errors.lastName.message}</p>}
                </div>
                <div>
                  <label className="input-label">Email Address</label>
                  <input {...register('email')} className={cn("input-field", errors.email && "error")} placeholder="jonathan@sterling.com" />
                  {errors.email && <p className="input-error">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="input-label">Phone Number</label>
                  <input {...register('phone')} className={cn("input-field", errors.phone && "error")} placeholder="+1 (713) 555-0123" />
                  {errors.phone && <p className="input-error">{errors.phone.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="input-label">Dashboard Password</label>
                  <input type="password" {...register('password')} className={cn("input-field", errors.password && "error")} placeholder="••••••••" />
                  {errors.password && <p className="input-error">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            {/* ─── Address & Route ───────────────────────────────────────── */}
            <div className="card-glass p-8 md:p-10 border-[#D4AF37]/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-[#222222] flex items-center justify-center text-[#D4AF37]">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-display uppercase tracking-widest text-[#D4AF37]">Service Route</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-sm font-bold tracking-widest uppercase border-b border-[#222222] pb-2 text-white/60">Pickup Details (Kingwood Area)</h3>
                  <div>
                    <label className="input-label">Street Address</label>
                    <input {...register('pickupAddress')} className={cn("input-field", errors.pickupAddress && "error")} placeholder="123 Kingwood Dr" />
                    {errors.pickupAddress && <p className="input-error">{errors.pickupAddress.message}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="input-label">City</label>
                      <input {...register('pickupCity')} className={cn("input-field", errors.pickupCity && "error")} placeholder="Kingwood" />
                      {errors.pickupCity && <p className="input-error">{errors.pickupCity.message}</p>}
                    </div>
                    <div>
                      <label className="input-label">Zip</label>
                      <input {...register('pickupZip')} className={cn("input-field", errors.pickupZip && "error")} placeholder="77339" maxLength={5} />
                      {errors.pickupZip && <p className="input-error">{errors.pickupZip.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-sm font-bold tracking-widest uppercase border-b border-[#222222] pb-2 text-white/60">Destination (IAH Airport)</h3>
                   <div>
                    <label className="input-label">Terminal / Location</label>
                    <input {...register('dropoffAddress')} className={cn("input-field", errors.dropoffAddress && "error")} placeholder="IAH Terminal C" />
                    {errors.dropoffAddress && <p className="input-error">{errors.dropoffAddress.message}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="input-label">City</label>
                      <input {...register('dropoffCity')} className={cn("input-field", errors.dropoffCity && "error")} placeholder="Houston" />
                    </div>
                    <div>
                      <label className="input-label">Zip</label>
                      <input {...register('dropoffZip')} className={cn("input-field", errors.dropoffZip && "error")} placeholder="77032" maxLength={5} />
                    </div>
                  </div>
                </div>
              </div>

              {distance && (
                <div className="mt-10 p-6 bg-black/40 border border-[#D4AF37]/20 rounded-xl animate-fade-in">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                         <div className="p-3 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                            <Calculator size={24} />
                         </div>
                         <div>
                            <p className="text-xs uppercase tracking-widest text-[#A0A0A0] mb-1">Estimated One-Way Fare</p>
                            <p className="text-3xl font-display font-bold text-white tracking-wide">
                              {formatCurrency(fare || 45)}
                            </p>
                         </div>
                      </div>
                      <div className="flex gap-10 text-center md:text-left">
                        <div>
                          <p className="text-[10px] uppercase text-[#666666] tracking-widest mb-1">Road Distance</p>
                          <p className="text-lg font-bold text-[#D4AF37]">{distance} mi</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-[#666666] tracking-widest mb-1">Base Price</p>
                          <p className="text-lg font-bold text-[#D4AF37]">$45.00</p>
                        </div>
                      </div>
                   </div>
                   <div className="mt-4 pt-4 border-t border-[#222222] flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest">
                     <Info size={12} className="text-[#D4AF37]" />
                     Final fare determined by exact drop-off terminal and dynamic pricing rules.
                   </div>
                </div>
              )}
            </div>

            {/* ─── Terms & Acceptance ────────────────────────────────────── */}
            <div className="card-glass p-8 md:p-10 border-[#D4AF37]/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-[#222222] flex items-center justify-center text-[#D4AF37]">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-xl font-display uppercase tracking-widest text-[#D4AF37]">Policies & Compliance</h2>
              </div>

              <div className="space-y-4 max-w-2xl">
                <p className="text-sm text-[#A0A0A0] mb-6">
                  To proceed with your ERANTT TRANSIT subscription, you must read and manually acknowledge the following executive policies. 
                  <span className="text-[#D4AF37] block mt-1">Reviewing each clause is mandatory before submission.</span>
                </p>

                <div className="space-y-3">
                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('termsAccepted')} />
                    <span className="text-sm">I have read and unconditionally accept the <Link href="/terms" className="text-[#D4AF37] hover:underline">Executive Terms of Service</Link>.</span>
                  </label>
                  {errors.termsAccepted && <p className="input-error">{errors.termsAccepted.message}</p>}

                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('privacyAccepted')} />
                    <span className="text-sm">I accept the <Link href="/privacy" className="text-[#D4AF37] hover:underline">Universal Privacy Policy</Link> regarding data handling.</span>
                  </label>
                  {errors.privacyAccepted && <p className="input-error">{errors.privacyAccepted.message}</p>}

                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('cancellationAccepted')} />
                    <span className="text-sm">I acknowledge the <span className="font-bold text-white">No-Refund Cancellation Policy</span> for scheduled transits.</span>
                  </label>
                  {errors.cancellationAccepted && <p className="input-error">{errors.cancellationAccepted.message}</p>}

                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('smsConsentAccepted')} />
                    <span className="text-sm">I consent to receive high-priority SMS updates regarding my scheduled transits.</span>
                  </label>
                  {errors.smsConsentAccepted && <p className="input-error">{errors.smsConsentAccepted.message}</p>}

                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('ageConfirmed')} />
                    <span className="text-sm">I confirm that I am at least 18 years of age and hold legal capacity to contract.</span>
                  </label>
                  {errors.ageConfirmed && <p className="input-error">{errors.ageConfirmed.message}</p>}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/30 rounded-lg flex items-start gap-3 animate-fade-in">
                <AlertCircle className="text-error shrink-0" size={20} />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={!allChecked || isSubmitting}
                className={cn(
                  "btn-gold w-full md:w-80 h-14 text-lg transition-all",
                  (!allChecked || isSubmitting) && "opacity-40 cursor-not-allowed filter grayscale"
                )}
              >
                {isSubmitting ? 'Processing...' : 'Apply for Membership'}
              </button>
              <p className="mt-6 text-[10px] text-white-dim uppercase tracking-widest text-center">
                Secure 256-bit encrypted application • IP logging enabled for compliance
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
