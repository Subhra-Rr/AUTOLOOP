import React, { useState, useEffect, useRef } from 'react';
import { 
  ProjectState, 
  AutonomyMode, 
  PipelineNodeId, 
  HumanInterventionRequest,
  SystemStateSnapshot 
} from './types';
import { createClientProjectState, executeClientStep } from './services/clientOrchestrator';
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

// Safe API JSON Fetcher helper that never crashes with Unexpected token '<'
async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<{ ok: boolean; data: T; error?: string }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, data, error: data?.error || `Server responded with status ${res.status}` };
      }
      return { ok: true, data };
    } else {
      // Non-JSON response received (e.g. HTML error page or fallback)
      const text = await res.text();
      const cleanMsg = res.ok 
        ? 'Received non-JSON response from server' 
        : `Server Error (${res.status}): ${text.slice(0, 120)}`;
      return { ok: false, data: {} as T, error: cleanMsg };
    }
  } catch (err: any) {
    return { ok: false, data: {} as T, error: err?.message || 'Network communication error' };
  }
}

export function App() {
  const [project, setProject] = useState<ProjectState | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('workspace');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeFilePath, setActiveFilePath] = useState<string>('src/index.js');
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [pendingIntervention, setPendingIntervention] = useState<HumanInterventionRequest | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isTakingSnapshot, setIsTakingSnapshot] = useState<boolean>(false);
  const [restoreToast, setRestoreToast] = useState<string | null>(null);
  const [isStartingBuild, setIsStartingBuild] = useState<boolean>(false);

  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isClientModeRef = useRef<boolean>(false);

  // Step runner loop
  const executeStep = async (projectId: string) => {
    if (isClientModeRef.current && project) {
      const { project: nextProject, done } = executeClientStep(project);
      setProject(nextProject);
      if (nextProject.activeFilePath) {
        setActiveFilePath(nextProject.activeFilePath);
      }
      if (done) {
        setIsRunning(false);
        setShowCompletionModal(true);
      }
      return;
    }

    const result = await safeFetchJson<any>(`/api/projects/${projectId}/step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!result.ok) {
      console.warn('Autonomous server step warning, failing over to client engine:', result.error);
      if (project) {
        isClientModeRef.current = true;
        const { project: nextProject, done } = executeClientStep(project);
        setProject(nextProject);
        if (done) {
          setIsRunning(false);
          setShowCompletionModal(true);
        }
        return;
      }
      setIsRunning(false);
      setGlobalError(result.error || 'Autonomous step execution failed');
      return;
    }

    const data = result.data;
    if (data.project) {
      setProject(data.project);
      if (data.project.activeFilePath) {
        setActiveFilePath(data.project.activeFilePath);
      } else if (data.project.files?.length > 0 && !data.project.files.some((f: any) => f.path === activeFilePath)) {
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

  // Project creator handler with zero-fail hybrid backend & client-engine fallback
  const handleStartBuild = async (prompt: string, mode: AutonomyMode) => {
    setGlobalError(null);
    setIsStartingBuild(true);
    try {
      const result = await safeFetchJson<any>('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode, isLiveGemini: true })
      });

      if (result.ok && result.data?.project) {
        isClientModeRef.current = false;
        setProject(result.data.project);
        setActiveTab('workspace');
        if (result.data.project.files?.length > 0) {
          setActiveFilePath(result.data.project.files[0].path);
        }
        setIsRunning(result.data.project.status !== 'BLOCKED' && result.data.project.status !== 'COMPLETED');
      } else {
        // Backend returned 405 (Method Not Allowed / static CDN / shared preview) or 404/500
        console.warn('Backend server returned non-OK or 405, starting in-browser Autonomous Engine:', result.error);
        isClientModeRef.current = true;
        const clientProject = createClientProjectState(prompt, mode);
        setProject(clientProject);
        setActiveTab('workspace');
        if (clientProject.files?.length > 0) {
          setActiveFilePath(clientProject.files[0].path);
        }
        setIsRunning(true);
      }
    } catch (err: any) {
      console.warn('Connection failed, starting in-browser Autonomous Engine:', err);
      isClientModeRef.current = true;
      const clientProject = createClientProjectState(prompt, mode);
      setProject(clientProject);
      setActiveTab('workspace');
      if (clientProject.files?.length > 0) {
        setActiveFilePath(clientProject.files[0].path);
      }
      setIsRunning(true);
    } finally {
      setIsStartingBuild(false);
    }
  };

  const handlePause = async () => {
    if (!project) return;
    setIsRunning(false);
    const result = await safeFetchJson<any>(`/api/projects/${project.projectId}/pause`, { method: 'POST' });
    if (result.ok && result.data.project) setProject(result.data.project);
  };

  const handleResume = async () => {
    if (!project) return;
    setIsRunning(true);
    const result = await safeFetchJson<any>(`/api/projects/${project.projectId}/resume`, { method: 'POST' });
    if (result.ok && result.data.project) setProject(result.data.project);
  };

  const handleAbort = async () => {
    if (!project) return;
    setIsRunning(false);
    const result = await safeFetchJson<any>(`/api/projects/${project.projectId}/abort`, { method: 'POST' });
    if (result.ok && result.data.project) setProject(result.data.project);
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

  const handleNodeFeedback = async (nodeId: string, sentiment: 'UP' | 'DOWN') => {
    if (!project) return;
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        nodeFeedback: {
          ...(prev.nodeFeedback || {}),
          [nodeId]: sentiment
        }
      };
    });

    const res = await safeFetchJson<any>(`/api/projects/${project.projectId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeId, sentiment })
    });

    if (res.ok && res.data?.project) {
      setProject(res.data.project);
    }
  };

  // Periodic System State Snapshot (Every 30 seconds while active)
  useEffect(() => {
    if (!project || project.status === 'COMPLETED' || project.status === 'ABORTED') return;

    const interval = setInterval(async () => {
      try {
        const res = await safeFetchJson<any>(`/api/projects/${project.projectId}/snapshots`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isAutomatic: true })
        });
        if (res.ok && res.data?.project) {
          setProject(prev => prev ? { ...prev, restorePoints: res.data.project.restorePoints } : prev);
        }
      } catch (e) {
        console.error('Periodic snapshot failed:', e);
      }
    }, 30000); // 30s interval

    return () => clearInterval(interval);
  }, [project?.projectId, project?.status]);

  // Snapshot handlers
  const handleCreateSnapshot = async (name?: string) => {
    if (!project) return;
    setIsTakingSnapshot(true);
    try {
      if (isClientModeRef.current) {
        const snapId = 'snap_' + Math.random().toString(36).substring(2, 9);
        const snapshot: SystemStateSnapshot = {
          id: snapId,
          projectId: project.projectId,
          name: name || `Milestone ${project.activeNode}`,
          timestamp: new Date().toISOString(),
          stage: project.activeNode,
          completedTasks: project.metrics.completedTasks,
          totalTasks: project.metrics.totalTasks,
          filesCount: project.files.length,
          tokensUsed: project.tokensUsed,
          elapsedSeconds: project.elapsedSeconds,
          summary: `Captured state at ${project.activeNode}`,
          stateDumpJson: JSON.stringify(project),
          isAutomatic: false
        };
        const updatedPoints = [snapshot, ...(project.restorePoints || [])];
        setProject(prev => prev ? { ...prev, restorePoints: updatedPoints } : prev);
        setRestoreToast(`Snapshot captured: "${snapshot.name}"`);
        setTimeout(() => setRestoreToast(null), 3500);
        return;
      }

      const res = await safeFetchJson<any>(`/api/projects/${project.projectId}/snapshots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isAutomatic: false })
      });
      if (res.ok && res.data?.project) {
        setProject(res.data.project);
        setRestoreToast(`Snapshot captured: "${res.data.snapshot.name}"`);
        setTimeout(() => setRestoreToast(null), 3500);
      }
    } finally {
      setIsTakingSnapshot(false);
    }
  };

  const handleRestoreSnapshot = async (snapshot: SystemStateSnapshot) => {
    if (!project) return;
    setIsRunning(false);
    if (isClientModeRef.current) {
      try {
        const restored = JSON.parse(snapshot.stateDumpJson);
        setProject(restored);
        setRestoreToast(`System state restored to: "${snapshot.name}"`);
        setTimeout(() => setRestoreToast(null), 4000);
      } catch (e) {
        setGlobalError('Failed to parse snapshot state');
      }
      return;
    }
    const res = await safeFetchJson<any>(`/api/projects/${project.projectId}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ snapshotId: snapshot.id })
    });
    if (res.ok && res.data?.project) {
      setProject(res.data.project);
      setRestoreToast(`System state restored to: "${snapshot.name}"`);
      setTimeout(() => setRestoreToast(null), 4000);
    } else {
      setGlobalError(res.error || 'Failed to restore project snapshot');
    }
  };

  const handleDeleteSnapshot = async (snapshotId: string) => {
    if (!project) return;
    const res = await safeFetchJson<any>(`/api/projects/${project.projectId}/snapshots/${snapshotId}`, {
      method: 'DELETE'
    });
    if (res.ok && res.data?.project) {
      setProject(prev => prev ? { ...prev, restorePoints: res.data.project.restorePoints } : prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#f1f5f9] flex flex-col selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      {/* Immersive background glowing mesh and animated glass orbs */}
      <div className="fixed inset-0 bg-grid-pattern opacity-25 pointer-events-none z-0" />
      <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none animate-float-slow z-0" />
      <div className="fixed top-[30%] right-[-10%] w-[650px] h-[650px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none animate-float-reverse z-0" />
      <div className="fixed bottom-[-10%] left-[25%] w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none animate-float-slow z-0" />
      <div className="fixed top-[60%] left-[10%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none animate-pulse-glow z-0" />

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
        <div className="glass-panel bg-red-950/40 border-b border-red-500/30 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-red-200 z-50 backdrop-blur-xl">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span className="font-bold uppercase text-red-400">[SYSTEM_ERROR]:</span>
            <span>{globalError}</span>
          </div>
          <button 
            onClick={() => setGlobalError(null)}
            className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 text-[10px] glass-button transition-colors"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* System Restore Toast Banner */}
      {restoreToast && (
        <div className="glass-panel bg-cyan-950/50 border-b border-cyan-500/40 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-cyan-200 z-50 backdrop-blur-xl animate-fadeIn">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
            <span className="font-bold uppercase text-cyan-300">[RESTORE_POINT]:</span>
            <span>{restoreToast}</span>
          </div>
          <button 
            onClick={() => setRestoreToast(null)}
            className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 text-[10px] glass-button transition-colors"
          >
            DISMISS
          </button>
        </div>
      )}

      {!project ? (
        <LandingPage onStartBuild={handleStartBuild} isSubmitting={isStartingBuild} />
      ) : (
        <main className="flex-1 p-3 sm:p-4 lg:p-6 max-w-[1700px] w-full mx-auto space-y-4 sm:space-y-6 relative z-10">
          {/* Always Visible Pipeline Node Graph on Workspace Tab */}
          <PipelineGraph 
            project={project} 
            onSelectNode={handleSelectNode} 
            onNodeFeedback={handleNodeFeedback}
          />

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
                  onRestoreSnapshot={handleRestoreSnapshot}
                  onCreateSnapshot={handleCreateSnapshot}
                  onDeleteSnapshot={handleDeleteSnapshot}
                  isTakingSnapshot={isTakingSnapshot}
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

      {/* Immersive UI Persistent Frosted Glass Footer */}
      <footer className="py-2.5 glass-panel border-t border-white/10 flex flex-col sm:flex-row items-center px-4 sm:px-6 justify-between gap-2 text-[10px] font-mono text-white/60 shrink-0 z-40 backdrop-blur-2xl">
        <div className="flex items-center space-x-3">
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">AUTOLOOP v2.4.0</span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden sm:inline text-white/50 tracking-wider">ZERO-TRUST SECURE SANDBOX</span>
        </div>
        <div className="text-center text-white/80 font-sans text-xs">
          Copyright © 2026 by Subhradeet Sabat | All Rights Reserved.
        </div>
        <div className="flex items-center space-x-2 text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.9)] animate-pulse" />
          <span className="font-bold tracking-wider">SYSTEM_NOMINAL</span>
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
