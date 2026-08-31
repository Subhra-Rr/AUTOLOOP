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
    <div className="p-4 sm:p-5 rounded-lg bg-[#0a0a0a]/60 border border-white/10 backdrop-blur-md shadow-2xl space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70">
            AUTONOMOUS EXECUTION GRAPH PIPELINE
          </h3>
        </div>
        <div className="flex items-center space-x-3 text-[10px] font-mono">
          <span className="text-white/40">
            STAGE: <strong className="text-cyan-400 font-semibold">{project.activeNode}</strong>
          </span>
          {isRepairActive && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse">
              <RotateCw className="w-2.5 h-2.5 animate-spin" />
              <span>AUTO_REPAIR_LOOP</span>
            </span>
          )}
        </div>
      </div>

      {/* Interactive Flow Visualizer */}
      <div className="relative py-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] gap-2 relative">
          {/* Main Connecting Track Line */}
          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-white/10 -translate-y-1/2 z-0" />

          {/* Animated Glowing Signal Line */}
          <div 
            className="absolute top-1/2 left-6 h-0.5 bg-gradient-to-r from-cyan-500 via-green-400 to-cyan-400 -translate-y-1/2 z-0 transition-all duration-700 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
            style={{ 
              width: `${Math.min(100, Math.max(5, (currentNodeIndex / (nodes.length - 1)) * 100))}%` 
            }}
          />

          {/* Repair Loop Arc Highlight (if repair active or completed) */}
          {project.repairHistory.length > 0 && (
            <div className="absolute top-0 right-[25%] left-[50%] h-8 border-t-2 border-dashed border-red-500/60 rounded-t-full pointer-events-none -translate-y-3 z-0 flex items-center justify-center">
              <span className="bg-[#0a0a0a] px-2 text-[9px] font-mono text-red-400 border border-red-500/30 rounded">
                TEST → REPAIR → RETEST
              </span>
            </div>
          )}

          {/* Render Nodes */}
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            const status = getNodeStatus(node.id, idx);

            let nodeStyle = 'bg-black/40 border border-white/5 text-white/30';

            if (status === 'COMPLETED') {
              nodeStyle = 'bg-green-500/10 border border-green-500/40 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.3)]';
            } else if (node.id === 'REPAIR' && isRepairActive) {
              nodeStyle = 'bg-red-500/15 border-2 border-red-500 text-red-400 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse';
            } else if (status === 'ACTIVE') {
              nodeStyle = 'bg-cyan-500/15 border-2 border-cyan-400 text-cyan-300 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.5)]';
            }

            return (
              <div
                key={node.id}
                onClick={() => onSelectNode?.(node.id)}
                className="relative z-10 flex flex-col items-center cursor-pointer group transition-all duration-300"
              >
                {/* Node circular/square box */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${nodeStyle}`}>
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                </div>

                {/* Node Label */}
                <span className={`text-[10px] font-mono font-bold mt-2 tracking-wider ${
                  status === 'ACTIVE' ? 'text-cyan-400' : status === 'COMPLETED' ? 'text-green-400' : 'text-white/40'
                }`}>
                  {node.label}
                </span>

                {/* Subtitle / Agent role */}
                <span className="text-[8px] font-mono text-white/30 text-center truncate max-w-[65px] uppercase">
                  {node.agent.split('_')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node activity bar summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-[10px] font-mono">
        <div className="flex items-center space-x-2 text-white/40">
          <span>CURRENT TASK:</span>
          <span className="text-white font-semibold">
            {project.currentTaskId 
              ? `${project.tasks.find(t => t.id === project.currentTaskId)?.code}: ${project.tasks.find(t => t.id === project.currentTaskId)?.title}`
              : project.status === 'COMPLETED' ? 'ALL TASKS VERIFIED' : 'ENGINE READY'}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-white/40">
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
            <span>COMPLETED ({project.metrics.completedTasks}/10)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)] animate-pulse" />
            <span>ACTIVE STAGE</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>REPAIRS ({project.metrics.repairCyclesCount})</span>
          </span>
        </div>
      </div>
    </div>
  );
}
