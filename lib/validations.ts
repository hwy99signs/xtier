import { z } from 'zod'

// ─── Subscriber / Sign-up ────────────────────────────────────────────────────

export const subscriberSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?1?\d{10,14}$/, 'Please enter a valid US phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),

  pickupAddress: z.string().min(5, 'Please enter your pickup street address'),
  pickupCity: z.string().min(2, 'Please enter your city'),
  pickupState: z.string().length(2, 'Please use the 2-letter state code (e.g. TX)'),
  pickupZip: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit ZIP code'),

  dropoffAddress: z.string().min(5, 'Please enter your destination address'),
  dropoffCity: z.string().min(2, 'Please enter destination city'),
  dropoffState: z.string().length(2, 'Please use the 2-letter state code'),
  dropoffZip: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit ZIP code'),
  direction: z.enum(['TO_AIRPORT', 'FROM_AIRPORT', 'BOTH']).default('BOTH'),

  // Subscription details
  employerName: z.string().optional(),
  shiftType: z.string().min(1, 'Shift type is required'),
  serviceType: z.enum(['COMMUTER', 'EXECUTIVE', 'AIRPORT']).default('COMMUTER'),
  daysPerWeek: z.coerce.number().min(1, 'Minimum 1 day').max(7, 'Maximum 7 days'),
  preferredPickupTime: z.string().min(1, 'Pickup time is required'),
  preferredReturnTime: z.string().min(1, 'Return time is required'),
  startDate: z.string().min(1, 'Start date is required'),
  notes: z.string().max(500, 'Notes must be under 500 characters').optional(),

  // Terms checkboxes — all must be true
  termsAccepted: z.boolean().refine(v => v === true, {
    message: 'You must accept the Terms of Service',
  }),
  privacyAccepted: z.boolean().refine(v => v === true, {
    message: 'You must accept the Privacy Policy',
  }),
  cancellationAccepted: z.boolean().refine(v => v === true, {
    message: 'You must acknowledge the cancellation policy',
  }),
  smsConsentAccepted: z.boolean().refine(v => v === true, {
    message: 'You must consent to SMS notifications',
  }),
  ageConfirmed: z.boolean().refine(v => v === true, {
    message: 'You must confirm you are 18 or older',
  }),
  conductAccepted: z.boolean().refine(v => v === true, {
    message: 'You must accept the Passenger Conduct Code',
  }),
  commuterAgreementAccepted: z.boolean().refine(v => v === true, {
    message: 'You must acknowledge the fixed-route nature of our service',
  }),
})

export type SubscriberFormData = z.infer<typeof subscriberSchema>

// ─── Driver Application ──────────────────────────────────────────────────────

export const driverApplicationSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().regex(/^\+?1?\d{10,14}$/, 'Valid US phone number required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),

  licenseNumber: z.string().min(5, 'License number required'),
  licenseState: z.string().length(2, '2-letter state code required'),
  licenseExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format: YYYY-MM-DD'),
  yearsExperience: z.coerce.number().min(0).max(50),

  vehicleMake: z.string().min(2, 'Vehicle make required'),
  vehicleModel: z.string().min(2, 'Vehicle model required'),
  vehicleYear: z.coerce.number().min(2015, 'Vehicle must be 2015 or newer').max(2026),
  vehicleColor: z.string().min(2, 'Vehicle color required'),
  vehiclePlate: z.string().min(2, 'License plate required'),
  vehicleCapacity: z.coerce.number().min(1).max(14),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),

  // Driver-specific terms
  conductAccepted: z.boolean().refine(v => v === true, {
    message: 'You must accept the Driver Conduct Policy',
  }),
  backgroundCheckAccepted: z.boolean().refine(v => v === true, {
    message: 'You must consent to a background check',
  }),
  insuranceAccepted: z.boolean().refine(v => v === true, {
    message: 'You must confirm your insurance coverage',
  }),
  termsAccepted: z.boolean().refine(v => v === true, {
    message: 'You must accept the Driver Terms of Service',
  }),
  privacyAccepted: z.boolean().refine(v => v === true, {
    message: 'You must accept the Privacy Policy',
  }),
})

export type DriverApplicationFormData = z.infer<typeof driverApplicationSchema>

// ─── Admin Login ─────────────────────────────────────────────────────────────

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password required'),
})

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>

// ─── Pricing Rule ────────────────────────────────────────────────────────────

export const pricingRuleSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  zoneId: z.string().optional(),
  direction: z.enum(['TO_AIRPORT', 'FROM_AIRPORT', 'BOTH']).default('BOTH'),
  baseFare: z.coerce.number().min(0),
  perMileRate: z.coerce.number().min(0),
  surgeMultiplier: z.coerce.number().min(1).max(5),
  commitmentPct: z.coerce.number().min(0).max(100),
  minFare: z.coerce.number().min(0),
  maxFare: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
})

export type PricingRuleFormData = z.infer<typeof pricingRuleSchema>

// ─── Service Zone ─────────────────────────────────────────────────────────────

export const serviceZoneSchema = z.object({
  name: z.string().min(2, 'Zone name required'),
  description: z.string().optional(),
  type: z.enum(['ORIGIN', 'DESTINATION', 'BOTH']).default('ORIGIN'),
  minMiles: z.coerce.number().min(0),
  maxMiles: z.coerce.number().min(0),
  basePrice: z.coerce.number().min(0),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
})

export type ServiceZoneFormData = z.infer<typeof serviceZoneSchema>
