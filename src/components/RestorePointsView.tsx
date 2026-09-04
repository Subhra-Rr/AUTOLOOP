import React, { useState } from 'react';
import { 
  History, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  Plus, 
  Clock, 
  ShieldCheck, 
  Layers, 
  FileCode2, 
  Cpu, 
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { SystemStateSnapshot, ProjectState } from '../types';

interface RestorePointsViewProps {
  project: ProjectState;
  onRestoreSnapshot: (snapshot: SystemStateSnapshot) => void;
  onCreateSnapshot: () => void;
  onDeleteSnapshot: (snapshotId: string) => void;
  isTakingSnapshot?: boolean;
}

export function RestorePointsView({
  project,
  onRestoreSnapshot,
  onCreateSnapshot,
  onDeleteSnapshot,
  isTakingSnapshot = false
}: RestorePointsViewProps) {
  const [selectedSnapshot, setSelectedSnapshot] = useState<SystemStateSnapshot | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const snapshots = project.restorePoints || [];

  const filteredSnapshots = snapshots.filter((snap) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      snap.name.toLowerCase().includes(q) ||
      snap.stage.toLowerCase().includes(q) ||
      (snap.taskCode && snap.taskCode.toLowerCase().includes(q)) ||
      snap.summary.toLowerCase().includes(q)
    );
  });

  const handleCopyJson = (snapshot: SystemStateSnapshot) => {
    navigator.clipboard.writeText(snapshot.stateDumpJson);
    setCopiedId(snapshot.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSnapshot = (snapshot: SystemStateSnapshot) => {
    const blob = new Blob([snapshot.stateDumpJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autoloop-snapshot-${snapshot.stage}-${snapshot.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      {/* Control Action Bar */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/40 border border-white/10">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse" />
          <span className="text-[10px] text-white/70 font-semibold tracking-wider">
            AUTO-SNAPSHOT: ACTIVE (30s)
          </span>
        </div>

        <button
          type="button"
          onClick={onCreateSnapshot}
          disabled={isTakingSnapshot}
          title="Take manual System State snapshot immediately"
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg glass-button-primary text-black text-[10px] font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)] disabled:opacity-50 transition-all cursor-pointer"
        >
          {isTakingSnapshot ? (
            <>
              <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>DUMPING...</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>+ SNAPSHOT</span>
            </>
          )}
        </button>
      </div>

      {/* Filter / Search Bar */}
      {snapshots.length > 0 && (
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="FILTER RESTORE POINTS..."
          className="w-full px-3 py-1.5 rounded-lg glass-input text-[10px] text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-500 uppercase"
        />
      )}

      {/* Snapshot List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
        {filteredSnapshots.length === 0 ? (
          <div className="p-6 rounded-xl glass-card border border-white/10 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white/90">No Restore Points Yet</h4>
              <p className="text-[10px] text-white/50 leading-relaxed max-w-xs mx-auto">
                Periodic System State snapshots are taken automatically every 30s during autonomous execution, or you can capture one manually right now.
              </p>
            </div>
            <button
              onClick={onCreateSnapshot}
              disabled={isTakingSnapshot}
              className="px-3 py-1.5 rounded-lg glass-button-primary text-black text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              Take First Snapshot
            </button>
          </div>
        ) : (
          filteredSnapshots.map((snap) => {
            const isConfirming = confirmRestoreId === snap.id;

            return (
              <div
                key={snap.id}
                className="p-3 rounded-xl glass-card border border-white/10 hover:border-cyan-500/30 transition-all space-y-2 group"
              >
                {/* Header line */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      <span className="text-xs font-bold text-white/90 truncate">
                        {snap.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {snap.stage}
                      </span>
                      {snap.isAutomatic && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] uppercase bg-white/5 text-white/50 border border-white/10">
                          AUTO
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[9px] text-white/40">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{snap.timestamp}</span>
                      </span>
                      <span>•</span>
                      <span>Runtime: {formatTime(snap.elapsedSeconds)}</span>
                    </div>
                  </div>

                  {/* Top Action Icons */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedSnapshot(snap)}
                      title="Inspect full JSON dump"
                      className="p-1 rounded glass-button text-white/60 hover:text-cyan-300 border border-white/10"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyJson(snap)}
                      title="Copy JSON to clipboard"
                      className="p-1 rounded glass-button text-white/60 hover:text-white border border-white/10"
                    >
                      {copiedId === snap.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadSnapshot(snap)}
                      title="Download snapshot JSON"
                      className="p-1 rounded glass-button text-white/60 hover:text-white border border-white/10"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSnapshot(snap.id)}
                      title="Delete restore point"
                      className="p-1 rounded glass-button text-white/40 hover:text-red-400 border border-white/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Telemetry metadata tags */}
                <div className="grid grid-cols-3 gap-1.5 text-[9px] bg-black/30 p-1.5 rounded-lg border border-white/5">
                  <div className="flex items-center space-x-1 text-white/70">
                    <Layers className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{snap.completedTasks}/{snap.totalTasks} Done</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white/70">
                    <FileCode2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{snap.filesCount} Files</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white/70">
                    <Cpu className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                    <span className="truncate">{snap.tokensUsed} Tkn</span>
                  </div>
                </div>

                {/* Restore Confirmation or Button */}
                {isConfirming ? (
                  <div className="p-2 rounded-lg bg-red-950/40 border border-red-500/40 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center space-x-1 text-[10px] text-red-300 font-bold">
                      <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      <span>Revert system state to this snapshot?</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          onRestoreSnapshot(snap);
                          setConfirmRestoreId(null);
                        }}
                        className="flex-1 py-1 rounded bg-red-500/30 hover:bg-red-500/50 text-red-200 border border-red-500/50 text-[10px] font-bold transition-all shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                      >
                        CONFIRM RESTORE
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmRestoreId(null)}
                        className="px-2.5 py-1 rounded glass-button text-white/70 text-[10px] border border-white/10"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmRestoreId(snap.id)}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold transition-all group-hover:border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>RESTORE TO THIS POINT</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* JSON Dump Inspector Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between glass-panel-subtle select-none">
              <div className="flex items-center space-x-2 min-w-0">
                <History className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                    SYSTEM STATE JSON DUMP: {selectedSnapshot.name}
                  </h3>
                  <span className="text-[10px] text-white/50">
                    Captured at {selectedSnapshot.timestamp} • Stage: {selectedSnapshot.stage} • Size: {(new Blob([selectedSnapshot.stateDumpJson]).size / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSnapshot(null)}
                className="p-1.5 rounded-lg glass-button text-white/60 hover:text-white border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content - JSON Code Block */}
            <div className="flex-1 overflow-y-auto p-4 bg-black/70">
              <pre className="text-[10px] sm:text-[11px] font-mono text-cyan-200/90 whitespace-pre-wrap leading-relaxed select-text">
                {selectedSnapshot.stateDumpJson}
              </pre>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 sm:p-4 border-t border-white/10 flex items-center justify-between glass-panel-subtle gap-2">
              <span className="text-[10px] text-white/50 hidden sm:inline">
                Full valid ProjectState snapshot ready for reproduction or audit
              </span>
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleCopyJson(selectedSnapshot)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg glass-button text-white/80 hover:text-white border border-white/10 text-xs transition-all"
                >
                  {copiedId === selectedSnapshot.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY JSON</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadSnapshot(selectedSnapshot)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg glass-button text-white/80 hover:text-white border border-white/10 text-xs transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRestoreSnapshot(selectedSnapshot);
                    setSelectedSnapshot(null);
                  }}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg glass-button-primary text-black font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESTORE NOW</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
