'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// ─── Audit Helper ─────────────────────────────────────────────────────────────
async function writeAuditLog({
  action,
  targetEntity,
  targetId,
  previousData,
  newData,
}: {
  action: string;
  targetEntity?: string;
  targetId?: string;
  previousData?: object;
  newData?: object;
}) {
  const session = await auth();
  await prisma.auditLog.create({
    data: {
      adminId: session?.user?.id ?? 'unknown',
      adminName: session?.user?.name ?? 'unknown',
      action,
      targetEntity,
      targetId,
      previousData: previousData ? previousData : undefined,
      newData: newData ? newData : undefined,
    },
  });
}

// ─── Guard ────────────────────────────────────────────────────────────────────
async function requireAdminSession() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  return session;
}

// ─── Subscriber Actions ───────────────────────────────────────────────────────
export async function updateSubscriberStatus(
  id: string,
  status: 'APPROVED' | 'REJECTED' | 'WAITLISTED' | 'SUSPENDED',
  adminNotes?: string
) {
  await requireAdminSession();
  const previous = await prisma.subscriber.findUnique({ where: { id } });
  const updated = await prisma.subscriber.update({
    where: { id },
    data: {
      status,
      adminNotes,
      ...(status === 'APPROVED' ? { approvedAt: new Date() } : {}),
    },
  });
  await writeAuditLog({
    action: `SET_SUBSCRIBER_${status}`,
    targetEntity: 'Subscriber',
    targetId: id,
    previousData: { status: previous?.status },
    newData: { status, adminNotes },
  });
  revalidatePath('/admin/subscribers');
  revalidatePath('/admin/waitlist');
  return { success: true };
}

export async function assignDriverToSubscriber(subscriberId: string, driverId: string) {
  await requireAdminSession();
  const updated = await prisma.subscriber.update({
    where: { id: subscriberId },
    data: { assignedDriverId: driverId },
  });
  await writeAuditLog({
    action: 'ASSIGN_DRIVER',
    targetEntity: 'Subscriber',
    targetId: subscriberId,
    newData: { driverId },
  });
  revalidatePath('/admin/subscribers');
  revalidatePath('/admin/routes');
  return { success: true };
}

export async function saveSubscriberNotes(id: string, adminNotes: string) {
  await requireAdminSession();
  await prisma.subscriber.update({ where: { id }, data: { adminNotes } });
  revalidatePath(`/admin/subscribers/${id}`);
  return { success: true };
}

// ─── Driver Actions ───────────────────────────────────────────────────────────
export async function updateDriverStatus(
  id: string,
  status: 'ACTIVE' | 'REJECTED' | 'INACTIVE' | 'SUSPENDED',
  adminNotes?: string
) {
  await requireAdminSession();
  const previous = await prisma.driver.findUnique({ where: { id } });
  await prisma.driver.update({
    where: { id },
    data: {
      status: status as any,
      adminNotes,
      ...(status === 'ACTIVE' ? { approvedAt: new Date(), isAvailable: true } : {}),
    },
  });
  await writeAuditLog({
    action: `SET_DRIVER_${status}`,
    targetEntity: 'Driver',
    targetId: id,
    previousData: { status: previous?.status },
    newData: { status, adminNotes },
  });
  revalidatePath('/admin/drivers');
  return { success: true };
}

// ─── Pricing Actions ──────────────────────────────────────────────────────────
export async function updatePricingRule(
  id: string,
  data: { baseFare?: number; perMileRate?: number; commitmentPct?: number; surgeMultiplier?: number }
) {
  await requireAdminSession();
  const previous = await prisma.pricingRule.findUnique({ where: { id } });
  await prisma.pricingRule.update({ where: { id }, data });
  await writeAuditLog({
    action: 'UPDATE_PRICING_RULE',
    targetEntity: 'PricingRule',
    targetId: id,
    previousData: previous as any,
    newData: data,
  });
  revalidatePath('/admin/pricing');
  return { success: true };
}

// ─── Settings Actions ─────────────────────────────────────────────────────────
export async function upsertSetting(key: string, value: string, label: string, groupKey = 'general') {
  await requireAdminSession();
  await prisma.adminSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value, label, groupKey },
  });
  await writeAuditLog({
    action: 'UPDATE_SETTING',
    targetEntity: 'AdminSetting',
    newData: { key, value },
  });
  revalidatePath('/admin/settings');
  return { success: true };
}

// ─── Terms Actions ────────────────────────────────────────────────────────────
export async function publishTermsVersion(title: string, content: string, version: string) {
  await requireAdminSession();
  // Deactivate all existing terms
  await prisma.termsVersion.updateMany({ data: { isActive: false } });
  const newTerms = await prisma.termsVersion.create({
    data: { title, content, version, isActive: true },
  });
  await writeAuditLog({
    action: 'PUBLISH_TERMS_VERSION',
    targetEntity: 'TermsVersion',
    targetId: newTerms.id,
    newData: { title, version },
  });
  revalidatePath('/admin/terms');
  return { success: true };
}

// ─── Service Zone Actions ─────────────────────────────────────────────────────
export async function updateServiceZone(id: string, data: any) {
  await requireAdminSession();
  const previous = await prisma.serviceZone.findUnique({ where: { id } });
  await prisma.serviceZone.update({ where: { id }, data });
  await writeAuditLog({
    action: 'UPDATE_SERVICE_ZONE',
    targetEntity: 'ServiceZone',
    targetId: id,
    previousData: previous as any,
    newData: data,
  });
  revalidatePath('/admin/zones');
  return { success: true };
}

export async function createServiceZone(data: any) {
  await requireAdminSession();
  const newZone = await prisma.serviceZone.create({ data });
  await writeAuditLog({
    action: 'CREATE_SERVICE_ZONE',
    targetEntity: 'ServiceZone',
    targetId: newZone.id,
    newData: data,
  });
  revalidatePath('/admin/zones');
  return { success: true, id: newZone.id };
}

// ─── Pricing Actions (Extension) ──────────────────────────────────────────────
export async function createPricingRule(data: any) {
  await requireAdminSession();
  const newRule = await prisma.pricingRule.create({ data });
  await writeAuditLog({
    action: 'CREATE_PRICING_RULE',
    targetEntity: 'PricingRule',
    targetId: newRule.id,
    newData: data,
  });
  revalidatePath('/admin/pricing');
  return { success: true, id: newRule.id };
}
