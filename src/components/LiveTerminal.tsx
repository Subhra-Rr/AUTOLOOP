import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  Lock, 
  Unlock, 
  ShieldCheck,
  Download,
  Filter,
  Sparkles,
  Palette
} from 'lucide-react';
import { TerminalLog, AgentRole, LogLevel, TerminalTheme } from '../types';

interface LiveTerminalProps {
  logs: TerminalLog[];
  onClearLogs?: () => void;
}

export function LiveTerminal({ logs, onClearLogs }: LiveTerminalProps) {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterAgent, setFilterAgent] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<TerminalTheme>(() => {
    try {
      const saved = localStorage.getItem('autoloop_terminal_theme');
      if (saved === 'matrix-green' || saved === 'classic-amber' || saved === 'default-white') {
        return saved as TerminalTheme;
      }
    } catch (e) {
      // ignore
    }
    return 'default-white';
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (newTheme: TerminalTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('autoloop_terminal_theme', newTheme);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.agent}] [${l.level}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportLogs = () => {
    const json = JSON.stringify(logs, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autoloop-terminal-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAgentColor = (agent: AgentRole | string) => {
    if (theme === 'matrix-green') {
      return 'text-emerald-300 bg-emerald-950/40 border-emerald-500/40';
    }
    if (theme === 'classic-amber') {
      return 'text-amber-300 bg-amber-950/40 border-amber-500/40';
    }
    switch (agent) {
      case 'ORCHESTRATOR':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'PLANNER':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'DEVELOPER':
      case 'EXECUTOR':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'TESTER':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'REPAIR_AGENT':
        return 'text-red-400 bg-red-500/20 border-red-500/40 font-bold shadow-[0_0_8px_rgba(239,68,68,0.3)]';
      case 'SECURITY_ANALYZER':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'FINAL_EVALUATOR':
        return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30';
      default:
        return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  const getLevelColor = (level: LogLevel) => {
    if (theme === 'matrix-green') {
      switch (level) {
        case 'ERROR': return 'text-red-400 font-bold drop-shadow-[0_0_4px_rgba(248,113,113,0.5)]';
        case 'WARN': return 'text-amber-300 font-semibold';
        case 'SUCCESS': return 'text-emerald-300 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]';
        case 'SECURITY': return 'text-teal-300 font-bold';
        default: return 'text-[#4ade80]';
      }
    }
    if (theme === 'classic-amber') {
      switch (level) {
        case 'ERROR': return 'text-red-400 font-bold drop-shadow-[0_0_4px_rgba(248,113,113,0.5)]';
        case 'WARN': return 'text-amber-200 font-semibold underline decoration-amber-500/40';
        case 'SUCCESS': return 'text-yellow-300 font-bold drop-shadow-[0_0_4px_rgba(253,224,71,0.8)]';
        case 'SECURITY': return 'text-orange-300 font-bold';
        default: return 'text-[#fbbf24]';
      }
    }
    switch (level) {
      case 'ERROR':
        return 'text-red-400 font-semibold';
      case 'WARN':
        return 'text-yellow-400 font-semibold';
      case 'SUCCESS':
        return 'text-green-400 font-semibold';
      case 'SECURITY':
        return 'text-cyan-300 font-semibold';
      default:
        return 'text-white/80';
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    if (filterAgent !== 'ALL' && log.agent !== filterAgent) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.agent.toLowerCase().includes(q) ||
        log.level.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getThemeStyles = () => {
    switch (theme) {
      case 'matrix-green':
        return {
          container: 'bg-[#020d04]/95 border-emerald-500/30 text-[#4ade80] shadow-[0_0_30px_rgba(16,185,129,0.15)]',
          header: 'bg-[#041908]/90 border-emerald-500/30 text-emerald-300',
          title: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]',
          icon: 'text-emerald-400',
          subbar: 'bg-[#031407]/90 border-emerald-500/20 text-emerald-400',
          input: 'bg-[#021808] border border-emerald-500/40 text-[#4ade80] placeholder-emerald-700 focus:ring-emerald-500',
          stream: 'bg-[#010903]/90 text-[#4ade80] selection:bg-emerald-500 selection:text-black',
          timestamp: 'text-emerald-600/90',
          codePre: 'bg-[#011406] border border-emerald-500/40 text-emerald-300 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]',
          footer: 'bg-[#041908]/90 border-emerald-500/20 text-emerald-500/80',
          footerShield: 'text-emerald-400',
          emptyText: 'text-emerald-600/60'
        };
      case 'classic-amber':
        return {
          container: 'bg-[#0d0901]/95 border-amber-500/30 text-[#fbbf24] shadow-[0_0_30px_rgba(245,158,11,0.15)]',
          header: 'bg-[#1c1303]/90 border-amber-500/30 text-amber-300',
          title: 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]',
          icon: 'text-amber-400',
          subbar: 'bg-[#170f02]/90 border-amber-500/20 text-amber-400',
          input: 'bg-[#180f02] border border-amber-500/40 text-[#fbbf24] placeholder-amber-700 focus:ring-amber-500',
          stream: 'bg-[#0a0701]/90 text-[#fbbf24] selection:bg-amber-500 selection:text-black',
          timestamp: 'text-amber-600/90',
          codePre: 'bg-[#1a1103] border border-amber-500/40 text-amber-300 shadow-[inset_0_0_10px_rgba(245,158,11,0.2)]',
          footer: 'bg-[#1c1303]/90 border-amber-500/20 text-amber-500/80',
          footerShield: 'text-amber-400',
          emptyText: 'text-amber-600/60'
        };
      case 'default-white':
      default:
        return {
          container: 'glass-panel border-white/10 text-white shadow-2xl',
          header: 'glass-panel-subtle border-white/10 text-white/70',
          title: 'text-white/70',
          icon: 'text-cyan-400',
          subbar: 'glass-panel-subtle border-white/10 text-white/80',
          input: 'glass-input text-white placeholder-white/40 focus:ring-cyan-500',
          stream: 'bg-black/40 backdrop-blur-md text-white/90 selection:bg-cyan-500 selection:text-black',
          timestamp: 'text-white/40',
          codePre: 'bg-black/70 border border-cyan-500/30 text-cyan-200/90 shadow-inner',
          footer: 'glass-panel-subtle border-white/10 text-white/50',
          footerShield: 'text-emerald-400',
          emptyText: 'text-white/40'
        };
    }
  };

  const ts = getThemeStyles();

  return (
    <div className={`flex flex-col h-full rounded-2xl border overflow-hidden font-mono backdrop-blur-2xl transition-colors duration-300 ${ts.container}`}>
      {/* Terminal Title Bar with Theme Switcher */}
      <div className={`h-9 border-b flex items-center justify-between px-3 sm:px-4 select-none transition-colors duration-300 ${ts.header}`}>
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 shadow-[0_0_6px_rgba(234,179,8,0.5)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          </div>
          <div className="flex items-center space-x-1.5 pl-2 border-l border-white/10 min-w-0">
            <TerminalIcon className={`w-3.5 h-3.5 shrink-0 ${ts.icon}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest truncate ${ts.title}`}>
              EXECUTION_STREAM
            </span>
          </div>
        </div>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center space-x-1.5 text-xs shrink-0">
          {/* Theme Switcher Toggle (matrix-green, classic-amber, default-white) */}
          <div className="flex items-center space-x-0.5 sm:space-x-1 p-0.5 rounded-lg bg-black/40 border border-white/10 text-[9px] font-mono mr-1">
            <button
              type="button"
              onClick={() => handleThemeChange('default-white')}
              title="Switch to 'default-white' terminal color scheme"
              className={`flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded transition-all ${
                theme === 'default-white'
                  ? 'bg-white/20 text-white font-bold shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="hidden md:inline">WHITE</span>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('matrix-green')}
              title="Switch to 'matrix-green' terminal color scheme"
              className={`flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded transition-all ${
                theme === 'matrix-green'
                  ? 'bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                  : 'text-emerald-500/50 hover:text-emerald-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.9)]" />
              <span className="hidden md:inline">MATRIX</span>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('classic-amber')}
              title="Switch to 'classic-amber' terminal color scheme"
              className={`flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded transition-all ${
                theme === 'classic-amber'
                  ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                  : 'text-amber-500/50 hover:text-amber-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.9)]" />
              <span className="hidden md:inline">AMBER</span>
            </button>
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            title={autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll disabled'}
            className={`p-1.5 rounded-lg border transition-all ${
              autoScroll ? 'glass-card-active text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]' : 'glass-button text-white/50 border-white/10'
            }`}
          >
            {autoScroll ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>

          <button
            onClick={handleCopyLogs}
            title="Copy logs to clipboard"
            className="p-1.5 rounded-lg glass-button text-white/70 hover:text-white border border-white/10 transition-all"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>

          <button
            onClick={handleExportLogs}
            title="Export JSON logs"
            className="p-1.5 rounded-lg glass-button text-white/70 hover:text-white border border-white/10 transition-all"
          >
            <Download className="w-3 h-3" />
          </button>

          {onClearLogs && (
            <button
              onClick={onClearLogs}
              title="Clear terminal"
              className="p-1.5 rounded-lg glass-button text-white/50 hover:text-red-400 border border-white/10 transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Sub-bar */}
      <div className={`flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 border-b text-xs transition-colors duration-300 ${ts.subbar}`}>
        <div className="flex items-center space-x-2">
          {/* Level Filter */}
          <select
            id="terminalFilterLevel"
            name="terminalFilterLevel"
            aria-label="Filter terminal logs by severity level"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className={`rounded-lg px-2.5 py-1 text-[10px] font-mono focus:outline-none focus:ring-1 ${ts.input}`}
          >
            <option value="ALL" className="bg-slate-900 text-white">ALL LEVELS</option>
            <option value="INFO" className="bg-slate-900 text-white">INFO</option>
            <option value="SUCCESS" className="bg-slate-900 text-emerald-400">SUCCESS</option>
            <option value="WARN" className="bg-slate-900 text-amber-400">WARN</option>
            <option value="ERROR" className="bg-slate-900 text-red-400">ERROR</option>
            <option value="SECURITY" className="bg-slate-900 text-cyan-300">SECURITY</option>
          </select>

          {/* Agent Filter */}
          <select
            id="terminalFilterAgent"
            name="terminalFilterAgent"
            aria-label="Filter terminal logs by agent role"
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className={`rounded-lg px-2.5 py-1 text-[10px] font-mono focus:outline-none focus:ring-1 ${ts.input}`}
          >
            <option value="ALL" className="bg-slate-900 text-white">ALL AGENTS</option>
            <option value="ORCHESTRATOR" className="bg-slate-900 text-purple-300">Orchestrator</option>
            <option value="PLANNER" className="bg-slate-900 text-blue-300">Planner</option>
            <option value="DEVELOPER" className="bg-slate-900 text-cyan-300">Developer</option>
            <option value="TESTER" className="bg-slate-900 text-yellow-300">Tester</option>
            <option value="REPAIR_AGENT" className="bg-slate-900 text-red-300">Repair Agent</option>
            <option value="SECURITY_ANALYZER" className="bg-slate-900 text-emerald-300">Security Analyzer</option>
            <option value="FINAL_EVALUATOR" className="bg-slate-900 text-cyan-300">Final Evaluator</option>
          </select>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-3 h-3 opacity-40 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            id="terminalLogSearch"
            name="terminalLogSearch"
            aria-label="Filter terminal logs by text query"
            autoComplete="off"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER LOGS..."
            className={`pl-7 pr-2.5 py-1 rounded-lg text-[10px] w-36 sm:w-48 font-mono uppercase ${ts.input}`}
          />
        </div>
      </div>

      {/* Terminal Log Output Stream */}
      <div 
        ref={scrollRef}
        className={`flex-1 overflow-y-auto p-3.5 space-y-2 text-[11px] leading-relaxed select-text transition-colors duration-300 ${ts.stream}`}
      >
        {filteredLogs.length === 0 ? (
          <div className={`italic py-8 text-center text-xs ${ts.emptyText}`}>
            NO STREAMING EVENTS CAPTURED
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isCodeWrite = log.message.includes('[Tool: writeFile]') || log.message.includes('Wrote') || log.message.includes('|');
            return (
              <div key={log.id} className="flex items-start space-x-2.5 group hover:bg-white/5 p-1.5 rounded-lg transition-colors">
                {/* Timestamp */}
                <span className={`text-[10px] select-none shrink-0 font-mono pt-0.5 ${ts.timestamp}`}>
                  [{log.timestamp}]
                </span>

                {/* Agent Badge */}
                <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-bold border shrink-0 ${getAgentColor(log.agent)}`}>
                  {log.agent}
                </span>

                {/* Message */}
                <div className="flex-1 min-w-0 font-mono">
                  {isCodeWrite && log.message.includes('\n') ? (
                    <div className="space-y-1">
                      <div className={`font-semibold ${getLevelColor(log.level)}`}>
                        {log.message.split('\n')[0]}
                      </div>
                      <pre className={`p-2.5 rounded-xl overflow-x-auto text-[10px] font-mono whitespace-pre leading-relaxed ${ts.codePre}`}>
                        {log.message.split('\n').slice(1).join('\n')}
                      </pre>
                    </div>
                  ) : (
                    <span className={`break-words whitespace-pre-wrap ${getLevelColor(log.level)}`}>
                      {log.message}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Status Bar */}
      <div className={`h-8 px-3.5 border-t text-[9px] flex items-center justify-between select-none transition-colors duration-300 ${ts.footer}`}>
        <span className={`flex items-center space-x-1.5 ${ts.footerShield}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SECRET_REDACTION :: ENFORCED (API Keys & JWTs Protected)</span>
        </span>
        <div className="flex items-center space-x-2 font-semibold">
          <span className="hidden sm:inline opacity-60">THEME: {theme.toUpperCase()}</span>
          <span>{filteredLogs.length} EVENTS STREAMED</span>
        </div>
      </div>
    </div>
  );
}
