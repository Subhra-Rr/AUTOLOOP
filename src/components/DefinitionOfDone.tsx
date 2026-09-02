import React from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { DefinitionOfDoneItem, ProjectState } from '../types';

interface DefinitionOfDoneProps {
  project: ProjectState;
}

export function DefinitionOfDone({ project }: DefinitionOfDoneProps) {
  const passedCount = project.definitionOfDone.filter(d => d.status === 'PASSED').length;
  const isAllPassed = passedCount === project.definitionOfDone.length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white/90 font-bold">
              AUTONOMOUS DEFINITION OF DONE (DOD) CONTRACT
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-white/60 max-w-xl font-sans leading-relaxed">
            Strict multi-gate criteria. The autonomous engine is prohibited from declaring project completion until all physical workspace verification standards are satisfied.
          </p>
        </div>

        <div className="flex items-center space-x-3.5 glass-card px-4 py-3 rounded-xl border border-white/10 shrink-0 shadow-lg">
          <div className="text-right font-mono">
            <span className="text-[9px] text-white/50 block tracking-wider uppercase font-bold">STATUS</span>
            <span className={`text-xs sm:text-sm font-bold ${isAllPassed ? 'text-emerald-400' : 'text-cyan-300'}`}>
              {passedCount} / {project.definitionOfDone.length} Criteria
            </span>
          </div>
          {isAllPassed ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <Clock className="w-6 h-6 text-cyan-400 animate-spin" />
          )}
        </div>
      </div>

      {/* DoD Checklist Items */}
      <div className="rounded-2xl glass-panel border border-white/10 p-5 space-y-3 shadow-2xl backdrop-blur-2xl">
        <div className="grid grid-cols-1 gap-2.5">
          {project.definitionOfDone.map((item, idx) => {
            const isPassed = item.status === 'PASSED';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                  isPassed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'glass-card text-white/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center font-mono text-[9px] text-white/50 font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className={`text-xs sm:text-sm font-semibold ${isPassed ? 'text-white/95' : 'text-white/70'}`}>
                      {item.label}
                    </p>
                    <div className="flex items-center space-x-2 text-[9px] font-mono text-white/50">
                      <span className="px-1.5 py-0.5 rounded-md glass-panel-subtle border border-white/10 font-bold">
                        CATEGORY: {item.category}
                      </span>
                      {item.verifiedAt && (
                        <span>VERIFIED AT {item.verifiedAt}</span>
                      )}
                    </div>
                  </div>
                </div>

                <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                  isPassed
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'glass-card text-white/40 border-white/10'
                }`}>
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
