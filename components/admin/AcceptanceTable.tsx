'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TermsAcceptanceDetail from './TermsAcceptanceDetail';

interface AcceptanceRecord {
  id: string;
  email: string;
  acceptedAt: Date | string;
  ipAddress: string | null;
  checkboxResponses: any;
}

interface AcceptanceTableProps {
  records: AcceptanceRecord[];
}

export default function AcceptanceTable({ records }: AcceptanceTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = records.filter(r => 
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.ipAddress && r.ipAddress.includes(searchQuery))
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={14} />
          <input 
            type="text" 
            placeholder="Filter records..." 
            className="bg-black/40 border border-[#1e1e1e] rounded-xl pl-9 pr-4 py-2 text-xs w-64 focus:border-[#D4AF37]/50 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="card-glass border-[#1e1e1e] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#1e1e1e] text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold bg-black/30">
              <th className="px-8 py-4">Participant</th>
              <th className="px-8 py-4">Timestamp</th>
              <th className="px-8 py-4">IP Audit</th>
              <th className="px-8 py-4 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0f0f0f]">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center opacity-40">
                  <p className="text-xs uppercase tracking-widest font-bold">No Records Match Query</p>
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <React.Fragment key={record.id}>
                  <tr 
                    className={cn(
                      "group cursor-pointer hover:bg-white/[0.02] transition-colors",
                      expandedId === record.id ? "bg-[#D4AF37]/5" : ""
                    )}
                    onClick={() => toggleExpand(record.id)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e1e1e] to-black border border-[#222] flex items-center justify-center font-bold text-[10px] text-[#A0A0A0]">
                          {record.email[0].toUpperCase()}
                        </div>
                        <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">{record.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-[#666]">
                        <Clock size={12} className="text-[#D4AF37]" />
                        <span className="text-xs">{new Date(record.acceptedAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[10px] font-mono text-[#444] group-hover:text-[#666]">{record.ipAddress || 'Not Captured'}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:underline">
                        Audit Details
                        {expandedId === record.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedId === record.id && (
                    <tr>
                      <td colSpan={4} className="px-12 py-8 bg-black/40 border-b border-[#1e1e1e]">
                        <div className="max-w-4xl animate-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <ShieldCheck className="text-emerald-400" size={20} />
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Cryptographic Verification</h4>
                                <p className="text-[10px] text-[#555] mt-0.5">Record ID: {record.id}</p>
                              </div>
                            </div>
                            <button className="p-2 border border-[#1e1e1e] rounded-xl hover:text-[#D4AF37] transition-all opacity-40 hover:opacity-100">
                               <ExternalLink size={14} />
                            </button>
                          </div>
                          
                          <TermsAcceptanceDetail checkboxResponses={record.checkboxResponses} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
