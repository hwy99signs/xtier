import 'dotenv/config';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  // 1. Create default ADMIN user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@xtier.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      phone: '8325551234',
      role: 'ADMIN',
    },
  });
  console.log(`Admin user created/verified: ${admin.email}`);

  // 2. Create Service Zones
  const zones = [
    {
      name: 'Kingwood North',
      description: 'North of Northpark Dr',
      type: 'ORIGIN' as const,
      minMiles: 0,
      maxMiles: 25,
      basePrice: 55,
      sortOrder: 1,
    },
    {
      name: 'Kingwood Central',
      description: 'Between Northpark Dr and Kingwood Dr',
      type: 'ORIGIN' as const,
      minMiles: 0,
      maxMiles: 22,
      basePrice: 45,
      sortOrder: 2,
    },
    {
      name: 'Atascocita',
      description: 'Atascocita area',
      type: 'ORIGIN' as const,
      minMiles: 0,
      maxMiles: 20,
      basePrice: 40,
      sortOrder: 3,
    },
    {
      name: 'IAH Terminals',
      description: 'George Bush Intercontinental Airport',
      type: 'DESTINATION' as const,
      minMiles: 0,
      maxMiles: 999,
      basePrice: 0,
      sortOrder: 4,
    },
  ];

  for (const zone of zones) {
    await prisma.serviceZone.upsert({
      where: { id: zone.name.toLowerCase().replace(/\s/g, '-') },
      update: zone,
      create: {
        id: zone.name.toLowerCase().replace(/\s/g, '-'),
        ...zone,
      },
    });
  }
  console.log('Service zones seeded.');

  // 3. Create initial Terms Version
  const terms = await prisma.termsVersion.create({
    data: {
      version: 'v1.0',
      title: 'xtier Executive Service Agreement',
      content: `
        1. Executive Master Agreement
        This agreement governs the use of xtier services...
        2. Cancellation & No-Show Policy
        Cancellations made less than 12 hours before...
        3. Service Limitations
        Our primary service area is strictly defined...
        4. Payment Terms
        Subscribers agree to an upfront commitment payment (up to 20%)...
        5. Data & Privacy
        We collect IP addresses, timestamps, and geolocation data...
      `,
      isActive: true,
      publishedAt: new Date(),
    },
  });
  console.log(`Terms version seeded: ${terms.version}`);

  // 5. Create test Subscriber Lead
  const subscriberUser = await prisma.user.upsert({
    where: { email: 'subscriber@example.com' },
    update: {},
    create: {
      email: 'subscriber@example.com',
      passwordHash: await bcrypt.hash('Subscriber123!', 10),
      firstName: 'John',
      lastName: 'Subscriber',
      phone: '8320001111',
      role: 'CUSTOMER',
    },
  });

  const termsAcceptance = await prisma.termsAcceptance.create({
    data: {
      termsVersionId: terms.id,
      email: subscriberUser.email,
      ipAddress: '127.0.0.1',
      checkboxResponses: {
        termsAccepted: true,
        privacyAccepted: true,
        cancellationAccepted: true,
        smsConsentAccepted: true,
        ageConfirmed: true,
      },
    },
  });

  const subscriber = await prisma.subscriber.upsert({
    where: { userId: subscriberUser.id },
    update: {},
    create: {
      userId: subscriberUser.id,
      pickupAddress: '123 Kingwood Dr',
      pickupCity: 'Kingwood',
      pickupState: 'TX',
      pickupZip: '77339',
      dropoffAddress: 'IAH Terminal C',
      dropoffCity: 'Houston',
      dropoffState: 'TX',
      dropoffZip: '77032',
      status: 'PENDING_APPROVAL',
      direction: 'BOTH',
      distanceMiles: 22,
      estimatedPrice: 45,
      termsAcceptanceId: termsAcceptance.id,
    },
  });
  console.log('Test subscriber lead seeded.');

  // 6. Create test Driver Applicant
  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@example.com' },
    update: {},
    create: {
      email: 'driver@example.com',
      passwordHash: await bcrypt.hash('Driver123!', 10),
      firstName: 'Jane',
      lastName: 'Driver',
      phone: '8329998888',
      role: 'DRIVER',
    },
  });

  await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: {},
    create: {
      userId: driverUser.id,
      licenseNumber: 'TX12345678',
      licenseState: 'TX',
      licenseExpiry: new Date('2028-12-31'),
      vehicleMake: 'Lexus',
      vehicleModel: 'ES 350',
      vehicleYear: 2022,
      vehicleColor: 'Black',
      vehiclePlate: 'ERT-1234',
      vehicleCapacity: 4,
      yearsExperience: 10,
      status: 'PENDING_REVIEW',
    },
  });
  console.log('Test driver applicant seeded.');

  // 7. Create test Route Request (Booking)
  await prisma.booking.create({
    data: {
      subscriberId: subscriber.id,
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
      direction: 'TO_AIRPORT',
      pickupAddress: subscriber.pickupAddress,
      dropoffAddress: subscriber.dropoffAddress,
      distanceMiles: 22,
      fareAmount: 45,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      notes: 'Test booking for staging verification.',
    },
  });
  console.log('Test route request (booking) seeded.');

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
