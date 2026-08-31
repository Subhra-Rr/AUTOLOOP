import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Workflow, 
  Wrench, 
  CheckCircle2, 
  Code2, 
  Terminal,
  Zap,
  GraduationCap,
  Activity,
  CreditCard,
  Lock
} from 'lucide-react';
import { AutonomyMode } from '../types';
import { PROJECT_TEMPLATES } from '../data/templates';

interface LandingPageProps {
  onStartBuild: (prompt: string, mode: AutonomyMode) => void;
}

export function LandingPage({ onStartBuild }: LandingPageProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedMode, setSelectedMode] = useState<AutonomyMode>('MAXIMUM');
  const [validationError, setValidationError] = useState<string | null>(null);

  const steps = [
    { label: 'GOAL', icon: Sparkles, desc: 'User prompt parsed' },
    { label: 'PLAN', icon: Workflow, desc: 'Real task decomposition' },
    { label: 'BUILD', icon: Code2, desc: 'Zero-trust workspace synthesis' },
    { label: 'TEST', icon: Terminal, desc: 'Node.js test execution' },
    { label: 'REPAIR', icon: Wrench, desc: 'Automated failure diagnosis' },
    { label: 'VERIFY', icon: ShieldCheck, desc: '9/9 DoD criteria audit' },
    { label: 'DONE', icon: CheckCircle2, desc: 'Production artifact ready' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setValidationError('Enter a task before starting the autonomous agent.');
      return;
    }
    setValidationError(null);
    onStartBuild(prompt.trim(), selectedMode);
  };

  const handleSelectTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    setValidationError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between relative overflow-hidden">
      {/* Background subtle radial glows & engineering grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/10 to-emerald-600/10 blur-[130px] rounded-full pointer-events-none" />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 w-full space-y-10">
        {/* Eyebrow & Main Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>AUTONOMOUS AI SOFTWARE ENGINEERING PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight font-sans">
            One Prompt. <br className="hidden sm:inline" />
            <span className="text-cyan-400">
              Infinite Execution.
            </span> <br />
            Verified Completion.
          </h1>

          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            Give AI one goal. Let it finish the work. AUTOLOOP plans, builds, tests, repairs, and verifies your project without requiring you to continuously prompt it.
          </p>
        </div>

        {/* Live Autonomous Pipeline Flow (Idle Roadmap) */}
        <div className="p-5 rounded-lg bg-[#0a0a0a]/60 border border-white/10 backdrop-blur-md shadow-2xl relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 flex items-center space-x-2">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>AUTONOMOUS_PIPELINE_FLOW</span>
            </span>
            <span className="text-[10px] font-mono text-white/40">
              STATUS: IDLE (AWAITING USER PROMPT)
            </span>
          </div>

          {/* Node to node pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.label}
                  className="relative p-3 rounded-lg border border-white/5 bg-black/40 text-white/50 flex flex-col items-center text-center transition-all hover:border-cyan-500/30"
                >
                  <div className="w-7 h-7 rounded flex items-center justify-center mb-1.5 bg-white/5 text-cyan-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-white/70">
                    {step.label}
                  </span>
                  <span className="text-[9px] text-white/40 mt-1 line-clamp-1 font-mono">
                    {step.desc}
                  </span>

                  {/* Flow Arrow indicator */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-white/20 text-xs">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Input & Autonomy Mode Form */}
        <div className="p-6 sm:p-7 rounded-lg bg-[#0a0a0a]/70 border border-white/10 backdrop-blur-md shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {validationError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span>{validationError}</span>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/80 flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>WHAT DO YOU WANT TO BUILD AUTONOMOUSLY?</span>
                </label>
                <span className="text-[10px] font-mono text-white/40">
                  ONE PROMPT STARTS ENGINE
                </span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                rows={3}
                placeholder="Describe your project goal, e.g. Build an autonomous grievance management portal with JWT auth, Postgres schema, Zod validation, and automated testing..."
                className="w-full p-3.5 rounded bg-[#050505] border border-white/10 text-white placeholder-white/30 font-mono text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-y"
              />
            </div>

            {/* Autonomy Mode Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/50 flex items-center space-x-1.5">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>AUTONOMY EXECUTION POLICY</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div
                  onClick={() => setSelectedMode('MAXIMUM')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedMode === 'MAXIMUM'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-black/40 border-white/5 text-white/50 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-xs text-cyan-400 font-mono">
                    <Zap className="w-3 h-3" />
                    <span>MAXIMUM AUTONOMY</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                    Zero interruptions. System handles all planning, code generation, error repair, and verification.
                  </p>
                </div>

                <div
                  onClick={() => setSelectedMode('BALANCED')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedMode === 'BALANCED'
                      ? 'bg-blue-500/10 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                      : 'bg-black/40 border-white/5 text-white/50 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-xs text-blue-400 font-mono">
                    <ShieldCheck className="w-3 h-3" />
                    <span>BALANCED AUTONOMY</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                    Auto-executes standard tasks. Requests human approval only for high-risk operations.
                  </p>
                </div>

                <div
                  onClick={() => setSelectedMode('HUMAN_APPROVAL')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedMode === 'HUMAN_APPROVAL'
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-black/40 border-white/5 text-white/50 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-xs text-amber-400 font-mono">
                    <Lock className="w-3 h-3" />
                    <span>HUMAN APPROVAL GATES</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                    Strict supervisor mode. Approvals required before major package installs or schema migrations.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                OR CHOOSE A REFERENCE ARCHITECTURE:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {PROJECT_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl.prompt)}
                    className="p-3 text-left rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/20 transition-all group"
                  >
                    <div className="text-xs font-semibold text-white/90 group-hover:text-cyan-400 transition-colors flex items-center justify-between font-mono">
                      <span className="truncate">{tmpl.title}</span>
                      <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[10px] text-white/40 mt-1 line-clamp-2">
                      {tmpl.shortDesc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-4 text-[10px] text-white/50 font-mono">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span>ZERO_TRUST</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>AUTO_REPAIR</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3 h-3 text-blue-400" />
                  <span>9/9 DOD CHECK</span>
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 fill-black" />
                <span>START AUTONOMOUS BUILD</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Copyright */}
        <footer className="mt-8 text-center text-xs text-white/50 font-sans pb-4">
          Copyright © 2026 by Subhradeet Sabat | All Rights Reserved.
        </footer>
      </main>
    </div>
  );
}
