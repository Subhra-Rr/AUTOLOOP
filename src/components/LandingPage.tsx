import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import { AutonomyMode } from '../types';

interface LandingPageProps {
  onStartBuild: (prompt: string, mode: AutonomyMode) => void;
}

const PROMPT_SUGGESTIONS = [
  {
    title: 'Grievance Redressal Portal',
    desc: 'Full-stack platform with student complaints, status tracking, analytics dashboard, and Node tests.',
    prompt: 'Build a full-stack student grievance management portal with interactive dashboard, complaint submission, status lifecycle tracking, responsive modern UI, and automated Node.js test cases.'
  },
  {
    title: 'Collaborative Whiteboard Canvas',
    desc: 'Real-time HTML5 drawing canvas with shape tools, color palette, undo/redo stack, and unit tests.',
    prompt: 'Build an interactive web-based drawing canvas application with freehand drawing, geometric shapes, color picker, brush sizes, undo/redo history, export to PNG, and test coverage.'
  },
  {
    title: 'Fintech Expense & Budget Engine',
    desc: 'Double-entry expense tracker with category budgets, financial analytics charts, and test suite.',
    prompt: 'Build a personal finance and expense tracker web app with transaction tagging, monthly budget gauges, category breakdown visualizer, localStorage persistence, and unit test suite.'
  },
  {
    title: 'Scientific Calculator & Grapher',
    desc: 'Mathematical evaluation engine with function plotting, history tape, and arithmetic tests.',
    prompt: 'Build a scientific graphing calculator web app with trigonometric functions, equation plotting on canvas, calculation history, responsive keypads, and test assertions.'
  }
];

export function LandingPage({ onStartBuild }: LandingPageProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedMode, setSelectedMode] = useState<AutonomyMode>('MAXIMUM');
  const [validationError, setValidationError] = useState<string | null>(null);

  const steps = [
    { label: 'GOAL', icon: Sparkles, desc: 'Real user prompt parsed' },
    { label: 'PLAN', icon: Workflow, desc: 'Dynamic task decomposition' },
    { label: 'BUILD', icon: Code2, desc: 'Zero-trust workspace synthesis' },
    { label: 'TEST', icon: Terminal, desc: 'Node.js test execution' },
    { label: 'REPAIR', icon: Wrench, desc: 'Automated self-healing cycles' },
    { label: 'VERIFY', icon: ShieldCheck, desc: 'Physical disk verification' },
    { label: 'DONE', icon: CheckCircle2, desc: 'Live running application' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setValidationError('Please describe what you want the autonomous agent to build before launching.');
      return;
    }
    setValidationError(null);
    onStartBuild(prompt.trim(), selectedMode);
  };

  const handleSelectSuggestion = (suggestionPrompt: string) => {
    setPrompt(suggestionPrompt);
    setValidationError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between relative overflow-hidden">
      {/* Background subtle radial glows & engineering grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/10 to-emerald-600/10 blur-[130px] rounded-full pointer-events-none" />

      <main className="relative max-w-6xl mx-auto px-3 sm:px-6 pt-6 sm:pt-10 pb-12 sm:pb-16 w-full space-y-6 sm:space-y-10">
        {/* Eyebrow & Main Hero */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-2.5 sm:px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-[11px] font-mono shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="truncate">AUTONOMOUS AI SOFTWARE ENGINEERING ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-sans">
            One Objective. <br className="hidden sm:inline" />
            <span className="text-cyan-400">
              Autonomous Loop.
            </span> <br />
            Real Verified Output.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed px-2">
            Specify any software application. AUTOLOOP writes real files to an isolated sandbox on disk, runs automated Node test suites, self-repairs failures, and produces a live preview.
          </p>
        </div>

        {/* Live Autonomous Pipeline Flow (Idle Roadmap) */}
        <div className="p-3.5 sm:p-5 rounded-lg bg-[#0a0a0a]/60 border border-white/10 backdrop-blur-md shadow-2xl relative space-y-3">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 flex items-center space-x-2">
              <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>AUTONOMOUS_EXECUTION_LIFECYCLE</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              STATUS: IDLE — AWAITING PROMPT
            </span>
          </div>

          {/* Node to node pipeline cards with responsive horizontal scroll on small devices */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.label}
                  className="p-2.5 sm:p-3 rounded-lg bg-[#050505] border border-white/5 space-y-1 sm:space-y-1.5 transition-all text-center group hover:border-cyan-500/30"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center mx-auto bg-white/5 text-white/50 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold block text-white/70">
                    {step.label}
                  </span>
                  <p className="text-[8px] sm:text-[9px] text-white/40 leading-tight">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real User Prompt Form */}
        <div className="p-4 sm:p-8 rounded-lg bg-[#0a0a0a]/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white/90 font-bold">
                DEFINE APPLICATION OBJECTIVE
              </h2>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-white/40">
              ZERO-TRUST ISOLATION
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase tracking-wider text-white/50 flex items-center space-x-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>PROJECT GOAL & REQUIREMENTS</span>
                </label>
                {validationError && (
                  <span className="text-[10px] font-mono text-red-400">
                    {validationError}
                  </span>
                )}
              </div>

              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                rows={3}
                placeholder="Describe what you want to build (e.g. Build an interactive student grievance platform with complaint filtering, priority tags, status updates, and automated test cases...)"
                className="w-full p-3 sm:p-3.5 rounded bg-[#050505] border border-white/10 text-white placeholder-white/30 font-mono text-xs sm:text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-y"
              />
            </div>

            {/* Autonomy Mode Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/50 flex items-center space-x-1.5">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>AUTONOMY SUPERVISION POLICY</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
                <div
                  onClick={() => setSelectedMode('MAXIMUM')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedMode === 'MAXIMUM'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-black/40 border-white/5 text-white/50 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-xs text-cyan-400 font-mono">
                    <Zap className="w-3 h-3 shrink-0" />
                    <span>MAXIMUM AUTONOMY</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                    Continuous loop. The agent plans, writes source code, runs automated tests, heals failures, and verifies completion.
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
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span>BALANCED SUPERVISION</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                    Auto-executes safe file writes and test runs. Asks for confirmation before high-impact actions.
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
                    <Lock className="w-3 h-3 shrink-0" />
                    <span>STRICT SUPERVISOR</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                    Step-by-step supervisor gating. Requires explicit approval before each phase transition.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Inspiration Prompts */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                OR SELECT AN EXAMPLE OBJECTIVE:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
                {PROMPT_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(item.prompt)}
                    className="p-3 text-left rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/20 transition-all group"
                  >
                    <div className="text-xs font-semibold text-white/90 group-hover:text-cyan-400 transition-colors flex items-center justify-between font-mono">
                      <span className="truncate">{item.title}</span>
                      <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5 shrink-0" />
                    </div>
                    <p className="text-[10px] text-white/40 mt-1 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] text-white/50 font-mono">
                <span className="flex items-center space-x-1 sm:space-x-1.5 truncate">
                  <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                  <span className="truncate">NO MOCK</span>
                </span>
                <span className="flex items-center space-x-1 sm:space-x-1.5 truncate">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">REAL DISK</span>
                </span>
                <span className="flex items-center space-x-1 sm:space-x-1.5 truncate">
                  <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                  <span className="truncate">NODE TESTS</span>
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 sm:py-3 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-black shrink-0" />
                <span>START AUTONOMOUS BUILD</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Copyright */}
        <footer className="mt-6 sm:mt-8 text-center text-xs text-white/50 font-sans pb-4">
          Copyright © 2026 by Subhradeet Sabat | All Rights Reserved.
        </footer>
      </main>
    </div>
  );
}
