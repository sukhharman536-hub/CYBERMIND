import React, { useState } from 'react';
import { SecurityAssessment, AuthorizedTarget } from '../types/cybermind';
import { ScoreGauge } from '../components/ScoreGauge';
import { 
  Server, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  AlertTriangle,
  X
} from 'lucide-react';

interface Props {
  assessments: SecurityAssessment[];
  targets: AuthorizedTarget[];
  onSelectAssessment: (assessmentId: string) => void;
  onCreateAssessment: (title: string, targetCode: string) => Promise<void>;
  onNavigate: (tab: string) => void;
}

export function AssessmentsView({
  assessments,
  targets,
  onSelectAssessment,
  onCreateAssessment,
  onNavigate,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTargetCode, setSelectedTargetCode] = useState(targets[0]?.targetCode || 'LAB-WEB-01');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTargetObj = targets.find(t => t.targetCode === selectedTargetCode) || targets[0];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onCreateAssessment(newTitle, selectedTargetCode);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setNewTitle('');
    onNavigate('findings');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c121d] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              LAB ASSESSMENTS MANAGER
            </span>
            <span className="text-xs font-mono text-slate-400">
              {assessments.length} Active Assessments
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Target Security Assessments
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Manage cybersecurity assessments conducted against authorized sandbox testbeds.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 text-xs font-mono font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Assessment</span>
        </button>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments.map(asmt => (
          <div
            key={asmt.id}
            onClick={() => onSelectAssessment(asmt.id)}
            className="p-6 rounded-2xl bg-[#0c121d] border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer space-y-4 group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {asmt.targetCode}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {asmt.environment}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                  {asmt.title}
                </h3>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black font-mono text-cyan-400">
                  {asmt.securityScore}
                  <span className="text-xs text-slate-500">/100</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Score
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {asmt.aiRiskSummary}
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3 text-slate-400">
                <span>Findings: <strong className="text-slate-200">{asmt.findings.length}</strong></span>
                <span>Chains: <strong className="text-purple-400">{asmt.correlatedChains.length}</strong></span>
              </div>

              <div className="text-cyan-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition">
                <span>Open Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assessment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0c121d] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Create Security Assessment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Select Authorized Lab Target *
                </label>
                <select
                  value={selectedTargetCode}
                  onChange={e => setSelectedTargetCode(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {targets.map(t => (
                    <option key={t.id} value={t.targetCode}>
                      {t.targetCode} — {t.name} ({t.environment})
                    </option>
                  ))}
                </select>
              </div>

              {selectedTargetObj && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="text-slate-400">Target Info:</div>
                  <div className="text-cyan-300 font-bold">{selectedTargetObj.name}</div>
                  <div className="text-slate-400">Environment: {selectedTargetObj.environment}</div>
                  <div className="text-slate-400">Subnet: {selectedTargetObj.ipRange}</div>
                  <div className="text-emerald-400 font-semibold">Status: AUTHORIZED SANDBOX</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Assessment Title
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${selectedTargetObj.name} Security Evaluation`}
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-mono font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                >
                  {isSubmitting ? 'Creating...' : 'Create & Proceed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
