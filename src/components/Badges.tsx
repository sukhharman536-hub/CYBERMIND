import React from 'react';
import { Severity, FindingStatus, ActionStatus } from '../types/cybermind';

export function SeverityBadge({ severity, size = 'md' }: { severity: Severity; size?: 'sm' | 'md' | 'lg' }) {
  const configs: Record<Severity, { bg: string; text: string; border: string; glow: string }> = {
    CRITICAL: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/40',
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]',
    },
    HIGH: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/40',
      glow: 'shadow-[0_0_10px_rgba(249,115,22,0.25)]',
    },
    MEDIUM: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      glow: 'shadow-[0_0_8px_rgba(245,158,11,0.2)]',
    },
    LOW: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/40',
      glow: 'shadow-[0_0_8px_rgba(6,182,212,0.15)]',
    },
    INFO: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      border: 'border-slate-500/40',
      glow: '',
    },
  };

  const c = configs[severity] || configs.INFO;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-semibold tracking-wider uppercase rounded border ${c.bg} ${c.text} ${c.border} ${c.glow} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${severity === 'CRITICAL' ? 'bg-rose-500 animate-ping' : severity === 'HIGH' ? 'bg-orange-500' : severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-cyan-400'}`} />
      {severity}
    </span>
  );
}

export function StatusBadge({ status }: { status: FindingStatus | ActionStatus | 'RECOMMENDED' }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'OBSERVED':
        return {
          label: 'OBSERVED',
          cls: 'bg-slate-800 text-slate-300 border-slate-700',
        };
      case 'REPORTED':
        return {
          label: 'REPORTED',
          cls: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
        };
      case 'AI_ANALYZED':
        return {
          label: 'AI ANALYZED',
          cls: 'bg-indigo-950/70 text-indigo-300 border-indigo-700/60',
        };
      case 'CORRELATED':
        return {
          label: 'CORRELATED',
          cls: 'bg-purple-950/70 text-purple-300 border-purple-600/60 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
        };
      case 'VERIFIED':
        return {
          label: 'VERIFIED',
          cls: 'bg-emerald-950/70 text-emerald-300 border-emerald-600/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
        };
      case 'RECOMMENDED':
        return {
          label: 'RECOMMENDED',
          cls: 'bg-cyan-950/70 text-cyan-300 border-cyan-600/60',
        };
      case 'WAITING_FOR_APPROVAL':
        return {
          label: 'APPROVAL REQUIRED',
          cls: 'bg-amber-950/70 text-amber-300 border-amber-600/60 animate-pulse',
        };
      case 'APPROVED':
        return {
          label: 'APPROVED',
          cls: 'bg-emerald-950/70 text-emerald-300 border-emerald-600/60',
        };
      case 'REJECTED':
        return {
          label: 'REJECTED',
          cls: 'bg-rose-950/70 text-rose-300 border-rose-700/60',
        };
      default:
        return {
          label: String(status),
          cls: 'bg-slate-800 text-slate-400 border-slate-700',
        };
    }
  };

  const { label, cls } = getBadgeConfig();

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-wide border ${cls}`}>
      {label}
    </span>
  );
}
