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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-lg bg-[#0a0a0a] border border-yellow-500/40 shadow-2xl p-5 sm:p-6 space-y-4 font-mono">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-yellow-400">
              HUMAN SUPERVISOR GATE
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">
              {request.title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-white/70 font-sans leading-relaxed">
          {request.description}
        </p>

        {request.suggestedAction && (
          <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1 text-xs font-mono">
            <span className="text-[9px] text-white/40 uppercase tracking-wider">SUGGESTED ACTION:</span>
            <p className="text-cyan-400">{request.suggestedAction}</p>
          </div>
        )}

        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            onClick={() => onReject(request.id)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold border border-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-red-400" />
            <span>REJECT ACTION</span>
          </button>
          <button
            onClick={() => onApprove(request.id)}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>APPROVE & PROCEED</span>
          </button>
        </div>
      </div>
    </div>
  );
}
