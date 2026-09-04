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
  ChevronRight,
  Search,
  WrapText,
  FileCheck2
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
  const [searchTerm, setSearchTerm] = useState('');
  const [wrapLines, setWrapLines] = useState(false);

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

  // Basic syntax coloring helper
  const renderHighlightedLine = (line: string) => {
    if (!line) return ' ';

    // Search term highlight
    if (searchTerm.trim()) {
      const parts = line.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
      return parts.map((part, i) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={i} className="bg-yellow-500/40 text-yellow-200 px-0.5 rounded font-bold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      );
    }

    // Keyword & tag coloring cues
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      return <span className="text-zinc-500 italic">{line}</span>;
    }
    if (line.includes('function ') || line.includes('const ') || line.includes('let ') || line.includes('export ') || line.includes('import ')) {
      return (
        <span>
          {line.split(/(function|const|let|var|export|import|from|return|if|else|async|await)/g).map((chunk, idx) => {
            if (['function', 'const', 'let', 'var', 'export', 'import', 'from', 'return', 'if', 'else', 'async', 'await'].includes(chunk)) {
              return <span key={idx} className="text-cyan-400 font-semibold">{chunk}</span>;
            }
            if (chunk.includes('"') || chunk.includes("'") || chunk.includes('`')) {
              return <span key={idx} className="text-emerald-300">{chunk}</span>;
            }
            return <span key={idx} className="text-zinc-200">{chunk}</span>;
          })}
        </span>
      );
    }
    if (line.includes('<') && line.includes('>')) {
      return <span className="text-amber-200/90">{line}</span>;
    }

    return <span className="text-zinc-200">{line}</span>;
  };

  const lines = currentFile ? currentFile.content.split('\n') : [];
  const matchCount = searchTerm.trim() 
    ? lines.filter(l => l.toLowerCase().includes(searchTerm.toLowerCase())).length 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full min-h-[500px]">
      {/* File Tree Explorer (Left col on desktop, collapsible on mobile) */}
      <div className="lg:col-span-1 rounded-2xl glass-panel border border-white/10 p-4 space-y-3 flex flex-col shadow-2xl backdrop-blur-2xl">
        <div 
          onClick={() => setMobileFileListOpen(!mobileFileListOpen)}
          className="flex items-center justify-between pb-2.5 border-b border-white/10 cursor-pointer lg:cursor-default"
        >
          <div className="flex items-center space-x-2">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-white/80 uppercase tracking-widest">
              FILES ({project.files.length})
            </span>
          </div>
          <div className="lg:hidden text-white/50 text-xs">
            {mobileFileListOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>

        {/* File List (Always visible on desktop, toggleable on mobile) */}
        <div className={`space-y-1.5 font-mono text-[11px] max-h-48 lg:max-h-none overflow-y-auto ${mobileFileListOpen ? 'block' : 'hidden lg:block'}`}>
          {project.files.length === 0 ? (
            <div className="text-white/40 text-xs italic py-2">No files synthesized yet</div>
          ) : (
            project.files.map((file) => {
              const isSelected = file.path === activeFilePath;
              const hasPatch = project.repairHistory.some(r => r.patchDiff?.file === file.path);
              const lineCount = file.content.split('\n').length;

              return (
                <button
                  key={file.path}
                  onClick={() => {
                    onSelectFile(file.path);
                    setMobileFileListOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-all ${
                    isSelected
                      ? 'glass-card-active text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'text-white/50 hover:text-white glass-button border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode2 className="w-3.5 h-3.5 shrink-0 text-white/40" />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-[9px] text-white/40 font-mono">
                      {lineCount}L
                    </span>
                    {hasPatch && (
                      <span className="px-1.5 py-0.2 rounded-md text-[8px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                        PATCHED
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="p-3 rounded-xl glass-card border border-white/10 text-[10px] font-mono text-white/50 space-y-1.5 hidden lg:block mt-auto">
          <div className="flex items-center justify-between text-white/80 font-bold">
            <span>REAL DISK FILES</span>
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-[9px] text-white/40 leading-relaxed">
            Written directly to isolated sandbox disk storage.
          </p>
        </div>
      </div>

      {/* Code / Diff Editor (Right 3 cols) */}
      <div className="lg:col-span-3 rounded-2xl glass-panel border border-white/10 flex flex-col overflow-hidden shadow-2xl font-mono min-h-[420px] lg:min-h-[560px] backdrop-blur-2xl">
        {/* Editor Title Bar */}
        <div className="min-h-10 py-2 flex flex-wrap items-center justify-between gap-2 px-4 glass-panel-subtle border-b border-white/10 select-none">
          <div className="flex items-center space-x-2 text-xs truncate max-w-full">
            <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-bold text-white text-[11px] truncate">{currentFile?.path || 'Select a file'}</span>
            {currentFile && (
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/10 text-white/70 uppercase shrink-0 border border-white/10">
                {currentFile.language} ({lines.length} lines)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5 shrink-0 ml-auto">
            {/* Quick Search */}
            <div className="relative flex items-center">
              <Search className="w-3 h-3 text-white/40 absolute left-2 pointer-events-none" />
              <input
                id="codeSearchInput"
                name="codeSearch"
                aria-label="Find in file"
                autoComplete="off"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find in file..."
                className="pl-6 pr-2 py-1 glass-input rounded-lg text-[10px] text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-24 sm:w-32"
              />
              {searchTerm.trim() && (
                <span className="ml-1 text-[9px] text-cyan-300 font-mono font-semibold">
                  {matchCount} found
                </span>
              )}
            </div>

            {/* Line wrap toggle */}
            <button
              onClick={() => setWrapLines(!wrapLines)}
              className={`p-1.5 rounded-lg border transition-all ${
                wrapLines ? 'glass-card-active text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]' : 'glass-button text-white/50 border-white/10 hover:text-white'
              }`}
              title="Toggle Line Wrap"
            >
              <WrapText className="w-3.5 h-3.5" />
            </button>

            {/* View Mode Toggle */}
            {repairDiff && (
              <div className="flex items-center glass-card p-0.5 rounded-lg border border-white/10 text-[10px]">
                <button
                  onClick={() => setViewMode('CODE')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    viewMode === 'CODE' ? 'glass-card-active text-cyan-300 font-bold' : 'text-white/50'
                  }`}
                >
                  <Code className="w-3 h-3 inline mr-1" />
                  <span>SRC</span>
                </button>
                <button
                  onClick={() => setViewMode('DIFF')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    viewMode === 'DIFF' ? 'bg-red-500/20 text-red-300 font-bold' : 'text-white/50'
                  }`}
                >
                  <GitCompare className="w-3 h-3 inline mr-1" />
                  <span>DIFF</span>
                </button>
              </div>
            )}

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg glass-button text-white/70 hover:text-white border border-white/10 transition-all"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg glass-button text-white/70 hover:text-white border border-white/10 transition-all"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Code / Diff Body */}
        <div className="flex-1 overflow-auto p-3 text-[10px] sm:text-[11px] leading-relaxed select-text bg-black/40 backdrop-blur-md">
          {!currentFile ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <FileCode2 className="w-10 h-10 text-cyan-400/40 animate-pulse" />
              <p className="text-white/50 text-xs font-mono max-w-sm">
                Workspace initializing... Files will appear dynamically as the AI creates them in the container.
              </p>
            </div>
          ) : viewMode === 'DIFF' && repairDiff ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex flex-wrap items-center justify-between gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-[11px]">
                    Automated Patch applied during <strong>Repair Cycle</strong>
                  </span>
                </div>
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  VERIFIED PASSED
                </span>
              </div>

              {/* Before block */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-red-400 flex items-center space-x-1">
                  <span>- ORIGINAL (Before automated patch):</span>
                </span>
                <pre className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 overflow-x-auto whitespace-pre-wrap font-mono text-[10px] sm:text-[11px]">
                  {repairDiff.before}
                </pre>
              </div>

              {/* After block */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1">
                  <span>+ PATCHED (Repaired by AI):</span>
                </span>
                <pre className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 overflow-x-auto whitespace-pre-wrap font-mono text-[10px] sm:text-[11px]">
                  {repairDiff.after}
                </pre>
              </div>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              {lines.map((line, idx) => (
                <div key={idx} className="flex hover:bg-white/5 px-1.5 py-0.5 rounded-md group">
                  <span className="text-white/30 select-none w-8 sm:w-10 text-right pr-2 sm:pr-4 text-[9px] sm:text-[10px] font-mono shrink-0 group-hover:text-cyan-400/80">
                    {idx + 1}
                  </span>
                  <span className={`text-white/90 flex-1 font-mono ${wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'}`}>
                    {renderHighlightedLine(line)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor Status bar */}
        <div className="h-8 px-4 glass-panel-subtle border-t border-white/10 text-[9px] text-white/50 flex items-center justify-between select-none">
          <span className="truncate font-semibold">{currentFile ? `UTF-8 • ${currentFile.language.toUpperCase()} • ${lines.length} LINES • ${Math.round(currentFile.content.length / 1024 * 10) / 10} KB` : 'EMPTY'}</span>
          <span className="text-cyan-300 font-bold truncate ml-2">ZERO_TRUST_SANDBOX</span>
        </div>
      </div>
    </div>
  );
}

