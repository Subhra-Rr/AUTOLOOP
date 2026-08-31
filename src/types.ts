export type AutonomyMode = 'MAXIMUM' | 'BALANCED' | 'HUMAN_APPROVAL';

export type ProjectStatus = 
  | 'IDLE'
  | 'INITIALIZING'
  | 'ANALYZING'
  | 'PLANNING'
  | 'EXECUTING'
  | 'TESTING'
  | 'EVALUATING'
  | 'REPAIRING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'BLOCKED'
  | 'PAUSED';

export type PipelineNodeId = 
  | 'GOAL'
  | 'ANALYZE'
  | 'PLAN'
  | 'EXECUTE'
  | 'OBSERVE'
  | 'TEST'
  | 'EVALUATE'
  | 'REPAIR'
  | 'VERIFY'
  | 'DONE';

export type AgentRole = 
  | 'ORCHESTRATOR'
  | 'PLANNER'
  | 'DEVELOPER'
  | 'EXECUTOR'
  | 'TESTER'
  | 'REVIEWER'
  | 'REPAIR_AGENT'
  | 'SECURITY_ANALYZER'
  | 'SECURITY'
  | 'DOCUMENTATION_AGENT'
  | 'FINAL_EVALUATOR'
  | 'SYSTEM';

export type TaskStatus = 
  | 'PENDING'
  | 'PLANNING'
  | 'RUNNING'
  | 'TESTING'
  | 'REPAIRING'
  | 'PASSED'
  | 'FAILED'
  | 'BLOCKED';

export type ToolRisk = 'SAFE' | 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'CRITICAL' | 'BLOCKED';

export type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'SUCCESS' | 'SECURITY' | 'SYSTEM';

export interface ToolCall {
  id: string;
  tool: string;
  arguments: Record<string, any>;
  risk: ToolRisk;
  output: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILURE' | 'REJECTED';
  timestamp: string;
  durationMs: number;
  redacted?: boolean;
}

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  agent: AgentRole;
  category: 
    | 'REQUIREMENTS'
    | 'ARCHITECTURE'
    | 'DATABASE'
    | 'AUTHENTICATION'
    | 'BACKEND'
    | 'FRONTEND'
    | 'INTEGRATION'
    | 'TESTING'
    | 'SECURITY'
    | 'BUILD'
    | 'VERIFICATION';
  status: TaskStatus;
  dependencies: string[];
  toolCalls: ToolCall[];
  progress: number;
  testCount?: number;
  passCount?: number;
  repairCycles?: number;
  completedAt?: string;
  errorMessage?: string;
}

export interface TestCase {
  id: string;
  name: string;
  suite: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED' | 'SKIPPED';
  durationMs: number;
  errorDetails?: {
    message: string;
    file: string;
    line: number;
    expected: string;
    actual: string;
    stackTrace?: string;
  };
  repairedInCycle?: number;
}

export interface RepairCycle {
  id: string;
  taskId: string;
  taskTitle: string;
  failureReason: string;
  rootCause: string;
  strategy: string;
  patchDiff: {
    file: string;
    before: string;
    after: string;
  };
  attemptNumber: number;
  maxAttempts: number;
  status: 'ANALYZING' | 'PATCHING' | 'RETESTING' | 'RESOLVED' | 'FAILED';
  timestamp: string;
}

export interface ProjectFile {
  path: string;
  name: string;
  language: string;
  content: string;
  originalContent?: string;
  isModified?: boolean;
  isNew?: boolean;
  lastModifiedBy?: AgentRole;
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  agent: AgentRole;
  taskId?: string;
  action: string;
  tool?: string;
  risk: ToolRisk;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED' | 'BLOCKED';
  details: string;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  agent: AgentRole;
  level: LogLevel;
  message: string;
  rawPayload?: any;
  toolName?: string;
}

export interface DefinitionOfDoneItem {
  id: string;
  label: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED';
  category: string;
  verifiedAt?: string;
}

export interface HumanInterventionRequest {
  id: string;
  projectId: string;
  taskId?: string;
  type: 
    | 'CREDENTIALS_REQUIRED'
    | 'PERMISSION_ESCALATION'
    | 'DESTRUCTIVE_CONFIRMATION'
    | 'AMBIGUOUS_REQUIREMENT'
    | 'MAX_REPAIRS_EXCEEDED'
    | 'SECURITY_ALERT';
  title: string;
  description: string;
  requestedAction: string;
  suggestedAction?: string;
  proposedData?: any;
  risk: ToolRisk;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFIED';
  timestamp: string;
}

export type ExecutionMetrics = ProjectState['metrics'];

export interface AIQualityEvaluation {
  architectureScore: number;
  codeQualityScore: number;
  securityScore: number;
  uxScore: number;
  requirementComplianceScore: number;
  overallScore: number;
  categories: {
    name: string;
    score: number;
    verdict: string;
    details: string;
    recommendations?: string[];
  }[];
}

export interface SecurityCenterState {
  authentication: boolean;
  authorization: boolean;
  sandboxIsolation: boolean;
  secretProtection: boolean;
  networkPolicy: boolean;
  commandPolicy: boolean;
  promptInjectionDefense: boolean;
  auditLogging: boolean;
  rateLimiting: boolean;
  riskCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    safe: number;
  };
  blockedAttempts: number;
  activeSandboxes: number;
  secretsScanned: number;
  secretExposureCount: number;
}

export interface ProjectState {
  projectId: string;
  name: string;
  objective: string;
  originalUserPrompt: string;
  description: string;
  autonomyMode: AutonomyMode;
  status: ProjectStatus;
  activeNode: PipelineNodeId;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  elapsedSeconds: number;
  tokensUsed: number;
  computeSeconds: number;
  requirements: string[];
  tasks: Task[];
  currentTaskId: string | null;
  files: ProjectFile[];
  activeFilePath: string | null;
  testCases: TestCase[];
  repairHistory: RepairCycle[];
  activeRepair: RepairCycle | null;
  definitionOfDone: DefinitionOfDoneItem[];
  evaluation: AIQualityEvaluation;
  security: SecurityCenterState;
  auditLogs: AuditLogEvent[];
  terminalLogs: TerminalLog[];
  pendingInterventions: HumanInterventionRequest[];
  checkpoints: {
    id: string;
    name: string;
    timestamp: string;
    taskCode: string;
  }[];
  metrics: {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    totalRequirements: number;
    satisfiedRequirements: number;
    totalTests: number;
    passingTests: number;
    failingTests: number;
    coveragePct: number;
    buildStatus: 'PASSED' | 'FAILED' | 'PENDING';
    typeErrors: number;
    lintErrors: number;
    securityIssues: number;
    confidenceScore: number;
    repairCyclesCount: number;
  };
  isLiveGemini: boolean;
}

export interface ProjectTemplate {
  id: string;
  title: string;
  icon: string;
  category: string;
  shortDesc: string;
  prompt: string;
  estimatedTasks: number;
  requirements: string[];
  techStack: string[];
}
