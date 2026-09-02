import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  X, 
  Terminal, 
  Lock 
} from 'lucide-react';
import { HumanInterventionRequest } from '../types';

interface HumanInterventionModalProps {
  request: HumanInterventionRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function HumanInterventionModal({
  request,
  onApprove,
  onReject
}: HumanInterventionModalProps) {
  if (!request || request.status !== 'PENDING') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-amber-500/40 shadow-2xl p-6 sm:p-7 space-y-4 font-mono backdrop-blur-3xl">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">
              HUMAN SUPERVISOR GATE
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {request.title}
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
          {request.description}
        </p>

        {request.suggestedAction && (
          <div className="p-3.5 rounded-xl glass-card border border-white/10 space-y-1 text-xs font-mono">
            <span className="text-[9px] text-white/50 uppercase tracking-wider font-bold">SUGGESTED ACTION:</span>
            <p className="text-cyan-300 font-semibold">{request.suggestedAction}</p>
          </div>
        )}

        <div className="flex items-center justify-end space-x-2.5 pt-2">
          <button
            onClick={() => onReject(request.id)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl glass-button text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition-all"
          >
            <X className="w-4 h-4 text-red-400" />
            <span>REJECT ACTION</span>
          </button>
          <button
            onClick={() => onApprove(request.id)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            <Check className="w-4 h-4" />
            <span>APPROVE & PROCEED</span>
          </button>
        </div>
      </div>
    </div>
  );
}
