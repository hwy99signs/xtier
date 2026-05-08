import React from 'react';
import { prisma } from '@/lib/prisma';
import { updatePricingRule } from '@/actions/admin';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, TrendingUp, DollarSign, Percent, ShieldAlert } from 'lucide-react';

export default async function EditPricingRulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rule = await prisma.pricingRule.findUnique({
    where: { id },
    include: { zone: true },
  });

  if (!rule) notFound();

  const zones = await prisma.serviceZone.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  async function action(fd: FormData) {
    'use server';
    const data = {
      name: fd.get('name') as string,
      description: fd.get('description') as string,
      baseFare: parseFloat(fd.get('baseFare') as string),
      perMileRate: parseFloat(fd.get('perMileRate') as string),
      commitmentPct: parseFloat(fd.get('commitmentPct') as string),
      surgeMultiplier: parseFloat(fd.get('surgeMultiplier') as string),
      minFare: parseFloat(fd.get('minFare') as string),
      direction: fd.get('direction') as string,
      zoneId: (fd.get('zoneId') as string) || null,
      isActive: fd.get('isActive') === 'on',
    };

    await updatePricingRule(id, data);
    redirect('/admin/pricing');
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/pricing" className="p-2 border border-[#1e1e1e] rounded-xl hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold">Edit Pricing Rule</h1>
          <p className="text-[#A0A0A0] text-sm mt-1">Refine the financial parameters for {rule.name}.</p>
        </div>
      </div>

      <div className="card-glass p-8 border-[#1e1e1e]">
        <form action={action} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="input-label">Rule Name</label>
              <input name="name" defaultValue={rule.name} className="input-field" required />
            </div>

            <div className="space-y-2">
              <label className="input-label">Applies to Zone</label>
              <select name="zoneId" defaultValue={rule.zoneId || ''} className="input-field">
                <option value="">Global / Universal</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="input-label">Description</label>
              <textarea name="description" defaultValue={rule.description || ''} className="input-field min-h-[80px]" />
            </div>

            <div className="space-y-2">
              <label className="input-label flex items-center gap-2">
                <DollarSign size={14} className="text-[#D4AF37]" /> Base Fare ($)
              </label>
              <input name="baseFare" type="number" step="0.01" defaultValue={rule.baseFare} className="input-field" required />
            </div>

            <div className="space-y-2">
              <label className="input-label flex items-center gap-2">
                <TrendingUp size={14} className="text-[#D4AF37]" /> Per Mile Rate ($)
              </label>
              <input name="perMileRate" type="number" step="0.01" defaultValue={rule.perMileRate} className="input-field" required />
            </div>

            <div className="space-y-2">
              <label className="input-label flex items-center gap-2">
                <Percent size={14} className="text-[#D4AF37]" /> Commitment Deposit (%)
              </label>
              <input name="commitmentPct" type="number" step="1" defaultValue={rule.commitmentPct} className="input-field" required />
            </div>

            <div className="space-y-2">
              <label className="input-label flex items-center gap-2">
                <TrendingUp size={14} className="text-[#D4AF37]" /> Surge Multiplier
              </label>
              <input name="surgeMultiplier" type="number" step="0.1" defaultValue={rule.surgeMultiplier} className="input-field" required />
            </div>

            <div className="space-y-2">
              <label className="input-label flex items-center gap-2">
                <ShieldAlert size={14} className="text-[#D4AF37]" /> Minimum Fare ($)
              </label>
              <input name="minFare" type="number" step="0.01" defaultValue={rule.minFare} className="input-field" required />
            </div>

            <div className="space-y-2">
              <label className="input-label">Travel Direction</label>
              <select name="direction" defaultValue={rule.direction} className="input-field">
                <option value="BOTH">Both Directions</option>
                <option value="TO_AIRPORT">To Airport Only</option>
                <option value="FROM_AIRPORT">From Airport Only</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input 
                type="checkbox" 
                id="isActive" 
                name="isActive" 
                defaultChecked={rule.isActive}
                className="w-5 h-5 rounded border-[#222] bg-[#111] text-[#D4AF37] focus:ring-[#D4AF37]/20"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-white">Rule is Active</label>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1e1e1e] flex gap-4">
            <button type="submit" className="btn-gold px-8 py-3 flex items-center gap-2">
              <Save size={18} /> Save Parameters
            </button>
            <Link href="/admin/pricing" className="btn-outline-gold px-8 py-3 text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
