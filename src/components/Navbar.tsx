import React from 'react';
import { AuthorizedTarget, SecurityAssessment } from '../types/cybermind';
import { 
  ShieldCheck, 
  Layers, 
  Terminal, 
  AlertTriangle, 
  FileText, 
  Activity, 
  Bot, 
  Flame, 
  RotateCcw, 
  CheckCircle, 
  LayoutDashboard,
  Server
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  targets: AuthorizedTarget[];
  currentTarget: AuthorizedTarget;
  onSelectTarget: (target: AuthorizedTarget) => void;
  assessment: SecurityAssessment;
  pendingApprovalsCount: number;
  onResetDemo: () => void;
  onOpenAssistant: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  targets,
  currentTarget,
  onSelectTarget,
  assessment,
  pendingApprovalsCount,
  onResetDemo,
  onOpenAssistant,
}: Props) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assessments', label: 'Assessments', icon: Server },
    { id: 'findings', label: 'Findings', icon: AlertTriangle, count: assessment.findings.length },
    { id: 'analysis', label: 'AI Analysis', icon: Activity },
    { id: 'graph', label: 'Risk Graph', icon: Layers },
    { id: 'recommendations', label: 'Remediation', icon: ShieldCheck },
    { id: 'approvals', label: 'Approval Center', icon: CheckCircle, badge: pendingApprovalsCount },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'audit', label: 'Audit Log', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b12]/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner: Hackathon status & target switcher */}
      <div className="px-4 py-2 bg-[#090e17] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-extrabold tracking-wider text-white text-sm">
              CYBERMIND <span className="text-cyan-400">AI</span>
            </span>
          </button>

          <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-950/80 text-indigo-300 border border-indigo-800/80">
            DataOps Innovation Hackathon 2026
          </span>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Sandbox Mode: Non-Destructive Active Action Policy</span>
          </div>
        </div>

        {/* Target Switcher & Demo Mode Quick Action */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Target:</span>
            <select
              value={currentTarget.targetCode}
              onChange={e => {
                const found = targets.find(t => t.targetCode === e.target.value);
                if (found) onSelectTarget(found);
              }}
              className="bg-transparent text-xs font-mono font-bold text-cyan-300 focus:outline-none cursor-pointer"
            >
              {targets.map(t => (
                <option key={t.id} value={t.targetCode} className="bg-slate-900 text-slate-200">
                  {t.targetCode} ({t.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onResetDemo}
            className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-700/60 transition flex items-center gap-1.5"
            title="Reset to official Hackathon Demo Scenario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Try Demo</span>
          </button>

          <button
            onClick={onOpenAssistant}
            className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)] transition flex items-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 overflow-x-auto scrollbar-none flex items-center gap-1 py-1.5 bg-[#070b12]">
        <button
          onClick={() => setActiveTab('landing')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wide transition shrink-0 ${
            activeTab === 'landing'
              ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Overview
        </button>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wide transition shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-600/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {typeof item.count === 'number' && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                  {item.count}
                </span>
              )}
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-600 text-white font-bold animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
