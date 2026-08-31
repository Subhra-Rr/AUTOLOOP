import React, { useState } from 'react';
import { 
  FileCode2, 
  FolderTree, 
  Copy, 
  Check, 
  Download, 
  GitCompare, 
  Sparkles, 
  Wrench, 
  CheckCircle2, 
  File, 
  Code,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ProjectFile, ProjectState } from '../types';

interface CodeViewerProps {
  project: ProjectState;
  activeFilePath: string;
  onSelectFile: (path: string) => void;
}

export function CodeViewer({ project, activeFilePath, onSelectFile }: CodeViewerProps) {
  const [viewMode, setViewMode] = useState<'CODE' | 'DIFF'>('CODE');
  const [copied, setCopied] = useState(false);
  const [mobileFileListOpen, setMobileFileListOpen] = useState(false);

  const currentFile = project.files.find((f) => f.path === activeFilePath) || project.files[0];

  // Find if there is a repair diff for this file
  const repairDiff = project.repairHistory.find(
    (r) => r.patchDiff && r.patchDiff.file === currentFile?.path
  )?.patchDiff;

  const handleCopy = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentFile) return;
    const blob = new Blob([currentFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full min-h-[500px]">
      {/* File Tree Explorer (Left col on desktop, collapsible on mobile) */}
      <div className="lg:col-span-1 rounded-lg bg-[#0a0a0a]/50 border border-white/10 p-3 space-y-3 flex flex-col">
        <div 
          onClick={() => setMobileFileListOpen(!mobileFileListOpen)}
          className="flex items-center justify-between pb-2 border-b border-white/10 cursor-pointer lg:cursor-default"
        >
          <div className="flex items-center space-x-2">
            <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-widest">
              FILES ({project.files.length})
            </span>
          </div>
          <div className="lg:hidden text-white/50 text-xs">
            {mobileFileListOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>

        {/* File List (Always visible on desktop, toggleable on mobile) */}
        <div className={`space-y-1 font-mono text-[11px] max-h-48 lg:max-h-none overflow-y-auto ${mobileFileListOpen ? 'block' : 'hidden lg:block'}`}>
          {project.files.length === 0 ? (
            <div className="text-white/30 text-xs italic py-2">No files synthesized yet</div>
          ) : (
            project.files.map((file) => {
              const isSelected = file.path === activeFilePath;
              const hasPatch = project.repairHistory.some(r => r.patchDiff?.file === file.path);

              return (
                <button
                  key={file.path}
                  onClick={() => {
                    onSelectFile(file.path);
                    setMobileFileListOpen(false);
                  }}
                  className={`w-full text-left p-1.5 rounded flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                      : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode2 className="w-3 h-3 shrink-0 text-white/30" />
                    <span className="truncate">{file.path}</span>
                  </div>
                  {hasPatch && (
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shrink-0">
                      PATCHED
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="p-2 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-white/40 space-y-1 hidden lg:block mt-auto">
          <div className="flex items-center justify-between text-white/70 font-semibold">
            <span>AST VALIDATOR</span>
            <CheckCircle2 className="w-3 h-3 text-green-400" />
          </div>
          <p className="text-[9px] text-white/30">
            Strict TypeScript compilation and syntax tree analysis active.
          </p>
        </div>
      </div>

      {/* Code / Diff Editor (Right 3 cols) */}
      <div className="lg:col-span-3 rounded-lg bg-black/40 border border-white/5 flex flex-col overflow-hidden shadow-2xl font-mono min-h-[420px] lg:min-h-[560px]">
        {/* Editor Title Bar */}
        <div className="min-h-9 py-1.5 flex flex-wrap items-center justify-between gap-2 px-3 bg-white/5 border-b border-white/5 select-none">
          <div className="flex items-center space-x-2 text-xs truncate max-w-full">
            <FileCode2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-bold text-white text-[11px] truncate">{currentFile?.path || 'Select a file'}</span>
            {currentFile && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 uppercase shrink-0">
                {currentFile.language}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5 shrink-0 ml-auto">
            {/* View Mode Toggle */}
            {repairDiff && (
              <div className="flex items-center bg-black/40 p-0.5 rounded border border-white/10 text-[10px]">
                <button
                  onClick={() => setViewMode('CODE')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    viewMode === 'CODE' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-white/40'
                  }`}
                >
                  <Code className="w-2.5 h-2.5 inline mr-1" />
                  <span>SRC</span>
                </button>
                <button
                  onClick={() => setViewMode('DIFF')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    viewMode === 'DIFF' ? 'bg-red-500/20 text-red-400 font-bold' : 'text-white/40'
                  }`}
                >
                  <GitCompare className="w-2.5 h-2.5 inline mr-1" />
                  <span>DIFF</span>
                </button>
              </div>
            )}

            <button
              onClick={handleCopy}
              className="p-1 sm:p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-1 sm:p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 transition-colors"
              title="Download file"
            >
              <Download className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Code / Diff Body */}
        <div className="flex-1 overflow-auto p-2 sm:p-3 text-[10px] sm:text-[11px] leading-relaxed select-text bg-[#050505]/95">
          {!currentFile ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <FileCode2 className="w-8 h-8 text-white/20 animate-pulse" />
              <p className="text-white/50 text-xs font-mono">
                Workspace initializing... Files will appear dynamically as the AI creates them in the container.
              </p>
            </div>
          ) : viewMode === 'DIFF' && repairDiff ? (
            <div className="space-y-3">
              <div className="p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="text-[11px]">
                    Automated Patch applied during <strong>Repair Cycle</strong>
                  </span>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                  VERIFIED PASSED
                </span>
              </div>

              {/* Before block */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-red-400 flex items-center space-x-1">
                  <span>- ORIGINAL (Before automated patch):</span>
                </span>
                <pre className="p-2.5 rounded bg-red-500/10 border border-red-500/20 text-red-300 overflow-x-auto whitespace-pre-wrap font-mono text-[10px] sm:text-[11px]">
                  {repairDiff.before}
                </pre>
              </div>

              {/* After block */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-green-400 flex items-center space-x-1">
                  <span>+ PATCHED (Repaired by AI):</span>
                </span>
                <pre className="p-2.5 rounded bg-green-500/10 border border-green-500/20 text-green-300 overflow-x-auto whitespace-pre-wrap font-mono text-[10px] sm:text-[11px]">
                  {repairDiff.after}
                </pre>
              </div>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              {currentFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="flex hover:bg-white/5 px-1 py-0.5 rounded">
                  <span className="text-white/30 select-none w-8 sm:w-10 text-right pr-2 sm:pr-4 text-[9px] sm:text-[10px] font-mono shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-white/80 flex-1 whitespace-pre font-mono">
                    {line || ' '}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor Status bar */}
        <div className="h-7 px-3 bg-white/5 border-t border-white/5 text-[9px] text-white/40 flex items-center justify-between select-none">
          <span className="truncate">{currentFile ? `UTF-8 • ${currentFile.language.toUpperCase()} • ${currentFile.content.split('\n').length} LINES` : 'EMPTY'}</span>
          <span className="text-cyan-400 truncate ml-2">ZERO_TRUST_SANDBOX</span>
        </div>
      </div>
    </div>
  );
}
