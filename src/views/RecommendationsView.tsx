import React, { useState } from 'react';
import { SecurityAssessment, RemediationRecommendation } from '../types/cybermind';
import { 
  ShieldCheck, 
  Clock, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  RotateCcw, 
  FileCode2,
  Check
} from 'lucide-react';

interface Props {
  assessment: SecurityAssessment;
  onSelectFinding: (findingId: string) => void;
}

export function RecommendationsView({ assessment, onSelectFinding }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const recommendations = assessment.recommendations || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c121d] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              ACTIONABLE REMEDIATION ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              Target: <strong className="text-cyan-400">{assessment.targetCode}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Prioritized Security Recommendations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Prioritized by contextual exploitability to maximize risk reduction with minimum operational friction.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
          Total Interventions: <strong className="text-emerald-400">{recommendations.length} Plans</strong>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-6">
        {recommendations.map(rec => (
          <div
            key={rec.id}
            className="p-6 rounded-2xl bg-[#0c121d] border border-slate-800 hover:border-emerald-500/40 transition space-y-5"
          >
            {/* Top Bar with Priority & Effort */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  Priority 0{rec.priority}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {rec.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{rec.effort}</span>
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Target: {rec.targetAsset}
                </span>
              </div>
            </div>

            {/* Why This Priority Card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Contextual Priority Justification (Why Fix First)
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {rec.rationale}
              </p>
              <div className="text-xs text-emerald-300 pt-1">
                <strong className="text-slate-400 font-mono">Impact on Attack Chains:</strong> {rec.impact}
              </div>
            </div>

            {/* Implementation Steps */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Actionable Implementation Steps:
              </span>
              <div className="space-y-2">
                {rec.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="text-emerald-400 font-bold select-none">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code / Configuration Snippet */}
            {rec.codeSnippet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                    Hardened Configuration Snippet
                  </span>
                  <button
                    onClick={() => handleCopy(rec.id, rec.codeSnippet!)}
                    className="text-xs font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 transition flex items-center gap-1"
                  >
                    {copiedId === rec.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3.5 rounded-xl bg-[#06090e] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  <code>{rec.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Rollback & Related Findings */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs font-mono">
              <div className="text-slate-400 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Rollback Procedure: <strong className="text-slate-300">{rec.rollback}</strong></span>
              </div>

              {rec.relatedFindingIds && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Related Findings:</span>
                  {rec.relatedFindingIds.map(fid => (
                    <button
                      key={fid}
                      onClick={() => onSelectFinding(fid)}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 transition"
                    >
                      {fid}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
