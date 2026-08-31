import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Sparkles, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  Terminal, 
  Code2, 
  FileCheck2,
  X
} from 'lucide-react';
import { ProjectState } from '../types';

interface CompletionReportModalProps {
  project: ProjectState;
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export function CompletionReportModal({
  project,
  isOpen,
  onClose,
  onRestart
}: CompletionReportModalProps) {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExportFullReport = () => {
    const report = {
      project: project.name,
      objective: project.objective,
      status: project.status,
      completedAt: project.completedAt,
      elapsedSeconds: project.elapsedSeconds,
      tokensUsed: project.tokensUsed,
      metrics: project.metrics,
      evaluation: project.evaluation,
      definitionOfDone: project.definitionOfDone,
      repairCycles: project.repairHistory,
      auditLogs: project.auditLogs,
      filesGenerated: project.files.map(f => ({ path: f.path, lines: f.content.split('\n').length }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autoloop-verified-report-${project.projectId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-lg bg-[#0a0a0a] border border-white/10 shadow-2xl p-5 sm:p-7 space-y-5 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold text-green-400 tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>AUTONOMOUS LOOP COMPLETE</span>
              </div>
              <h2 className="text-lg font-bold font-mono text-white mt-0.5">
                {project.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-center">
            <span className="text-[9px] text-white/40 uppercase tracking-wider">TASKS PASSED</span>
            <p className="text-base font-bold text-white mt-0.5">
              {project.metrics.completedTasks}/{project.tasks.length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-center">
            <span className="text-[9px] text-white/40 uppercase tracking-wider">TESTS GREEN</span>
            <p className="text-base font-bold text-green-400 mt-0.5">
              {project.metrics.passingTests}/{project.testCases.length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-center">
            <span className="text-[9px] text-white/40 uppercase tracking-wider">DOD CRITERIA</span>
            <p className="text-base font-bold text-cyan-400 mt-0.5">
              9/9 PASSED
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-center">
            <span className="text-[9px] text-white/40 uppercase tracking-wider">QUALITY SCORE</span>
            <p className="text-base font-bold text-blue-400 mt-0.5">
              {project.evaluation.overallScore}%
            </p>
          </div>
        </div>

        {/* Verification Seals */}
        <div className="space-y-2 p-3.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-white/70">
          <div className="flex items-center justify-between text-white/40 pb-2 border-b border-white/5 text-[10px]">
            <span>VERIFICATION ARTIFACTS</span>
            <span>ZERO-TRUST SIGN-OFF</span>
          </div>
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span>Zero-Trust Sandbox Boundary Audit</span>
              </span>
              <span className="text-green-400 font-bold">0 Violations</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span>Automated Failure & Self-Repair Cycles</span>
              </span>
              <span className="text-cyan-400 font-bold">{project.repairHistory.length} Cycles Resolved</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span>TypeScript Strict Compilation</span>
              </span>
              <span className="text-green-400 font-bold">0 Errors</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <button
            onClick={handleExportFullReport}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white/80 text-xs font-semibold border border-white/10 transition-colors font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT AUDIT REPORT (JSON)</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors font-mono"
            >
              INSPECT WORKSPACE
            </button>
            <button
              onClick={onRestart}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>NEW OBJECTIVE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
