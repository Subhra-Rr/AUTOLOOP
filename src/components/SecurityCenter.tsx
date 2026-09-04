import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Terminal, 
  Key, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  EyeOff, 
  FileCheck, 
  Layers, 
  Search,
  Zap,
  Globe,
  Database,
  ArrowRight
} from 'lucide-react';
import { SecurityCenterState, AuditLogEvent, ProjectState } from '../types';
import { classifyCommandRisk } from '../lib/engine';

interface SecurityCenterProps {
  project: ProjectState;
}

export function SecurityCenter({ project }: SecurityCenterProps) {
  const [testCmd, setTestCmd] = useState('npm test -- --coverage');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const evaluatedRisk = classifyCommandRisk(testCmd);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'SAFE':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-green-500/15 text-green-400 border border-green-500/30">SAFE (AUTO-PERMIT)</span>;
      case 'LOW_RISK':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">LOW RISK</span>;
      case 'MEDIUM_RISK':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">MEDIUM (MONITORED)</span>;
      case 'HIGH_RISK':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">HIGH RISK (GATE REQUIRED)</span>;
      case 'BLOCKED':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">BLOCKED (ZERO TRUST)</span>;
      default:
        return null;
    }
  };

  const securityPillars = [
    { name: 'Zero-Trust Sandbox Isolation', desc: 'Ephemeral container filesystem boundary', active: project.security.sandboxIsolation, icon: Layers },
    { name: 'Path Traversal Shield', desc: 'Blocks ../ escape and parent directory access', active: true, icon: Lock },
    { name: 'Secret & Credential Masker', desc: 'Redacts JWTs, API keys & secrets from logs', active: project.security.secretProtection, icon: EyeOff },
    { name: 'Command Risk Policy Gateway', desc: 'Pre-flight evaluation before shell execution', active: project.security.commandPolicy, icon: Terminal },
    { name: 'Role-Based Access Control (RBAC)', desc: 'Student, Admin, Dean, and Faculty tiers', active: project.security.authorization, icon: ShieldCheck },
    { name: 'Immutable Audit Logging', desc: 'Tamper-evident append-only event stream', active: project.security.auditLogging, icon: FileCheck },
  ];

  const permissions = [
    { tool: 'readFile (Workspace)', scope: 'Local Project Dir', risk: 'SAFE', policy: 'AUTO-APPROVE' },
    { tool: 'searchCode (AST)', scope: 'Project Sources', risk: 'SAFE', policy: 'AUTO-APPROVE' },
    { tool: 'writeFile / editFile', scope: 'src/, server/, tests/', risk: 'MEDIUM_RISK', policy: 'SANDBOX ONLY' },
    { tool: 'runTests / vitest', scope: 'Node Sandboxed PTY', risk: 'LOW_RISK', policy: 'AUTO-APPROVE' },
    { tool: 'executeCommand (npm/tsc)', scope: 'Container Shell', risk: 'MEDIUM_RISK', policy: 'LOGGED & BOUNDED' },
    { tool: 'databaseMigration', scope: 'Postgres Local Mock/DB', risk: 'HIGH_RISK', policy: 'SUPERVISOR GATE' },
    { tool: 'hostOsRootAccess', scope: 'Root Host System', risk: 'BLOCKED', policy: 'STRICTLY FORBIDDEN' },
  ];

  return (
    <div className="space-y-6">
      {/* Zero-Trust Architecture Diagram & Pillars */}
      <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-5 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/80 font-extrabold">
              ZERO-TRUST AUTONOMOUS EXECUTION ARCHITECTURE
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ZERO HOST OS ACCESS ENFORCED</span>
          </span>
        </div>

        {/* Security Pipeline Flow */}
        <div className="p-3.5 rounded-xl glass-panel-subtle border border-white/10 text-[11px] font-mono overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] text-center space-x-2">
            <div className="p-2.5 rounded-xl glass-card border border-white/10 text-cyan-300 font-semibold">
              AI Agent
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            <div className="p-2.5 rounded-xl glass-card border border-white/10 text-purple-300 font-semibold">
              Orchestrator
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            <div className="p-2.5 rounded-xl glass-card border border-cyan-500/30 text-cyan-300 font-semibold">
              Policy Engine
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            <div className="p-2.5 rounded-xl glass-card border border-amber-500/30 text-amber-300 font-semibold">
              Risk Classifier
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              Isolated Sandbox
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            <div className="p-2.5 rounded-xl glass-card border border-white/10 text-white/80 font-semibold">
              Audit Logger
            </div>
          </div>
        </div>

        {/* Security Pillars 6-box grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {securityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.name}
                className="p-3.5 rounded-xl glass-card border border-white/10 flex items-start space-x-3 transition-all hover:border-white/20"
              >
                <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <h5 className="text-[11px] font-semibold text-white/95">
                      {pillar.name}
                    </h5>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-white/50 leading-snug font-sans">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Command Risk Classifier & Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Command Risk Sandbox Tester */}
        <div className="rounded-2xl glass-panel border border-white/10 p-5 space-y-4 flex flex-col font-mono shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80 font-bold flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>INTERACTIVE COMMAND RISK CLASSIFIER</span>
            </h4>
            <span className="text-[9px] text-cyan-300 font-bold">REAL-TIME POLICY</span>
          </div>

          <p className="text-[11px] font-sans text-white/60">
            Test any shell command or tool invocation against the Zero-Trust execution policy:
          </p>

          <div className="space-y-2.5">
            <div className="relative">
              <input
                id="securityPolicyTestInput"
                name="securityPolicyTest"
                aria-label="Test command against Zero-Trust policy"
                autoComplete="off"
                type="text"
                value={testCmd}
                onChange={(e) => setTestCmd(e.target.value)}
                placeholder="e.g. npm test, git commit, rm -rf /, curl 169.254.169.254..."
                className="w-full p-3 rounded-xl glass-input text-[11px] text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[9px]">
              <span className="text-white/50 font-bold mr-1">PRESETS:</span>
              <button
                type="button"
                onClick={() => setTestCmd('npm test -- --coverage')}
                className="px-2.5 py-1 rounded-lg glass-button text-white/80 hover:text-white transition-all text-[10px]"
              >
                npm test
              </button>
              <button
                type="button"
                onClick={() => setTestCmd('git commit -m "feat: auth"')}
                className="px-2.5 py-1 rounded-lg glass-button text-white/80 hover:text-white transition-all text-[10px]"
              >
                git commit
              </button>
              <button
                type="button"
                onClick={() => setTestCmd('npx prisma migrate deploy')}
                className="px-2.5 py-1 rounded-lg glass-button text-white/80 hover:text-white transition-all text-[10px]"
              >
                db migration
              </button>
              <button
                type="button"
                onClick={() => setTestCmd('rm -rf /')}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 hover:text-white hover:bg-red-500/30 transition-all text-[10px]"
              >
                rm -rf / (Dangerous)
              </button>
              <button
                type="button"
                onClick={() => setTestCmd('curl http://169.254.169.254/latest/meta-data/')}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 hover:text-white hover:bg-red-500/30 transition-all text-[10px]"
              >
                Metadata Exfiltration
              </button>
            </div>
          </div>

          {/* Classification result box */}
          <div className="p-3.5 rounded-xl glass-card border border-white/10 space-y-1.5 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50 font-bold">SECURITY DECISION:</span>
              {getRiskBadge(evaluatedRisk)}
            </div>
            <p className="text-[10px] font-mono text-white/80 leading-relaxed">
              {evaluatedRisk === 'BLOCKED' && 'STRICTLY PROHIBITED: Pattern violates sandbox isolation boundaries and host protection invariants.'}
              {evaluatedRisk === 'HIGH_RISK' && 'REQUIRES SUPERVISOR: Destructive or systemic changes require explicit human gate approval.'}
              {evaluatedRisk === 'MEDIUM_RISK' && 'MONITORED EXECUTION: Executed inside isolated ephemeral sandbox with output streaming and audit capture.'}
              {evaluatedRisk === 'LOW_RISK' && 'LOW RISK PERMITTED: Read-only or unit testing execution bounded to workspace root.'}
              {evaluatedRisk === 'SAFE' && 'AUTOMATICALLY GRANTED: Read-only inspection of source code and AST entities.'}
            </p>
          </div>
        </div>

        {/* Right: Permission Matrix Table */}
        <div className="rounded-2xl glass-panel border border-white/10 p-5 space-y-4 flex flex-col font-mono shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80 font-bold">
              TOOL GATEWAY PERMISSION MATRIX
            </h4>
            <span className="text-[9px] text-cyan-300 font-bold">LEAST PRIVILEGE</span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto text-xs">
            {permissions.map((perm) => (
              <div
                key={perm.tool}
                className="p-2.5 rounded-xl glass-card border border-white/10 flex items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-white/95">
                    {perm.tool}
                  </p>
                  <span className="text-[9px] text-white/50">{perm.scope}</span>
                </div>
                <div className="text-right space-y-0.5">
                  {getRiskBadge(perm.risk)}
                  <div className="text-[8px] text-white/40 font-semibold">{perm.policy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Immutable Audit Log Stream */}
      <div className="rounded-2xl glass-panel border border-white/10 p-5 space-y-4 font-mono shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <h4 className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80 font-bold">
              ZERO-TRUST SECURITY AUDIT LOG
            </h4>
          </div>
          <span className="text-[10px] text-cyan-300 font-bold">
            {project.auditLogs.length} VERIFIED EVENTS
          </span>
        </div>

        <div className="space-y-2 overflow-x-auto text-xs">
          {project.auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl glass-card border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white/40 text-[10px]">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className="text-cyan-300 font-bold text-[11px]">{log.agent}</span>
                  <span className="text-white/90 font-semibold text-[11px]">{log.action}</span>
                </div>
                <p className="text-white/50 text-[10px] font-sans">
                  {log.details}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getRiskBadge(log.risk)}
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
