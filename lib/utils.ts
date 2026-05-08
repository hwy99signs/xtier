import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

import { getMockDistance } from './maps';

/**
 * Estimates road distance in miles from Kingwood area to IAH.
 * @param pickupZip Valid 5-digit ZIP code
 */
export function estimateDistance(pickupZip: string): number {
  if (!process.env.GOOGLE_MAPS_API_KEY && process.env.NODE_ENV === 'production') {
    console.warn('[xtier] GOOGLE_MAPS_API_KEY is missing. Using ZIP fallback.');
  }

  return getMockDistance(pickupZip);
}

/**
 * Calculates fare based on distance and base pricing.
 */
export function calculateFare(
  distanceMiles: number,
  baseFare: number = 45,
  perMileRate: number = 2.0
): number {
  const fare = baseFare + Math.max(0, distanceMiles - 20) * perMileRate
  return Math.round(fare * 100) / 100
}

/**
 * Calculates the upfront commitment payment amount.
 */
export function calculateCommitment(totalFare: number, commitmentPct: number = 20): number {
  return Math.round((totalFare * commitmentPct) / 100 * 100) / 100
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}
