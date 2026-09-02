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
      <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>MEASURED WORKSPACE QUALITY & VERIFICATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
            INDEPENDENT VERIFICATION REPORT
          </h2>
          <p className="text-[11px] sm:text-xs text-white/60 max-w-xl leading-relaxed font-sans">
            Metrics evaluated directly from workspace files, Node test runner outcomes, and static security analysis.
          </p>
        </div>

        {/* Real Score Gauge */}
        <div className="flex items-center space-x-4 glass-card p-4 rounded-2xl border border-white/10 shadow-xl">
          <div className="text-center px-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 block font-bold">
              STATUS
            </span>
            <span className={`text-xl font-bold font-mono ${isCompleted ? 'text-emerald-400' : 'text-cyan-300'}`}>
              {isCompleted ? 'VERIFIED' : project.status}
            </span>
          </div>
          <div className="h-9 w-px bg-white/10" />
          <div className="text-center px-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 block font-bold">
              FILES
            </span>
            <span className="text-xl font-bold font-mono text-cyan-300">
              {project.files.length}
            </span>
          </div>
          <div className="h-9 w-px bg-white/10" />
          <div className="text-center px-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 block font-bold">
              SCORE
            </span>
            <span className="text-2xl font-bold font-mono text-blue-400">
              {evaluation.overallScore > 0 ? `${evaluation.overallScore}%` : 'CALCULATING'}
            </span>
          </div>
        </div>
      </div>

      {/* Quantitative Grid */}
      <div className="space-y-3">
        <h3 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/80 font-bold flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>MEASURED WORKSPACE INVARIANTS</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quantCards.map((card) => (
            <div
              key={card.label}
              className="p-4 rounded-2xl glass-panel border border-white/10 font-mono shadow-xl backdrop-blur-2xl"
            >
              <span className="text-[9px] text-white/50 block truncate font-bold uppercase tracking-wider">
                {card.label}
              </span>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-sm sm:text-base font-bold text-white truncate">
                  {card.val}
                </span>
                {card.status === 'PASS' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
                ) : card.status === 'FAIL' ? (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 ml-1" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Qualitative AI Pillars Breakdown */}
      {evaluation.categories && evaluation.categories.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/80 font-bold flex items-center space-x-2">
            <LineChart className="w-4 h-4 text-blue-400" />
            <span>MEASURED VERIFICATION PILLARS</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {evaluation.categories.map((cat) => (
              <div
                key={cat.name}
                className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2.5 shadow-xl backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-semibold text-white/95 font-mono">
                    {cat.name}
                  </h4>
                  <span className="text-xs sm:text-sm font-bold font-mono text-cyan-300">
                    {cat.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/10">
                  <div
                    className="bg-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                  <span className="text-emerald-400 font-semibold">{cat.verdict}</span>
                </div>

                <p className="text-[10px] sm:text-[11px] text-white/60 font-sans leading-relaxed">
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
