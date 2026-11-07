import React from 'react';
import { ShieldCheck, Terminal, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06090e] py-8 text-xs font-mono text-slate-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-cyan-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-3 h-3" />
          </div>
          <span className="font-bold text-slate-300">CYBERMIND AI</span>
          <span>— DataOps Innovation Hackathon 2026</span>
        </div>

        <div className="text-center sm:text-right text-[11px] space-y-0.5">
          <div>Strict Sandbox Safety: All active operations require human approval.</div>
          <div className="text-slate-600">Built with React, TypeScript, Express, and Google Gemini 3.8 Flash.</div>
        </div>
      </div>
    </footer>
  );
}
