import { 
  ProjectState, 
  AutonomyMode, 
  Task, 
  TestCase, 
  RepairCycle, 
  ProjectFile, 
  DefinitionOfDoneItem, 
  AIQualityEvaluation,
  SecurityCenterState,
  AuditLogEvent,
  TerminalLog,
  PipelineNodeId
} from '../types';

export function redactSecrets(text: string): string {
  if (!text) return '';
  return text
    .replace(/(?:AIza[0-9A-Za-z-_]{35})/g, 'AIza*******************************')
    .replace(/(?:sk-[a-zA-Z0-9]{20,})/g, 'sk-********************')
    .replace(/(?:ghp_[a-zA-Z0-9]{36})/g, 'ghp_************************************')
    .replace(/(?:Bearer\s+)[a-zA-Z0-9\-._~+/]+=*/g, 'Bearer [REDACTED_JWT_TOKEN]')
    .replace(/(?:password\s*[:=]\s*["']?)[^"',\s]+/gi, 'password="[REDACTED_PASSWORD]"')
    .replace(/(?:DATABASE_URL\s*[:=]\s*["']?)[^"',\s]+/gi, 'DATABASE_URL="postgres://user:****@localhost:5432/db"');
}

export function classifyCommandRisk(cmd: string): 'SAFE' | 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'BLOCKED' {
  const lower = cmd.toLowerCase().trim();
  if (lower.includes('rm -rf /') || lower.includes(':(){ :|:& };:') || lower.includes('/etc/shadow') || lower.includes('curl http://169.254.169.254')) {
    return 'BLOCKED';
  }
  if (lower.includes('drop database') || lower.includes('force-push') || lower.includes('deploy --prod') || lower.includes('grant all privileges')) {
    return 'HIGH_RISK';
  }
  if (lower.includes('npm install') || lower.includes('migrate') || lower.includes('git commit') || lower.includes('chmod')) {
    return 'MEDIUM_RISK';
  }
  if (lower.includes('npm test') || lower.includes('tsc') || lower.includes('eslint') || lower.includes('git diff')) {
    return 'LOW_RISK';
  }
  return 'SAFE';
}

export function createInitialProjectState(
  prompt: string, 
  mode: AutonomyMode = 'MAXIMUM',
  isLiveGemini: boolean = false
): ProjectState {
  const projectId = 'proj_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();

  // Extract a clean project name from prompt
  let name = 'Autonomous Software Project';
  if (prompt.toLowerCase().includes('complaint')) {
    name = 'CivicSense: College Complaint Portal';
  } else if (prompt.toLowerCase().includes('sentinel') || prompt.toLowerCase().includes('health')) {
    name = 'Sentinel: Microservices Health Mesh';
  } else if (prompt.toLowerCase().includes('canvas') || prompt.toLowerCase().includes('collaborative')) {
    name = 'CollabCanvas: Multiplayer Vector Engine';
  } else if (prompt.toLowerCase().includes('ledger') || prompt.toLowerCase().includes('billing')) {
    name = 'FinLedger: Idempotent Billing Core';
  } else if (prompt.length > 0) {
    const words = prompt.split(' ').slice(0, 4).join(' ');
    name = words.charAt(0).toUpperCase() + words.slice(1);
  }

  const initialRequirements = [
    'System Architecture Specification & Domain Modeling',
    'PostgreSQL Schema Design with Foreign Key Cascades & Indexes',
    'JWT Authentication & Role-Based Access Control (RBAC)',
    'Secure REST API Endpoints with Joi/Zod Schema Validation',
    'Responsive Student & Administrator Frontend Dashboard',
    'Real-Time Status Workflows & SLA Escalation Timers',
    'Automated Unit, Integration, & Security Audit Tests (90%+ target)',
    'Zero-Trust Tool Sandboxing & Sanitized Audit Logging',
    'Production Optimized Bundle & Type-Check Verification'
  ];

  const initialTasks: Task[] = [
    {
      id: 'task-1',
      code: 'TASK-001',
      title: 'Analyze Requirements & Extract Domain Entity Graph',
      description: 'Decompose natural language user objective into strict functional and non-functional specifications.',
      agent: 'PLANNER',
      category: 'REQUIREMENTS',
      status: 'PENDING',
      dependencies: [],
      toolCalls: [],
      progress: 0
    },
    {
      id: 'task-2',
      code: 'TASK-002',
      title: 'Design System Architecture & Security Boundary Topology',
      description: 'Define micro-modules, API contracts, zero-trust permission profile, and data flow pipelines.',
      agent: 'PLANNER',
      category: 'ARCHITECTURE',
      status: 'PENDING',
      dependencies: ['TASK-001'],
      toolCalls: [],
      progress: 0
    },
    {
      id: 'task-3',
      code: 'TASK-003',
      title: 'Initialize Workspace & Establish Zero-Trust Sandbox Layer',
      description: 'Create directory hierarchy, configure TypeScript strict mode, and lock down host OS execution boundaries.',
      agent: 'DEVELOPER',
      category: 'ARCHITECTURE',
      status: 'PENDING',
      dependencies: ['TASK-002'],
      toolCalls: [],
      progress: 0
    },
    {
      id: 'task-4',
      code: 'TASK-004',
      title: 'Generate Relational Schema with Audit Trails & Migrations',
      description: 'Write PostgreSQL DDL with UUID primary keys, role enums, SLA timestamps, and index optimization.',
      agent: 'DEVELOPER',
      category: 'DATABASE',
      status: 'PENDING',
      dependencies: ['TASK-003'],
      toolCalls: [],
      progress: 0
    },
    {
      id: 'task-5',
      code: 'TASK-005',
      title: 'Implement JWT Authentication & RBAC Guard Middleware',
      description: 'Implement token issuance, bcrypt password hashing, signature verification, and permission enforcement.',
      agent: 'DEVELOPER',
      category: 'AUTHENTICATION',
      status: 'PENDING',
      dependencies: ['TASK-004'],
      toolCalls: [],
      progress: 0
    },
    {
      id: 'task-6',
      code: 'TASK-006',
      title: 'Build Complaint Management REST API with Input Validation',
      description: 'Implement CRUD controllers with Zod schema validation, pagination, and SLA escalation triggers.',
      agent: 'DEVELOPER',
      category: 'BACKEND',
      status: 'PENDING',
      dependencies: ['TASK-005'],
      toolCalls: [],
      progress: 0
    },
    {
      id: 'task-7',
      code: 'TASK-007',
      title: 'Develop Student & Admin Web Interfaces with Live State',
      description: 'Build responsive UI with grievance timeline, category filters, photo preview, and SLA countdowns.',
      agent: 'DEVELOPER',
      category: 'FRONTEND',
      status: 'PENDING',
      dependencies: ['TASK-006'],
      toolCalls: [],
      progress: 0
    },
    {
      id: 'task-8',
      code: 'TASK-008',
      title: 'Execute Automated Test Suite & Run Failure-Repair Loop',
      description: 'Run unit & integration test suites. Detect regressions, perform root-cause analysis, and auto-patch bugs.',
      agent: 'TESTER',
      category: 'TESTING',
      status: 'PENDING',
      dependencies: ['TASK-007'],
      toolCalls: [],
      progress: 0
    },
    {
      id: 'task-9',
      code: 'TASK-009',
      title: 'Execute Security Vulnerability Scan & Static Code Analysis',
      description: 'Audit against OWASP Top 10, check for path traversal vulnerabilities, secret leakage, and SQL injection.',
      agent: 'SECURITY_ANALYZER',
      category: 'SECURITY',
      status: 'PENDING',
      dependencies: ['TASK-008'],
      toolCalls: [],
      progress: 0
    },
    {
      id: 'task-10',
      code: 'TASK-010',
      title: 'Perform Final Definition of Done Verification & Sign-Off',
      description: 'Validate complete build passes, all tests green, 0 security issues, and AI quality metrics >= 90%.',
      agent: 'FINAL_EVALUATOR',
      category: 'VERIFICATION',
      status: 'PENDING',
      dependencies: ['TASK-009'],
      toolCalls: [],
      progress: 0
    }
  ];

  const initialFiles: ProjectFile[] = [
    {
      path: 'server/middleware/auth.ts',
      name: 'auth.ts',
      language: 'typescript',
      content: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-32-chars-long-min!';
const JWT_AUDIENCE = 'civicsense-api';
const JWT_ISSUER = 'civicsense-auth';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN' | 'DEAN';
}

export function authenticateToken(req: Request & { user?: AuthenticatedUser }, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    // Note: Verification checks issuer, audience, and expiry
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      audience: JWT_AUDIENCE,
      issuer: JWT_ISSUER
    }) as AuthenticatedUser;

    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ error: 'Invalid or forged authentication token' });
  }
}

export function requireRole(allowedRoles: ('STUDENT' | 'FACULTY' | 'ADMIN' | 'DEAN')[]) {
  return (req: Request & { user?: AuthenticatedUser }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden: Insufficient privileges for role ' + req.user.role 
      });
    }
    next();
  };
}
`
    },
    {
      path: 'server/routes/complaints.ts',
      name: 'complaints.ts',
      language: 'typescript',
      content: `import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

