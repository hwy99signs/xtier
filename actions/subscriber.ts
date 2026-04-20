'use server';

import { subscriberSchema, type SubscriberFormData } from '@/lib/validations';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { estimateDistance, calculateFare, calculateCommitment } from '@/lib/utils';
import { calculateDetailedPricing } from '@/lib/pricing-engine';

export async function createSubscriberAction(data: SubscriberFormData) {
  // 1. Validate on server
  const validatedFields = subscriberSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: 'Invalid form data' };
  }

  const validated = validatedFields.data;

  try {
    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { error: 'A user with this email already exists' };
    }

    // 3. Get metadata for compliance logging
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // 4. Get active terms version
    const activeTerms = await prisma.termsVersion.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeTerms) {
      return { error: 'Service agreement is currently unavailable' };
    }

    // 5. Calculate detailed pricing and assignment
    const distance = estimateDistance(validated.pickupZip);
    const pricing = await calculateDetailedPricing(distance, validated.serviceType);

    // 6. DB Transaction: Create everything
    const result = await prisma.$transaction(async (tx) => {
      // a. Create User
      const user = await tx.user.create({
        data: {
          email: validated.email,
          passwordHash: await bcrypt.hash(validated.password, 10),
          firstName: validated.firstName,
          lastName: validated.lastName,
          phone: validated.phone,
          role: 'CUSTOMER',
        },
      });

      // b. Log Terms Acceptance
      const acceptance = await tx.termsAcceptance.create({
        data: {
          termsVersionId: activeTerms.id,
          email: validated.email,
          ipAddress,
          userAgent,
          checkboxResponses: {
            terms: Boolean(validated.termsAccepted),
            privacy: Boolean(validated.privacyAccepted),
            cancellation: Boolean(validated.cancellationAccepted),
            sms: Boolean(validated.smsConsentAccepted),
            age: Boolean(validated.ageConfirmed),
            conduct: Boolean((validated as any).conductAccepted),
            commuter: Boolean((validated as any).commuterAgreementAccepted),
            pricingSnapshot: pricing as any,
          },
        },
      });

      // c. Create Subscriber
      const subscriber = await tx.subscriber.create({
        data: {
          userId: user.id,
          pickupAddress: validated.pickupAddress,
          pickupCity: validated.pickupCity,
          pickupState: validated.pickupState,
          pickupZip: validated.pickupZip,
          dropoffAddress: validated.dropoffAddress,
          dropoffCity: validated.dropoffCity,
          dropoffState: validated.dropoffState,
          dropoffZip: validated.dropoffZip,
          
          distanceMiles: distance,
          estimatedPrice: pricing.totalFare,
          zoneId: pricing.zoneId,
          
          direction: validated.direction,
          employerName: validated.employerName,
          shiftType: validated.shiftType,
          serviceType: validated.serviceType,
          daysPerWeek: validated.daysPerWeek,
          preferredPickupTime: validated.preferredPickupTime,
          preferredReturnTime: validated.preferredReturnTime,
          startDate: validated.startDate ? new Date(validated.startDate) : null,
          notes: validated.notes,
          
          status: pricing.isWaitlistOnly ? 'WAITLISTED' : 'PENDING_APPROVAL',
          termsAcceptanceId: acceptance.id,
          paymentStatus: 'UNPAID',
        },
      });

      return subscriber;
    });

    return { success: true };
  } catch (err: any) {
    console.error('Subscriber registration error:', err);
    return { error: 'An unexpected error occurred during registration' };
  }
}
