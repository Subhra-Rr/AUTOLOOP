import React from 'react';
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
  RotateCw
} from 'lucide-react';
import { PipelineNodeId, ProjectState } from '../types';

interface PipelineGraphProps {
  project: ProjectState;
  onSelectNode?: (nodeId: PipelineNodeId) => void;
}

export function PipelineGraph({ project, onSelectNode }: PipelineGraphProps) {
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

  return (
    <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-3.5 sm:space-y-4 backdrop-blur-2xl">
      {/* Header bar */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.9)] animate-pulse" />
          <h3 className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-white/80">
            AUTONOMOUS EXECUTION GRAPH
          </h3>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] font-mono">
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
          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-white/10 -translate-y-1/2 z-0" />

          {/* Animated Glowing Signal Line */}
          <div 
            className="absolute top-1/2 left-6 h-0.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 -translate-y-1/2 z-0 transition-all duration-700 shadow-[0_0_12px_rgba(6,182,212,0.7)]"
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

            let nodeStyle = 'glass-card border-white/10 text-white/30';

            if (status === 'COMPLETED') {
              nodeStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]';
            } else if (node.id === 'REPAIR' && isRepairActive) {
              nodeStyle = 'bg-red-500/20 border-2 border-red-400 text-red-300 scale-110 shadow-[0_0_18px_rgba(239,68,68,0.6)] animate-pulse';
            } else if (status === 'ACTIVE') {
              nodeStyle = 'glass-card-active border-2 border-cyan-400 text-cyan-300 scale-110 shadow-[0_0_18px_rgba(6,182,212,0.6)]';
            }

            return (
              <div
                key={node.id}
                onClick={() => onSelectNode?.(node.id)}
                className="relative z-10 flex flex-col items-center cursor-pointer group transition-all duration-300 shrink-0 transform hover:-translate-y-1 active:scale-95"
                title={`Stage: ${node.label} (${node.desc})`}
              >
                {/* Node circular/square box with subtle scale up on hover */}
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-md group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] group-hover:border-cyan-400/60 ${nodeStyle}`}>
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:scale-115" />
                </div>

                {/* Node Label */}
                <span className={`text-[9px] sm:text-[10px] font-mono font-bold mt-1.5 sm:mt-2 tracking-wider transition-all duration-300 group-hover:text-cyan-300 group-hover:scale-105 ${
                  status === 'ACTIVE' ? 'text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]' : status === 'COMPLETED' ? 'text-emerald-400' : 'text-white/40'
                }`}>
                  {node.label}
                </span>

                {/* Subtitle / Agent role */}
                <span className="text-[7px] sm:text-[8px] font-mono text-white/40 text-center truncate max-w-[60px] sm:max-w-[65px] uppercase transition-colors duration-300 group-hover:text-white/80">
                  {node.agent.split('_')[0]}
                </span>
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
