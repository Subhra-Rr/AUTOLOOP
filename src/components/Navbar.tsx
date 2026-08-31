import React from 'react';
import { 
  Activity, 
  Pause, 
  Play, 
  Square, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  Terminal,
  FileCheck2,
  Wrench,
  LineChart,
  GitFork,
  ExternalLink
} from 'lucide-react';
import { ProjectState } from '../types';

export type ActiveTabType = 'preview' | 'workspace' | 'code' | 'repair' | 'security' | 'evaluation' | 'dod' | 'timeline';

interface NavbarProps {
  project: ProjectState | null;
  activeTab: ActiveTabType;
  onTabChange: (tab: ActiveTabType) => void;
  isRunning: boolean;
  onToggleRun: () => void;
  onPause: () => void;
  onResume: () => void;
  onAbort: () => void;
  onReset: () => void;
}

export function Navbar({
  project,
  activeTab,
  onTabChange,
  isRunning,
  onToggleRun,
  onPause,
  onResume,
  onAbort,
  onReset
}: NavbarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const getStatusBadge = () => {
    if (!project) return null;
    switch (project.status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.4)]">
            <CheckCircle2 className="w-3 h-3" />
            VERIFIED_COMPLETE
          </span>
        );
      case 'REPAIRING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse">
            <Wrench className="w-3 h-3" />
            AUTONOMOUS_REPAIR
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-3 h-3" />
            HUMAN_GATE_REQUIRED
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-white/10 text-white/80 border border-white/10">
            <Pause className="w-3 h-3" />
            PAUSED
          </span>
        );
      case 'EXECUTING':
      case 'TESTING':
      case 'PLANNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.4)] animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            AUTONOMOUS :: {project.status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-white/5 text-white/50 border border-white/10">
            READY
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
      {/* Brand & Project Info */}
      <div className="flex items-center space-x-4">
        <div 
          onClick={onReset}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
            <span className="font-bold text-white text-xs font-mono">AL</span>
          </div>
          <div>
            <h1 className="text-xs font-semibold tracking-widest text-white/90 uppercase">
              AUTOLOOP PLATFORM
            </h1>
            <p className="text-[10px] text-cyan-400 font-mono">
              AUTONOMOUS_MODE :: ACTIVE
            </p>
          </div>
        </div>

        {project && (
          <div className="hidden lg:flex items-center space-x-3 pl-4 border-l border-white/10">
            <span className="text-xs font-mono text-white/80 truncate max-w-[180px] xl:max-w-[260px]">
              {project.name}
            </span>
            {getStatusBadge()}
          </div>
        )}
      </div>

      {/* Center Navigation Tabs */}
      {project && (
        <nav className="hidden xl:flex items-center space-x-1 bg-[#0a0a0a]/60 p-1 rounded-lg border border-white/10 backdrop-blur-sm">
          {/* Real Live App Preview Tab */}
          <button
            onClick={() => onTabChange('preview')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'preview' 
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]' 
                : 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={() => onTabChange('workspace')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'workspace' 
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.3)]' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Workspace</span>
          </button>
          <button
            onClick={() => onTabChange('code')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'code' 
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.3)]' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>Code ({project.files.length})</span>
          </button>
          <button
            onClick={() => onTabChange('repair')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'repair' 
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(234,179,8,0.3)]' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wrench className="w-3 h-3" />
            <span>Repair</span>
            {project.repairHistory.length > 0 && (
              <span className="ml-1 px-1 rounded bg-amber-500 text-black text-[9px] font-bold">
                {project.repairHistory.length}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('security')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'security' 
                ? 'bg-green-500/15 text-green-400 border border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.3)]' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Security</span>
          </button>
          <button
            onClick={() => onTabChange('evaluation')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'evaluation' 
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <LineChart className="w-3 h-3" />
            <span>Metrics</span>
          </button>
          <button
            onClick={() => onTabChange('dod')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'dod' 
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCheck2 className="w-3 h-3" />
            <span>DoD Contract</span>
          </button>
        </nav>
      )}

      {/* Right Controls & Telemetry */}
      <div className="flex items-center space-x-3">
        {project ? (
          <>
            {/* Live Telemetry Chips */}
            <div className="hidden sm:flex items-center space-x-2 text-[10px] font-mono">
              <div className="flex items-center space-x-1 px-2 py-1 rounded bg-black/40 border border-white/5 text-white/70">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{formatTime(project.elapsedSeconds)}</span>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 rounded bg-black/40 border border-white/5 text-white/70">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>{project.tokensUsed} TOKENS</span>
              </div>
            </div>

            {/* Loop Actions */}
            <div className="flex items-center space-x-1.5 pl-2 border-l border-white/10">
              {isRunning ? (
                <button
                  onClick={onPause}
                  title="Pause autonomous loop"
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-mono transition-colors"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">PAUSE</span>
                </button>
              ) : project.status !== 'COMPLETED' ? (
                <button
                  onClick={onResume}
                  title="Resume autonomous execution"
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">RESUME</span>
                </button>
              ) : null}

              <button
                onClick={onReset}
                title="Start new project objective"
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-mono transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">NEW</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>AWAITING USER PROMPT</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
