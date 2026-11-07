import React, { useState, useMemo } from 'react';
import { SecurityAssessment, SecurityFinding, Severity, FindingStatus } from '../types/cybermind';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  UploadCloud, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Server,
  ArrowUpDown
} from 'lucide-react';

interface Props {
  assessment: SecurityAssessment;
  onSelectFinding: (findingId: string) => void;
  onOpenImportModal: () => void;
  onTriggerAnalysis: () => Promise<void>;
  isAnalyzing: boolean;
}

export function FindingsView({
  assessment,
  onSelectFinding,
  onOpenImportModal,
  onTriggerAnalysis,
  isAnalyzing,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [assetFilter, setAssetFilter] = useState<string>('ALL');

  // Unique assets in findings
  const uniqueAssets = useMemo(() => {
    return Array.from(new Set(assessment.findings.map(f => f.asset)));
  }, [assessment.findings]);

  // Filtered Findings
  const filteredFindings = useMemo(() => {
    return assessment.findings.filter(f => {
      const effSev = f.aiAnalysis?.finalContextualRisk || f.technicalSeverity;
      if (severityFilter !== 'ALL' && effSev !== severityFilter) return false;
      if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
      if (assetFilter !== 'ALL' && f.asset !== assetFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          f.finding.toLowerCase().includes(q) ||
          f.asset.toLowerCase().includes(q) ||
          f.service.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [assessment.findings, severityFilter, statusFilter, assetFilter, searchTerm]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c121d] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              {assessment.targetCode}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {assessment.findings.length} Total Findings
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Security Findings Repository
          </h2>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenImportModal}
            className="px-3.5 py-2 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Import Findings</span>
          </button>

          <button
            onClick={onTriggerAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center gap-2"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-Correlate All'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#090e17] border border-slate-800/80 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search findings, assets, ports, or CVE keywords..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          className="text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="OBSERVED">Observed</option>
          <option value="AI_ANALYZED">AI Analyzed</option>
          <option value="CORRELATED">Correlated</option>
          <option value="VERIFIED">Verified</option>
        </select>

        {/* Asset Filter */}
        <select
          value={assetFilter}
          onChange={e => setAssetFilter(e.target.value)}
          className="text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Assets</option>
          {uniqueAssets.map(a => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Findings Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0c121d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#090e17] border-b border-slate-800 text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Asset & Service</th>
                <th className="py-3 px-4">Finding Title</th>
                <th className="py-3 px-4">AI Exploitability</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFindings.map(f => {
                const effectiveSev = f.aiAnalysis?.finalContextualRisk || f.technicalSeverity;
                return (
                  <tr
                    key={f.id}
                    onClick={() => onSelectFinding(f.id)}
                    className="hover:bg-slate-900/60 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <SeverityBadge severity={effectiveSev} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">{f.asset}</div>
                      <div className="text-[11px] text-slate-500">
                        {f.service} :{f.port}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-medium text-slate-200 group-hover:text-cyan-300 transition line-clamp-1">
                        {f.finding}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {f.aiAnalysis?.plainEnglishSummary || f.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-slate-300">
                        {f.aiAnalysis?.exploitability || 'Moderate'}
                      </span>
                      {f.aiAnalysis?.confidence && (
                        <div className="text-[10px] text-emerald-400">
                          {Math.round(f.aiAnalysis.confidence * 100)}% conf
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSelectFinding(f.id);
                        }}
                        className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-slate-900 hover:bg-cyan-950 hover:text-cyan-400 text-slate-300 border border-slate-700 hover:border-cyan-700 transition flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredFindings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-mono text-xs">
                    No findings match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
