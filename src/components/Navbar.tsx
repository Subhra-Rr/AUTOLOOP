import React, { useState } from 'react';
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
  ExternalLink,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.4)] whitespace-nowrap">
            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            VERIFIED_COMPLETE
          </span>
        );
      case 'REPAIRING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse whitespace-nowrap">
            <Wrench className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            AUTONOMOUS_REPAIR
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap">
            <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            HUMAN_GATE
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-white/10 text-white/80 border border-white/10 whitespace-nowrap">
            <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            PAUSED
          </span>
        );
      case 'EXECUTING':
      case 'TESTING':
      case 'PLANNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.4)] animate-pulse whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            {project.status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-white/5 text-white/50 border border-white/10 whitespace-nowrap">
            READY
          </span>
        );
    }
  };

  const navItems = [
    { id: 'preview' as ActiveTabType, label: 'Live Preview', icon: Play, highlight: true },
    { id: 'workspace' as ActiveTabType, label: 'Workspace', icon: Terminal },
    { id: 'code' as ActiveTabType, label: `Code (${project?.files?.length || 0})`, icon: Code2 },
    { id: 'repair' as ActiveTabType, label: 'Repair', icon: Wrench, count: project?.repairHistory?.length },
    { id: 'security' as ActiveTabType, label: 'Security', icon: ShieldCheck },
    { id: 'evaluation' as ActiveTabType, label: 'Metrics', icon: LineChart },
    { id: 'dod' as ActiveTabType, label: 'DoD Contract', icon: FileCheck2 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
      {/* Top Main Navigation Bar */}
      <div className="h-14 flex items-center justify-between px-3 sm:px-6">
        {/* Brand & Project Info */}
        <div className="flex items-center space-x-2.5 sm:space-x-4 min-w-0">
          <div 
            onClick={onReset}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group shrink-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
              <span className="font-bold text-white text-[11px] sm:text-xs font-mono">AL</span>
            </div>
            <div>
              <h1 className="text-[11px] sm:text-xs font-semibold tracking-wider sm:tracking-widest text-white/90 uppercase truncate">
                AUTOLOOP
              </h1>
              <p className="text-[9px] sm:text-[10px] text-cyan-400 font-mono hidden xs:block">
                AUTONOMOUS ENGINE
              </p>
            </div>
          </div>

          {project && (
            <div className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-white/10 min-w-0">
              <span className="text-[11px] sm:text-xs font-mono text-white/80 truncate max-w-[100px] sm:max-w-[160px] md:max-w-[220px] xl:max-w-[280px]">
                {project.name}
              </span>
              <div className="hidden md:block">
                {getStatusBadge()}
              </div>
            </div>
          )}
        </div>

        {/* Center Desktop Navigation Tabs (Visible on XL screens) */}
        {project && (
          <nav className="hidden xl:flex items-center space-x-1 bg-[#0a0a0a]/60 p-1 rounded-lg border border-white/10 backdrop-blur-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    item.highlight && isActive
                      ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : item.highlight
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20'
                      : isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-1 px-1 rounded bg-amber-500 text-black text-[8px] font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Controls & Telemetry */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {project ? (
            <>
              {/* Live Telemetry Chips (Desktop/Tablet) */}
              <div className="hidden lg:flex items-center space-x-2 text-[10px] font-mono">
                <div className="flex items-center space-x-1 px-2 py-1 rounded bg-black/40 border border-white/5 text-white/70">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{formatTime(project.elapsedSeconds)}</span>
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded bg-black/40 border border-white/5 text-white/70">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>{project.tokensUsed} TKN</span>
                </div>
              </div>

              {/* Loop Action Controls */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 pl-1.5 sm:pl-2 border-l border-white/10">
                {isRunning ? (
                  <button
                    onClick={onPause}
                    title="Pause autonomous loop"
                    className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[11px] sm:text-xs font-mono transition-colors"
                  >
                    <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">PAUSE</span>
                  </button>
                ) : project.status !== 'COMPLETED' ? (
                  <button
                    onClick={onResume}
                    title="Resume autonomous execution"
                    className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] sm:text-xs font-mono font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all"
                  >
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">RESUME</span>
                  </button>
                ) : null}

                <button
                  onClick={onReset}
                  title="Start new project objective"
                  className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-[11px] sm:text-xs font-mono transition-colors"
                >
                  <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">NEW</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="hidden xs:inline">AWAITING OBJECTIVE</span>
                <span className="xs:hidden">READY</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Responsive Scrollable Tab Bar for Tablets & Mobile (< XL screens) */}
      {project && (
        <div className="xl:hidden flex items-center overflow-x-auto no-scrollbar px-3 py-1.5 bg-[#070707] border-t border-white/5 gap-1.5">
          <div className="md:hidden shrink-0 pr-1 border-r border-white/10">
            {getStatusBadge()}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 transition-all ${
                  item.highlight && isActive
                    ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : item.highlight
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                    : isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-white/60 bg-black/30 border border-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="ml-1 px-1 rounded bg-amber-500 text-black text-[8px] font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
