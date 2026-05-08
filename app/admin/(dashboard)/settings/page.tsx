import React from 'react';
import { prisma } from '@/lib/prisma';
import { upsertSetting } from '@/actions/admin';
import { Settings, Radio, MapPin, Bell, Zap } from 'lucide-react';

const DEFAULT_SETTINGS = [
  { key: 'PRIMARY_CORRIDOR', label: 'Primary Corridor', groupKey: 'operations', defaultValue: 'Kingwood ↔ IAH' },
  { key: 'SERVICE_AREA', label: 'Service Area Description', groupKey: 'operations', defaultValue: 'Kingwood, TX and surrounding Humble/Atascocita zones' },
  { key: 'LAUNCH_STATUS', label: 'Launch Status', groupKey: 'operations', defaultValue: 'STAGE_1_OPEN' },
  { key: 'MAX_ROUTE_CAPACITY', label: 'Max Riders Per Route', groupKey: 'operations', defaultValue: '6' },
  { key: 'NOTIFICATION_EMAIL', label: 'Admin Notification Email', groupKey: 'notifications', defaultValue: 'ops@xtier-transit.com' },
  { key: 'ALERT_ON_NEW_APPLICATION', label: 'Alert on New Application', groupKey: 'notifications', defaultValue: 'true' },
  { key: 'WEEKLY_BILLING_DAY', label: 'Weekly Billing Day', groupKey: 'billing', defaultValue: 'MONDAY' },
  { key: 'COMMITMENT_DEPOSIT_PCT', label: 'Commitment Deposit %', groupKey: 'billing', defaultValue: '20' },
];

export default async function AdminSettingsPage() {
  const settings = await prisma.adminSetting.findMany();
  const settingMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const groups: Record<string, typeof DEFAULT_SETTINGS> = {
    operations: DEFAULT_SETTINGS.filter((s) => s.groupKey === 'operations'),
    notifications: DEFAULT_SETTINGS.filter((s) => s.groupKey === 'notifications'),
    billing: DEFAULT_SETTINGS.filter((s) => s.groupKey === 'billing'),
  };

  const groupMeta: Record<string, { label: string; icon: any }> = {
    operations: { label: 'Operations', icon: MapPin },
    notifications: { label: 'Notifications', icon: Bell },
    billing: { label: 'Billing', icon: Zap },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">System Settings</h1>
        <p className="text-[#A0A0A0] text-sm mt-1">Configure xtier operational parameters and launch controls.</p>
      </div>

      {Object.entries(groups).map(([groupKey, items]) => {
        const meta = groupMeta[groupKey];
        return (
          <div key={groupKey} className="card-glass border-[#1e1e1e] overflow-hidden">
            <div className="px-8 py-5 border-b border-[#1e1e1e] flex items-center gap-3">
              <meta.icon size={16} className="text-[#D4AF37]" />
              <h2 className="font-display font-bold text-base uppercase tracking-widest">{meta.label}</h2>
            </div>
            <div className="p-8 space-y-6">
              {items.map((setting) => (
                <form
                  key={setting.key}
                  action={async (fd) => {
                    'use server';
                    const value = fd.get('value') as string;
                    await upsertSetting(setting.key, value, setting.label, setting.groupKey);
                  }}
                  className="flex items-end gap-6"
                >
                  <div className="flex-1">
                    <label className="input-label">{setting.label}</label>
                    <input
                      name="value"
                      defaultValue={settingMap[setting.key] ?? setting.defaultValue}
                      className="input-field"
                    />
                    <p className="text-[10px] text-[#444] mt-1 font-mono">KEY: {setting.key}</p>
                  </div>
                  <button type="submit" className="btn-outline-gold text-xs py-3 px-6 shrink-0">
                    Save
                  </button>
                </form>
              ))}
            </div>
          </div>
        );
      })}

      <div className="card-glass p-6 border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <Radio size={16} className="text-[#D4AF37]" />
          <h3 className="font-display font-bold tracking-widest uppercase text-base text-[#D4AF37]">Launch Status</h3>
        </div>
        <p className="text-[#A0A0A0] text-sm leading-relaxed">
          Current setting:{' '}
          <strong className="text-[#D4AF37]">{settingMap['LAUNCH_STATUS'] ?? 'STAGE_1_OPEN'}</strong>
        </p>
        <p className="text-[11px] text-[#555] mt-2">
          Use the LAUNCH_STATUS field above to control whether the subscriber form is active. Valid values include STAGE_1_OPEN, STAGE_1_WAITLIST_ONLY, PAUSED.
        </p>
      </div>
    </div>
  );
}
