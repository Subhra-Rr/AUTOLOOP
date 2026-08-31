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
  Sparkles
} from 'lucide-react';
import { TerminalLog, AgentRole, LogLevel } from '../types';

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
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col h-full rounded-lg bg-black/40 border border-white/5 shadow-2xl overflow-hidden font-mono">
      {/* Terminal Title Bar */}
      <div className="h-8 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 select-none">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
          <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
            <TerminalIcon className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
              AUTONOMOUS_EXECUTION_STREAM
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 text-xs">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            title={autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll disabled'}
            className={`p-1 rounded border transition-colors ${
              autoScroll ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-white/5 text-white/40 border-white/10'
            }`}
          >
            {autoScroll ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
          </button>

          <button
            onClick={handleCopyLogs}
            title="Copy logs to clipboard"
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
          </button>

          <button
            onClick={handleExportLogs}
            title="Export JSON logs"
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 transition-colors"
          >
            <Download className="w-2.5 h-2.5" />
          </button>

          {onClearLogs && (
            <button
              onClick={onClearLogs}
              title="Clear terminal"
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/40 hover:text-red-400 border border-white/10 transition-colors"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Sub-bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#0a0a0a]/60 border-b border-white/5 text-xs">
        <div className="flex items-center space-x-2">
          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-[#050505] border border-white/10 rounded px-2 py-0.5 text-[10px] text-white/80 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">ALL LEVELS</option>
            <option value="INFO">INFO</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="SECURITY">SECURITY</option>
          </select>

          {/* Agent Filter */}
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="bg-[#050505] border border-white/10 rounded px-2 py-0.5 text-[10px] text-white/80 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">ALL AGENTS</option>
            <option value="ORCHESTRATOR">Orchestrator</option>
            <option value="PLANNER">Planner</option>
            <option value="DEVELOPER">Developer</option>
            <option value="TESTER">Tester</option>
            <option value="REPAIR_AGENT">Repair Agent</option>
            <option value="SECURITY_ANALYZER">Security Analyzer</option>
            <option value="FINAL_EVALUATOR">Final Evaluator</option>
          </select>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-2.5 h-2.5 text-white/30 absolute left-2 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER LOGS..."
            className="pl-6 pr-2 py-0.5 bg-[#050505] border border-white/10 rounded text-[10px] text-white/90 placeholder-white/30 focus:outline-none focus:border-cyan-500 w-36 sm:w-48 font-mono uppercase"
          />
        </div>
      </div>

      {/* Terminal Log Output Stream */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 text-[11px] leading-relaxed select-text bg-[#050505]/95"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-white/30 italic py-8 text-center text-xs">
            NO STREAMING EVENTS CAPTURED
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isCodeWrite = log.message.includes('[Tool: writeFile]') || log.message.includes('Wrote') || log.message.includes('|');
            return (
              <div key={log.id} className="flex items-start space-x-2 group hover:bg-white/5 p-1.5 rounded transition-colors">
                {/* Timestamp */}
                <span className="text-white/40 text-[10px] select-none shrink-0 font-mono pt-0.5">
                  [{log.timestamp}]
                </span>

                {/* Agent Badge */}
                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold border shrink-0 ${getAgentColor(log.agent)}`}>
                  {log.agent}
                </span>

                {/* Message */}
                <div className="flex-1 min-w-0 font-mono">
                  {isCodeWrite && log.message.includes('\n') ? (
                    <div className="space-y-1">
                      <div className={`font-semibold ${getLevelColor(log.level)}`}>
                        {log.message.split('\n')[0]}
                      </div>
                      <pre className="p-2 rounded bg-black/60 border border-cyan-500/20 text-cyan-200/90 overflow-x-auto text-[10px] font-mono whitespace-pre leading-relaxed shadow-inner">
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
      <div className="h-7 px-3 bg-white/5 border-t border-white/5 text-[9px] text-white/40 flex items-center justify-between select-none">
        <span className="flex items-center space-x-1.5 text-green-400">
          <ShieldCheck className="w-3 h-3" />
          <span>SECRET_REDACTION :: ENFORCED (API Keys & JWTs Protected)</span>
        </span>
        <span>{filteredLogs.length} EVENTS STREAMED</span>
      </div>
    </div>
  );
}
