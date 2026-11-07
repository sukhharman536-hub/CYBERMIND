import React, { useState } from 'react';
import { AuthorizedTarget, Severity } from '../types/cybermind';
import { X, UploadCloud, Plus, FileText, CheckCircle2, AlertCircle, Copy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  target: AuthorizedTarget;
  onImport: (findings: any[], source: string) => Promise<void>;
}

export function ImportFindingsModal({ isOpen, onClose, target, onImport }: Props) {
  const [tab, setTab] = useState<'upload' | 'manual'>('upload');
  const [jsonText, setJsonText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Manual Form State
  const [manualFinding, setManualFinding] = useState({
    asset: 'Web Application',
    service: 'HTTP',
    port: 80,
    version: '1.0.0',
    finding: '',
    severity: 'HIGH' as Severity,
    description: '',
  });

  if (!isOpen) return null;

  const sampleJson = `[
  {
    "target": "${target.targetCode}",
    "asset": "Internal API Gateway",
    "service": "HTTP/REST",
    "port": 8080,
    "version": "Spring Boot 2.5.4",
    "finding": "Unauthenticated Actuator Endpoint Leaking Heap Dumps",
    "severity": "High",
    "description": "Endpoint /actuator/heapdump is publicly queryable and permits memory dumps that contain cleartext database passwords."
  },
  {
    "target": "${target.targetCode}",
    "asset": "Caching Service",
    "service": "Redis",
    "port": 6379,
    "version": "Redis 6.0",
    "finding": "Redis Instance Exposed Without AUTH Password Gating",
    "severity": "Critical",
    "description": "Redis cluster port 6379 accepts arbitrary commands without requirepass authentication, allowing remote cache poisoning."
  }
]`;

  const handleLoadSample = () => {
    setJsonText(sampleJson);
    setErrorMsg('');
  };

  const handleJsonSubmit = async () => {
    setErrorMsg('');
    if (!jsonText.trim()) {
      setErrorMsg('Please paste or upload JSON findings data.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      const findingsList = Array.isArray(parsed) ? parsed : [parsed];
      if (findingsList.length === 0) {
        throw new Error('Array contains 0 findings.');
      }

      setIsSubmitting(true);
      await onImport(findingsList, 'json_upload');
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setErrorMsg('Invalid JSON format: ' + err.message);
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!manualFinding.finding.trim()) {
      setErrorMsg('Finding title is required.');
      return;
    }

    setIsSubmitting(true);
    await onImport([manualFinding], 'manual');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0c121d] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#090e17]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {target.targetCode}
              </span>
              <span className="text-xs font-mono text-slate-400">Target Sandbox Ingest</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Import Security Findings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice on Observed vs Verified */}
        <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-300">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Safety Guarantee: Uploaded data is marked as <strong className="text-cyan-300">OBSERVED</strong> until verified by CyberMind AI.
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-[#090e17]/50 px-5">
          <button
            onClick={() => setTab('upload')}
            className={`py-3 px-4 text-xs font-mono font-semibold transition border-b-2 flex items-center gap-2 ${
              tab === 'upload'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            JSON / CSV Upload
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`py-3 px-4 text-xs font-mono font-semibold transition border-b-2 flex items-center gap-2 ${
              tab === 'manual'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            Manual Entry
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === 'upload' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
                  Paste JSON Array of Findings
                </label>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 border border-cyan-800 px-2.5 py-1 rounded transition flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Load Sample JSON
                </button>
              </div>

              <textarea
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                placeholder={`[
  {
    "asset": "Web Server",
    "service": "HTTP",
    "port": 80,
    "version": "1.2.3",
    "finding": "Outdated web server",
    "severity": "High",
    "description": "Server version requires security updates."
  }
]`}
                rows={9}
                className="w-full p-3 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 transition"
              />

              <div className="text-[11px] font-mono text-slate-500">
                Supports outputs from Burp Suite, OWASP ZAP, Nmap JSON, Nessus CSV, or custom security scanners.
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Finding Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unauthenticated Admin Console on Port 8080"
                  value={manualFinding.finding}
                  onChange={e => setManualFinding({ ...manualFinding, finding: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Asset Name</label>
                  <input
                    type="text"
                    value={manualFinding.asset}
                    onChange={e => setManualFinding({ ...manualFinding, asset: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Technical Severity</label>
                  <select
                    value={manualFinding.severity}
                    onChange={e => setManualFinding({ ...manualFinding, severity: e.target.value as Severity })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                    <option value="INFO">INFO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Service</label>
                  <input
                    type="text"
                    value={manualFinding.service}
                    onChange={e => setManualFinding({ ...manualFinding, service: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Port</label>
                  <input
                    type="number"
                    value={manualFinding.port}
                    onChange={e => setManualFinding({ ...manualFinding, port: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Version</label>
                  <input
                    type="text"
                    value={manualFinding.version}
                    onChange={e => setManualFinding({ ...manualFinding, version: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe technical observations and conditions..."
                  value={manualFinding.description}
                  onChange={e => setManualFinding({ ...manualFinding, description: e.target.value })}
                  className="w-full p-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Importing...' : 'Add Security Finding'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {tab === 'upload' && (
          <div className="p-4 border-t border-slate-800 bg-[#090e17] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Target: <strong className="text-cyan-400">{target.targetCode}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleJsonSubmit}
                className="px-5 py-2 text-xs font-mono font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition"
              >
                {isSubmitting ? 'Importing...' : 'Import Findings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
