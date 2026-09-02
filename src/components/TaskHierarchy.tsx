import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  RotateCw, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  Wrench,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  GitBranch
} from 'lucide-react';
import { Task, TaskStatus, ProjectState } from '../types';

interface TaskHierarchyProps {
  project: ProjectState;
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
}

export function TaskHierarchy({ project, selectedTaskId, onSelectTask }: TaskHierarchyProps) {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'PASSED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_6px_rgba(34,197,94,0.3)]">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>PASSED</span>
          </span>
        );
      case 'RUNNING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.4)] animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>RUNNING</span>
          </span>
        );
      case 'PLANNING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">
            <RotateCw className="w-2.5 h-2.5 animate-spin" />
            <span>PLANNING</span>
          </span>
        );
      case 'TESTING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse">
            <Clock className="w-2.5 h-2.5" />
            <span>TESTING</span>
          </span>
        );
      case 'REPAIRING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse">
            <Wrench className="w-2.5 h-2.5" />
            <span>REPAIRING</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>FAILED</span>
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
            <ShieldAlert className="w-2.5 h-2.5" />
            <span>BLOCKED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono text-white/30 bg-black/40 border border-white/5">
            <Circle className="w-2 h-2" />
            <span>PENDING</span>
          </span>
        );
    }
  };

  const uniqueCategories = Array.from(new Set(project.tasks.map(t => t.category).filter(Boolean)));
  const categories = ['ALL', ...(uniqueCategories.length > 0 ? uniqueCategories : ['REQUIREMENTS', 'BACKEND', 'TESTING'])];

  const filteredTasks = filterCategory === 'ALL' 
    ? project.tasks 
    : project.tasks.filter(t => t.category === filterCategory);

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-white/10 space-y-3 glass-panel-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-white/80">
              TASK HIERARCHY & MODULE TREE
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            {project.metrics.completedTasks} / {project.tasks.length} DONE
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden border border-white/10 shadow-inner">
          <div
            className="bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 h-full transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            style={{ width: `${(project.metrics.completedTasks / project.tasks.length) * 100}%` }}
          />
        </div>

        {/* Category Pill Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-0.5 text-[10px] font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'glass-card-active text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-white/50 hover:text-white glass-button border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
        {filteredTasks.map((task) => {
          const isSelected = selectedTaskId === task.id || project.currentTaskId === task.id;
          const isCurrent = project.currentTaskId === task.id;

          return (
            <div
              key={task.id}
              onClick={() => onSelectTask(task.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'glass-card-active border-cyan-400/60 shadow-[0_0_16px_rgba(6,182,212,0.25)]'
                  : isCurrent
                  ? 'glass-card border-cyan-500/40 bg-cyan-500/5'
                  : 'glass-card hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-cyan-300">
                    {task.code}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/60 border border-white/10 uppercase">
                    {task.agent}
                  </span>
                </div>
                {getStatusBadge(task.status)}
              </div>

              <h4 className="text-xs font-semibold text-white/95 line-clamp-1">
                {task.title}
              </h4>

              <p className="text-[11px] text-white/50 line-clamp-2 mt-1 font-sans leading-relaxed">
                {task.description}
              </p>

              {/* Task Footer stats */}
              <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/5 text-[9px] font-mono text-white/40">
                <div className="flex items-center space-x-2">
                  {task.dependencies.length > 0 && (
                    <span className="flex items-center space-x-1 text-white/40">
                      <GitBranch className="w-2.5 h-2.5 text-white/30" />
                      <span>{task.dependencies.join(', ')}</span>
                    </span>
                  )}
                  {task.toolCalls.length > 0 && (
                    <span className="text-cyan-300/90 font-mono font-semibold">
                      {task.toolCalls.find(tc => tc.tool === 'writeFile')?.arguments?.path 
                        ? `${task.toolCalls.find(tc => tc.tool === 'writeFile')?.arguments?.path} (${task.toolCalls.find(tc => tc.tool === 'writeFile')?.arguments?.lines || 0}L)`
                        : `${task.toolCalls.length} tool calls`}
                    </span>
                  )}
                </div>

                {task.progress > 0 && task.progress < 100 && (
                  <span className="text-cyan-300 font-bold">
                    {task.progress}%
                  </span>
                )}
                {task.status === 'PASSED' && (
                  <span className="text-emerald-400 font-semibold">
                    {task.completedAt || 'COMPLETED'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Summary Footer */}
      <div className="p-3 border-t border-white/10 glass-panel-subtle text-[10px] font-mono text-white/50 flex items-center justify-between">
        <span>BOUNDED AUTONOMY: 5 REPAIRS</span>
        <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
          <span>AUTONOMOUS_LOOP_ON</span>
        </span>
      </div>
    </div>
  );
}
