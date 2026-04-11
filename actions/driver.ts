'use server';

import { driverApplicationSchema, type DriverApplicationFormData } from '@/lib/validations';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';

export async function applyAsDriverAction(data: DriverApplicationFormData) {
  // 1. Validate
  const validatedFields = driverApplicationSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: 'Invalid application data' };
  }

  const validated = validatedFields.data;

  try {
    // 2. Check existence
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { error: 'A professional account with this email already exists' };
    }

    // 3. Metadata
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // 4. Terms
    const activeTerms = await prisma.termsVersion.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    // 5. Transaction
    await prisma.$transaction(async (tx) => {
      // a. User
      const user = await tx.user.create({
        data: {
          email: validated.email,
          passwordHash: await bcrypt.hash(validated.password, 10),
          firstName: validated.firstName,
          lastName: validated.lastName,
          phone: validated.phone,
          role: 'DRIVER',
        },
      });

      // b. Terms (Generic for now, or driver specific if available)
      const acceptance = await tx.termsAcceptance.create({
        data: {
          termsVersionId: activeTerms?.id || 'master-terms',
          email: validated.email,
          ipAddress,
          userAgent,
          checkboxResponses: {
             conduct: Boolean(validated.conductAccepted),
             background: Boolean(validated.backgroundCheckAccepted),
             insurance: Boolean(validated.insuranceAccepted),
             terms: Boolean(validated.termsAccepted),
             privacy: Boolean(validated.privacyAccepted)
          },
        },
      });

      // c. Driver Application
      await tx.driver.create({
        data: {
          userId: user.id,
          licenseNumber: validated.licenseNumber,
          licenseState: validated.licenseState,
          licenseExpiry: new Date(validated.licenseExpiry),
          vehicleMake: validated.vehicleMake,
          vehicleModel: validated.vehicleModel,
          vehicleYear: validated.vehicleYear,
          vehicleColor: validated.vehicleColor,
          vehiclePlate: validated.vehiclePlate,
          vehicleCapacity: validated.vehicleCapacity,
          yearsExperience: validated.yearsExperience,
          status: 'PENDING_REVIEW',
          termsAcceptanceId: acceptance.id,
        },
      });
    });

    return { success: true };
  } catch (err: any) {
    console.error('Driver application error:', err);
    return { error: 'Application failed. Please check your document details.' };
  }
}
