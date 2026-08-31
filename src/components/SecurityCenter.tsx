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
      <div className="p-4 sm:p-5 rounded-lg bg-[#0a0a0a]/50 border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/70 font-bold">
              ZERO-TRUST AUTONOMOUS EXECUTION ARCHITECTURE
            </h3>
          </div>
          <span className="text-[10px] font-mono text-green-400 font-semibold flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>ZERO HOST OS ACCESS ENFORCED</span>
          </span>
        </div>

        {/* Security Pipeline Flow */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] text-center space-x-2">
            <div className="p-2 rounded bg-white/5 border border-white/10 text-cyan-400">
              AI Agent
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            <div className="p-2 rounded bg-white/5 border border-white/10 text-purple-400">
              Orchestrator
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            <div className="p-2 rounded bg-white/5 border border-cyan-500/40 text-cyan-400">
              Policy Engine
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            <div className="p-2 rounded bg-white/5 border border-yellow-500/40 text-yellow-400">
              Risk Classifier
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            <div className="p-2 rounded bg-green-500/10 border border-green-500/40 text-green-400 font-bold">
              Isolated Sandbox
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            <div className="p-2 rounded bg-white/5 border border-white/10 text-white/70">
              Audit Logger
            </div>
          </div>
        </div>

        {/* Security Pillars 6-box grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {securityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.name}
                className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-start space-x-2.5"
              >
                <div className="p-1.5 rounded bg-green-500/15 text-green-400 border border-green-500/30 shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <h5 className="text-[11px] font-semibold text-white/90">
                      {pillar.name}
                    </h5>
                    <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
                  </div>
                  <p className="text-[10px] text-white/40 leading-snug font-sans">
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
        <div className="rounded-lg bg-[#0a0a0a]/50 border border-white/10 p-4 space-y-3 flex flex-col font-mono">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] uppercase tracking-widest text-white/70 font-bold flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>INTERACTIVE COMMAND RISK CLASSIFIER</span>
            </h4>
            <span className="text-[9px] text-white/40">REAL-TIME POLICY</span>
          </div>

          <p className="text-[11px] font-sans text-white/50">
            Test any shell command or tool invocation against the Zero-Trust execution policy:
          </p>

          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={testCmd}
                onChange={(e) => setTestCmd(e.target.value)}
                placeholder="e.g. npm test, git commit, rm -rf /, curl 169.254.169.254..."
                className="w-full p-2.5 rounded bg-black/40 border border-white/10 text-[11px] text-white placeholder-white/20 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[9px]">
              <span className="text-white/40">PRESETS:</span>
              <button
                type="button"
                onClick={() => setTestCmd('npm test -- --coverage')}
                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors"
              >
                npm test
              </button>
              <button
                type="button"
                onClick={() => setTestCmd('git commit -m "feat: auth"')}
                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors"
              >
                git commit
              </button>
              <button
                type="button"
                onClick={() => setTestCmd('npx prisma migrate deploy')}
                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors"
              >
                db migration
              </button>
              <button
                type="button"
                onClick={() => setTestCmd('rm -rf /')}
                className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 hover:text-white transition-colors"
              >
                rm -rf / (Dangerous)
              </button>
              <button
                type="button"
                onClick={() => setTestCmd('curl http://169.254.169.254/latest/meta-data/')}
                className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 hover:text-white transition-colors"
              >
                Metadata Exfiltration
              </button>
            </div>
          </div>

          {/* Classification result box */}
          <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1.5 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40">SECURITY DECISION:</span>
              {getRiskBadge(evaluatedRisk)}
            </div>
            <p className="text-[10px] font-mono text-white/70 leading-relaxed">
              {evaluatedRisk === 'BLOCKED' && 'STRICTLY PROHIBITED: Pattern violates sandbox isolation boundaries and host protection invariants.'}
              {evaluatedRisk === 'HIGH_RISK' && 'REQUIRES SUPERVISOR: Destructive or systemic changes require explicit human gate approval.'}
              {evaluatedRisk === 'MEDIUM_RISK' && 'MONITORED EXECUTION: Executed inside isolated ephemeral sandbox with output streaming and audit capture.'}
              {evaluatedRisk === 'LOW_RISK' && 'LOW RISK PERMITTED: Read-only or unit testing execution bounded to workspace root.'}
              {evaluatedRisk === 'SAFE' && 'AUTOMATICALLY GRANTED: Read-only inspection of source code and AST entities.'}
            </p>
          </div>
        </div>

        {/* Right: Permission Matrix Table */}
        <div className="rounded-lg bg-[#0a0a0a]/50 border border-white/10 p-4 space-y-3 flex flex-col font-mono">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] uppercase tracking-widest text-white/70 font-bold">
              TOOL GATEWAY PERMISSION MATRIX
            </h4>
            <span className="text-[9px] text-white/40">LEAST PRIVILEGE</span>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto text-xs">
            {permissions.map((perm) => (
              <div
                key={perm.tool}
                className="p-2 rounded bg-black/40 border border-white/5 flex items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-white/90">
                    {perm.tool}
                  </p>
                  <span className="text-[9px] text-white/40">{perm.scope}</span>
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
      <div className="rounded-lg bg-[#0a0a0a]/50 border border-white/10 p-4 space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
            <h4 className="text-[10px] uppercase tracking-widest text-white/70 font-bold">
              ZERO-TRUST SECURITY AUDIT LOG
            </h4>
          </div>
          <span className="text-[10px] text-white/40">
            {project.auditLogs.length} VERIFIED EVENTS
          </span>
        </div>

        <div className="space-y-1.5 overflow-x-auto text-xs">
          {project.auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white/30 text-[10px]">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className="text-cyan-400 font-bold text-[11px]">{log.agent}</span>
                  <span className="text-white/80 font-semibold text-[11px]">{log.action}</span>
                </div>
                <p className="text-white/40 text-[10px] font-sans">
                  {log.details}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getRiskBadge(log.risk)}
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/30">
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
