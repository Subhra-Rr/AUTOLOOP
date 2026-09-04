import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Workflow, 
  Code2, 
  Eye, 
  Terminal, 
  LineChart, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { PipelineNodeId, ProjectState } from '../types';

interface PipelineGraphProps {
  project: ProjectState;
  onSelectNode?: (nodeId: PipelineNodeId) => void;
  onNodeFeedback?: (nodeId: PipelineNodeId, sentiment: 'UP' | 'DOWN') => void;
}

export function PipelineGraph({ project, onSelectNode, onNodeFeedback }: PipelineGraphProps) {
  const [feedbackToast, setFeedbackToast] = useState<{ nodeId: string; sentiment: 'UP' | 'DOWN' } | null>(null);

  const nodes: { id: PipelineNodeId; label: string; icon: any; agent: string; desc: string }[] = [
    { id: 'GOAL', label: 'GOAL', icon: Sparkles, agent: 'ORCHESTRATOR', desc: 'Objective Parsed' },
    { id: 'ANALYZE', label: 'ANALYZE', icon: Search, agent: 'PLANNER', desc: 'Domain Requirements' },
    { id: 'PLAN', label: 'PLAN', icon: Workflow, agent: 'PLANNER', desc: 'Task Decomposition' },
    { id: 'EXECUTE', label: 'EXECUTE', icon: Code2, agent: 'DEVELOPER', desc: 'Code Synthesis' },
    { id: 'OBSERVE', label: 'OBSERVE', icon: Eye, agent: 'REVIEWER', desc: 'AST & Runtime Telemetry' },
    { id: 'TEST', label: 'TEST', icon: Terminal, agent: 'TESTER', desc: 'Test Suite Execution' },
    { id: 'EVALUATE', label: 'EVALUATE', icon: LineChart, agent: 'FINAL_EVALUATOR', desc: 'Quality Scoring' },
    { id: 'REPAIR', label: 'REPAIR', icon: Wrench, agent: 'REPAIR_AGENT', desc: 'Failure Auto-Repair' },
    { id: 'VERIFY', label: 'VERIFY', icon: ShieldCheck, agent: 'SECURITY_ANALYZER', desc: 'DoD & Security Scan' },
    { id: 'DONE', label: 'DONE', icon: CheckCircle2, agent: 'ORCHESTRATOR', desc: 'Verified Complete' },
  ];

  const currentNodeIndex = nodes.findIndex((n) => n.id === project.activeNode);
  const isRepairActive = project.activeNode === 'REPAIR' || (project.activeRepair && project.activeRepair.status !== 'RESOLVED');

  const getNodeStatus = (nodeId: PipelineNodeId, idx: number) => {
    if (project.status === 'COMPLETED') return 'COMPLETED';
    if (project.activeNode === nodeId) return 'ACTIVE';
    if (nodeId === 'REPAIR') {
      if (isRepairActive) return 'ACTIVE';
      if (project.repairHistory.length > 0) return 'COMPLETED';
      return 'INACTIVE';
    }
    if (idx < currentNodeIndex) return 'COMPLETED';
    return 'INACTIVE';
  };

  const handleFeedbackClick = (e: React.MouseEvent, nodeId: PipelineNodeId, sentiment: 'UP' | 'DOWN') => {
    e.stopPropagation();
    onNodeFeedback?.(nodeId, sentiment);
    setFeedbackToast({ nodeId, sentiment });
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const feedbacks = project.nodeFeedback || {};
  const positiveFeedbacks = Object.values(feedbacks).filter(s => s === 'UP').length;
  const negativeFeedbacks = Object.values(feedbacks).filter(s => s === 'DOWN').length;

  return (
    <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-3.5 sm:space-y-4 backdrop-blur-2xl">
      {/* Header bar */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.9)] animate-pulse" />
          <h3 className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-white/80">
            AUTONOMOUS EXECUTION GRAPH
          </h3>
          {/* Real-time sentiment refinement indicator */}
          {(positiveFeedbacks > 0 || negativeFeedbacks > 0) && (
            <span className="hidden md:inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[9px] font-mono text-white/60">
              <span className="text-emerald-400 font-bold">+{positiveFeedbacks} 👍</span>
              <span>/</span>
              <span className="text-rose-400 font-bold">-{negativeFeedbacks} 👎</span>
              <span className="text-white/40">AI SENTIMENT TUNED</span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] font-mono">
          {feedbackToast && (
            <span className="animate-fadeIn px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              {feedbackToast.sentiment === 'UP' ? '👍 UPVOTE' : '👎 DOWNVOTE'} LOGGED ON [{feedbackToast.nodeId}]
            </span>
          )}
          <span className="text-white/50">
            STAGE: <strong className="text-cyan-300 font-bold">{project.activeNode}</strong>
          </span>
          {isRepairActive && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] sm:text-[10px] font-bold shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse">
              <RotateCw className="w-2.5 h-2.5 animate-spin" />
              <span>REPAIR_LOOP</span>
            </span>
          )}
        </div>
      </div>

      {/* Interactive Flow Visualizer with smooth horizontal scroll */}
      <div className="relative py-2 sm:py-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center justify-between min-w-[700px] sm:min-w-[780px] gap-2 relative px-2">
          {/* Main Connecting Track Line */}
          <div className="absolute top-[32%] left-6 right-6 h-0.5 bg-white/10 -translate-y-1/2 z-0" />

          {/* Animated Glowing Signal Line */}
          <div 
            className="absolute top-[32%] left-6 h-0.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 -translate-y-1/2 z-0 transition-all duration-700 shadow-[0_0_12px_rgba(6,182,212,0.7)]"
            style={{ 
              width: `${Math.min(100, Math.max(5, (currentNodeIndex / (nodes.length - 1)) * 100))}%` 
            }}
          />

          {/* Repair Loop Arc Highlight (if repair active or completed) */}
          {project.repairHistory.length > 0 && (
            <div className="absolute top-0 right-[25%] left-[50%] h-7 sm:h-8 border-t-2 border-dashed border-red-500/60 rounded-t-full pointer-events-none -translate-y-2 sm:-translate-y-3 z-0 flex items-center justify-center">
              <span className="glass-panel px-2.5 py-0.5 text-[8px] sm:text-[9px] font-mono text-red-400 border border-red-500/40 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.3)]">
                TEST → REPAIR → RETEST
              </span>
            </div>
          )}

          {/* Render Nodes */}
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            const status = getNodeStatus(node.id, idx);
            const sentiment = feedbacks[node.id];
            const isActiveProcessing = status === 'ACTIVE' || (node.id === 'REPAIR' && isRepairActive);

            let nodeStyle = 'glass-card border-white/10 text-white/30';

            if (status === 'COMPLETED') {
              nodeStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]';
            } else if (node.id === 'REPAIR' && isRepairActive) {
              nodeStyle = 'bg-red-500/25 border-2 border-red-400 text-red-300 scale-110 shadow-[0_0_24px_rgba(239,68,68,0.8)] animate-pulse';
            } else if (status === 'ACTIVE') {
              nodeStyle = 'glass-card-active border-2 border-cyan-400 text-cyan-300 scale-110 shadow-[0_0_24px_rgba(6,182,212,0.85)] animate-pulse';
            }

            return (
              <div
                key={node.id}
                onClick={() => onSelectNode?.(node.id)}
                className="relative z-10 flex flex-col items-center cursor-pointer group transition-all duration-300 shrink-0 transform hover:-translate-y-1 active:scale-95"
                title={`Stage: ${node.label} (${node.desc})`}
              >
                {/* Node Box Wrapper with subtle glowing pulse halo */}
                <div className="relative">
                  {isActiveProcessing && (
                    <>
                      {/* Subtle ambient radiant blur pulse */}
                      <span className="absolute -inset-1.5 sm:-inset-2 rounded-2xl bg-cyan-400/30 blur-md animate-pulse pointer-events-none -z-10" />
                      {/* Gentle beacon ping ring */}
                      <span className="absolute -inset-1 rounded-xl border border-cyan-400/50 animate-ping opacity-35 pointer-events-none -z-10 [animation-duration:2.5s]" />
                      {/* Live activity indicator pip */}
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)] animate-pulse z-20" />
                    </>
                  )}

                  {/* Node circular/square box with subtle scale up on hover */}
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-md group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] group-hover:border-cyan-400/60 relative z-10 ${nodeStyle}`}>
                    <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:scale-115 ${isActiveProcessing ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : ''}`} />
                  </div>
                </div>

                {/* Node Label */}
                <span className={`text-[9px] sm:text-[10px] font-mono font-bold mt-1.5 sm:mt-2 tracking-wider transition-all duration-300 group-hover:text-cyan-300 group-hover:scale-105 ${
                  isActiveProcessing ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse' : status === 'COMPLETED' ? 'text-emerald-400' : 'text-white/40'
                }`}>
                  {node.label}
                </span>

                {/* Subtitle / Agent role */}
                <span className="text-[7px] sm:text-[8px] font-mono text-white/40 text-center truncate max-w-[60px] sm:max-w-[65px] uppercase transition-colors duration-300 group-hover:text-white/80">
                  {node.agent.split('_')[0]}
                </span>

                {/* Thumbs Up / Down Sentiment Feedback Control */}
                <div 
                  className="flex items-center space-x-1 mt-1 px-1 py-0.5 rounded-full bg-black/50 border border-white/10 group-hover:border-white/20 transition-all shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => handleFeedbackClick(e, node.id, 'UP')}
                    title={`Upvote ${node.label} decisions (logs positive sentiment)`}
                    className={`p-1 rounded-full transition-all duration-200 ${
                      sentiment === 'UP'
                        ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.9)] scale-110'
                        : 'text-white/40 hover:text-emerald-300 hover:bg-emerald-500/20'
                    }`}
                  >
                    <ThumbsUp className="w-2.5 h-2.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleFeedbackClick(e, node.id, 'DOWN')}
                    title={`Downvote ${node.label} decisions (logs critical sentiment)`}
                    className={`p-1 rounded-full transition-all duration-200 ${
                      sentiment === 'DOWN'
                        ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.9)] scale-110'
                        : 'text-white/40 hover:text-rose-300 hover:bg-rose-500/20'
                    }`}
                  >
                    <ThumbsDown className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node activity bar summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-white/10 text-[9px] sm:text-[10px] font-mono">
        <div className="flex items-center space-x-1.5 text-white/50 truncate">
          <span className="shrink-0 font-bold text-white/70">ACTIVE TASK:</span>
          <span className="text-cyan-300 font-semibold truncate">
            {project.currentTaskId 
              ? `${project.tasks.find(t => t.id === project.currentTaskId)?.code}: ${project.tasks.find(t => t.id === project.currentTaskId)?.title}`
              : project.status === 'COMPLETED' ? 'ALL TASKS VERIFIED' : 'ENGINE READY'}
          </span>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4 text-white/50 shrink-0">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span>COMPLETED ({project.metrics.completedTasks}/10)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)] animate-pulse" />
            <span>ACTIVE</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
            <span>REPAIRS ({project.metrics.repairCyclesCount})</span>
          </span>
        </div>
      </div>
    </div>
  );
}
