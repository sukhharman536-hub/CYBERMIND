import React, { useState } from 'react';
import { SecurityAssessment, SecurityActionRequest, AuthorizedTarget } from '../types/cybermind';
import { StatusBadge } from '../components/Badges';
import confetti from 'canvas-confetti';
import { 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  AlertTriangle, 
  Plus, 
  Clock, 
  Shield, 
  Lock,
  Check,
  X
} from 'lucide-react';

interface Props {
  assessment: SecurityAssessment;
  target: AuthorizedTarget;
  onOpenRequestModal: () => void;
  onReviewAction: (actionId: string, approved: boolean, notes?: string) => Promise<void>;
}

export function ApprovalCenterView({
  assessment,
  target,
  onOpenRequestModal,
  onReviewAction,
}: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [reviewingAction, setReviewingAction] = useState<SecurityActionRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const actions = assessment.actionRequests || [];

  const filteredActions = actions.filter(a => {
    if (activeFilter === 'WAITING') return a.status === 'WAITING_FOR_APPROVAL';
    if (activeFilter === 'APPROVED') return a.status === 'APPROVED';
    if (activeFilter === 'REJECTED') return a.status === 'REJECTED';
    return true;
  });

  const handleApprove = async () => {
    if (!reviewingAction) return;
    setIsProcessing(true);
    await onReviewAction(reviewingAction.id, true, reviewNotes);
    setIsProcessing(false);
    setReviewingAction(null);
    setReviewNotes('');

    // Trigger visual celebration for authorized safety gate
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#00ff9d', '#6366f1'],
      });
    } catch (e) {}
  };

  const handleReject = async () => {
    if (!reviewingAction) return;
    setIsProcessing(true);
    await onReviewAction(reviewingAction.id, false, reviewNotes || 'Declined during human review.');
    setIsProcessing(false);
    setReviewingAction(null);
    setReviewNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c121d] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              HUMAN-IN-THE-LOOP SAFETY GATEWAY
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Strict Non-Destructive Policy</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Security Action Approval Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Autonomous AI recommends actions, but humans retain absolute authorization over execution. Active probes only run on explicitly authorized sandbox environments.
          </p>
        </div>

        <button
          onClick={onOpenRequestModal}
          className="px-4 py-2.5 text-xs font-mono font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Request New Lab Action</span>
        </button>
      </div>

      {/* Safety Safeguards Checklist Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          Enforced System Safety Constraints (Automatic Pre-Flight Blockers)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Authorized Sandboxes Only
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> No Internet Scanning
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> No Credential Spraying
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Zero Destruction Guarantee
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'ALL', label: 'All Requests' },
          { id: 'WAITING', label: 'Waiting for Approval' },
          { id: 'APPROVED', label: 'Approved' },
          { id: 'REJECTED', label: 'Rejected' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
              activeFilter === tab.id
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Requests Cards */}
      <div className="space-y-4">
        {filteredActions.map(req => {
          const isPending = req.status === 'WAITING_FOR_APPROVAL';

          return (
            <div
              key={req.id}
              className={`p-6 rounded-2xl bg-[#0c121d] border transition space-y-4 ${
                isPending
                  ? 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                  : req.status === 'APPROVED'
                  ? 'border-emerald-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                      SECURITY ACTION REQUEST
                    </span>
                    <StatusBadge status={req.status} />
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      Target: {req.target}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {req.action}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    Risk: <strong className="text-amber-400">{req.riskLevel}</strong>
                  </span>
                </div>
              </div>

              {/* Reason & Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase font-semibold">Justification / Reason:</span>
                  <p className="text-slate-200 leading-relaxed font-sans">{req.reason}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="text-slate-400 uppercase font-semibold">Audit Record:</div>
                  <div className="text-slate-300">Requested by: <span className="text-cyan-400">{req.requestedBy}</span></div>
                  <div className="text-slate-400 text-[11px]">Requested at: {new Date(req.requestedAt).toLocaleString()}</div>
                  {req.reviewedBy && (
                    <div className="pt-1 border-t border-slate-800 text-emerald-400">
                      Reviewed by: {req.reviewedBy} ({new Date(req.reviewedAt!).toLocaleTimeString()})
                    </div>
                  )}
                </div>
              </div>

              {/* Execution Output Console if available */}
              {req.executionOutput && (
                <div className="space-y-1.5">
                  <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    Sandbox Execution Telemetry
                  </span>
                  <pre className="p-3 rounded-xl bg-[#06090e] border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                    {req.executionOutput}
                  </pre>
                </div>
              )}

              {/* Reviewer Notes if rejected or approved */}
              {req.reviewNotes && (
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs font-mono text-slate-300">
                  <strong className="text-slate-400">Review Notes:</strong> {req.reviewNotes}
                </div>
              )}

              {/* Action Buttons if Pending */}
              {isPending && (
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setReviewingAction(req);
                      setReviewNotes('Declined during human review.');
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>REJECT</span>
                  </button>

                  <button
                    onClick={() => {
                      setReviewingAction(req);
                      setReviewNotes('Authorized for isolated sandbox execution.');
                    }}
                    className="px-6 py-2 rounded-lg text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>APPROVE</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredActions.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-mono text-xs bg-[#0c121d] rounded-2xl border border-slate-800">
            No action requests matching this filter.
          </div>
        )}
      </div>

      {/* Review Dialog Modal */}
      {reviewingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0c121d] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              Human Decision Confirmation
            </h3>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <div className="text-slate-400 mb-1">Action to Execute:</div>
              <div className="text-white font-bold">{reviewingAction.action}</div>
              <div className="text-cyan-400 mt-1">Target: {reviewingAction.target}</div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Approval / Rejection Notes for Audit Log
              </label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                className="w-full p-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReviewingAction(null)}
                className="px-4 py-2 text-xs font-mono rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                disabled={isProcessing}
                onClick={handleReject}
                className="px-4 py-2 text-xs font-mono font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white"
              >
                Reject Action
              </button>
              <button
                disabled={isProcessing}
                onClick={handleApprove}
                className="px-5 py-2 text-xs font-mono font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
              >
                Authorize & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
