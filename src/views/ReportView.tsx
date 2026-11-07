import React, { useState } from 'react';
import { SecurityAssessment, AuthorizedTarget, AuditLogEntry } from '../types/cybermind';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { 
  FileText, 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface Props {
  assessment: SecurityAssessment;
  target: AuthorizedTarget;
  auditLogs: AuditLogEntry[];
}

export function ReportView({ assessment, target, auditLogs }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const md = `# CYBERMIND AI — COMPREHENSIVE CYBERSECURITY ASSESSMENT REPORT
**DataOps Innovation Hackathon 2026**

- **Target:** ${assessment.targetCode} (${target.name})
- **Environment:** ${assessment.environment} (${target.ipRange})
- **Generated At:** ${new Date().toISOString()}
- **Security Health Score:** ${assessment.securityScore}/100
- **Status:** CERTIFIED SANDBOX ASSESSMENT

---

## 1. Executive Summary
${assessment.executiveSummary || assessment.aiRiskSummary}

## 2. Assessment Scope
This cybersecurity assessment was conducted strictly against the authorized sandbox target **${target.targetCode}** spanning the assigned CIDR block **${target.ipRange}**. Authorization was granted by **${target.authorizedBy}** valid through **${new Date(target.authorizationExpiry).toLocaleDateString()}**.

## 3. Evaluated Assets
${Array.from(new Set(assessment.findings.map(f => f.asset)))
  .map(asset => `- **${asset}** (Hosting ${assessment.findings.filter(f => f.asset === asset).length} observed findings)`)
  .join('\n')}

## 4. Assessment Methodology
${assessment.methodology || 'Multi-vector contextual security evaluation leveraging Gemini 3.8 Flash, passive telemetry analysis, graph-based attack chain correlation, and human-in-the-loop safety gating.'}

## 5. Security Findings (${assessment.findings.length})
${assessment.findings
  .map(
    f =>
      `### [${f.aiAnalysis?.finalContextualRisk || f.technicalSeverity}] ${f.finding}
- **Asset:** ${f.asset}:${f.port} (${f.service})
- **Status:** ${f.status}
- **Exposure:** ${f.aiAnalysis?.exposure || 'External'}
- **Exploitability:** ${f.aiAnalysis?.exploitability || 'Moderate'}
- **AI Rationale:** ${f.aiAnalysis?.contextualReasoning || f.description}
- **Remediation:** ${f.aiAnalysis?.recommendedRemediation || 'N/A'}`
  )
  .join('\n\n')}

## 6. Correlated Attack Chains
${assessment.correlatedChains
  .map(
    c => `### ${c.title} (${c.severity})
${c.description}
**Sequence:**
${c.chainSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
**Business Impact:** ${c.businessImpact}
**Recommended Intervention:** ${c.recommendedIntervention}`
  )
  .join('\n\n')}

## 7. Critical Risks & Immediate Action Priorities
${assessment.recommendations
  .map(
    r => `### Priority ${r.priority}: ${r.title}
- **Effort:** ${r.effort}
- **Impact:** ${r.impact}
- **Rationale:** ${r.rationale}
- **Target Asset:** ${r.targetAsset}
- **Steps:**
${r.steps.map(s => `  - ${s}`).join('\n')}`
  )
  .join('\n\n')}

## 8. Limitations & Safety Policy
${assessment.limitations || 'All security verifications were restricted to non-destructive methods within authorized lab boundary. No persistent malware, credential attacks, or denial-of-service operations were conducted.'}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberMind-Report-${assessment.targetCode}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Action Bar (Hidden during print) */}
      <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              FORMAL SECURITY AUDIT REPORT
            </span>
            <span className="text-xs font-mono text-slate-400">
              Report ID: <code className="text-slate-300">CMR-{assessment.targetCode}-2026</code>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Executive Cybersecurity Assessment Report
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadMarkdown}
            className="px-3.5 py-2 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Markdown</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#080d16] border border-slate-800 text-slate-200 font-sans shadow-2xl space-y-10 print:border-none print:p-0 print:bg-white print:text-black">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 print:border-black">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800 print:text-black print:bg-gray-200">
                DataOps Innovation Hackathon 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight print:text-black">
              CYBERMIND <span className="text-cyan-400 print:text-blue-700">AI</span> ASSESSMENT REPORT
            </h1>
            <p className="text-sm font-mono text-slate-400 print:text-gray-600">
              Autonomous Cybersecurity Finding Correlation & Contextual Risk Prioritization
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-right font-mono text-xs space-y-1 print:bg-gray-100 print:border-gray-300">
            <div>TARGET: <strong className="text-cyan-300 print:text-black">{assessment.targetCode}</strong></div>
            <div>SCORE: <strong className="text-emerald-400 print:text-black">{assessment.securityScore}/100</strong></div>
            <div className="text-slate-500 print:text-gray-600">DATE: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 pb-1">
            1. Executive Summary
          </h2>
          <p className="text-sm leading-relaxed text-slate-300 print:text-black">
            {assessment.executiveSummary || assessment.aiRiskSummary}
          </p>
        </section>

        {/* 2. Assessment Scope */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 pb-1">
            2. Assessment Scope & Target Authorization
          </h2>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono grid grid-cols-1 sm:grid-cols-2 gap-3 print:bg-gray-50 print:border-gray-300">
            <div>Target Name: <strong>{target.name}</strong></div>
            <div>Target Code: <strong>{target.targetCode}</strong></div>
            <div>Environment: <strong>{target.environment}</strong></div>
            <div>Authorized Subnet: <strong>{target.ipRange}</strong></div>
            <div>Authorized By: <strong>{target.authorizedBy}</strong></div>
            <div>Expiration: <strong>{new Date(target.authorizationExpiry).toLocaleDateString()}</strong></div>
          </div>
        </section>

        {/* 3. Assets Evaluated */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 pb-1">
            3. Discovered Assets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            {Array.from(new Set(assessment.findings.map(f => f.asset))).map((asset, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 print:border-gray-300">
                <div className="text-cyan-400 font-bold">{asset}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  {assessment.findings.filter(f => f.asset === asset).length} vulnerabilities observed
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Methodology */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 pb-1">
            4. Methodology
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed print:text-black">
            {assessment.methodology ||
              'DataOps Automated Security Assessment Methodology combines passive port and banner observation, multi-source vulnerability ingest (ZAP/Nmap/Burp), graph-theoretic finding correlation, and human-in-the-loop validation of active verification probes.'}
          </p>
        </section>

        {/* 5. Findings Breakdown */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 pb-1">
            5. Security Findings ({assessment.findings.length})
          </h2>
          <div className="space-y-3">
            {assessment.findings.map(f => (
              <div key={f.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1.5 print:border-gray-300">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-200 print:text-black">{f.finding}</div>
                  <SeverityBadge severity={f.aiAnalysis?.finalContextualRisk || f.technicalSeverity} size="sm" />
                </div>
                <div className="text-slate-400 text-[11px]">
                  Asset: {f.asset} | Port: {f.port} ({f.service}) | Status: {f.status}
                </div>
                <div className="text-slate-300 print:text-gray-800 pt-1 font-sans text-xs">
                  {f.aiAnalysis?.plainEnglishSummary || f.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Correlated Attack Chains */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 pb-1">
            6. Finding Correlation & Multi-Step Attack Chains
          </h2>
          <div className="space-y-4">
            {assessment.correlatedChains.map((c, i) => (
              <div key={c.id} className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs font-mono space-y-2 print:border-gray-300 print:bg-gray-50">
                <div className="flex items-center justify-between">
                  <strong className="text-purple-300 print:text-black text-sm">{c.title}</strong>
                  <SeverityBadge severity={c.severity} size="sm" />
                </div>
                <p className="text-slate-300 font-sans text-xs">{c.description}</p>
                <div className="space-y-1 text-slate-400 pt-1">
                  {c.chainSteps.map((step, sIdx) => (
                    <div key={sIdx}>• {step}</div>
                  ))}
                </div>
                <div className="text-rose-300 pt-1 font-bold">
                  Business Impact: {c.businessImpact}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Recommendations */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 pb-1">
            7. Remediation Recommendations
          </h2>
          <div className="space-y-3">
            {assessment.recommendations.map(r => (
              <div key={r.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2 print:border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">Priority {r.priority}: {r.title}</span>
                  <span className="text-slate-400">{r.effort}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs">{r.rationale}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Limitations & Safety Guarantee */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-blue-800 border-b border-slate-800 pb-1">
            8. Limitations & Safety Policy
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed print:text-black">
            {assessment.limitations ||
              'All tests were conducted on authorized sandbox lab containers. The platform forbids destructive operations, credential spray attacks, and unauthorized internet scanning by design.'}
          </p>
        </section>

        {/* Report Footer */}
        <div className="pt-8 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>CyberMind AI Platform • DataOps Innovation Hackathon 2026</span>
          <span>Certified Safe Sandbox Assessment</span>
        </div>
      </div>
    </div>
  );
}
