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
      <div className="p-4 sm:p-5 rounded-lg bg-[#0a0a0a]/50 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/80 font-bold">
              AUTONOMOUS DEFINITION OF DONE (DOD) CONTRACT
            </h3>
          </div>
          <p className="text-[11px] text-white/50 max-w-xl font-sans">
            Strict multi-gate criteria. The autonomous engine is prohibited from declaring project completion until all 9 verification standards are mathematically satisfied.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-black/40 px-3.5 py-2.5 rounded-lg border border-white/10 shrink-0">
          <div className="text-right font-mono">
            <span className="text-[9px] text-white/40 block tracking-wider uppercase">STATUS</span>
            <span className={`text-xs font-bold ${isAllPassed ? 'text-green-400' : 'text-cyan-400'}`}>
              {passedCount} / {project.definitionOfDone.length} Criteria
            </span>
          </div>
          {isAllPassed ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : (
            <Clock className="w-5 h-5 text-cyan-400 animate-spin" />
          )}
        </div>
      </div>

      {/* DoD Checklist Items */}
      <div className="rounded-lg bg-[#0a0a0a]/50 border border-white/10 p-4 space-y-2.5">
        <div className="grid grid-cols-1 gap-2">
          {project.definitionOfDone.map((item, idx) => {
            const isPassed = item.status === 'PASSED';

            return (
              <div
                key={item.id}
                className={`p-3 rounded-lg border flex items-start justify-between gap-3 transition-all ${
                  isPassed
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-black/40 border-white/5 text-white/40'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  <div className="mt-0.5">
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center font-mono text-[9px] text-white/40">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className={`text-xs font-semibold ${isPassed ? 'text-white/90' : 'text-white/60'}`}>
                      {item.label}
                    </p>
                    <div className="flex items-center space-x-2 text-[9px] font-mono text-white/40">
                      <span className="px-1 py-0.2 rounded bg-white/5 border border-white/10">
                        CATEGORY: {item.category}
                      </span>
                      {item.verifiedAt && (
                        <span>VERIFIED AT {item.verifiedAt}</span>
                      )}
                    </div>
                  </div>
                </div>

                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                  isPassed
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-black/40 text-white/40 border-white/10'
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
