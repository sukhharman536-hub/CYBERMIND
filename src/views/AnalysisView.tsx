import React from 'react';
import { SecurityAssessment, SecurityFinding } from '../types/cybermind';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { 
  Sparkles, 
  BrainCircuit, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  FileCode2,
  RefreshCw,
  Info
} from 'lucide-react';

interface Props {
  assessment: SecurityAssessment;
  onSelectFinding: (findingId: string) => void;
  onTriggerAnalysis: () => Promise<void>;
  isAnalyzing: boolean;
  onNavigate: (tab: string) => void;
}

export function AnalysisView({
  assessment,
  onSelectFinding,
  onTriggerAnalysis,
  isAnalyzing,
  onNavigate,
}: Props) {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1424] via-indigo-950/40 to-[#0c1424] border border-indigo-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
              AI SECURITY ANALYST ENGINE
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              Gemini 3.8 Flash Active
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Contextual Risk Reasoning & Finding Correlation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            CyberMind AI synthesizes fragmented vulnerability observations into correlated attack chains, evaluates contextual exploitability, and explains WHY risk was elevated.
          </p>
        </div>

        <button
          onClick={onTriggerAnalysis}
          disabled={isAnalyzing}
          className="px-5 py-2.5 text-xs font-mono font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Running Gemini Analysis...' : 'Re-Analyze Findings'}</span>
        </button>
      </div>

      {/* Correlated Multi-Finding Attack Chains Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white font-heading">
              Correlated Attack Chains ({assessment.correlatedChains.length})
            </h3>
          </div>
          <button
            onClick={() => onNavigate('graph')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <span>Visualize in Risk Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {assessment.correlatedChains.map((chain, idx) => (
            <div
              key={chain.id}
              className="p-5 rounded-2xl bg-[#0c121d] border border-purple-500/40 shadow-xl space-y-4 hover:border-purple-400/70 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-700">
                    CHAIN 0{idx + 1}
                  </span>
                  <h4 className="text-base font-bold text-white tracking-tight">{chain.title}</h4>
                </div>
                <SeverityBadge severity={chain.severity} size="sm" />
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {chain.description}
              </p>

              {/* Step Sequence */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Exploitation Progression Flow:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {chain.chainSteps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono relative overflow-hidden"
                    >
                      <div className="text-[10px] text-purple-400 font-bold mb-1">
                        STAGE {sIdx + 1}
                      </div>
                      <div className="leading-snug">{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact & Intervention */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-300">
                  <strong className="text-rose-400 block mb-0.5">Potential Business Impact:</strong>
                  {chain.businessImpact}
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-300">
                  <strong className="text-emerald-400 block mb-0.5">Recommended Intervention:</strong>
                  {chain.recommendedIntervention}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual Risk Scoring Matrix Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white font-heading">
            Contextual Risk Evaluation Matrix (Why Findings Were Elevated)
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0c121d] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#090e17] border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Finding & Asset</th>
                  <th className="py-3 px-4">Tech Severity</th>
                  <th className="py-3 px-4">Exposure</th>
                  <th className="py-3 px-4">Exploitability</th>
                  <th className="py-3 px-4">Importance</th>
                  <th className="py-3 px-4">Final Contextual Risk</th>
                  <th className="py-3 px-4">AI "Why" Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {assessment.findings.map(f => {
                  const a = f.aiAnalysis;
                  const finalSev = a?.finalContextualRisk || f.technicalSeverity;
                  const isElevated =
                    (f.technicalSeverity === 'HIGH' || f.technicalSeverity === 'MEDIUM') &&
                    finalSev === 'CRITICAL';

                  return (
                    <tr
                      key={f.id}
                      onClick={() => onSelectFinding(f.id)}
                      className="hover:bg-slate-900/60 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-200 line-clamp-1">{f.finding}</div>
                        <div className="text-[11px] text-slate-500">
                          {f.asset} (:{f.port})
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <SeverityBadge severity={f.technicalSeverity} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-cyan-300">
                        {a?.exposure || 'External'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-amber-300">
                        {a?.exploitability || 'Moderate'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-purple-300">
                        {a?.assetImportance || 'High'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <SeverityBadge severity={finalSev} size="sm" />
                          {isElevated && (
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide bg-rose-950 px-1 rounded">
                              Elevated
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-sm">
                        <div className="line-clamp-2">
                          {a?.contextualReasoning || 'Assessed through multi-vector exposure logic.'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
