import React from 'react';
import { SecurityAssessment, AuthorizedTarget, SecurityFinding } from '../types/cybermind';
import { ScoreGauge } from '../components/ScoreGauge';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { 
  ShieldAlert, 
  Layers, 
  Terminal, 
  Activity, 
  Bot, 
  ArrowRight, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Server, 
  TrendingUp, 
  UploadCloud, 
  FileText,
  UserCheck
} from 'lucide-react';

interface Props {
  assessment: SecurityAssessment;
  target: AuthorizedTarget;
  onNavigate: (tab: string) => void;
  onSelectFinding: (findingId: string) => void;
  onOpenImportModal: () => void;
  onTriggerAnalysis: () => Promise<void>;
  isAnalyzing: boolean;
}

export function DashboardView({
  assessment,
  target,
  onNavigate,
  onSelectFinding,
  onOpenImportModal,
  onTriggerAnalysis,
  isAnalyzing,
}: Props) {
  const stats = assessment.stats;

  // Pending action requests
  const pendingActions = assessment.actionRequests.filter(a => a.status === 'WAITING_FOR_APPROVAL');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Status Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0c1424] via-[#09101c] to-[#0c1424] border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {target.targetCode}
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {target.environment}
            </span>
            <span className="text-xs font-mono text-slate-400">
              IP Range: <code className="text-slate-300">{target.ipRange}</code>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {assessment.title}
          </h2>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenImportModal}
            className="px-3.5 py-2 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center gap-2 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Import Findings</span>
          </button>

          <button
            onClick={onTriggerAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Correlating...' : 'Run AI Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Security Score Gauge Card */}
        <div className="sm:col-span-2 p-5 rounded-2xl bg-[#0c121d] border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-3 left-4 text-xs font-mono text-slate-400 uppercase font-semibold">
            Overall Health
          </div>
          <ScoreGauge score={assessment.securityScore} size={150} />
          <div className="mt-3 text-center text-xs text-slate-400">
            Calculated across <strong className="text-slate-200">{stats.total}</strong> observed findings
          </div>
        </div>

        {/* Severity Metrics */}
        <div className="p-4 rounded-2xl bg-[#0c121d] border border-rose-500/30 flex flex-col justify-between hover:border-rose-500/60 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
              Critical
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <div className="text-4xl font-mono font-black text-rose-400 mt-2">{stats.critical}</div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            Contextual attack blockers
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c121d] border border-orange-500/30 flex flex-col justify-between hover:border-orange-500/60 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider">
              High
            </span>
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          </div>
          <div className="text-4xl font-mono font-black text-orange-400 mt-2">{stats.high}</div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            Direct ingress vectors
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c121d] border border-amber-500/30 flex flex-col justify-between hover:border-amber-500/60 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              Medium
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-4xl font-mono font-black text-amber-400 mt-2">{stats.medium}</div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            Reconnaissance & hygiene
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c121d] border border-cyan-500/30 flex flex-col justify-between hover:border-cyan-500/60 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Low / Info
            </span>
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
          </div>
          <div className="text-4xl font-mono font-black text-cyan-400 mt-2">{stats.low}</div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            Defense-in-depth standard
          </div>
        </div>
      </div>

      {/* AI Risk Summary Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/30 border border-purple-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-950 border border-purple-800 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-purple-300">
              AI Risk Correlation Summary
            </h3>
          </div>
          <button
            onClick={() => onNavigate('graph')}
            className="text-xs font-mono font-semibold text-purple-300 hover:text-white flex items-center gap-1 transition"
          >
            <span>View Full Attack Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          "{assessment.aiRiskSummary}"
        </p>

        {assessment.correlatedChains.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {assessment.correlatedChains.map((c, i) => (
              <div
                key={c.id}
                onClick={() => onNavigate('graph')}
                className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-700/60 text-xs font-mono text-purple-200 hover:border-purple-400 cursor-pointer transition flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>{c.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Human Approval Alert Banner if pending */}
      {pendingActions.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/60 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950 border border-amber-700 text-amber-400">
              <UserCheck className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase text-amber-300">
                Human Sign-Off Required ({pendingActions.length} Pending Actions)
              </div>
              <p className="text-xs text-slate-300">
                Active lab verification requests are awaiting authorized approval before execution.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('approvals')}
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 transition"
          >
            Open Approval Center
          </button>
        </div>
      )}

      {/* Split Section: Recent Findings Table & AI Prioritized Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Findings (2 spans) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
                Recent Security Findings ({assessment.findings.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate('findings')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {assessment.findings.slice(0, 5).map(f => {
              const effectiveSev = f.aiAnalysis?.finalContextualRisk || f.technicalSeverity;
              return (
                <div
                  key={f.id}
                  onClick={() => onSelectFinding(f.id)}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/80 transition cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={effectiveSev} size="sm" />
                      <StatusBadge status={f.status} />
                      <span className="text-[11px] font-mono text-slate-400 truncate">
                        {f.asset} (:{f.port})
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {f.finding}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600 hover:text-cyan-400 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Prioritized Recommendations */}
        <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
                Top Remediation
              </h3>
            </div>
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>All Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {assessment.recommendations && assessment.recommendations.length > 0 ? (
              assessment.recommendations.slice(0, 3).map(rec => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-emerald-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Priority {rec.priority}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {rec.effort}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{rec.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{rec.impact}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs font-mono text-slate-500">
                Run AI Analysis to generate contextual recommendations.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
