import React from 'react';
import { SecurityFinding } from '../types/cybermind';
import { SeverityBadge, StatusBadge } from './Badges';
import { 
  X, 
  ShieldCheck, 
  Server, 
  Terminal, 
  Sparkles, 
  Link as LinkIcon, 
  ExternalLink,
  Clock, 
  FileCode2, 
  CheckCircle2, 
  AlertOctagon,
  ArrowRight
} from 'lucide-react';

interface Props {
  finding: SecurityFinding | null;
  onClose: () => void;
  onSelectRelated?: (findingId: string) => void;
  onRequestAction?: (finding: SecurityFinding) => void;
}

export function FindingDetailModal({ finding, onClose, onSelectRelated, onRequestAction }: Props) {
  if (!finding) return null;

  const analysis = finding.aiAnalysis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0c121d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-[#090e17]">
          <div className="space-y-2 pr-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <SeverityBadge severity={analysis?.finalContextualRisk || finding.technicalSeverity} size="md" />
              <StatusBadge status={finding.status} />
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                {finding.target}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Port {finding.port} ({finding.service})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {finding.finding}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Contextual Risk Comparison Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-indigo-300">
                Contextual Risk Evaluation vs Raw Severity
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Technical Severity</span>
                <span className="text-xs font-mono font-bold text-slate-200 mt-1 block">
                  {finding.technicalSeverity}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Exposure</span>
                <span className="text-xs font-mono font-bold text-cyan-300 mt-1 block">
                  {analysis?.exposure || 'External'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Exploitability</span>
                <span className="text-xs font-mono font-bold text-amber-300 mt-1 block">
                  {analysis?.exploitability || 'Moderate'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Asset Importance</span>
                <span className="text-xs font-mono font-bold text-purple-300 mt-1 block">
                  {analysis?.assetImportance || 'High'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Correlation</span>
                <span className="text-xs font-mono font-bold text-pink-300 mt-1 block">
                  {analysis?.correlationFactor || 'High'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Confidence</span>
                <span className="text-xs font-mono font-bold text-emerald-400 mt-1 block">
                  {analysis?.confidence ? `${Math.round(analysis.confidence * 100)}%` : '92%'}
                </span>
              </div>
            </div>

            {/* AI Reasoning (Why it matters) */}
            <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40">
              <span className="text-xs font-mono font-semibold text-indigo-300 uppercase tracking-wide block mb-1">
                Why CyberMind Elevated / Prioritized this finding:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {analysis?.contextualReasoning ||
                  'Evaluated by evaluating exposure to public ingress vectors and correlated authentication weaknesses.'}
              </p>
            </div>
          </div>

          {/* Technical & Plain English Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase">
                <Terminal className="w-4 h-4" />
                Technical Explanation
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {analysis?.technicalExplanation || finding.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
                <ShieldCheck className="w-4 h-4" />
                Plain English Explanation (Non-Expert)
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {analysis?.plainEnglishSummary || finding.finding}
              </p>
              {analysis?.potentialImpact && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-rose-300">
                  <strong className="text-slate-400 font-mono">Potential Impact:</strong> {analysis.potentialImpact}
                </div>
              )}
            </div>
          </div>

          {/* Evidence Checklist */}
          {analysis?.evidence && analysis.evidence.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Observed Evidence & Proof
              </h4>
              <div className="space-y-1.5">
                {analysis.evidence.map((ev, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300">
                    <span className="text-cyan-500 font-bold select-none">[EV-{idx + 1}]</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MITRE ATT&CK & Related Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis?.mitreAttackTactics && analysis.mitreAttackTactics.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
                  MITRE ATT&CK Tactics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.mitreAttackTactics.map((tac, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {tac}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis?.relatedFindingIds && analysis.relatedFindingIds.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold block flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
                  Connected Findings in Attack Chain
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.relatedFindingIds.map(rfId => (
                    <button
                      key={rfId}
                      onClick={() => onSelectRelated && onSelectRelated(rfId)}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/60 transition flex items-center gap-1"
                    >
                      <span>Finding {rfId}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommended Remediation Section */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <FileCode2 className="w-4 h-4" />
                Recommended Remediation
              </span>
              {analysis?.remediationEffort && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Effort: {analysis.remediationEffort}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {analysis?.recommendedRemediation || 'Apply vendor updates and isolate endpoint access.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#090e17] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400">
            Assessed by CyberMind AI • Safe Sandbox Authorized
          </div>

          <div className="flex items-center gap-3">
            {onRequestAction && (
              <button
                onClick={() => {
                  onClose();
                  onRequestAction(finding);
                }}
                className="px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Request Sandbox Verification</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
