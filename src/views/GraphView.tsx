import React from 'react';
import { SecurityAssessment } from '../types/cybermind';
import { InteractiveRiskGraph } from '../components/InteractiveRiskGraph';
import { Layers, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  assessment: SecurityAssessment;
  onSelectFinding: (findingId: string) => void;
  onNavigate: (tab: string) => void;
}

export function GraphView({ assessment, onSelectFinding, onNavigate }: Props) {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c121d] border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              POTENTIAL RISK RELATIONSHIP GRAPH
            </span>
            <span className="text-xs font-mono text-slate-400">
              Target: <strong className="text-cyan-400">{assessment.targetCode}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Attack Vector & Dependency Graph
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Visualizes potential risk relationships, assets, and service exposures. This represents theoretical risk correlation, not claims of active intrusion without verified telemetry.
          </p>
        </div>

        <button
          onClick={() => onNavigate('analysis')}
          className="px-4 py-2 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 shrink-0"
        >
          <span>View Matrix Table</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Interactive Graph Component */}
      <InteractiveRiskGraph
        assessment={assessment}
        onSelectFinding={onSelectFinding}
      />
    </div>
  );
}
