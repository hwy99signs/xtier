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
import { calculateDetailedPricingSync, type PricingBreakdown } from '@/lib/pricing-engine';

// Mock zones for frontend calculation (would normally fetch or be pre-served)
const MOCK_ZONES = [
  { id: 'z1', name: 'Kingwood Central', minMiles: 0, maxMiles: 23, basePrice: 45 },
  { id: 'z2', name: 'Atascocita / Humble', minMiles: 15, maxMiles: 21, basePrice: 40 },
  { id: 'z3', name: 'Kingwood North', minMiles: 23.1, maxMiles: 30, basePrice: 55 },
];

export default function SubscribePage() {
  const [step, setStep] = useState(1);
  const [distance, setDistance] = useState<number | null>(null);
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
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
      serviceType: 'COMMUTER',
      daysPerWeek: 5,
      termsAccepted: false,
      privacyAccepted: false,
      cancellationAccepted: false,
      smsConsentAccepted: false,
      ageConfirmed: false,
      conductAccepted: false,
      commuterAgreementAccepted: false
    }
  });

  const watchPickupZip = watch('pickupZip');
  const watchCheckboxes = [
    watch('termsAccepted'),
    watch('privacyAccepted'),
    watch('cancellationAccepted'),
    watch('smsConsentAccepted'),
    watch('ageConfirmed'),
    watch('conductAccepted'),
    watch('commuterAgreementAccepted')
  ];

  const allChecked = watchCheckboxes.every(val => val === true);

  // Recalculate price when ZIP changes
  useEffect(() => {
    if (watchPickupZip && watchPickupZip.length === 5) {
      const d = estimateDistance(watchPickupZip);
      const p = calculateDetailedPricingSync(d, MOCK_ZONES);
      setDistance(d);
      setPricing(p);
    } else {
      setDistance(null);
      setPricing(null);
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
      <div className="min-h-screen hero-bg flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background glows for success state */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-success/10 rounded-full blur-[160px] opacity-[0.15] animate-pulse" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px]" />
        </div>

        <div className="w-full max-w-xl z-10 animate-fade-in-up">
          <div className="card-glass p-8 md:p-16 text-center border-success/30 shadow-2xl shadow-success/5">
            <div className="w-24 h-24 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-10 relative">
              <div className="absolute inset-0 rounded-full bg-success/20 animate-ping opacity-20" />
              <CheckCircle2 className="text-success" size={48} strokeWidth={1.5} />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
              Application <br className="md:hidden" /> Under Review
            </h1>
            
            <div className="gold-line mx-auto w-16 mb-8" />
            
            <div className="space-y-6 text-white-muted text-sm md:text-base leading-relaxed max-w-md mx-auto">
              <p>
                Your executive membership request has been encrypted and submitted to our logistics review board.
              </p>
              <p className="border-t border-white/5 pt-6 text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                Manual Verification Protocol Active
              </p>
              <p className="text-xs text-white/40">
                A confirmation summary has been dispatched to your provided email address. Our team typically completes vetting within 24-48 business hours.
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/'} 
                className="btn-gold px-10 h-14 text-sm"
              >
                Return to Dashboard
              </button>
              <Link 
                href="/terms" 
                className="btn-outline-gold px-10 h-14 text-xs flex items-center justify-center"
              >
                Review Policies
              </Link>
            </div>
          </div>
          
          <p className="text-center mt-10 text-[10px] text-[#444] uppercase tracking-[0.4em] font-bold">
            xtier · Secure Submission Terminal
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

            {/* ─── Route & Logistics ────────────────────────────────────────── */}
            <div className="card-glass p-8 md:p-10 border-[#D4AF37]/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-[#222222] flex items-center justify-center text-[#D4AF37]">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-display uppercase tracking-widest text-[#D4AF37]">Route Logistics</h2>
              </div>

              <div className="space-y-8">
                {/* Pickup Address */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Residential Pickup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="input-label">Street Address</label>
                      <input {...register('pickupAddress')} className={cn("input-field", errors.pickupAddress && "error")} placeholder="123 Kingwood Dr" />
                      {errors.pickupAddress && <p className="input-error">{errors.pickupAddress.message}</p>}
                    </div>
                    <div>
                      <label className="input-label">City</label>
                      <input {...register('pickupCity')} className={cn("input-field", errors.pickupCity && "error")} placeholder="Kingwood" />
                    </div>
                    <div>
                      <label className="input-label">ZIP Code</label>
                      <input {...register('pickupZip')} className={cn("input-field", errors.pickupZip && "error")} placeholder="77339" maxLength={5} />
                      {errors.pickupZip && <p className="input-error">{errors.pickupZip.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Dropoff Address */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Primary Destination</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="input-label">Destination Address</label>
                      <input {...register('dropoffAddress')} className={cn("input-field", errors.dropoffAddress && "error")} placeholder="e.g. IAH Terminal C" />
                      {errors.dropoffAddress && <p className="input-error">{errors.dropoffAddress.message}</p>}
                    </div>
                    <div>
                      <label className="input-label">City</label>
                      <input {...register('dropoffCity')} className={cn("input-field", errors.dropoffCity && "error")} placeholder="Houston" />
                    </div>
                    <div>
                      <label className="input-label">ZIP Code</label>
                      <input {...register('dropoffZip')} className={cn("input-field", errors.dropoffZip && "error")} placeholder="77032" maxLength={5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Schedule Details ───────────────────────────────────────── */}
            <div className="card-glass p-8 md:p-10 border-[#D4AF37]/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-[#222222] flex items-center justify-center text-[#D4AF37]">
                  <Calculator size={20} />
                </div>
                <h2 className="text-xl font-display uppercase tracking-widest text-[#D4AF37]">Schedule & Service</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <label className="input-label">Employer / Facility Name</label>
                  <input {...register('employerName')} className={cn("input-field", errors.employerName && "error")} placeholder="e.g. United Airlines, IAH Tech Ops" />
                </div>
                <div>
                  <label className="input-label">Service Type</label>
                  <select {...register('serviceType')} className="input-field">
                    <option value="COMMUTER">Standard Commuter</option>
                    <option value="EXECUTIVE">Executive Solo</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Days Needed Per Week</label>
                  <input type="number" {...register('daysPerWeek')} className="input-field" min={1} max={7} />
                </div>
                <div>
                   <label className="input-label">Shift Details</label>
                   <input {...register('shiftType')} className="input-field" placeholder="e.g. Day Shift, 4-on-4-off" />
                </div>
                <div>
                  <label className="input-label">Requested Start Date</label>
                  <input type="date" {...register('startDate')} className="input-field text-white/50" />
                </div>
                <div>
                  <label className="input-label">Preferred Pickup Time</label>
                  <input type="time" {...register('preferredPickupTime')} className="input-field" />
                </div>
                <div>
                  <label className="input-label">Preferred Return Time</label>
                  <input type="time" {...register('preferredReturnTime')} className="input-field" />
                </div>
                <div className="lg:col-span-2">
                  <label className="input-label">Additional Route Notes</label>
                  <textarea {...register('notes')} className="input-field min-h-[100px] py-3" placeholder="Gate access codes, specific terminal pick-up points, etc." />
                </div>
              </div>
            </div>

            {/* ─── Route Summary ─────────────────────────────────────────── */}
            {pricing && (
              <div className={cn(
                "p-8 md:p-10 rounded-2xl border-2 transition-all duration-500",
                pricing.isWaitlistOnly 
                  ? "bg-amber-500/5 border-amber-500/30" 
                  : "bg-[#D4AF37]/5 border-[#D4AF37]/30 shadow-2xl shadow-[#D4AF37]/5"
              )}>
                <div className="flex flex-col lg:flex-row justify-between gap-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        pricing.isWaitlistOnly ? "bg-amber-500/10 text-amber-500" : "bg-[#D4AF37]/10 text-[#D4AF37]"
                      )}>
                        <Info size={20} />
                      </div>
                      <h3 className="text-xl font-display uppercase tracking-[0.2em] font-bold">
                        {pricing.isWaitlistOnly ? 'Waitlist Eligibility' : 'Subscription Summary'}
                      </h3>
                    </div>

                    {pricing.isWaitlistOnly ? (
                      <div className="space-y-4">
                        <p className="text-white font-medium text-lg italic">"Route outside active Kingwood corridor."</p>
                        <div className="p-4 bg-black/60 border border-amber-500/20 rounded-lg text-sm text-white/80">
                           <p className="mb-2"><span className="text-amber-500 uppercase text-[10px] font-bold block">Pickup:</span> {watch('pickupAddress') || '[Enter Address]'}, {watch('pickupZip')}</p>
                           <p><span className="text-amber-500 uppercase text-[10px] font-bold block">Destination:</span> {watch('dropoffAddress') || '[Enter Address]'}, {watch('dropoffZip')}</p>
                        </div>
                        <p className="text-white-dim text-sm leading-relaxed max-w-lg">
                          xtier currently only operates the <span className="text-amber-500 font-bold underline">Kingwood ↔ IAH</span> direct-line route. 
                          Your request will be added to our expansion waitlist for your specific corridor.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-8 py-4">
                        <div className="col-span-2 md:col-span-2 p-4 bg-black/60 border border-[#D4AF37]/20 rounded-lg text-sm text-white/80 mb-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[#D4AF37] uppercase text-[10px] font-bold block mb-1">From</span>
                                {watch('pickupAddress') || '[Pickup Address]'}
                              </div>
                              <div>
                                <span className="text-[#D4AF37] uppercase text-[10px] font-bold block mb-1">To</span>
                                {watch('dropoffAddress') || '[Destination]'}
                              </div>
                           </div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-white/40 tracking-[0.2em] mb-2">Transit Zone</p>
                          <p className="text-white font-bold">{pricing.zoneName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-white/40 tracking-[0.2em] mb-2">Service Type</p>
                          <p className="text-white font-bold">{watch('serviceType')} Membership</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-white/40 tracking-[0.2em] mb-2">Road Distance</p>
                          <p className="text-white font-bold">{pricing.distanceMiles} Miles</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-white/40 tracking-[0.2em] mb-2">Week Estimate</p>
                          <p className="text-[#D4AF37] font-bold text-xl">
                            {formatCurrency(pricing.totalFare * (watch('daysPerWeek') || 5))}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {!pricing.isWaitlistOnly && (
                    <div className="lg:w-80 bg-black/60 p-6 rounded-xl border border-white/5 space-y-4">
                      <p className="text-[10px] uppercase text-[#D4AF37] tracking-widest font-black">Fee Breakdown</p>
                      <div className="space-y-3">
                         <div className="flex justify-between text-xs">
                           <span className="text-white/60">Base One-Way</span>
                           <span className="text-white">{formatCurrency(pricing.baseFare)}</span>
                         </div>
                         <div className="flex justify-between text-xs">
                           <span className="text-white/60">Distance Overhead</span>
                           <span className="text-white">Included</span>
                         </div>
                         <div className="h-[1px] bg-white/10" />
                         <div className="flex justify-between text-sm font-bold">
                           <span className="text-[#D4AF37]">Transit Cost</span>
                           <span className="text-[#D4AF37]">{formatCurrency(pricing.totalFare)}</span>
                         </div>
                      </div>
                      <p className="text-[9px] text-white/30 italic leading-tight pt-2 border-t border-white/5">
                        * Weekly total based on {watch('daysPerWeek')} transits. Final invoice includes 2-way multiplier if selected.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                  To proceed with your xtier subscription, you must read and manually acknowledge the following executive policies. 
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

                  <div className="h-[1px] bg-white/5 my-6" />
                  
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-6">Operations Acceptance</h3>
                  
                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('conductAccepted')} />
                    <span className="text-sm italic">I agree to the <span className="font-bold text-white uppercase tracking-tighter">Elite Passenger Conduct Code</span> for refined transit environments.</span>
                  </label>
                  
                  <label className="checkbox-wrapper">
                    <input type="checkbox" {...register('commuterAgreementAccepted')} />
                    <span className="text-sm">I acknowledge xtier is a <span className="text-[#D4AF37] font-bold">strictly fixed-line corridor service</span>, not a dynamic rideshare provider.</span>
                  </label>
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
                  "btn-gold w-full md:w-80 h-14 text-lg transition-all shadow-2xl",
                  (!allChecked || isSubmitting) && "opacity-40 cursor-not-allowed filter grayscale"
                )}
              >
                {isSubmitting ? 'Securing Spot...' : pricing?.isWaitlistOnly ? 'Join Waitlist' : 'Apply for Membership'}
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