const ComplaintSchema = z.object({
  title: z.string().min(5).max(120),
  category: z.enum(['ACADEMIC', 'FACILITY', 'HOSTEL', 'FINANCE', 'DISCIPLINE', 'OTHER']),
  description: z.string().min(20).max(2000),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  isAnonymous: z.boolean().default(false),
  attachments: z.array(z.string().url()).optional()
});

// In-memory persistent collection with SLA timers
const complaintsDb = new Map<string, any>();

router.post('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const validated = ComplaintSchema.parse(req.body);
    const complaintId = 'CMP-' + Math.floor(100000 + Math.random() * 900000);
    
    // Calculate SLA target based on urgency
    const hoursToResolve = validated.urgency === 'CRITICAL' ? 12 : validated.urgency === 'HIGH' ? 24 : 72;
    const slaDeadline = new Date(Date.now() + hoursToResolve * 60 * 60 * 1000).toISOString();

    const record = {
      id: complaintId,
      ...validated,
      studentId: validated.isAnonymous ? 'ANONYMOUS' : req.user.id,
      studentEmail: validated.isAnonymous ? null : req.user.email,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      slaDeadline,
      timeline: [
        {
          status: 'SUBMITTED',
          actor: req.user.email,
          timestamp: new Date().toISOString(),
          note: 'Grievance ticket registered in system.'
        }
      ]
    };

    complaintsDb.set(complaintId, record);
    return res.status(201).json({ success: true, complaint: record });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', issues: err.issues });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authenticateToken, (req: any, res: Response) => {
  const all = Array.from(complaintsDb.values());
  if (req.user.role === 'STUDENT') {
    const userComplaints = all.filter(c => c.studentId === req.user.id || (c.isAnonymous && c.studentId === 'ANONYMOUS'));
    return res.json({ complaints: userComplaints });
  }
  return res.json({ complaints: all });
});

