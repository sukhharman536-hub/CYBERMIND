import React, { useState } from 'react';
import { AuthorizedTarget, SecurityFinding } from '../types/cybermind';
import { X, ShieldAlert, CheckSquare, AlertTriangle, Send } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  target: AuthorizedTarget;
  prefillFinding?: SecurityFinding | null;
  onSubmitAction: (actionData: {
    action: string;
    reason: string;
    targetCode: string;
    riskLevel: 'Low' | 'Medium' | 'High';
  }) => Promise<void>;
}

export function RequestActionModal({ isOpen, onClose, target, prefillFinding, onSubmitAction }: Props) {
  const [action, setAction] = useState(
    prefillFinding
      ? `Execute safe verification check on ${prefillFinding.asset} (${prefillFinding.service}:${prefillFinding.port})`
      : `Run passive service configuration audit against ${target.targetCode}`
  );
  const [reason, setReason] = useState(
    prefillFinding
      ? `Verify if ${prefillFinding.finding} can be safely mitigated in sandbox staging.`
      : `Validate suspected security finding in isolated lab environment.`
  );
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Pre-flight client checks for prohibited keywords
    const forbidden = /brute|dictionary spray|malware|persistence|rm -rf|drop table/i;
    if (forbidden.test(action) || forbidden.test(reason)) {
      setErrorMsg('CyberMind Safety Policy: Offensive actions (brute force, destructive commands, malware) are strictly prohibited.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmitAction({
        action,
        reason,
        targetCode: target.targetCode,
        riskLevel,
      });
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit action request');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0c121d] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#090e17]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Request Active Security Action
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Target: <strong className="text-cyan-400">{target.targetCode}</strong> ({target.environment})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Policy Rules Banner */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Mandatory Safety Controls & Constraints
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckSquare className="w-3.5 h-3.5" /> Authorized Lab Target Only
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckSquare className="w-3.5 h-3.5" /> No Credential Attacks
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckSquare className="w-3.5 h-3.5" /> No Destructive Operations
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckSquare className="w-3.5 h-3.5" /> Human Approval Required
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1">
              Action Description *
            </label>
            <input
              type="text"
              required
              value={action}
              onChange={e => setAction(e.target.value)}
              placeholder="e.g. Probe TLS cipher configuration or query API health"
              className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1">
              Justification / Reason *
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Explain why this action is required to validate the finding..."
              className="w-full p-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1">
              Estimated Operational Risk Level
            </label>
            <div className="flex gap-3">
              {(['Low', 'Medium', 'High'] as const).map(lvl => (
                <label
                  key={lvl}
                  className={`flex-1 flex items-center justify-center p-2 rounded-lg border cursor-pointer font-mono text-xs transition ${
                    riskLevel === lvl
                      ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="riskLevel"
                    value={lvl}
                    checked={riskLevel === lvl}
                    onChange={() => setRiskLevel(lvl)}
                    className="sr-only"
                  />
                  <span>{lvl} Risk</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-mono font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit to Approval Center'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
