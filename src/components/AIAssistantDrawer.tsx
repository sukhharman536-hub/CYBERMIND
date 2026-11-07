import React, { useState, useRef, useEffect } from 'react';
import { SecurityAssessment, ChatMessage } from '../types/cybermind';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Shield, 
  HelpCircle, 
  RefreshCw,
  Terminal,
  ChevronDown
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  assessment: SecurityAssessment;
}

export function AIAssistantDrawer({ isOpen, onClose, assessment }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **CyberMind AI Assistant**. I can help analyze your findings on **${assessment.targetCode}**, explain why risks were elevated, correlate attack chains, and prioritize remediation.\n\n*All responses are strictly grounded in your current assessment data.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Which finding should I fix first?',
    'Why is this finding Critical?',
    'Show me related risks.',
    'Explain this vulnerability in simple language.',
    'What is the safest remediation?',
    'Summarize the assessment for management.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          assessmentId: assessment.id,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Insufficient evidence to determine this.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'AI ANALYSIS TEMPORARILY UNAVAILABLE\n\nYour imported security findings are preserved. You can retry the query later.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#090e17] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-[#0c121d] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono">CyberMind AI Copilot</h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Grounded in {assessment.targetCode} ({assessment.findings.length} findings)
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-[#0a0f19] border-b border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-[11px] font-mono whitespace-nowrap px-2.5 py-1 rounded bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-800 text-slate-300 border border-slate-800 transition"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                {msg.role === 'user' ? 'Security Analyst' : 'CyberMind AI'}
              </span>
              <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[90%] text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-white font-sans rounded-tr-none'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none font-sans whitespace-pre-line'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-mono text-cyan-400 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing assessment context...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="p-4 bg-[#0c121d] border-t border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask questions about findings, risks, or remediation..."
            className="flex-1 px-3.5 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold transition flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-2 text-[10px] font-mono text-slate-500 text-center">
          Strict Anti-Hallucination Policy: Operates solely on verified assessment data.
        </div>
      </div>
    </div>
  );
}