export default router;
`
    },
    {
      path: 'src/components/StudentDashboard.tsx',
      name: 'StudentDashboard.tsx',
      language: 'typescript',
      content: `import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Filter, Plus, ShieldCheck } from 'lucide-react';

export function StudentDashboard() {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* SLA Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-sm">
            <span>Total Tickets</span>
            <Filter className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-mono mt-2 text-white">14</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-sm">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono mt-2 text-amber-400">3</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-sm">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono mt-2 text-emerald-400">11</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-sm">
            <span>SLA Compliance</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-mono mt-2 text-cyan-400">98.2%</p>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          {(['ALL', 'ACTIVE', 'RESOLVED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={\`px-3 py-1.5 rounded-md text-xs font-medium transition-colors \${
                filter === tab ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-neutral-400 hover:text-white'
              }\`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Submit Grievance
        </button>
      </div>
    </div>
  );
}
`
    },
    {
      path: 'tests/auth.test.ts',
      name: 'auth.test.ts',
      language: 'typescript',
      content: `import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticateToken, requireRole } from '../server/middleware/auth';

const SECRET = 'dev-secret-key-32-chars-long-min!';

describe('Authentication & RBAC Middleware Test Suite', () => {
  it('should reject unauthenticated request with 401 code', () => {
    const req: any = { headers: {} };
    let status = 0;
    let jsonBody: any = null;
    const res: any = {
      status: (s: number) => { status = s; return res; },
      json: (j: any) => { jsonBody = j; }
    };
    const next = () => {};

    authenticateToken(req, res, next);
    expect(status).toBe(401);
    expect(jsonBody.error).toBe('Authentication token required');
  });

  it('should decode valid JWT token with proper claims and audience', () => {
    const payload = { id: 'usr-101', email: 'student@campus.edu', role: 'STUDENT' };
    const token = jwt.sign(payload, SECRET, {
      algorithm: 'HS256',
      audience: 'civicsense-api',
      issuer: 'civicsense-auth',
      expiresIn: '2h'
    });

    const req: any = { headers: { authorization: \`Bearer \${token}\` } };
    let nextCalled = false;
    const res: any = {};
    const next = () => { nextCalled = true; };

    authenticateToken(req, res, next);
    expect(nextCalled).toBe(true);
    expect(req.user.email).toBe('student@campus.edu');
    expect(req.user.role).toBe('STUDENT');
  });

  it('should prevent student role from accessing admin endpoints', () => {
    const req: any = { user: { id: 'usr-101', role: 'STUDENT' } };
    let status = 0;
    const res: any = {
      status: (s: number) => { status = s; return res; },
      json: () => {}
    };
    const next = () => {};

    const guard = requireRole(['ADMIN', 'DEAN']);
    guard(req, res, next);
    expect(status).toBe(403);
  });
});
`
    },
    {
      path: 'index.html',
      name: 'index.html',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CivicSense: College Complaint Portal</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #0a0b10; color: #f3f4f6; min-height: 100vh; padding: 20px; }
    .container { max-width: 1100px; margin: 0 auto; }
    header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .brand { display: flex; align-items: center; gap: 10px; }
    .logo-badge { background: #06b6d4; color: #000; font-weight: 800; font-size: 14px; padding: 6px 12px; border-radius: 8px; font-family: monospace; }
    h1 { font-size: 20px; font-weight: 700; color: #fff; }
    .nav-tabs { display: flex; gap: 8px; background: #12131c; padding: 4px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); }
    .tab-btn { background: transparent; border: none; color: #9ca3af; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
    .tab-btn.active { background: #06b6d4; color: #000; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .metric-card { background: #141622; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; }
    .metric-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace; }
    .metric-val { font-size: 28px; font-weight: 700; color: #fff; margin-top: 4px; font-family: monospace; }
    .panel { background: #141622; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 24px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 12px; color: #d1d5db; margin-bottom: 6px; font-weight: 600; font-family: monospace; }
    input, select, textarea { width: 100%; background: #0a0b10; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 10px 14px; color: #fff; font-size: 13px; outline: none; }
    input:focus, select:focus, textarea:focus { border-color: #06b6d4; }
    .btn-submit { background: #06b6d4; color: #000; font-weight: 700; font-size: 14px; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; width: 100%; transition: opacity 0.15s; }
    .btn-submit:hover { opacity: 0.9; }
    .search-bar { display: flex; gap: 10px; margin-bottom: 16px; }
    .complaint-card { background: #0d0e17; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; margin-bottom: 12px; transition: border-color 0.15s; }
    .complaint-card:hover { border-color: rgba(6,182,212,0.4); }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 8px; }
    .badge { font-size: 10px; font-family: monospace; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
    .badge-submitted { background: rgba(59,130,246,0.2); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
    .badge-review { background: rgba(245,158,11,0.2); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
    .badge-resolved { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
    .badge-critical { background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
    .actions { display: flex; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px dashed rgba(255,255,255,0.08); }
    .action-btn { background: #1f2233; border: 1px solid rgba(255,255,255,0.1); color: #d1d5db; font-size: 11px; padding: 5px 10px; border-radius: 6px; cursor: pointer; }
    .action-btn:hover { background: #2b2f47; color: #fff; }
    .toast { position: fixed; bottom: 20px; right: 20px; background: #06b6d4; color: #000; font-weight: 700; font-size: 13px; padding: 12px 20px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: none; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <span class="logo-badge">CIVICSENSE</span>
        <h1>College Grievance Redressal System</h1>
      </div>
      <div class="nav-tabs">
        <button class="tab-btn active" onclick="switchTab('submit')">File Grievance</button>
        <button class="tab-btn" onclick="switchTab('track')">Track & Triage</button>
        <button class="tab-btn" onclick="switchTab('metrics')">SLA Metrics</button>
      </div>
    </header>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Tickets</div>
        <div id="statTotal" class="metric-val">12</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Active / In Progress</div>
        <div id="statActive" class="metric-val" style="color:#fbbf24;">4</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Resolved</div>
        <div id="statResolved" class="metric-val" style="color:#34d399;">8</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">SLA Compliance Rate</div>
        <div id="statSla" class="metric-val" style="color:#22d3ee;">98.4%</div>
      </div>
    </div>

    <!-- TAB 1: Submit Form -->
    <div id="tabSubmit" class="panel">
      <h2 style="font-size:16px; margin-bottom:16px; color:#fff;">File a New Official Campus Grievance</h2>
      <form id="grievanceForm" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label for="titleInput">GRIEVANCE TITLE</label>
          <input type="text" id="titleInput" name="title" placeholder="e.g. Wi-Fi outage in Block B 3rd Floor" required minlength="5" />
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div class="form-group">
            <label for="categorySelect">CATEGORY</label>
            <select id="categorySelect" name="category">
              <option value="FACILITY">Campus Facility / Maintenance</option>
              <option value="ACADEMIC">Academic & Coursework</option>
              <option value="HOSTEL">Hostel & Accommodation</option>
              <option value="FINANCE">Tuition & Scholarship</option>
              <option value="DISCIPLINE">Code of Conduct</option>
            </select>
          </div>
          <div class="form-group">
            <label for="urgencySelect">URGENCY LEVEL</label>
            <select id="urgencySelect" name="urgency">
              <option value="LOW">Low (72h SLA)</option>
              <option value="MEDIUM" selected>Medium (48h SLA)</option>
              <option value="HIGH">High (24h SLA)</option>
              <option value="CRITICAL">Critical Emergency (12h SLA)</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="descInput">DETAILED DESCRIPTION</label>
          <textarea id="descInput" name="description" rows="4" placeholder="Provide full context, room numbers, dates, and impact..." required minlength="15"></textarea>
        </div>
        <div class="form-group" style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" id="anonCheck" name="anonymous" style="width:auto;" />
          <label for="anonCheck" style="margin:0; cursor:pointer;">File Anonymously (Hide Student ID from Faculty)</label>
        </div>
        <button type="submit" class="btn-submit">SUBMIT GRIEVANCE TICKET</button>
      </form>
    </div>

    <!-- TAB 2: Track & Triage -->
    <div id="tabTrack" class="panel" style="display:none;">
      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search grievances by keyword, ID, category..." oninput="renderComplaints()" />
        <select id="filterStatus" onchange="renderComplaints()" style="width:180px;">
          <option value="ALL">All Statuses</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>
      <div id="complaintsList"></div>
    </div>

    <!-- TAB 3: Metrics -->
    <div id="tabMetrics" class="panel" style="display:none;">
      <h2 style="font-size:16px; margin-bottom:16px; color:#fff;">Department Performance & SLA Adherence</h2>
      <p style="font-size:13px; color:#9ca3af; margin-bottom:20px; line-height:1.6;">Real-time automated calculations of resolution turnarounds across Campus Facilities, Academics, and Administration.</p>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:16px;">
        <div style="background:#0d0e17; padding:16px; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:12px; color:#9ca3af; font-family:monospace; margin-bottom:8px;">FACILITIES (MAINTENANCE)</div>
          <div style="font-size:20px; font-weight:700; color:#34d399;">96.8% Resolved in SLA</div>
          <div style="font-size:11px; color:#6b7280; margin-top:4px;">Average time: 14.2 hours</div>
        </div>
        <div style="background:#0d0e17; padding:16px; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:12px; color:#9ca3af; font-family:monospace; margin-bottom:8px;">ACADEMIC AFFAIRS</div>
          <div style="font-size:20px; font-weight:700; color:#60a5fa;">100% Resolved in SLA</div>
          <div style="font-size:11px; color:#6b7280; margin-top:4px;">Average time: 8.5 hours</div>
        </div>
        <div style="background:#0d0e17; padding:16px; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:12px; color:#9ca3af; font-family:monospace; margin-bottom:8px;">HOSTEL RESIDENCE</div>
          <div style="font-size:20px; font-weight:700; color:#fbbf24;">92.5% Resolved in SLA</div>
          <div style="font-size:11px; color:#6b7280; margin-top:4px;">Average time: 22.1 hours</div>
        </div>
      </div>
    </div>
  </div>

  <div id="toast" class="toast">Grievance ticket successfully submitted!</div>

  <script>
    let complaints = JSON.parse(localStorage.getItem('civic_complaints')) || [
      { id: 'CMP-849201', title: 'Main Library 2nd Floor AC malfunctioning', category: 'FACILITY', urgency: 'HIGH', status: 'UNDER_REVIEW', desc: 'Temperature exceeding 32C during peak afternoon study hours.', date: 'Today at 09:30 AM', isAnon: false },
      { id: 'CMP-739102', title: 'Grading discrepancy on CS302 Midterm Exam', category: 'ACADEMIC', urgency: 'MEDIUM', status: 'SUBMITTED', desc: 'Question 4 rubric was applied incorrectly for Section B students.', date: 'Yesterday at 04:15 PM', isAnon: false },
      { id: 'CMP-619283', title: 'Hot water geyser failure in Hostel Block C', category: 'HOSTEL', urgency: 'CRITICAL', status: 'RESOLVED', desc: 'Geyser in 3rd-floor bathroom stopped heating entirely.', date: '2 days ago', isAnon: true }
    ];

    function saveState() {
      localStorage.setItem('civic_complaints', JSON.stringify(complaints));
      updateStats();
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }

    function switchTab(tab) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('tabSubmit').style.display = tab === 'submit' ? 'block' : 'none';
      document.getElementById('tabTrack').style.display = tab === 'track' ? 'block' : 'none';
      document.getElementById('tabMetrics').style.display = tab === 'metrics' ? 'block' : 'none';
      
      const buttons = document.querySelectorAll('.tab-btn');
      if (tab === 'submit') buttons[0].classList.add('active');
      if (tab === 'track') { buttons[1].classList.add('active'); renderComplaints(); }
      if (tab === 'metrics') buttons[2].classList.add('active');
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      const title = document.getElementById('titleInput').value.trim();
      const category = document.getElementById('categorySelect').value;
      const urgency = document.getElementById('urgencySelect').value;
      const desc = document.getElementById('descInput').value.trim();
      const isAnon = document.getElementById('anonCheck').checked;

      const newTicket = {
        id: 'CMP-' + Math.floor(100000 + Math.random() * 900000),
        title,
        category,
        urgency,
        desc,
        isAnon,
        status: 'SUBMITTED',
        date: 'Just now'
      };

      complaints.unshift(newTicket);
      saveState();
      document.getElementById('grievanceForm').reset();
      showToast('Grievance ' + newTicket.id + ' registered successfully!');
      switchTab('track');
    }

    function updateStatus(id, newStatus) {
      const item = complaints.find(c => c.id === id);
      if (item) {
        item.status = newStatus;
        saveState();
        renderComplaints();
        showToast('Ticket ' + id + ' transitioned to ' + newStatus);
      }
    }

    function deleteTicket(id) {
      complaints = complaints.filter(c => c.id !== id);
      saveState();
      renderComplaints();
      showToast('Ticket ' + id + ' removed');
    }

    function updateStats() {
      const total = complaints.length;
      const active = complaints.filter(c => c.status !== 'RESOLVED').length;
      const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
      document.getElementById('statTotal').textContent = total;
      document.getElementById('statActive').textContent = active;
      document.getElementById('statResolved').textContent = resolved;
    }

    function renderComplaints() {
      const search = (document.getElementById('searchInput').value || '').toLowerCase();
      const filter = document.getElementById('filterStatus').value;
      const container = document.getElementById('complaintsList');

      const filtered = complaints.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search) || c.id.toLowerCase().includes(search) || c.category.toLowerCase().includes(search);
        const matchesStatus = filter === 'ALL' || c.status === filter;
        return matchesSearch && matchesStatus;
      });

      if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:32px; color:#6b7280; font-size:13px;">No grievance records match your filter criteria.</div>';
        return;
      }

      container.innerHTML = filtered.map(c => {
        const statusBadgeClass = c.status === 'SUBMITTED' ? 'badge-submitted' : c.status === 'UNDER_REVIEW' ? 'badge-review' : 'badge-resolved';
        const urgencyBadgeClass = c.urgency === 'CRITICAL' ? 'badge-critical' : '';
        return \`
          <div class="complaint-card">
            <div class="card-header">
              <div>
                <span style="font-family:monospace; font-size:11px; color:#06b6d4; font-weight:bold; margin-right:8px;">\${c.id}</span>
                <span class="badge \${statusBadgeClass}">\${c.status.replace('_', ' ')}</span>
                \${c.urgency === 'CRITICAL' ? '<span class="badge badge-critical" style="margin-left:6px;">CRITICAL SLA</span>' : ''}
                \${c.isAnon ? '<span class="badge" style="background:#27272a; color:#a1a1aa; margin-left:6px;">ANONYMOUS</span>' : ''}
                <h3 style="font-size:15px; font-weight:600; color:#fff; margin-top:6px;">\${c.title}</h3>
              </div>
              <span style="font-size:11px; color:#6b7280; font-family:monospace;">\${c.date}</span>
            </div>
            <p style="font-size:13px; color:#9ca3af; line-height:1.5; margin:8px 0;">\${c.desc}</p>
            <div class="actions">
              \${c.status === 'SUBMITTED' ? '<button class="action-btn" onclick="updateStatus(\\'' + c.id + '\\', \\'UNDER_REVIEW\\')">Mark Under Review</button>' : ''}
              \${c.status === 'UNDER_REVIEW' ? '<button class="action-btn" onclick="updateStatus(\\'' + c.id + '\\', \\'RESOLVED\\')">Mark Resolved</button>' : ''}
              \${c.status === 'RESOLVED' ? '<button class="action-btn" onclick="updateStatus(\\'' + c.id + '\\', \\'SUBMITTED\\')">Reopen Ticket</button>' : ''}
              <button class="action-btn" style="margin-left:auto; color:#ef4444;" onclick="deleteTicket('\\'' + c.id + '\\'')">Delete</button>
            </div>
          </div>
        \`;
      }).join('');
    }

    updateStats();
    renderComplaints();
  </script>
</body>
</html>`
    }
  ];

  const initialTests: TestCase[] = [
    { id: 'test-1', name: 'Reject missing Authorization header with 401', suite: 'auth.test.ts', status: 'PENDING', durationMs: 42 },
    { id: 'test-2', name: 'Verify JWT signature, issuer, and audience', suite: 'auth.test.ts', status: 'PENDING', durationMs: 58 },
    { id: 'test-3', name: 'Enforce RBAC role permissions across student/admin gates', suite: 'auth.test.ts', status: 'PENDING', durationMs: 34 },
    { id: 'test-4', name: 'Handle token expiration gracefully with refresh code', suite: 'auth.test.ts', status: 'PENDING', durationMs: 29 },
    { id: 'test-5', name: 'Validate complaint creation with Zod schema rules', suite: 'api.test.ts', status: 'PENDING', durationMs: 82 },
    { id: 'test-6', name: 'Enforce automatic SLA deadline calculation by urgency level', suite: 'api.test.ts', status: 'PENDING', durationMs: 47 },
    { id: 'test-7', name: 'Sanitize malicious XSS payloads in complaint description', suite: 'security.test.ts', status: 'PENDING', durationMs: 65 },
    { id: 'test-8', name: 'Block SQL injection attempts in search filter parameters', suite: 'security.test.ts', status: 'PENDING', durationMs: 71 },
    { id: 'test-9', name: 'Zero-Trust sandbox path traversal prevention test (../ shield)', suite: 'security.test.ts', status: 'PENDING', durationMs: 38 }
  ];

  const initialDoD: DefinitionOfDoneItem[] = [
    { id: 'dod-1', label: 'TypeScript compilation & strict type-checking passes with 0 errors', status: 'PENDING', category: 'Build' },
    { id: 'dod-2', label: 'Backend Express server boots & binds to 0.0.0.0:3000 cleanly', status: 'PENDING', category: 'Backend' },
    { id: 'dod-3', label: 'Relational database schema migration applies with foreign key constraints', status: 'PENDING', category: 'Database' },
    { id: 'dod-4', label: 'JWT Authentication & Role-Based Access Control verified', status: 'PENDING', category: 'Security' },
    { id: 'dod-5', label: 'Complete CRUD API with Zod schema validation & SLA timers functioning', status: 'PENDING', category: 'API' },
    { id: 'dod-6', label: 'Automated test suite executes with 100% passing tests (0 failures)', status: 'PENDING', category: 'Quality' },
    { id: 'dod-7', label: 'Zero-Trust security scan: 0 critical vulnerabilities, path traversal shielded', status: 'PENDING', category: 'Security' },
    { id: 'dod-8', label: 'Code quality evaluation score exceeds 90% threshold across all pillars', status: 'PENDING', category: 'Evaluation' },
    { id: 'dod-9', label: 'Full project execution report, audit logs, and artifacts verified', status: 'PENDING', category: 'Verification' }
  ];

  const initialEvaluation: AIQualityEvaluation = {
    architectureScore: 92,
    codeQualityScore: 89,
    securityScore: 96,
    uxScore: 88,
    requirementComplianceScore: 100,
    overallScore: 93,
    categories: [
      {
        name: 'Architecture & Modularity',
        score: 92,
        verdict: 'Excellent Separation of Concerns',
        details: 'Clean layer decoupling between API routers, middleware guards, domain validators, and state storage.'
      },
      {
        name: 'Code Quality & Maintainability',
        score: 89,
        verdict: 'Strict TypeScript typing',
        details: 'Strongly typed DTO interfaces, explicit error codes, and zero unhandled Promise rejections.'
      },
      {
        name: 'Security & Zero-Trust Defense',
        score: 96,
        verdict: 'Defense-in-depth enforced',
        details: 'Command risk classification, secret redaction, path normalization, and RBAC authorization applied server-side.'
      },
      {
        name: 'User Experience & Responsiveness',
        score: 88,
        verdict: 'Accessible & Ergonomic',
        details: 'SLA countdown urgency badges, instantaneous filter updates, and accessible contrast ratios.'
      },
      {
        name: 'Requirement Compliance',
        score: 100,
        verdict: '100% User Goal Fulfillment',
        details: 'All requested student/admin workflows, JWT auth, SLA timers, and verification requirements fulfilled.'
      }
    ]
  };

  const initialSecurity: SecurityCenterState = {
    authentication: true,
    authorization: true,
    sandboxIsolation: true,
    secretProtection: true,
    networkPolicy: true,
    commandPolicy: true,
    promptInjectionDefense: true,
    auditLogging: true,
    rateLimiting: true,
    riskCounts: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 6,
      safe: 18
    },
    blockedAttempts: 0,
    activeSandboxes: 1,
    secretsScanned: 24,
    secretExposureCount: 0
  };

  const initialTerminalLogs: TerminalLog[] = [
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      agent: 'ORCHESTRATOR',
      level: 'SYSTEM',
      message: 'AUTOLOOP Autonomous Engine v2.4 initialized. Ready for objective.'
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString(),
      agent: 'PLANNER',
      level: 'INFO',
      message: `Project Objective loaded: "${prompt.slice(0, 70)}..."`
    },
    {
      id: 'log-3',
      timestamp: new Date().toLocaleTimeString(),
      agent: 'SECURITY_ANALYZER',
      level: 'SECURITY',
      message: 'Zero-Trust Tool Gateway active: Path traversal shield ON, Secret Redactor ON, Command Risk Filter ON.'
    }
  ];

  return {
    projectId,
    name,
    objective: prompt,
    originalUserPrompt: prompt,
    description: 'Autonomous AI software engineering project with continuous verification & self-repair loop.',
    autonomyMode: mode,
    status: 'IDLE',
    activeNode: 'GOAL',
    createdAt: now,
    updatedAt: now,
    elapsedSeconds: 0,
    tokensUsed: 1240,
    computeSeconds: 0,
    requirements: initialRequirements,
    tasks: initialTasks,
    currentTaskId: null,
    files: initialFiles,
    activeFilePath: 'server/middleware/auth.ts',
    testCases: initialTests,
    repairHistory: [],
    activeRepair: null,
    definitionOfDone: initialDoD,
    evaluation: initialEvaluation,
    security: initialSecurity,
    auditLogs: [
      {
        id: 'audit-1',
        timestamp: now,
        agent: 'ORCHESTRATOR',
        action: 'PROJECT_INITIALIZED',
        risk: 'SAFE',
        status: 'SUCCESS',
        details: 'Project state graph bootstrapped with Zero-Trust policy profile.'
      }
    ],
    terminalLogs: initialTerminalLogs,
    pendingInterventions: [],
    checkpoints: [
      {
        id: 'chk-init',
        name: 'Initial Clean State',
        timestamp: now,
        taskCode: 'INIT'
      }
    ],
    metrics: {
      totalTasks: 10,
      completedTasks: 0,
      failedTasks: 0,
      totalRequirements: initialRequirements.length,
      satisfiedRequirements: 0,
      totalTests: initialTests.length,
      passingTests: 0,
      failingTests: 0,
      coveragePct: 0,
      buildStatus: 'PENDING',
      typeErrors: 0,
      lintErrors: 0,
      securityIssues: 0,
      confidenceScore: 0,
      repairCyclesCount: 0
    },
    isLiveGemini
  };
}
