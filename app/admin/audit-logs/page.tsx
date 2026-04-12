import React from 'react';
import { prisma } from '@/lib/prisma';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const actionColor: Record<string, string> = {
  APPROVED: 'text-emerald-400',
  REJECTED: 'text-red-400',
  WAITLISTED: 'text-blue-400',
  ASSIGNED: 'text-[#D4AF37]',
  UPDATED: 'text-amber-400',
  PUBLISHED: 'text-purple-400',
};

function getActionColor(action: string): string {
  for (const key of Object.keys(actionColor)) {
    if (action.includes(key)) return actionColor[key];
  }
  return 'text-[#A0A0A0]';
}

export default async function AdminAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Audit Log</h1>
          <p className="text-[#A0A0A0] text-sm mt-1">Immutable record of all administrative actions across ERANTT TRANSIT.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl">
          <Shield size={14} className="text-[#D4AF37]" />
          <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">Read-Only · Immutable</span>
        </div>
      </div>

      <div className="card-glass border-[#1e1e1e] overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-20 text-center opacity-40">
            <Shield size={48} className="text-[#D4AF37] mx-auto mb-4" />
            <p className="text-sm uppercase tracking-widest font-bold">No admin actions recorded yet</p>
            <p className="text-xs text-[#555] mt-2">Actions will appear here as admins manage the portal</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e1e] text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold bg-black/30">
                <th className="px-8 py-4 text-left">Timestamp</th>
                <th className="px-8 py-4 text-left">Admin</th>
                <th className="px-8 py-4 text-left">Action</th>
                <th className="px-8 py-4 text-left">Entity</th>
                <th className="px-8 py-4 text-left">Previous</th>
                <th className="px-8 py-4 text-left">New Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0f0f0f]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.015] transition-colors">
                  <td className="px-8 py-3">
                    <p className="text-xs text-[#A0A0A0] font-mono">{new Date(log.createdAt).toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-3">
                    <p className="text-sm font-bold text-white">{log.adminName ?? '—'}</p>
                    <p className="text-[10px] text-[#555] font-mono">{log.adminId?.slice(0, 8)}...</p>
                  </td>
                  <td className="px-8 py-3">
                    <span className={cn('text-xs font-bold uppercase tracking-widest', getActionColor(log.action))}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-3">
                    <div>
                      <span className="text-xs text-[#A0A0A0] font-medium">{log.targetEntity ?? '—'}</span>
                      {log.targetId && (
                        <p className="text-[10px] text-[#444] font-mono">{log.targetId.slice(0, 12)}...</p>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-3">
                    {log.previousData ? (
                      <code className="text-[10px] text-[#666] bg-black/40 px-2 py-1 rounded font-mono block max-w-[160px] truncate">
                        {JSON.stringify(log.previousData)}
                      </code>
                    ) : (
                      <span className="text-[11px] text-[#333]">—</span>
                    )}
                  </td>
                  <td className="px-8 py-3">
                    {log.newData ? (
                      <code className="text-[10px] text-[#D4AF37]/70 bg-[#D4AF37]/5 px-2 py-1 rounded font-mono block max-w-[160px] truncate">
                        {JSON.stringify(log.newData)}
                      </code>
                    ) : (
                      <span className="text-[11px] text-[#333]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
