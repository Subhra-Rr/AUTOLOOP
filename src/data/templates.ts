import { ProjectTemplate } from '../types';

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'college-complaint-system',
    title: 'College Complaint Management Platform',
    icon: 'GraduationCap',
    category: 'Full-Stack Web App',
    shortDesc: 'Automated student grievance tracking, SLA escalations, role-based access, and analytics.',
    prompt: 'Build a production-ready college complaint management platform with student and administrator portals, categorized complaint filing with photo uploads, SLA escalation timers, status workflows (Submitted -> Under Review -> Investigating -> Resolved), JWT authentication with RBAC, Postgres schema, REST API, and responsive student dashboard.',
    estimatedTasks: 16,
    requirements: [
      'Role-based access control (Student, Faculty, Dean, Admin)',
      'Secure JWT authentication with refresh tokens',
      'Complaint submission with category, urgency, and attachments',
      'Automated SLA tracking and urgent escalation notifications',
      'Administrator dashboard with triage filtering and status transitions',
      'Student real-time tracking timeline',
      'PostgreSQL schema with migrations and foreign-key integrity',
      'Robust validation middleware and sanitized inputs',
      'Comprehensive unit and integration test suite with 90%+ coverage'
    ],
    techStack: ['React 19', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'TailwindCSS', 'Vitest']
  },
  {
    id: 'microservice-health-sentinel',
    title: 'Autonomous Microservice Health Sentinel',
    icon: 'Activity',
    category: 'DevOps & Reliability',
    shortDesc: 'Distributed health monitoring, automated anomaly detection, circuit breaker, and self-healing webhooks.',
    prompt: 'Build an autonomous microservices health sentinel that monitors 12 simulated microservices via HTTP/gRPC health probes, calculates p99 latencies, detects memory leaks, triggers circuit breakers when error rate exceeds 5%, dispatches self-healing webhooks, and provides a real-time observability telemetry dashboard with incident postmortems.',
    estimatedTasks: 14,
    requirements: [
      'Configurable HTTP/gRPC health probe polling engine',
      'Real-time p50, p90, and p99 latency metric aggregations',
      'Automated circuit-breaker state machine (Closed, Open, Half-Open)',
      'Anomaly detection heuristics for rapid error spikes',
      'Self-healing automated webhook remediation dispatch',
      'Incident management lifecycle with post-mortem logs',
      'Observability dashboard with live health graph topology'
    ],
    techStack: ['React 19', 'TypeScript', 'Node.js', 'Express', 'SSE Streaming', 'TailwindCSS']
  },
  {
    id: 'collaborative-canvas',
    title: 'Real-Time Collaborative Design Canvas',
    icon: 'Layers',
    category: 'Interactive Web Application',
    shortDesc: 'Multiplayer vector canvas with live presence, shape manipulation, conflict-free CRDT sync, and export.',
    prompt: 'Build a real-time multiplayer vector drawing canvas with live cursor presence, shape creation (rectangles, diamonds, arrows, text), layer reordering, snapping grid, undo/redo history stack, collaborative locking mechanism, export to SVG/PNG, and WebSocket state sync.',
    estimatedTasks: 15,
    requirements: [
      'Infinite canvas with pan, zoom, and coordinate transformation',
      'Vector shape rendering (Rectangles, Ellipses, Connectors, Text)',
      'Multiplayer cursor tracking and selection highlight broadcasts',
      'CRDT-inspired state conflict resolution',
      'History undo/redo transaction stack',
      'Export engine to high-resolution SVG and PNG',
      'Comprehensive component and canvas rendering unit tests'
    ],
    techStack: ['React 19', 'TypeScript', 'HTML5 Canvas', 'WebSockets', 'TailwindCSS']
  },
  {
    id: 'fintech-billing-ledger',
    title: 'FinTech Double-Entry Billing & Invoicing Engine',
    icon: 'CreditCard',
    category: 'Financial Engineering',
    shortDesc: 'Idempotent double-entry transactions, invoice generation, Stripe webhook reconciliation, and audit logs.',
    prompt: 'Build a secure, idempotent double-entry financial ledger and automated subscription invoicing engine with Stripe webhook signature validation, balance verification, transaction rollback safety, currency exchange calculations, PDF invoice generator, and tamper-evident audit logs.',
    estimatedTasks: 18,
    requirements: [
      'Immutable double-entry debit/credit ledger system',
      'Strict idempotency key verification on all transfer endpoints',
      'Stripe webhook signature validation and replay attack prevention',
      'Multi-currency decimal-safe monetary arithmetic',
      'Automated recurring billing and proration calculations',
      'Tamper-evident hash-chained audit logging',
      'Zero-tolerance financial reconciliation test suite'
    ],
    techStack: ['React 19', 'TypeScript', 'Node.js', 'Express', 'SQL Ledger', 'TailwindCSS']
  }
];
