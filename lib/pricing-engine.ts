import { prisma } from './prisma';

export interface PricingBreakdown {
  distanceMiles: number;
  totalFare: number;
  baseFare: number;
  perMileFare: number;
  commitmentAmount: number;
  zoneName: string;
  zoneId: string | null;
  isWaitlistOnly: boolean;
}

/**
 * xtier — Pricing Engine
 * Matches distance to zones and applies pricing rules.
 */
export async function calculateDetailedPricing(
  distanceMiles: number,
  serviceType: 'COMMUTER' | 'EXECUTIVE' | 'AIRPORT' = 'COMMUTER'
): Promise<PricingBreakdown> {
  // 1. Fetch all active zones
  const zones = await prisma.serviceZone.findMany({
    where: { isActive: true },
    orderBy: { minMiles: 'asc' },
  });

  // 2. Find matching zone
  let matchedZone = zones.find(
    (z) => distanceMiles >= z.minMiles && distanceMiles <= z.maxMiles
  );

  // 3. Handle "Out of Area" (No zone matches)
  if (!matchedZone) {
    return {
      distanceMiles,
      totalFare: 0,
      baseFare: 0,
      perMileFare: 0,
      commitmentAmount: 0,
      zoneName: 'OUTSIDE_SERVICE_AREA',
      zoneId: null,
      isWaitlistOnly: true,
    };
  }

  // 4. Fetch pricing rules for this zone
  const pricingRule = await prisma.pricingRule.findFirst({
    where: {
      zoneId: matchedZone.id,
      isActive: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // 5. Calculate fare (Fallback to zone basePrice if no rule exists)
  const baseFare = pricingRule?.baseFare ?? matchedZone.basePrice;
  const perMileRate = pricingRule?.perMileRate ?? 0;
  const commitmentPct = pricingRule?.commitmentPct ?? 20;

  // Logic: Base Fare covers first 20 miles (standard)
  const excessMiles = Math.max(0, distanceMiles - 20);
  const totalFare = baseFare + (excessMiles * perMileRate);
  
  const commitmentAmount = (totalFare * commitmentPct) / 100;

  return {
    distanceMiles,
    totalFare: Math.round(totalFare * 100) / 100,
    baseFare: Math.round(baseFare * 100) / 100,
    perMileFare: Math.round(perMileRate * 100) / 100,
    commitmentAmount: Math.round(commitmentAmount * 100) / 100,
    zoneName: matchedZone.name,
    zoneId: matchedZone.id,
    isWaitlistOnly: false,
  };
}

/**
 * Sync version for frontend (using mock data or pre-fetched zones)
 */
export function calculateDetailedPricingSync(
  distanceMiles: number,
  zones: any[]
): PricingBreakdown {
  let matchedZone = zones.find(
    (z) => distanceMiles >= z.minMiles && distanceMiles <= z.maxMiles
  );

  if (!matchedZone) {
    return {
      distanceMiles,
      totalFare: 0,
      baseFare: 0,
      perMileFare: 0,
      commitmentAmount: 0,
      zoneName: 'OUTSIDE_SERVICE_AREA',
      zoneId: null,
      isWaitlistOnly: true,
    };
  }

  // Simplified sync calculation for preview
  const baseFare = matchedZone.basePrice || 45;
  const perMileRate = 2.0;

  // Logic: Base Fare covers first 20 miles (consistent with async)
  const excessMiles = Math.max(0, distanceMiles - 20);
  const totalFare = baseFare + (excessMiles * perMileRate);
  
  return {
    distanceMiles,
    totalFare: Math.round(totalFare * 100) / 100,
    baseFare: Math.round(baseFare * 100) / 100,
    perMileFare: perMileRate,
    commitmentAmount: Math.round((totalFare * 0.2) * 100) / 100,
    zoneName: matchedZone.name,
    zoneId: matchedZone.id,
    isWaitlistOnly: false,
  };
}
