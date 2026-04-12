import React from 'react';
import { prisma } from '@/lib/prisma';
import { publishTermsVersion } from '@/actions/admin';
import { FileText, CheckCircle2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function AdminTermsPage() {
  const versions = await prisma.termsVersion.findMany({
    include: { acceptances: true },
    orderBy: { createdAt: 'desc' },
  });

  const activeVersion = versions.find((v) => v.isActive);
  const acceptances = await prisma.termsAcceptance.findMany({
    orderBy: { acceptedAt: 'desc' },
    take: 20,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Terms Management</h1>
        <p className="text-[#A0A0A0] text-sm mt-1">Publish, version, and audit terms acceptance records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publish New Version */}
        <div className="card-glass p-6 border-[#1e1e1e]">
          <h2 className="font-display font-bold text-lg uppercase tracking-widest border-b border-[#1e1e1e] pb-4 mb-5">
            Publish New Terms Version
          </h2>
          <form
            action={async (fd) => {
              'use server';
              const version = fd.get('version') as string;
              const title = fd.get('title') as string;
              const content = fd.get('content') as string;
              if (version && title && content) {
                await publishTermsVersion(title, content, version);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="input-label">Version (e.g. v1.1)</label>
              <input name="version" className="input-field" placeholder="v1.0" required />
            </div>
            <div>
              <label className="input-label">Title</label>
              <input name="title" className="input-field" placeholder="Member Service Agreement" required />
            </div>
            <div>
              <label className="input-label">Content</label>
              <textarea name="content" className="input-field min-h-[160px] resize-y"
                placeholder="Full terms and conditions text..." required />
            </div>
            <button type="submit" className="btn-gold w-full text-xs py-3">
              Publish & Activate This Version
            </button>
          </form>
        </div>

        {/* Active Version */}
        <div className="space-y-4">
          <div className="card-glass p-6 border-[#1e1e1e]">
            <h2 className="font-display font-bold text-lg uppercase tracking-widest border-b border-[#1e1e1e] pb-4 mb-5">
              Active Version
            </h2>
            {activeVersion ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full">
                    ACTIVE
                  </span>
                  <span className="text-[#D4AF37] font-display font-bold">{activeVersion.version}</span>
                </div>
                <p className="text-sm font-bold text-white">{activeVersion.title}</p>
                <p className="text-[10px] text-[#555]">
                  Published {new Date(activeVersion.publishedAt).toLocaleDateString()} ·{' '}
                  {activeVersion.acceptances.length} acceptances
                </p>
                <div className="mt-4 p-4 bg-black/40 rounded-xl text-xs text-[#666] leading-relaxed line-clamp-6 overflow-hidden">
                  {activeVersion.content}
                </div>
              </div>
            ) : (
              <p className="text-[#555] text-sm italic">No active terms version published.</p>
            )}
          </div>

          {/* Version history */}
          {versions.length > 0 && (
            <div className="card-glass p-6 border-[#1e1e1e]">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest mb-4">Version History</h3>
              <div className="space-y-2">
                {versions.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-[#1e1e1e]">
                    <span className={cn('px-2 py-0.5 text-[10px] font-bold rounded-full border',
                      v.isActive ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' : 'text-[#555] bg-white/5 border-white/10')}>
                      {v.isActive ? 'ACTIVE' : 'ARCHIVED'}
                    </span>
                    <span className="text-sm font-bold text-[#D4AF37]">{v.version}</span>
                    <span className="text-xs text-[#555] flex-1">{v.title}</span>
                    <span className="text-[10px] text-[#444]">{v.acceptances.length} accepted</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Acceptance Records */}
      <div className="card-glass border-[#1e1e1e] overflow-hidden">
        <div className="px-8 py-5 border-b border-[#1e1e1e] flex items-center gap-3">
          <Users size={16} className="text-[#D4AF37]" />
          <h2 className="font-display font-bold text-base uppercase tracking-widest">Recent Acceptance Records</h2>
        </div>
        {acceptances.length === 0 ? (
          <div className="p-16 text-center opacity-40">
            <FileText size={40} className="text-[#D4AF37] mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest font-bold">No acceptance records yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e1e] text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold bg-black/30">
                <th className="px-8 py-4 text-left">Email</th>
                <th className="px-8 py-4 text-left">Accepted At</th>
                <th className="px-8 py-4 text-left">IP Address</th>
                <th className="px-8 py-4 text-left">Checkboxes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0f0f0f]">
              {acceptances.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-4 text-sm font-medium text-white">{a.email}</td>
                  <td className="px-8 py-4 text-xs text-[#666]">{new Date(a.acceptedAt).toLocaleString()}</td>
                  <td className="px-8 py-4 text-xs text-[#666] font-mono">{a.ipAddress ?? '—'}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Recorded</span>
                    </div>
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
