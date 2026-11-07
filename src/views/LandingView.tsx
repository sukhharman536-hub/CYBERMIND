import React from 'react';
import { 
  ShieldAlert, 
  Layers, 
  BrainCircuit, 
  UserCheck, 
  Sparkles, 
  FileCheck, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  Network,
  Zap,
  Play
} from 'lucide-react';

interface Props {
  onStartAssessment: () => void;
  onTryDemo: () => void;
}

export function LandingView({ onStartAssessment, onTryDemo }: Props) {
  const innovations = [
    {
      title: 'Context-Aware Risk Analysis',
      badge: 'INNOVATION #1',
      desc: 'Risk is evaluated through contextual factors—exposure, exploitability, and asset criticality—rather than relying on raw scanner severities in a vacuum.',
      icon: BrainCircuit,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-950/20',
    },
    {
      title: 'Finding Correlation Engine',
      badge: 'INNOVATION #2',
      desc: 'Connects isolated findings (e.g. exposed admin + weak auth + outdated proxy) to uncover multi-step attack vectors before adversaries exploit them.',
      icon: Network,
      color: 'text-purple-400',
      border: 'border-purple-500/40',
      bg: 'bg-purple-950/20',
    },
    {
      title: 'Explainable AI Reasoning',
      badge: 'INNOVATION #3',
      desc: 'Plain-English explanations written for both SecOps engineers and non-technical stakeholders detailing exactly WHY a priority was assigned.',
      icon: Sparkles,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/20',
    },
    {
      title: 'Human-in-the-Loop Security',
      badge: 'INNOVATION #4',
      desc: 'Mandatory human approval gateway before any active verification or remediation action. Strictly restricted to authorized sandbox targets.',
      icon: UserCheck,
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/20',
    },
    {
      title: 'Automated Security Intelligence',
      badge: 'INNOVATION #5',
      desc: 'Transforms noisy raw observation data into actionable, prioritized remediation guidance with copyable configs, rollback steps, and formal reports.',
      icon: FileCheck,
      color: 'text-rose-400',
      border: 'border-rose-500/40',
      bg: 'bg-rose-950/20',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 text-xs font-mono font-semibold tracking-wide">
          <Terminal className="w-3.5 h-3.5" />
          <span>DATAOPS INNOVATION HACKATHON 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-heading">
            CYBERMIND <span className="text-cyan-400">AI</span>
          </h1>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-200 tracking-tight">
            Think Beyond Automation. Understand Security.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-sans">
            An AI-powered cybersecurity assessment platform that correlates security findings, understands contextual risk, prioritizes threats, explains its reasoning, and keeps humans in control.
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartAssessment}
            className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm shadow-[0_0_25px_rgba(6,182,212,0.5)] transition flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Start Assessment</span>
          </button>

          <button
            onClick={onTryDemo}
            className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold font-mono text-sm transition flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span>Try Demo (LAB-WEB-01)</span>
          </button>
        </div>

        {/* Pitch Quote Card */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 max-w-3xl mx-auto text-left relative shadow-xl">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold mb-2">
            The CyberMind Positioning
          </div>
          <blockquote className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
            "CyberMind AI doesn't just find security issues. It understands how those issues relate to each other, evaluates their contextual risk, explains why they matter, recommends what to fix first, and keeps humans in control of security actions."
          </blockquote>
        </div>
      </section>

      {/* 5 Core Hackathon Innovations Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white font-heading tracking-tight">
            Five Pillars of Security Intelligence
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Architected specifically for autonomous reasoning and responsible operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {innovations.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${item.border} ${item.bg} backdrop-blur space-y-3 transition duration-200 hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* The 10-Step Operational User Flow */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="p-6 rounded-2xl bg-[#090e17] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-bold text-white font-heading">
              Deterministic Security Assessment Flow
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
              SAFE LAB ENVIRONMENT ONLY
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            {[
              '1. Create Assessment',
              '2. Select Lab Target',
              '3. Ingest Findings',
              '4. AI Analysis',
              '5. Finding Correlation',
              '6. Risk Prioritization',
              '7. Attack Relationship Graph',
              '8. AI Plain Explanation',
              '9. Human Sign-Off Gateway',
              '10. Security Report Ready',
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center space-y-1 hover:border-cyan-500/40 transition"
              >
                <div className="text-[10px] font-mono text-cyan-500 font-bold">STAGE 0{idx + 1}</div>
                <div className="text-xs font-semibold text-slate-200">{step.split('. ')[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
