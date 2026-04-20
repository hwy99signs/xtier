'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';

/**
 * Handle new driver application submission.
 */
export async function applyAsDriverAction(data: any) {
  try {
    console.log('Processing driver application for:', data.email);

    // 1. Get audit metadata
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // 2. Get active terms version
    const activeTerms = await prisma.termsVersion.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeTerms) {
      return { error: 'Driver Service Agreement unavailable. Please try again later.' };
    }

    // 3. Check for existing driver
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      include: { driver: true }
    });

    if (existingUser?.driver) {
      return { error: 'An application is already on file for this email address.' };
    }

    // 4. DB Transaction: Atomic onboarding
    const result = await prisma.$transaction(async (tx) => {
      let user = existingUser;

      if (!user) {
        user = await tx.user.create({
          data: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            passwordHash: await bcrypt.hash(data.password, 10),
            role: 'DRIVER',
          },
        });
      }

      // Log formal terms acceptance
      const acceptance = await tx.termsAcceptance.create({
        data: {
          termsVersionId: activeTerms.id,
          email: data.email,
          ipAddress,
          userAgent,
          checkboxResponses: {
            conduct: Boolean(data.conductAccepted),
            background: Boolean(data.backgroundCheckAccepted),
            insurance: Boolean(data.insuranceAccepted),
            terms: Boolean(data.termsAccepted),
            privacy: Boolean(data.privacyAccepted),
            type: 'DRIVER_APPLICATION'
          },
        },
      });

      // Create Driver Profile
      const driver = await tx.driver.create({
        data: {
          userId: user.id,
          licenseNumber: data.licenseNumber,
          licenseState: data.licenseState,
          licenseExpiry: new Date(data.licenseExpiry),
          vehicleMake: data.vehicleMake,
          vehicleModel: data.vehicleModel,
          vehicleYear: Number(data.vehicleYear),
          vehicleColor: data.vehicleColor,
          vehiclePlate: data.vehiclePlate,
          vehicleCapacity: Number(data.vehicleCapacity || 4),
          yearsExperience: Number(data.yearsExperience || 0),
          bio: data.bio,
          status: 'PENDING_REVIEW',
          termsAcceptanceId: acceptance.id,
        },
      });

      return driver;
    });

    console.log('Driver application successful:', result.id);
    
    revalidatePath('/admin/drivers');
    revalidatePath('/admin/terms');
    
    return { success: true, driverId: result.id };
  } catch (error: any) {
    console.error('Error applying as driver:', error);
    if (error.code === 'P2002') {
      return { error: 'A driver with these unique credentials (e.g. license, plate) already exists.' };
    }
    return { error: 'Application failed. Please verify your vehicle and license details.' };
  }
}

/**
 * Update driver's online/availability status.
 */
export async function updateDriverAvailability(driverId: string, isAvailable: boolean) {
  try {
    await prisma.driver.update({
      where: { id: driverId },
      data: { isAvailable },
    });
    
    revalidatePath('/drivers/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error updating driver availability:', error);
    return { success: false, error: 'Failed to update availability' };
  }
}

/**
 * Update the status of a specific booking/trip.
 */
export async function updateBookingStatus(bookingId: string, status: any) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    
    revalidatePath('/drivers/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, error: 'Failed to update booking status' };
  }
}

/**
 * Update driver's shift status (Note: Shift status not yet in schema, using isAvailable for now).
 */
export async function updateShiftStatus(driverId: string, shiftStatus: string) {
  console.log(`Updating shift status for driver ${driverId}: ${shiftStatus}`);
  
  // Future: Implement shift tracking table
  revalidatePath('/drivers/dashboard');
  return { success: true };
}
