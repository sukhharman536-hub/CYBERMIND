import React, { useState } from 'react';
import { AuditLogEntry } from '../types/cybermind';
import { Terminal, ShieldAlert, CheckCircle2, AlertTriangle, Search, Filter } from 'lucide-react';

interface Props {
  auditLogs: AuditLogEntry[];
}

export function AuditLogView({ auditLogs }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.eventType.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c121d] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              IMMUTABLE AUDIT TRAIL
            </span>
            <span className="text-xs font-mono text-slate-400">
              {auditLogs.length} Recorded Security Events
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            System & Human Action Audit Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Chronological logging of finding imports, AI reasoning triggers, approvals, rejections, and blocked policy violations.
          </p>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-800/60 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Compliance Logging: Active</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-[#090e17] border border-slate-800/80 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search audit logs by actor, event type, or details..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Outcomes</option>
          <option value="SUCCESS">Success</option>
          <option value="BLOCKED">Blocked (Violations)</option>
          <option value="WARNING">Warning</option>
          <option value="INFO">Info</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c121d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#090e17] border-b border-slate-800 text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map(log => {
                const isBlocked = log.status === 'BLOCKED';
                const isSuccess = log.status === 'SUCCESS';

                return (
                  <tr
                    key={log.id}
                    className={`transition ${isBlocked ? 'bg-rose-950/20' : 'hover:bg-slate-900/50'}`}
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          isBlocked
                            ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                            : isSuccess
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-200">
                      {log.eventType}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-cyan-400">
                      {log.actor}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-purple-300">
                      {log.target}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-md">
                      {log.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
