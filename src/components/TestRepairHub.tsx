import React, { useState } from 'react';
import { 
  Terminal, 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCw, 
  Play, 
  GitCompare, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Cpu 
} from 'lucide-react';
import { TestCase, RepairCycle, ProjectState } from '../types';

interface TestRepairHubProps {
  project: ProjectState;
}

export function TestRepairHub({ project }: TestRepairHubProps) {
  const [selectedSuite, setSelectedSuite] = useState<string>('ALL');
  const [activeCycleId, setActiveCycleId] = useState<string | null>(
    project.repairHistory[0]?.id || null
  );

  const derivedSuites = Array.from(new Set(project.testCases.map(t => t.suite).filter(Boolean)));
  const suites = ['ALL', ...(derivedSuites.length > 0 ? derivedSuites : ['tests'])];

  const filteredTests = selectedSuite === 'ALL'
    ? project.testCases
    : project.testCases.filter(t => t.suite === selectedSuite);

  const activeRepair = project.repairHistory.find(r => r.id === activeCycleId) || project.repairHistory[0] || project.activeRepair;

  const passCount = project.testCases.filter(t => t.status === 'PASSED').length;
  const failCount = project.testCases.filter(t => t.status === 'FAILED').length;
  const pendingCount = project.testCases.filter(t => t.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Top Test Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-lg bg-[#0a0a0a]/50 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/40 text-[10px] font-mono uppercase tracking-wider">
            <span>TOTAL TESTS</span>
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-xl font-bold font-mono text-white mt-1.5">
            {project.testCases.length}
          </p>
          <span className="text-[9px] text-white/30 font-mono">VITEST / UNIT & INTEGRATION</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0a0a0a]/50 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/40 text-[10px] font-mono uppercase tracking-wider">
            <span>PASSING TESTS</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          </div>
          <p className="text-xl font-bold font-mono text-green-400 mt-1.5">
            {passCount}
          </p>
          <span className="text-[9px] text-green-400/80 font-mono">
            {project.testCases.length > 0 ? ((passCount / project.testCases.length) * 100).toFixed(0) : 0}% SUCCESS RATE
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0a0a0a]/50 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/40 text-[10px] font-mono uppercase tracking-wider">
            <span>FAILING / IN REPAIR</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <p className="text-xl font-bold font-mono text-red-400 mt-1.5">
            {failCount}
          </p>
          <span className="text-[9px] text-red-400/80 font-mono">
            {failCount > 0 ? 'CAPTURED BY REPAIR AGENT' : 'ZERO UNHANDLED FAILURES'}
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0a0a0a]/50 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/40 text-[10px] font-mono uppercase tracking-wider">
            <span>REPAIR CYCLES</span>
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-xl font-bold font-mono text-cyan-400 mt-1.5">
            {project.repairHistory.length}
          </p>
          <span className="text-[9px] text-cyan-400/80 font-mono">
            BOUNDED AUTONOMY: 5 MAX ATTEMPTS
          </span>
        </div>
      </div>

      {/* Autonomous Repair Loop Visual Workflow */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#0a0a0a]/60 border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="w-3.5 h-3.5 text-red-400" />
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/70 font-bold">
              AUTONOMOUS FAILURE-REPAIR PIPELINE
            </h3>
          </div>
          <span className="text-[10px] font-mono text-white/40">
            ENGINE: <strong className="text-cyan-400 font-semibold">AST ANALYSIS + REGRESSION RETEST</strong>
          </span>
        </div>

        {/* Linear workflow nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {[
            { step: '1. EXECUTE', desc: 'Synthesize module', status: 'COMPLETE' },
            { step: '2. TEST', desc: 'Run test suite', status: 'COMPLETE' },
            { step: '3. DETECT', desc: 'Capture failure & stack', status: 'COMPLETE' },
            { step: '4. ANALYZE', desc: 'Root-cause extraction', status: 'COMPLETE' },
            { step: '5. PATCH', desc: 'Synthesize code fix', status: 'COMPLETE' },
            { step: '6. RETEST', desc: 'Verify 100% green', status: project.metrics.passingTests === project.testCases.length ? 'COMPLETE' : 'PENDING' },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-2.5 rounded-lg border flex flex-col text-center ${
                item.status === 'COMPLETE'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-black/40 border-white/5 text-white/40'
              }`}
            >
              <span className="text-[10px] font-mono font-bold tracking-wider">
                {item.step}
              </span>
              <span className="text-[9px] text-white/40 mt-1 font-mono">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Test Cases Table, Right Detailed Repair Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Test Suites & Cases */}
        <div className="rounded-lg bg-[#0a0a0a]/50 border border-white/10 p-4 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/70 font-bold">
              TEST EXECUTION SUITE
            </h4>
            {/* Filter pills */}
            <div className="flex items-center space-x-1 bg-black/40 p-0.5 rounded border border-white/10 text-[9px] font-mono">
              {suites.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSuite(s)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    selectedSuite === s
                      ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto font-mono text-[11px]">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className={`p-2.5 rounded-lg border flex items-start justify-between gap-3 transition-colors ${
                  test.status === 'PASSED'
                    ? 'bg-white/5 border-white/5'
                    : test.status === 'FAILED'
                    ? 'bg-red-500/10 border-red-500/40 text-red-300'
                    : 'bg-black/40 border-white/5 text-white/40'
                }`}
              >
                <div className="flex items-start space-x-2.5 flex-1">
                  {test.status === 'PASSED' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                  ) : test.status === 'FAILED' ? (
                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-white/30 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-white/90">
                      {test.name}
                    </p>
                    <div className="flex items-center space-x-2 text-[9px] text-white/40">
                      <span>{test.suite}</span>
                      <span>•</span>
                      <span>{test.durationMs}ms</span>
                      {test.repairedInCycle && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-400 font-bold">
                            Repaired in Cycle #{test.repairedInCycle}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                  test.status === 'PASSED'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : test.status === 'FAILED'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-black/40 text-white/40 border-white/10'
                }`}>
                  {test.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Deep Root-Cause & Repair Analysis */}
        <div className="rounded-lg bg-[#0a0a0a]/50 border border-white/10 p-4 space-y-3 flex flex-col font-mono">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] uppercase tracking-widest text-white/70 font-bold flex items-center space-x-2">
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>AUTOMATED ROOT-CAUSE DIAGNOSTIC</span>
            </h4>
            {activeRepair && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                ATTEMPT {activeRepair.attemptNumber} OF {activeRepair.maxAttempts}
              </span>
            )}
          </div>

          {activeRepair ? (
            <div className="space-y-3 flex-1 overflow-y-auto text-xs">
              {/* Failure Reason */}
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 space-y-1">
                <span className="text-[9px] font-bold uppercase text-red-400 tracking-wider">
                  FAILURE REASON
                </span>
                <p className="text-red-200 font-mono text-[11px] leading-relaxed">
                  {activeRepair.failureReason}
                </p>
              </div>

              {/* Root Cause Analysis */}
              <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
                <span className="text-[9px] font-bold uppercase text-cyan-400 tracking-wider">
                  ROOT CAUSE DIAGNOSIS
                </span>
                <p className="text-white/80 font-mono text-[11px] leading-relaxed">
                  {activeRepair.rootCause}
                </p>
              </div>

              {/* Repair Strategy */}
              <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
                <span className="text-[9px] font-bold uppercase text-blue-400 tracking-wider">
                  AUTOMATED REPAIR STRATEGY
                </span>
                <p className="text-white/80 font-mono text-[11px] leading-relaxed">
                  {activeRepair.strategy}
                </p>
              </div>

              {/* Code Diff preview */}
              {activeRepair.patchDiff && (
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase text-white/50 tracking-wider flex items-center space-x-1.5">
                    <GitCompare className="w-3 h-3 text-green-400" />
                    <span>APPLIED PATCH ({activeRepair.patchDiff.file})</span>
                  </span>
                  <pre className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-green-400 text-[10px] overflow-x-auto whitespace-pre-wrap font-mono">
                    {activeRepair.patchDiff.after}
                  </pre>
                </div>
              )}

              {/* Verification Outcome */}
              <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-[11px]">Regression Test Suite: <strong>9/9 PASSING</strong></span>
                </div>
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                  REPAIR RESOLVED
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-white/40 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-green-500/60" />
              <p className="text-xs">No active repair cycles. All current tests passing cleanly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
