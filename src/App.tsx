import React, { useState, useEffect, useRef } from 'react';
import { 
  ProjectState, 
  AutonomyMode, 
  PipelineNodeId, 
  HumanInterventionRequest 
} from './types';
import { Navbar, ActiveTabType } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PipelineGraph } from './components/PipelineGraph';
import { TaskHierarchy } from './components/TaskHierarchy';
import { LiveTerminal } from './components/LiveTerminal';
import { CodeViewer } from './components/CodeViewer';
import { LivePreview } from './components/LivePreview';
import { TestRepairHub } from './components/TestRepairHub';
import { SecurityCenter } from './components/SecurityCenter';
import { EvaluationMetrics } from './components/EvaluationMetrics';
import { DefinitionOfDone } from './components/DefinitionOfDone';
import { CompletionReportModal } from './components/CompletionReportModal';
import { HumanInterventionModal } from './components/HumanInterventionModal';

export function App() {
  const [project, setProject] = useState<ProjectState | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('workspace');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeFilePath, setActiveFilePath] = useState<string>('src/index.js');
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [pendingIntervention, setPendingIntervention] = useState<HumanInterventionRequest | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Step runner loop
  const executeStep = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Step execution failed');
      }
      
      if (data.project) {
        setProject(data.project);
        if (data.project.activeFilePath) {
          setActiveFilePath(data.project.activeFilePath);
        } else if (data.project.files.length > 0 && !data.project.files.some((f: any) => f.path === activeFilePath)) {
          setActiveFilePath(data.project.files[0].path);
        }
      }

      if (data.blocked) {
        setIsRunning(false);
        setGlobalError(data.error || 'Autonomous execution paused due to error.');
      } else if (data.done) {
        setIsRunning(false);
        setShowCompletionModal(true);
      }
    } catch (err: any) {
      console.error('Autonomous step error:', err);
      setIsRunning(false);
      setGlobalError(err?.message || 'Autonomous step execution failed');
    }
  };

  // Autonomous continuous loop effect
  useEffect(() => {
    if (isRunning && project && project.status !== 'COMPLETED' && project.status !== 'PAUSED' && project.status !== 'BLOCKED') {
      loopTimerRef.current = setTimeout(() => {
        executeStep(project.projectId);
      }, 1400);
    } else {
      if (loopTimerRef.current) {
        clearTimeout(loopTimerRef.current);
        loopTimerRef.current = null;
      }
    }

    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [isRunning, project]);

  // Project creator handler
  const handleStartBuild = async (prompt: string, mode: AutonomyMode) => {
    setGlobalError(null);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode, isLiveGemini: true })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create autonomous project');
      }
      if (data.project) {
        setProject(data.project);
        setActiveTab('workspace');
        if (data.project.files?.length > 0) {
          setActiveFilePath(data.project.files[0].path);
        }
        setIsRunning(data.project.status !== 'BLOCKED' && data.project.status !== 'COMPLETED');
      }
    } catch (err: any) {
      console.error('Build init error:', err);
      setGlobalError(err?.message || 'Failed to initialize real AI project');
    }
  };

  const handlePause = async () => {
    if (!project) return;
    setIsRunning(false);
    try {
      const res = await fetch(`/api/projects/${project.projectId}/pause`, { method: 'POST' });
      const data = await res.json();
      if (data.project) setProject(data.project);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResume = async () => {
    if (!project) return;
    setIsRunning(true);
    try {
      const res = await fetch(`/api/projects/${project.projectId}/resume`, { method: 'POST' });
      const data = await res.json();
      if (data.project) setProject(data.project);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAbort = async () => {
    if (!project) return;
    setIsRunning(false);
    try {
      const res = await fetch(`/api/projects/${project.projectId}/abort`, { method: 'POST' });
      const data = await res.json();
      if (data.project) setProject(data.project);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setProject(null);
    setShowCompletionModal(false);
    setActiveTab('workspace');
  };

  const handleSelectNode = (nodeId: PipelineNodeId) => {
    if (nodeId === 'REPAIR') {
      setActiveTab('repair');
    } else if (nodeId === 'VERIFY') {
      setActiveTab('dod');
    } else if (nodeId === 'EVALUATE') {
      setActiveTab('evaluation');
    } else if (nodeId === 'EXECUTE') {
      setActiveTab('code');
    } else {
      setActiveTab('workspace');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col selection:bg-cyan-500 selection:text-black relative">
      {/* Immersive background glow layer */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.06),transparent_50%)] pointer-events-none z-0" />

      <Navbar
        project={project}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isRunning={isRunning}
        onToggleRun={() => setIsRunning(!isRunning)}
        onPause={handlePause}
        onResume={handleResume}
        onAbort={handleAbort}
        onReset={handleReset}
      />

      {/* Global Real Error Alert Banner */}
      {globalError && (
        <div className="bg-red-500/15 border-b border-red-500/30 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-red-300 z-50">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span className="font-bold uppercase">[SYSTEM_ERROR]:</span>
            <span>{globalError}</span>
          </div>
          <button 
            onClick={() => setGlobalError(null)}
            className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 text-[10px]"
          >
            DISMISS
          </button>
        </div>
      )}

      {!project ? (
        <LandingPage onStartBuild={handleStartBuild} />
      ) : (
        <main className="flex-1 p-3 sm:p-4 lg:p-6 max-w-[1700px] w-full mx-auto space-y-4 sm:space-y-6 relative z-10">
          {/* Always Visible Pipeline Node Graph on Workspace Tab */}
          <PipelineGraph project={project} onSelectNode={handleSelectNode} />

          {/* Tab Views */}
          {activeTab === 'preview' && (
            <LivePreview project={project} />
          )}

          {activeTab === 'workspace' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
              {/* Left Task Hierarchy (5 cols) */}
              <div className="lg:col-span-5 h-[420px] sm:h-[480px] lg:h-[640px]">
                <TaskHierarchy
                  project={project}
                  selectedTaskId={selectedTaskId}
                  onSelectTask={(id) => {
                    setSelectedTaskId(id);
                    const t = project.tasks.find(x => x.id === id);
                    if (t?.code === 'TASK-008') setActiveTab('repair');
                  }}
                />
              </div>

              {/* Right Live Terminal Stream (7 cols) */}
              <div className="lg:col-span-7 h-[420px] sm:h-[480px] lg:h-[640px]">
                <LiveTerminal
                  logs={project.terminalLogs}
                  onClearLogs={() => {
                    setProject(prev => prev ? { ...prev, terminalLogs: [] } : null);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="min-h-[500px] lg:h-[720px]">
              <CodeViewer
                project={project}
                activeFilePath={activeFilePath}
                onSelectFile={setActiveFilePath}
              />
            </div>
          )}

          {activeTab === 'repair' && (
            <TestRepairHub project={project} />
          )}

          {activeTab === 'security' && (
            <SecurityCenter project={project} />
          )}

          {activeTab === 'evaluation' && (
            <EvaluationMetrics project={project} />
          )}

          {activeTab === 'dod' && (
            <DefinitionOfDone project={project} />
          )}
        </main>
      )}

      {/* Immersive UI Persistent Footer */}
      <footer className="py-2 bg-[#0a0a0a] border-t border-white/10 flex flex-col sm:flex-row items-center px-4 justify-between gap-2 text-[10px] font-mono text-white/50 shrink-0 z-40">
        <div className="flex items-center space-x-3">
          <span className="text-cyan-400 font-semibold uppercase tracking-wider">AUTOLOOP v2.4.0</span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden sm:inline text-white/40">ZERO-TRUST SECURE SANDBOX</span>
        </div>
        <div className="text-center text-white/70 font-sans text-xs">
          Copyright © 2026 by Subhradeet Sabat | All Rights Reserved.
        </div>
        <div className="flex items-center space-x-1.5 text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)] animate-pulse" />
          <span className="font-bold">SYSTEM_NOMINAL</span>
        </div>
      </footer>

      {/* Completion Celebration Modal */}
      {project && (
        <CompletionReportModal
          project={project}
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          onRestart={handleReset}
          onViewLivePreview={() => setActiveTab('preview')}
        />
      )}

      {/* Human Intervention Approval Modal */}
      <HumanInterventionModal
        request={pendingIntervention}
        onApprove={(id) => {
          setPendingIntervention(null);
          setIsRunning(true);
        }}
        onReject={(id) => {
          setPendingIntervention(null);
        }}
      />
    </div>
  );
}

export default App;
