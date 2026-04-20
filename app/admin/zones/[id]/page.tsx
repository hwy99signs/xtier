import React from 'react';
import { prisma } from '@/lib/prisma';
import { updateServiceZone } from '@/actions/admin';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, MapPin, Activity, Navigation, Ruler } from 'lucide-react';

export default async function EditServiceZonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const zone = await prisma.serviceZone.findUnique({
    where: { id },
  });

  if (!zone) notFound();

  async function action(fd: FormData) {
    'use server';
    const data = {
      name: fd.get('name') as string,
      description: fd.get('description') as string,
      type: fd.get('type') as string,
      minMiles: parseFloat(fd.get('minMiles') as string),
      maxMiles: parseFloat(fd.get('maxMiles') as string),
      basePrice: parseFloat(fd.get('basePrice') as string),
      sortOrder: parseInt(fd.get('sortOrder') as string),
      isActive: fd.get('isActive') === 'on',
    };

    await updateServiceZone(id, data);
    redirect('/admin/zones');
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/zones" className="p-2 border border-[#1e1e1e] rounded-xl hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold">Edit Service Zone</h1>
          <p className="text-[#A0A0A0] text-sm mt-1">Modify geographical boundaries and base pricing for {zone.name}.</p>
        </div>
      </div>

      <div className="card-glass p-8 border-[#1e1e1e]">
        <form action={action} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="input-label">Zone Name</label>
              <input name="name" defaultValue={zone.name} className="input-field" required />
            </div>

            <div className="space-y-2">
              <label className="input-label">Zone Type</label>
              <select name="type" defaultValue={zone.type} className="input-field">
                <option value="ORIGIN">Origin (Pickup Zone)</option>
                <option value="DESTINATION">Destination (Drop-off Zone)</option>
                <option value="BOTH">Universal (Both)</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="input-label">Description</label>
              <textarea name="description" defaultValue={zone.description || ''} className="input-field min-h-[80px]" />
            </div>

            <div className="space-y-2">
              <label className="input-label flex items-center gap-2">
                <Ruler size={14} className="text-[#D4AF37]" /> Min Miles
              </label>
              <input name="minMiles" type="number" step="0.1" defaultValue={zone.minMiles} className="input-field" required />
            </div>

            <div className="space-y-2">
              <label className="input-label flex items-center gap-2">
                <Navigation size={14} className="text-[#D4AF37]" /> Max Miles
              </label>
              <input name="maxMiles" type="number" step="0.1" defaultValue={zone.maxMiles} className="input-field" required />
            </div>

            <div className="space-y-2">
              <label className="input-label flex items-center gap-2 text-[#D4AF37]">
                Base Price ($)
              </label>
              <input name="basePrice" type="number" step="0.01" defaultValue={zone.basePrice} className="input-field" required />
            </div>

            <div className="space-y-2">
              <label className="input-label">Sort Order</label>
              <input name="sortOrder" type="number" step="1" defaultValue={zone.sortOrder} className="input-field" required />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input 
                type="checkbox" 
                id="isActive" 
                name="isActive" 
                defaultChecked={zone.isActive}
                className="w-5 h-5 rounded border-[#222] bg-[#111] text-[#D4AF37] focus:ring-[#D4AF37]/20"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-white">Zone is Operational</label>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1e1e1e] flex gap-4">
            <button type="submit" className="btn-gold px-8 py-3 flex items-center gap-2">
              <Save size={18} /> Save Boundaries
            </button>
            <Link href="/admin/zones" className="btn-outline-gold px-8 py-3 text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
