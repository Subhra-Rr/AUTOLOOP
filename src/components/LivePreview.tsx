import React, { useState, useRef, useEffect } from 'react';
import { 
  ExternalLink, 
  RotateCw, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  Sparkles, 
  FileCode, 
  AlertCircle,
  Play,
  CheckCircle2
} from 'lucide-react';
import { ProjectState } from '../types';

interface LivePreviewProps {
  project: ProjectState;
}

export function LivePreview({ project }: LivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showHtmlSource, setShowHtmlSource] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const previewUrl = `/api/projects/${project.projectId}/preview`;
  
  // Find index.html or main html file
  const htmlFile = project.files.find(f => f.path === 'index.html' || f.path.endsWith('.html') || f.path === 'public/index.html');
  const hasFiles = project.files.length > 0;
  const isReady = hasFiles && (htmlFile !== undefined || project.status === 'COMPLETED');

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(Date.now());
  };

  const handleOpenNewTab = () => {
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col rounded-lg bg-[#070707] border border-white/10 shadow-2xl overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'h-[680px]'
      }`}
    >
      {/* Top Browser Chrome Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0e0e0e] border-b border-white/10 shrink-0">
        {/* Left: Window controls & Mode */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          
          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center space-x-1.5 text-xs font-mono">
            <span className="text-white/40 text-[11px] uppercase tracking-wider hidden sm:inline">ARTIFACT:</span>
            <span className="text-cyan-400 font-bold text-xs truncate max-w-[200px]">
              {project.name || 'Application Preview'}
            </span>
          </div>
        </div>

        {/* Middle: Simulated Address Bar */}
        <div className="flex-1 max-w-md hidden md:flex items-center px-3 py-1 rounded bg-[#030303] border border-white/10 text-[11px] font-mono text-white/70">
          <ShieldCheck className="w-3 h-3 text-green-400 mr-2 shrink-0" />
          <span className="text-white/30 mr-1">https://autoloop.sandbox</span>
          <span className="text-cyan-300 truncate">{previewUrl}</span>
          {isReady && (
            <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-green-500/20 text-green-400 border border-green-500/30">
              LIVE
            </span>
          )}
        </div>

        {/* Right: Viewport Mode Switcher & Actions */}
        <div className="flex items-center space-x-2">
          {/* Device Toggles */}
          <div className="flex items-center rounded bg-black/60 border border-white/10 p-0.5">
            <button
              onClick={() => setDeviceMode('desktop')}
              title="Desktop View (100%)"
              className={`p-1 rounded transition-colors ${
                deviceMode === 'desktop' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-white/40 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              title="Tablet View (768px)"
              className={`p-1 rounded transition-colors ${
                deviceMode === 'tablet' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-white/40 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              title="Mobile View (375px)"
              className={`p-1 rounded transition-colors ${
                deviceMode === 'mobile' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-white/40 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* HTML Source Toggle */}
          {htmlFile && (
            <button
              onClick={() => setShowHtmlSource(!showHtmlSource)}
              title="View Entry HTML"
              className={`p-1.5 rounded border text-xs font-mono transition-colors ${
                showHtmlSource 
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Reload Button */}
          <button
            onClick={handleRefresh}
            title="Reload Application Preview"
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors hidden sm:block"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Open in New Window */}
          <button
            onClick={handleOpenNewTab}
            title="Open Live App in Dedicated Tab"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OPEN IN NEW TAB</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Content Area */}
      <div className="flex-1 bg-[#050505] p-2 sm:p-4 flex items-center justify-center overflow-auto relative">
        {showHtmlSource && htmlFile ? (
          <div className="w-full h-full p-4 rounded bg-[#0a0a0a] border border-white/10 overflow-auto font-mono text-xs text-white/80">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10 text-white/40">
              <span>SOURCE: {htmlFile.path}</span>
              <button 
                onClick={() => setShowHtmlSource(false)}
                className="text-cyan-400 hover:underline"
              >
                Back to Live View
              </button>
            </div>
            <pre className="whitespace-pre-wrap">{htmlFile.content}</pre>
          </div>
        ) : isReady ? (
          <div 
            className={`h-full bg-white rounded shadow-2xl transition-all duration-300 overflow-hidden relative border border-white/20 ${
              deviceMode === 'desktop' 
                ? 'w-full' 
                : deviceMode === 'tablet' 
                ? 'w-[768px] max-w-full' 
                : 'w-[375px] max-w-full'
            }`}
          >
            <iframe
              key={iframeKey}
              src={previewUrl}
              title="Generated Real Web Application"
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-[#070707]/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-10">
                <RotateCw className="w-6 h-6 text-cyan-400 animate-spin" />
                <span className="text-xs font-mono text-white/70">Connecting to Real Workspace Sandbox...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-md p-6 rounded-lg bg-[#0a0a0a] border border-white/10 text-center space-y-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-mono font-bold text-white">
                Synthesizing Web Application Artifacts...
              </h3>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                The autonomous agent is generating real source files into the isolated disk workspace (<code className="text-cyan-400">.workspaces/{project.projectId}</code>).
              </p>
            </div>
            <div className="p-3 rounded bg-black/50 border border-white/5 text-[11px] font-mono text-left space-y-1">
              <div className="flex justify-between text-white/40">
                <span>PROJECT ROOT:</span>
                <span className="text-white/70 truncate max-w-[200px]">{project.originalUserPrompt}</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>FILES ON DISK:</span>
                <span className="text-cyan-400 font-bold">{project.files.length} files</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>ACTIVE PHASE:</span>
                <span className="text-yellow-400 font-bold">{project.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="px-4 py-1.5 bg-[#0e0e0e] border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] font-mono text-white/40 shrink-0">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
            <span className={isReady ? 'text-green-400 font-bold' : 'text-yellow-400'}>
              {isReady ? 'RUNTIME: ONLINE & RESPONSIVE' : 'RUNTIME: COMPILING ARTIFACTS'}
            </span>
          </span>
          <span>•</span>
          <span>WORKSPACE: {project.files.length} REAL FILES</span>
        </div>

        <div className="flex items-center space-x-3">
          <span>PORT: 3000 (SANDBOX PROXY)</span>
          <span>•</span>
          <span>SANDBOX ISOLATION: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
