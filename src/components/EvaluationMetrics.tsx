import React from 'react';
import { 
  LineChart, 
  CheckCircle2, 
  ShieldCheck, 
  Code2, 
  Layers, 
  Sparkles, 
  Terminal, 
  Cpu,
  TrendingUp,
  AlertCircle,
  FileCode,
  Check
} from 'lucide-react';
import { AIQualityEvaluation, ExecutionMetrics, ProjectState } from '../types';

interface EvaluationMetricsProps {
  project: ProjectState;
}

export function EvaluationMetrics({ project }: EvaluationMetricsProps) {
  const { metrics, evaluation } = project;
  const hasTests = project.testCases.length > 0;
  const isCompleted = project.status === 'COMPLETED';

  const quantCards = [
    { 
      label: 'TASKS COMPLETED', 
      val: `${metrics.completedTasks}/${metrics.totalTasks}`, 
      status: metrics.completedTasks === metrics.totalTasks && metrics.totalTasks > 0 ? 'PASS' : 'IN_PROGRESS' 
    },
    { 
      label: 'REQUIREMENTS SATISFIED', 
      val: `${metrics.satisfiedRequirements}/${metrics.totalRequirements}`, 
      status: metrics.satisfiedRequirements === metrics.totalRequirements && metrics.totalRequirements > 0 ? 'PASS' : 'IN_PROGRESS' 
    },
    { 
      label: 'WORKSPACE FILES', 
      val: `${project.files.length} on disk`, 
      status: project.files.length > 0 ? 'PASS' : 'IN_PROGRESS' 
    },
    { 
      label: 'AUTOMATED TESTS', 
      val: hasTests ? `${metrics.passingTests}/${project.testCases.length} Passed` : '0 tests configured', 
      status: hasTests ? (metrics.failingTests === 0 ? 'PASS' : 'FAIL') : 'NEUTRAL' 
    },
    { 
      label: 'BUILD VERIFICATION', 
      val: metrics.buildStatus, 
      status: metrics.buildStatus === 'PASSED' ? 'PASS' : 'IN_PROGRESS' 
    },
    { 
      label: 'ZERO-TRUST LEAKS', 
      val: `${metrics.securityIssues} Findings`, 
      status: metrics.securityIssues === 0 ? 'PASS' : 'FAIL' 
    },
    { 
      label: 'SYNTAX ERRORS', 
      val: `${metrics.typeErrors} Errors`, 
      status: metrics.typeErrors === 0 ? 'PASS' : 'FAIL' 
    },
    { 
      label: 'SELF-REPAIR CYCLES', 
      val: `${project.repairHistory.length} Resolved`, 
      status: 'PASS' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score Banner */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#0a0a0a]/50 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>MEASURED WORKSPACE QUALITY & VERIFICATION</span>
          </div>
          <h2 className="text-xl font-bold font-mono text-white tracking-tight">
            INDEPENDENT VERIFICATION REPORT
          </h2>
          <p className="text-[11px] text-white/50 max-w-xl leading-relaxed font-sans">
            Metrics evaluated directly from workspace files, Node test runner outcomes, and static security analysis.
          </p>
        </div>

        {/* Real Score Gauge */}
        <div className="flex items-center space-x-4 bg-black/40 p-3 rounded-lg border border-white/10">
          <div className="text-center px-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">
              STATUS
            </span>
            <span className={`text-xl font-bold font-mono ${isCompleted ? 'text-green-400' : 'text-cyan-400'}`}>
              {isCompleted ? 'VERIFIED' : project.status}
            </span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center px-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">
              FILES
            </span>
            <span className="text-xl font-bold font-mono text-cyan-400">
              {project.files.length}
            </span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center px-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">
              SCORE
            </span>
            <span className="text-2xl font-bold font-mono text-blue-400">
              {evaluation.overallScore > 0 ? `${evaluation.overallScore}%` : 'CALCULATING'}
            </span>
          </div>
        </div>
      </div>

      {/* Quantitative Grid */}
      <div className="space-y-2.5">
        <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/70 font-bold flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>MEASURED WORKSPACE INVARIANTS</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {quantCards.map((card) => (
            <div
              key={card.label}
              className="p-3 rounded-lg bg-[#0a0a0a]/50 border border-white/10 font-mono"
            >
              <span className="text-[9px] text-white/40 block truncate">
                {card.label}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-white truncate">
                  {card.val}
                </span>
                {card.status === 'PASS' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 ml-1" />
                ) : card.status === 'FAIL' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 ml-1" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0 ml-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Qualitative AI Pillars Breakdown */}
      {evaluation.categories && evaluation.categories.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/70 font-bold flex items-center space-x-2">
            <LineChart className="w-3.5 h-3.5 text-blue-400" />
            <span>MEASURED VERIFICATION PILLARS</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {evaluation.categories.map((cat) => (
              <div
                key={cat.name}
                className="p-3.5 rounded-lg bg-[#0a0a0a]/50 border border-white/10 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-white/90 font-mono">
                    {cat.name}
                  </h4>
                  <span className="text-xs font-bold font-mono text-cyan-400">
                    {cat.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden border border-white/5">
                  <div
                    className="bg-cyan-500 h-full rounded-full shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span className="text-green-400 font-semibold">{cat.verdict}</span>
                </div>

                <p className="text-[10px] text-white/50 font-sans leading-relaxed">
                  {cat.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
