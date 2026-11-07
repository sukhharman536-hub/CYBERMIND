import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RiskGraphNode, RiskGraphEdge, SecurityAssessment, CorrelatedAttackChain } from '../types/cybermind';
import { buildRiskGraphFromAssessment } from '../utils/graphBuilder';
import { 
  Server, 
  Network, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  Briefcase, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  ChevronRight,
  Info,
  Maximize2
} from 'lucide-react';
import { SeverityBadge } from './Badges';

interface Props {
  assessment: SecurityAssessment;
  onSelectFinding?: (findingId: string) => void;
}

export function InteractiveRiskGraph({ assessment, onSelectFinding }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.85);
  const [offset, setOffset] = useState({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [selectedNode, setSelectedNode] = useState<RiskGraphNode | null>(null);
  const [highlightedChainId, setHighlightedChainId] = useState<string | 'ALL'>('ALL');

  // Build graph data
  const { nodes, edges } = useMemo(() => {
    return buildRiskGraphFromAssessment(assessment);
  }, [assessment]);

  // Active highlighted attack chain
  const activeChain = useMemo(() => {
    if (highlightedChainId === 'ALL') return null;
    return assessment.correlatedChains.find(c => c.id === highlightedChainId) || null;
  }, [assessment.correlatedChains, highlightedChainId]);

  // Determine active node IDs in highlighted chain
  const activeNodeIds = useMemo(() => {
    if (!activeChain) return null;
    const ids = new Set<string>();
    ids.add(`risk-${activeChain.id}`);
    ids.add(`impact-${activeChain.id}`);
    activeChain.findingIds.forEach(fid => {
      ids.add(`finding-${fid}`);
    });
    // Add connected services & assets
    edges.forEach(e => {
      if (ids.has(e.target)) {
        ids.add(e.source);
      }
    });
    return ids;
  }, [activeChain, edges]);

  // Handle Canvas Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(1.8, Math.max(0.4, prev + delta)));
  };

  const handleReset = () => {
    setScale(0.85);
    setOffset({ x: 40, y: 30 });
    setSelectedNode(null);
    setHighlightedChainId('ALL');
  };

  // Node styling helper
  const getNodeColor = (node: RiskGraphNode) => {
    switch (node.type) {
      case 'asset':
        return {
          bg: 'bg-cyan-950/80',
          border: 'border-cyan-500/70',
          text: 'text-cyan-300',
          glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]',
          icon: Server,
        };
      case 'service':
        return {
          bg: 'bg-blue-950/80',
          border: 'border-blue-500/70',
          text: 'text-blue-300',
          glow: 'shadow-[0_0_12px_rgba(59,130,246,0.25)]',
          icon: Network,
        };
      case 'finding':
        return {
          bg: node.severity === 'CRITICAL' ? 'bg-rose-950/90' : 'bg-amber-950/80',
          border: node.severity === 'CRITICAL' ? 'border-rose-500/80' : 'border-amber-500/70',
          text: node.severity === 'CRITICAL' ? 'text-rose-300' : 'text-amber-300',
          glow: node.severity === 'CRITICAL' ? 'shadow-[0_0_18px_rgba(244,63,94,0.4)]' : 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
          icon: AlertTriangle,
        };
      case 'risk':
        return {
          bg: 'bg-purple-950/90',
          border: 'border-purple-500/80',
          text: 'text-purple-300',
          glow: 'shadow-[0_0_20px_rgba(168,85,247,0.45)]',
          icon: Zap,
        };
      case 'business_impact':
        return {
          bg: 'bg-red-950/90',
          border: 'border-red-500/80',
          text: 'text-red-300',
          glow: 'shadow-[0_0_22px_rgba(239,68,68,0.5)]',
          icon: Briefcase,
        };
      default:
        return {
          bg: 'bg-slate-900',
          border: 'border-slate-700',
          text: 'text-slate-300',
          glow: '',
          icon: ShieldAlert,
        };
    }
  };

  return (
    <div className="relative w-full h-[640px] bg-[#070b12] rounded-xl border border-slate-800 overflow-hidden flex flex-col select-none">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0c121d]/90 backdrop-blur border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/50">
            <Layers className="w-3.5 h-3.5" />
            <span>SECURITY RISK GRAPH</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Showing correlated attack relationships for <strong className="text-slate-200">{assessment.targetCode}</strong>
          </span>
        </div>

        {/* Attack Chain Highlight Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden md:inline">Path Filter:</span>
          <select
            value={highlightedChainId}
            onChange={e => setHighlightedChainId(e.target.value)}
            className="text-xs font-mono bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Show All Risk Vectors</option>
            {assessment.correlatedChains.map((c, idx) => (
              <option key={c.id} value={c.id}>
                Chain #{idx + 1}: {c.title.slice(0, 32)}...
              </option>
            ))}
          </select>

          {/* Zoom & Reset Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded overflow-hidden">
            <button
              onClick={() => handleZoom(0.15)}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition border-l border-r border-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden cyber-grid"
      >
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            width: 1400,
            height: 900,
            position: 'absolute',
          }}
        >
          {/* Column Category Labels */}
          <div className="absolute top-2 left-20 text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-400/80 bg-cyan-950/30 px-3 py-1 rounded border border-cyan-900/40">
            Assets
          </div>
          <div className="absolute top-2 left-[280px] text-[11px] font-mono font-bold tracking-wider uppercase text-blue-400/80 bg-blue-950/30 px-3 py-1 rounded border border-blue-900/40">
            Services & Ports
          </div>
          <div className="absolute top-2 left-[520px] text-[11px] font-mono font-bold tracking-wider uppercase text-amber-400/80 bg-amber-950/30 px-3 py-1 rounded border border-amber-900/40">
            Security Findings
          </div>
          <div className="absolute top-2 left-[780px] text-[11px] font-mono font-bold tracking-wider uppercase text-purple-400/80 bg-purple-950/30 px-3 py-1 rounded border border-purple-900/40">
            Correlated Risks
          </div>
          <div className="absolute top-2 left-[1040px] text-[11px] font-mono font-bold tracking-wider uppercase text-rose-400/80 bg-rose-950/30 px-3 py-1 rounded border border-rose-900/40">
            Business Impact
          </div>

          {/* SVG Edges Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="edgeGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="edgeGradRose" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff2a5f" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b026ff" stopOpacity="0.9" />
              </linearGradient>
              <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#475569" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#ff2a5f" />
              </marker>
            </defs>

            {edges.map(edge => {
              const srcNode = nodes.find(n => n.id === edge.source);
              const tgtNode = nodes.find(n => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isEdgeInChain =
                activeNodeIds && activeNodeIds.has(edge.source) && activeNodeIds.has(edge.target);
              const isSelectedEdge =
                selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

              // Curved bezier paths
              const sx = srcNode.x + 120;
              const sy = srcNode.y + 30;
              const tx = tgtNode.x;
              const ty = tgtNode.y + 30;
              const mx = (sx + tx) / 2;

              const d = `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`;

              return (
                <g key={edge.id}>
                  <path
                    d={d}
                    fill="none"
                    stroke={
                      isEdgeInChain
                        ? 'url(#edgeGradRose)'
                        : isSelectedEdge
                        ? '#00f0ff'
                        : '#1e293b'
                    }
                    strokeWidth={isEdgeInChain ? 3 : isSelectedEdge ? 2.5 : 1.5}
                    strokeDasharray={isEdgeInChain ? '6 3' : edge.label === 'leads to' ? '4 2' : 'none'}
                    markerEnd={isEdgeInChain ? 'url(#arrow-active)' : 'url(#arrow)'}
                    className={isEdgeInChain ? 'animate-pulse' : ''}
                    opacity={activeNodeIds && !isEdgeInChain ? 0.2 : 1}
                  />
                  {/* Edge label pill */}
                  <text
                    x={mx}
                    y={(sy + ty) / 2 - 6}
                    fill={isEdgeInChain ? '#ff2a5f' : '#64748b'}
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                    opacity={activeNodeIds && !isEdgeInChain ? 0.15 : 0.8}
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* HTML Interactive Nodes */}
          {nodes.map(node => {
            const style = getNodeColor(node);
            const Icon = style.icon;
            const isNodeInChain = !activeNodeIds || activeNodeIds.has(node.id);
            const isSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedNode(node);
                  if (node.id.startsWith('finding-') && onSelectFinding) {
                    onSelectFinding(node.id.replace('finding-', ''));
                  }
                }}
                style={{
                  transform: `translate(${node.x}px, ${node.y}px)`,
                  width: '180px',
                }}
                className={`interactive-node absolute p-3 rounded-lg border backdrop-blur transition-all duration-200 cursor-pointer ${
                  style.bg
                } ${style.border} ${style.glow} ${
                  isSelected ? 'ring-2 ring-cyan-400 scale-105 z-20' : 'hover:scale-102 z-10'
                } ${isNodeInChain ? 'opacity-100' : 'opacity-25 grayscale'}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1 rounded ${style.bg} border ${style.border}`}>
                    <Icon className={`w-3.5 h-3.5 ${style.text}`} />
                  </div>
                  <span className="text-[10px] font-mono font-semibold tracking-wider uppercase text-slate-400 truncate">
                    {node.category || node.type}
                  </span>
                </div>

                <div className={`text-xs font-semibold leading-snug line-clamp-2 ${style.text}`}>
                  {node.label}
                </div>

                {node.severity && (
                  <div className="mt-2 flex items-center justify-between">
                    <SeverityBadge severity={node.severity} size="sm" />
                    {node.confidence && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {Math.round(node.confidence * 100)}% conf
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Node Inspector Panel (Bottom / Overlay) */}
      {selectedNode && (
        <div className="absolute bottom-3 left-4 right-4 bg-[#0c1424]/95 border border-cyan-500/40 p-4 rounded-xl shadow-2xl backdrop-blur flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-20 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {selectedNode.category || selectedNode.type}
              </span>
              <h4 className="text-sm font-bold text-white tracking-wide">{selectedNode.label}</h4>
              {selectedNode.severity && <SeverityBadge severity={selectedNode.severity} size="sm" />}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {selectedNode.details}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            {selectedNode.id.startsWith('finding-') && (
              <button
                onClick={() => {
                  const fid = selectedNode.id.replace('finding-', '');
                  if (onSelectFinding) onSelectFinding(fid);
                }}
                className="px-3 py-1.5 text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-600/70 hover:bg-cyan-900 rounded transition flex items-center gap-1.5"
              >
                <span>Deep Inspection</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setSelectedNode(null)}
              className="px-2.5 py-1.5 text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-700 rounded transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Graph Legend & Status */}
      <div className="px-4 py-2 bg-[#070b12] border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-cyan-500"></span> Asset
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-500"></span> Service
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Finding
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-purple-500"></span> Correlated Risk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-500"></span> Business Impact
          </span>
        </div>
        <div className="text-slate-500 hidden sm:block">
          Interactive: Drag to pan • Scroll/buttons to zoom • Click node to inspect
        </div>
      </div>
    </div>
  );
}
