import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Sparkles, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  ExternalLink, 
  Code2, 
  FileCheck2,
  X,
  Play,
  Layers
} from 'lucide-react';
import { ProjectState } from '../types';

interface CompletionReportModalProps {
  project: ProjectState;
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onViewLivePreview?: () => void;
}

export function CompletionReportModal({
  project,
  isOpen,
  onClose,
  onRestart,
  onViewLivePreview
}: CompletionReportModalProps) {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const passedDodCount = project.definitionOfDone.filter(d => d.status === 'PASSED').length;
  const totalDodCount = project.definitionOfDone.length;
  const hasTests = project.testCases.length > 0;
  const previewUrl = `/api/projects/${project.projectId}/preview`;

  const handleExportFullReport = () => {
    const report = {
      project: project.name,
      objective: project.originalUserPrompt,
      status: project.status,
      completedAt: project.completedAt,
      elapsedSeconds: project.elapsedSeconds,
      tokensUsed: project.tokensUsed,
      computeSeconds: project.computeSeconds,
      metrics: project.metrics,
      evaluation: project.evaluation,
      definitionOfDone: project.definitionOfDone,
      repairCycles: project.repairHistory,
      auditLogs: project.auditLogs,
      filesGenerated: project.files.map(f => ({ path: f.path, lines: f.content ? f.content.split('\n').length : 0 }))
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
                <span>AUTONOMOUS BUILD COMPLETE</span>
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

        {/* Real User Prompt Objective Quote */}
        <div className="p-3 rounded-lg bg-black/50 border border-white/5 space-y-1">
          <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider">
            USER OBJECTIVE REALIZED:
          </div>
          <p className="text-xs text-white/90 font-sans italic">
            "{project.originalUserPrompt}"
          </p>
        </div>

        {/* Executive Summary Real Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-center">
            <span className="text-[9px] text-white/40 uppercase tracking-wider">TASKS COMPLETED</span>
            <p className="text-base font-bold text-white mt-0.5">
              {project.metrics.completedTasks}/{project.tasks.length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-center">
            <span className="text-[9px] text-white/40 uppercase tracking-wider">FILES ON DISK</span>
            <p className="text-base font-bold text-cyan-400 mt-0.5">
              {project.files.length} Files
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-center">
            <span className="text-[9px] text-white/40 uppercase tracking-wider">TEST RUNNER</span>
            <p className="text-base font-bold text-green-400 mt-0.5">
              {hasTests ? `${project.metrics.passingTests}/${project.testCases.length}` : 'Syntax OK'}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-center">
            <span className="text-[9px] text-white/40 uppercase tracking-wider">DOD GATES</span>
            <p className="text-base font-bold text-blue-400 mt-0.5">
              {passedDodCount}/{totalDodCount} Passed
            </p>
          </div>
        </div>

        {/* Real Live Artifact Callout */}
        <div className="p-3.5 rounded-lg bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-cyan-400">
              <Play className="w-3.5 h-3.5" />
              <span>LIVE APPLICATION ARTIFACT READY</span>
            </div>
            <p className="text-[11px] text-white/60">
              The real application is compiled and serving on the sandbox proxy.
            </p>
          </div>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>OPEN LIVE APP</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <button
            onClick={handleExportFullReport}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-3.5 py-2 rounded bg-white/5 hover:bg-white/10 text-white/80 text-xs font-semibold border border-white/10 transition-colors font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT JSON REPORT</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                if (onViewLivePreview) onViewLivePreview();
              }}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors font-mono"
            >
              VIEW LIVE PREVIEW
            </button>
            <button
              onClick={onRestart}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all font-mono"
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
