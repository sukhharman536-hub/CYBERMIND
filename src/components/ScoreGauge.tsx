import React from 'react';

export function ScoreGauge({ score, size = 160 }: { score: number; size?: number }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: '#10b981', text: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.3)', status: 'LOW RISK' };
    if (score >= 65) return { stroke: '#f59e0b', text: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.3)', status: 'MODERATE RISK' };
    if (score >= 40) return { stroke: '#f97316', text: 'text-orange-400', glow: 'rgba(249, 115, 22, 0.35)', status: 'HIGH RISK' };
    return { stroke: '#f43f5e', text: 'text-rose-400', glow: 'rgba(244, 63, 94, 0.4)', status: 'CRITICAL RISK' };
  };

  const { stroke, text, glow, status } = getColor();

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated active stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${glow})`
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-extrabold font-mono tracking-tight ${text}`}>
            {score}
            <span className="text-xs text-slate-500 font-normal">/100</span>
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 mt-0.5">
            Security Score
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase border border-slate-700/60 bg-slate-900/80 ${text}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
