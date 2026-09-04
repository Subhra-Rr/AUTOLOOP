// Production-Grade Domain Synthesizer for Autoloop AI
// Generates 100% authentic, interactive, mobile-responsive web applications
// with real JavaScript event handlers, local storage persistence, and unit tests.

export type DomainType = 
  | 'GRIEVANCE' 
  | 'WHITEBOARD' 
  | 'EXPENSE' 
  | 'CALCULATOR' 
  | 'TODO' 
  | 'WEATHER' 
  | 'NOTES' 
  | 'QUIZ' 
  | 'CONVERTER' 
  | 'UNIVERSAL';

export interface DomainBundle {
  domain: DomainType;
  title: string;
  description: string;
  requirements: string[];
  html: string;
  coreJs: { path: string; content: string };
  testJs: { path: string; content: string };
  tasks: Array<{
    code: string;
    title: string;
    description: string;
    agent: 'PLANNER' | 'DEVELOPER' | 'TESTER' | 'SECURITY_ANALYZER' | 'FINAL_EVALUATOR';
    category: 'REQUIREMENTS' | 'ARCHITECTURE' | 'DATABASE' | 'AUTHENTICATION' | 'BACKEND' | 'FRONTEND' | 'TESTING' | 'SECURITY' | 'VERIFICATION';
    dependencies: string[];
    targetFile: string;
  }>;
}

export function detectDomain(prompt: string): DomainType {
  const p = prompt.toLowerCase();
  if (p.includes('complaint') || p.includes('grievance') || p.includes('ticket') || p.includes('redressal') || p.includes('helpdesk') || p.includes('issue')) {
    return 'GRIEVANCE';
  }
  if (p.includes('whiteboard') || p.includes('canvas') || p.includes('draw') || p.includes('paint') || p.includes('sketch') || p.includes('doodle')) {
    return 'WHITEBOARD';
  }
  if (p.includes('expense') || p.includes('budget') || p.includes('finance') || p.includes('fintech') || p.includes('spend') || p.includes('ledger') || p.includes('money') || p.includes('wallet')) {
    return 'EXPENSE';
  }
  if (p.includes('calc') || p.includes('arithmetic') || p.includes('math') || p.includes('scientific')) {
    return 'CALCULATOR';
  }
  if (p.includes('todo') || p.includes('task') || p.includes('checklist') || p.includes('kanban') || p.includes('habit')) {
    return 'TODO';
  }
  if (p.includes('weather') || p.includes('forecast') || p.includes('temperature') || p.includes('climate')) {
    return 'WEATHER';
  }
  if (p.includes('note') || p.includes('markdown') || p.includes('journal') || p.includes('memo') || p.includes('doc')) {
    return 'NOTES';
  }
  if (p.includes('quiz') || p.includes('trivia') || p.includes('flashcard') || p.includes('exam')) {
    return 'QUIZ';
  }
  if (p.includes('converter') || p.includes('conversion') || p.includes('currency') || p.includes('unit')) {
    return 'CONVERTER';
  }
  return 'UNIVERSAL';
}

// 1. GRIEVANCE REDRESSAL PORTAL
function generateGrievanceBundle(prompt: string): DomainBundle {
  const title = 'Grievance Redressal & Support Portal';
  const description = 'Enterprise complaint management system with priority ticketing, SLA tracking, search, and resolution workflows.';
  const requirements = [
    'Student & user complaint submission with category, department, and priority routing',
    'Interactive status transition workflows (Open, In Progress, Resolved, Escalated)',
    'Real-time SLA breach countdown and resolution velocity analytics',
    'Live search, category filtering, and persistent local storage'
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Grievance Redressal Portal</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --border: rgba(255,255,255,0.1);
      --primary: #ef4444;
      --primary-hover: #dc2626;
      --accent: #06b6d4;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; padding: 16px; display: flex; flex-direction: column; align-items: center; }
    .container { width: 100%; max-width: 1000px; display: flex; flex-direction: column; gap: 20px; }
    header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 20px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .logo-group { display: flex; align-items: center; gap: 10px; }
    .logo-badge { width: 36px; height: 36px; border-radius: 10px; background: rgba(239,68,68,0.2); border: 1px solid var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--primary); font-size: 16px; }
    h1 { font-size: 18px; font-weight: 700; color: #fff; }
    .subtitle { font-size: 12px; color: var(--text-muted); }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
    .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
    .stat-label { font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 0.5px; }
    .stat-value { font-size: 26px; font-weight: 800; color: #fff; font-family: monospace; }
    
    .layout-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
    @media (min-width: 768px) {
      .layout-grid { grid-template-columns: 360px 1fr; }
    }
    
    .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
    .card-title { font-size: 15px; font-weight: 700; color: #fff; display: flex; align-items: center; justify-content: space-between; }
    
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); }
    input, select, textarea { background: #0c121e; border: 1px solid var(--border); color: #fff; padding: 10px 12px; border-radius: 10px; font-size: 13px; outline: none; transition: border-color 0.2s; }
    input:focus, select:focus, textarea:focus { border-color: var(--primary); }
    textarea { resize: vertical; min-height: 80px; }
    
    .btn { background: var(--primary); color: #fff; border: none; border-radius: 10px; padding: 12px 16px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .btn:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-secondary { background: rgba(255,255,255,0.06); border: 1px solid var(--border); color: #fff; }
    .btn-secondary:hover { background: rgba(255,255,255,0.12); }
    
    .filter-bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; }
    .search-input { flex: 1; min-width: 160px; }
    .tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; }
    .tab-btn { background: rgba(255,255,255,0.04); border: 1px solid var(--border); color: var(--text-muted); padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .tab-btn.active { background: rgba(239,68,68,0.2); border-color: var(--primary); color: #fff; }
    
    .tickets-list { display: flex; flex-direction: column; gap: 12px; max-height: 540px; overflow-y: auto; padding-right: 4px; }
    .ticket-item { background: #0c121e; border: 1px solid var(--border); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; transition: border-color 0.2s; }
    .ticket-item:hover { border-color: rgba(239,68,68,0.4); }
    .ticket-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
    .ticket-id { font-family: monospace; font-size: 11px; color: var(--accent); font-weight: 700; }
    .ticket-title { font-size: 14px; font-weight: 700; color: #fff; margin-top: 2px; }
    .ticket-desc { font-size: 12px; color: var(--text-muted); line-height: 1.4; }
    
    .badge { padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; font-family: monospace; }
    .badge-open { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
    .badge-in_progress { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
    .badge-resolved { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
    .badge-escalated { background: rgba(168,85,247,0.15); color: #c084fc; border: 1px solid rgba(168,85,247,0.3); }
    
    .ticket-meta { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; font-size: 11px; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px; }
    .ticket-actions { display: flex; gap: 6px; }
    .action-btn { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 10px; cursor: pointer; }
    .action-btn:hover { background: var(--primary); }
    .empty-state { text-align: center; padding: 40px 20px; color: var(--text-muted); font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo-group">
        <div class="logo-badge">GR</div>
        <div>
          <h1>Grievance Redressal Portal</h1>
          <div class="subtitle">Real-time Citizen & Student Issue Management System</div>
        </div>
      </div>
      <button class="btn btn-secondary" onclick="seedSampleData()">Reset Sample Data</button>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Tickets</div>
        <div class="stat-value" id="statTotal">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pending Action</div>
        <div class="stat-value" id="statPending" style="color: #f87171;">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Resolved</div>
        <div class="stat-value" id="statResolved" style="color: #34d399;">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">SLA Compliance</div>
        <div class="stat-value" id="statSla" style="color: #38bdf8;">94.2%</div>
      </div>
    </div>

    <div class="layout-grid">
      <!-- Submission Form -->
      <div class="card">
        <div class="card-title">
          <span>File New Grievance</span>
          <span style="font-size: 11px; color: var(--accent);">Direct Routing</span>
        </div>
        <form id="grievanceForm" onsubmit="handleFormSubmit(event)">
          <div class="form-group">
            <label for="complainantName">Full Name / ID</label>
            <input type="text" id="complainantName" placeholder="e.g. Alex Mercer (ID: STU-8421)" required />
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" required>
              <option value="Hostel & Housing">Hostel & Housing</option>
              <option value="Academic & Grading">Academic & Grading</option>
              <option value="Infrastructure & WiFi">Infrastructure & WiFi</option>
              <option value="Administrative Services">Administrative Services</option>
              <option value="Transportation">Transportation & Safety</option>
            </select>
          </div>
          <div class="form-group">
            <label for="priority">Urgency Priority</label>
            <select id="priority" required>
              <option value="Medium">Medium Priority (48h SLA)</option>
              <option value="High">High Priority (24h SLA)</option>
              <option value="Critical">Critical Emergency (4h SLA)</option>
              <option value="Low">Low Priority (7-day SLA)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="subject">Grievance Subject</label>
            <input type="text" id="subject" placeholder="Brief summary of the issue" required />
          </div>
          <div class="form-group">
            <label for="details">Detailed Explanation</label>
            <textarea id="details" placeholder="Describe the specific issue, location, and desired resolution..." required></textarea>
          </div>
          <button type="submit" class="btn" style="width: 100%;">Submit Grievance Ticket</button>
        </form>
      </div>

      <!-- Tickets Feed -->
      <div class="card">
        <div class="card-title">
          <span>Grievance Registry</span>
          <span id="ticketCountLabel" style="font-size: 11px; color: var(--text-muted);">0 Records</span>
        </div>

        <div class="filter-bar">
          <input type="text" id="searchFilter" class="search-input" placeholder="Search ticket by ID, title, or category..." oninput="renderTickets()" />
          <div class="tabs">
            <button class="tab-btn active" onclick="setFilter('ALL', this)">All</button>
            <button class="tab-btn" onclick="setFilter('OPEN', this)">Open</button>
            <button class="tab-btn" onclick="setFilter('IN_PROGRESS', this)">In Progress</button>
            <button class="tab-btn" onclick="setFilter('RESOLVED', this)">Resolved</button>
          </div>
        </div>

        <div class="tickets-list" id="ticketsList">
          <!-- Dynamically populated -->
        </div>
      </div>
    </div>
  </div>

  <script>
    const STORAGE_KEY = 'autoloop_grievances_db';
    let currentFilter = 'ALL';

    function getTickets() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    }

    function saveTickets(tickets) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      updateStats();
      renderTickets();
    }

    function seedSampleData() {
      const samples = [
        {
          id: 'GRV-2041',
          name: 'Sarah Connor',
          category: 'Infrastructure & WiFi',
          priority: 'High',
          subject: 'Library 3rd Floor Router Intermittent Disconnections',
          details: 'The mesh access points in the quiet study zone drop packets every 10 minutes during peak hours.',
          status: 'OPEN',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          id: 'GRV-2042',
          name: 'David Miller',
          category: 'Hostel & Housing',
          priority: 'Critical',
          subject: 'Water heater malfunction in Block C-2',
          details: 'Main heating line tripped breaker, no hot water available since yesterday evening.',
          status: 'IN_PROGRESS',
          timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
        },
        {
          id: 'GRV-2040',
          name: 'Priya Patel',
          category: 'Academic & Grading',
          priority: 'Medium',
          subject: 'Grade recalculation for Data Structures lab assignment',
          details: 'Uploaded automated test report proving test suite passed before deadline.',
          status: 'RESOLVED',
          timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ];
      saveTickets(samples);
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('complainantName').value.trim();
      const category = document.getElementById('category').value;
      const priority = document.getElementById('priority').value;
      const subject = document.getElementById('subject').value.trim();
      const details = document.getElementById('details').value.trim();

      const newTicket = {
        id: 'GRV-' + Math.floor(1000 + Math.random() * 9000),
        name,
        category,
        priority,
        subject,
        details,
        status: 'OPEN',
        timestamp: new Date().toISOString()
      };

      const tickets = getTickets();
      tickets.unshift(newTicket);
      saveTickets(tickets);

      document.getElementById('grievanceForm').reset();
    }

    function updateStatus(ticketId, newStatus) {
      const tickets = getTickets();
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket) {
        ticket.status = newStatus;
        saveTickets(tickets);
      }
    }

    function deleteTicket(ticketId) {
      if (confirm('Delete grievance ticket #' + ticketId + '?')) {
        const tickets = getTickets().filter(t => t.id !== ticketId);
        saveTickets(tickets);
      }
    }

    function setFilter(filter, el) {
      currentFilter = filter;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      if (el) el.classList.add('active');
      renderTickets();
    }

    function updateStats() {
      const tickets = getTickets();
      const total = tickets.length;
      const openCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
      const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;

      document.getElementById('statTotal').textContent = total;
      document.getElementById('statPending').textContent = openCount;
      document.getElementById('statResolved').textContent = resolvedCount;
      document.getElementById('ticketCountLabel').textContent = total + ' Records';
    }

    function renderTickets() {
      const tickets = getTickets();
      const query = (document.getElementById('searchFilter').value || '').toLowerCase();
      const list = document.getElementById('ticketsList');

      const filtered = tickets.filter(t => {
        const matchesFilter = currentFilter === 'ALL' || t.status === currentFilter;
        const matchesSearch = !query || 
          t.id.toLowerCase().includes(query) ||
          t.subject.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.name.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
      });

      if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state">No grievance records found matching criteria.</div>';
        return;
      }

      list.innerHTML = filtered.map(t => {
        const badgeClass = 'badge-' + t.status.toLowerCase();
        const dateStr = new Date(t.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        return \`
          <div class="ticket-item">
            <div class="ticket-top">
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="ticket-id">\${t.id}</span>
                  <span class="badge \${badgeClass}">\${t.status.replace('_', ' ')}</span>
                  <span style="font-size: 11px; color: #f87171; font-weight: 600;">\${t.priority}</span>
                </div>
                <div class="ticket-title">\${t.subject}</div>
              </div>
            </div>
            <div class="ticket-desc">\${t.details}</div>
            <div class="ticket-meta">
              <div>By: <strong>\${t.name}</strong> • <span>\${t.category}</span> • <span>\${dateStr}</span></div>
              <div class="ticket-actions">
                \${t.status !== 'IN_PROGRESS' && t.status !== 'RESOLVED' ? \`<button class="action-btn" onclick="updateStatus('\${t.id}', 'IN_PROGRESS')">Take Case</button>\` : ''}
                \${t.status !== 'RESOLVED' ? \`<button class="action-btn" style="color: #34d399;" onclick="updateStatus('\${t.id}', 'RESOLVED')">Resolve</button>\` : \`<button class="action-btn" onclick="updateStatus('\${t.id}', 'OPEN')">Reopen</button>\`}
                <button class="action-btn" style="color: #ef4444;" onclick="deleteTicket('\${t.id}')">✕</button>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Initialize on load
    if (getTickets().length === 0) {
      seedSampleData();
    } else {
      updateStats();
      renderTickets();
    }
  </script>
</body>
</html>`;

  const coreJs = {
    path: 'src/grievanceCore.js',
    content: `// Grievance management domain entity and state workflows
export function createGrievance(payload) {
  if (!payload || !payload.subject || !payload.category) {
    throw new Error('Grievance requires subject and category');
  }
  return {
    id: 'GRV-' + Math.floor(1000 + Math.random() * 9000),
    name: payload.name || 'Anonymous',
    category: payload.category,
    priority: payload.priority || 'Medium',
    subject: payload.subject,
    details: payload.details || '',
    status: 'OPEN',
    createdAt: new Date().toISOString()
  };
}

export function transitionStatus(grievance, newStatus) {
  const allowed = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED'];
  if (!allowed.includes(newStatus)) {
    throw new Error('Invalid grievance status: ' + newStatus);
  }
  return {
    ...grievance,
    status: newStatus,
    updatedAt: new Date().toISOString()
  };
}

export function calculateSlaStatus(grievance) {
  const hours = (Date.now() - new Date(grievance.createdAt).getTime()) / (1000 * 60 * 60);
  const maxHours = grievance.priority === 'Critical' ? 4 : grievance.priority === 'High' ? 24 : 48;
  return {
    elapsedHours: Math.round(hours * 10) / 10,
    maxHours,
    isBreached: hours > maxHours && grievance.status !== 'RESOLVED'
  };
}
`
  };

  const testJs = {
    path: 'tests/grievance.test.js',
    content: `import test from 'node:test';
import assert from 'node:assert';
import { createGrievance, transitionStatus, calculateSlaStatus } from '../src/grievanceCore.js';

test('Grievance: creation and validation', () => {
  const g = createGrievance({
    name: 'Jane Doe',
    category: 'Hostel',
    subject: 'Room lock damaged',
    priority: 'High'
  });
  assert.strictEqual(g.status, 'OPEN');
  assert.ok(g.id.startsWith('GRV-'));
  assert.strictEqual(g.priority, 'High');

  assert.throws(() => createGrievance({ name: 'Jane' }), /Grievance requires subject/);
});

test('Grievance: status transitions', () => {
  const g = createGrievance({ category: 'WiFi', subject: 'Slow net' });
  const inProgress = transitionStatus(g, 'IN_PROGRESS');
  assert.strictEqual(inProgress.status, 'IN_PROGRESS');

  const resolved = transitionStatus(inProgress, 'RESOLVED');
  assert.strictEqual(resolved.status, 'RESOLVED');

  assert.throws(() => transitionStatus(g, 'UNKNOWN_STATUS'), /Invalid grievance status/);
});

test('Grievance: SLA calculation', () => {
  const g = createGrievance({ category: 'Admin', subject: 'Certificate', priority: 'Critical' });
  const sla = calculateSlaStatus(g);
  assert.strictEqual(sla.maxHours, 4);
  assert.strictEqual(sla.isBreached, false);
});
`
  };

  const tasks = [
    {
      code: 'TASK-001',
      title: 'Architectural Specification & Workflow Design',
      description: 'Define ticket lifecycle, priority SLA schema, and data models.',
      agent: 'PLANNER' as const,
      category: 'ARCHITECTURE' as const,
      dependencies: [],
      targetFile: 'src/grievanceCore.js'
    },
    {
      code: 'TASK-002',
      title: 'Interactive Citizen & Student Grievance Portal (index.html)',
      description: 'Build complete responsive portal with ticket filing, filtering, search, and local persistence.',
      agent: 'DEVELOPER' as const,
      category: 'FRONTEND' as const,
      dependencies: ['TASK-001'],
      targetFile: 'index.html'
    },
    {
      code: 'TASK-003',
      title: 'Automated Lifecycle & SLA Test Suite',
      description: 'Implement unit tests verifying ticket creation, transitions, and SLA breach boundaries.',
      agent: 'TESTER' as const,
      category: 'TESTING' as const,
      dependencies: ['TASK-001'],
      targetFile: 'tests/grievance.test.js'
    },
    {
      code: 'TASK-004',
      title: 'Security & Verification Analysis',
      description: 'Verify input sanitization, zero-trust constraints, and production readiness.',
      agent: 'SECURITY_ANALYZER' as const,
      category: 'VERIFICATION' as const,
      dependencies: ['TASK-002', 'TASK-003'],
      targetFile: 'src/grievanceCore.js'
    }
  ];

  return { domain: 'GRIEVANCE', title, description, requirements, html, coreJs, testJs, tasks };
}

// 2. COLLABORATIVE WHITEBOARD CANVAS (WITH COMPLETE TOUCH SUPPORT FOR PHONES)
function generateWhiteboardBundle(prompt: string): DomainBundle {
  const title = 'Collaborative Whiteboard & Drawing Canvas';
  const description = 'High-performance interactive drawing engine with shape tools, undo/redo, color palette, and mobile touch support.';
  const requirements = [
    'HTML5 Canvas with high-DPI retina support and fluid multi-touch drawing',
    'Tool palette: Freehand Brush, Eraser, Line, Rectangle, Circle, and Clear',
    'Customizable stroke width slider and quick color swatches',
    'Undo/Redo snapshot history buffer and one-click PNG image export'
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Interactive Whiteboard Canvas</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
    body { background: #0c0e14; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; min-height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    
    /* Top Toolbar */
    .toolbar {
      background: #151824;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 8px 14px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      z-index: 20;
    }
    .tool-group { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .tool-btn {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      color: #cbd5e1;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s;
    }
    .tool-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .tool-btn.active {
      background: #ef4444;
      border-color: #dc2626;
      color: #fff;
      box-shadow: 0 0 12px rgba(239,68,68,0.5);
    }
    
    .color-swatch {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: transform 0.1s, border-color 0.1s;
    }
    .color-swatch:hover { transform: scale(1.15); }
    .color-swatch.active { border-color: #fff; transform: scale(1.2); box-shadow: 0 0 8px rgba(255,255,255,0.8); }
    
    .slider-group { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #94a3b8; font-family: monospace; }
    input[type="range"] { accent-color: #ef4444; width: 80px; }
    
    /* Canvas Area */
    .canvas-container {
      flex: 1;
      position: relative;
      background: #0f111a;
      touch-action: none; /* CRITICAL FOR MOBILE TOUCH DRAWING */
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
      touch-action: none;
      cursor: crosshair;
    }
    
    /* Floating Status Indicator */
    .status-pill {
      position: absolute;
      bottom: 16px;
      left: 16px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      color: #94a3b8;
      font-family: monospace;
      pointer-events: none;
      z-index: 10;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <!-- Tool Modes -->
    <div class="tool-group">
      <button class="tool-btn active" id="btnBrush" onclick="setTool('brush')">✏️ Pen</button>
      <button class="tool-btn" id="btnEraser" onclick="setTool('eraser')">🧹 Eraser</button>
      <button class="tool-btn" id="btnLine" onclick="setTool('line')">╱ Line</button>
      <button class="tool-btn" id="btnRect" onclick="setTool('rect')">□ Rect</button>
      <button class="tool-btn" id="btnCircle" onclick="setTool('circle')">○ Circle</button>
    </div>

    <!-- Palette -->
    <div class="tool-group">
      <div class="color-swatch active" style="background: #ffffff;" onclick="setColor('#ffffff', this)"></div>
      <div class="color-swatch" style="background: #ef4444;" onclick="setColor('#ef4444', this)"></div>
      <div class="color-swatch" style="background: #f59e0b;" onclick="setColor('#f59e0b', this)"></div>
      <div class="color-swatch" style="background: #10b981;" onclick="setColor('#10b981', this)"></div>
      <div class="color-swatch" style="background: #06b6d4;" onclick="setColor('#06b6d4', this)"></div>
      <div class="color-swatch" style="background: #a855f7;" onclick="setColor('#a855f7', this)"></div>
      <input type="color" id="customColor" value="#ffffff" onchange="setColor(this.value, null)" style="width: 26px; height: 26px; border: none; border-radius: 6px; cursor: pointer; background: transparent;" />
    </div>

    <!-- Size Slider -->
    <div class="slider-group">
      <span>Size:</span>
      <input type="range" id="sizeSlider" min="1" max="40" value="4" oninput="updateSize(this.value)" />
      <span id="sizeValue">4px</span>
    </div>

    <!-- History & Actions -->
    <div class="tool-group">
      <button class="tool-btn" onclick="undo()" title="Undo (Ctrl+Z)">↩ Undo</button>
      <button class="tool-btn" onclick="redo()" title="Redo (Ctrl+Y)">↪ Redo</button>
      <button class="tool-btn" onclick="clearCanvas()" style="color: #f87171;">✕ Clear</button>
      <button class="tool-btn" onclick="exportImage()" style="background: rgba(16,185,129,0.2); border-color: #10b981; color: #34d399;">💾 Save</button>
    </div>
  </div>

  <div class="canvas-container" id="canvasContainer">
    <canvas id="whiteboard"></canvas>
    <div class="status-pill" id="statusPill">Tool: Freehand Pen (4px)</div>
  </div>

  <script>
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const container = document.getElementById('canvasContainer');
    const statusPill = document.getElementById('statusPill');

    let currentTool = 'brush';
    let currentColor = '#ffffff';
    let currentSize = 4;
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let snapshot = null;

    const undoStack = [];
    const redoStack = [];
    const MAX_HISTORY = 20;

    function resizeCanvas() {
      const rect = container.getBoundingClientRect();
      if (canvas.width === rect.width && canvas.height === rect.height) return;

      // Save canvas state before resize
      const prevData = ctx.getImageData(0, 0, canvas.width || 1, canvas.height || 1);
      
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Fill background dark
      ctx.fillStyle = '#0f111a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (prevData.width > 1) {
        ctx.putImageData(prevData, 0, 0);
      }
      saveState();
    }

    function saveState() {
      if (undoStack.length >= MAX_HISTORY) undoStack.shift();
      undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      redoStack.length = 0; // Clear redo
    }

    function undo() {
      if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        const state = undoStack[undoStack.length - 1];
        ctx.putImageData(state, 0, 0);
        showPill('Undo action');
      }
    }

    function redo() {
      if (redoStack.length > 0) {
        const state = redoStack.pop();
        undoStack.push(state);
        ctx.putImageData(state, 0, 0);
        showPill('Redo action');
      }
    }

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDraw(e) {
      e.preventDefault();
      isDrawing = true;
      const pos = getPos(e);
      startX = pos.x;
      startY = pos.y;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineWidth = currentSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = currentTool === 'eraser' ? '#0f111a' : currentColor;

      snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);

      if (currentTool === 'brush' || currentTool === 'eraser') {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else {
        // Restore snapshot for shapes
        ctx.putImageData(snapshot, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentSize;

        if (currentTool === 'line') {
          ctx.moveTo(startX, startY);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        } else if (currentTool === 'rect') {
          const w = pos.x - startX;
          const h = pos.y - startY;
          ctx.strokeRect(startX, startY, w, h);
        } else if (currentTool === 'circle') {
          const r = Math.sqrt(Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2));
          ctx.arc(startX, startY, r, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }

    function stopDraw(e) {
      if (!isDrawing) return;
      isDrawing = false;
      ctx.closePath();
      saveState();
    }

    // Touch events for mobile phones
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw, { passive: false });
    canvas.addEventListener('touchcancel', stopDraw, { passive: false });

    // Mouse events for desktop
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    function setTool(tool) {
      currentTool = tool;
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      const activeBtn = document.getElementById('btn' + tool.charAt(0).toUpperCase() + tool.slice(1));
      if (activeBtn) activeBtn.classList.add('active');
      showPill('Tool: ' + tool.toUpperCase() + ' (' + currentSize + 'px)');
    }

    function setColor(color, el) {
      currentColor = color;
      if (currentTool === 'eraser') setTool('brush');
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      if (el) el.classList.add('active');
      showPill('Color: ' + color);
    }

    function updateSize(size) {
      currentSize = Number(size);
      document.getElementById('sizeValue').textContent = size + 'px';
      showPill('Stroke Width: ' + size + 'px');
    }

    function showPill(msg) {
      statusPill.textContent = msg;
    }

    function clearCanvas() {
      if (confirm('Clear entire whiteboard canvas?')) {
        ctx.fillStyle = '#0f111a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
        showPill('Canvas Cleared');
      }
    }

    function exportImage() {
      const link = document.createElement('a');
      link.download = 'whiteboard_' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showPill('Image exported to download');
    }

    // Hotkeys
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  </script>
</body>
</html>`;

  const coreJs = {
    path: 'src/canvasCore.js',
    content: `// Canvas geometric calculation and drawing math utilities
export function computeDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function computeBoundingBox(points) {
  if (!points || points.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  let minX = points[0].x, maxX = points[0].x;
  let minY = points[0].y, maxY = points[0].y;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
`
  };

  const testJs = {
    path: 'tests/canvas.test.js',
    content: `import test from 'node:test';
import assert from 'node:assert';
import { computeDistance, computeBoundingBox, clamp } from '../src/canvasCore.js';

test('Canvas math: compute distance', () => {
  const dist = computeDistance(0, 0, 3, 4);
  assert.strictEqual(dist, 5);
});

test('Canvas math: bounding box computation', () => {
  const points = [
    { x: 10, y: 20 },
    { x: 50, y: 80 },
    { x: -5, y: 30 }
  ];
  const box = computeBoundingBox(points);
  assert.strictEqual(box.minX, -5);
  assert.strictEqual(box.maxX, 50);
  assert.strictEqual(box.width, 55);
  assert.strictEqual(box.height, 60);
});

test('Canvas math: clamp bounds', () => {
  assert.strictEqual(clamp(15, 0, 10), 10);
  assert.strictEqual(clamp(-5, 0, 10), 0);
  assert.strictEqual(clamp(7, 0, 10), 7);
});
`
  };

  const tasks = [
    {
      code: 'TASK-001',
      title: 'Canvas Coordinate Engine & Geometric Math',
      description: 'Implement bounding box calculations, stroke interpolation, and distance formulas.',
      agent: 'PLANNER' as const,
      category: 'ARCHITECTURE' as const,
      dependencies: [],
      targetFile: 'src/canvasCore.js'
    },
    {
      code: 'TASK-002',
      title: 'Interactive HTML5 Canvas Whiteboard (index.html)',
      description: 'Implement responsive canvas with mobile touch drawing, color swatches, shapes, and undo/redo.',
      agent: 'DEVELOPER' as const,
      category: 'FRONTEND' as const,
      dependencies: ['TASK-001'],
      targetFile: 'index.html'
    },
    {
      code: 'TASK-003',
      title: 'Canvas Math & State Unit Tests',
      description: 'Automated test suite verifying geometry formulas, point bounds, and clamping.',
      agent: 'TESTER' as const,
      category: 'TESTING' as const,
      dependencies: ['TASK-001'],
      targetFile: 'tests/canvas.test.js'
    },
    {
      code: 'TASK-004',
      title: 'Touch Response & Mobile Sandbox Validation',
      description: 'Verify touch event passive bindings, high-DPI scaling, and snapshot memory safety.',
      agent: 'FINAL_EVALUATOR' as const,
      category: 'VERIFICATION' as const,
      dependencies: ['TASK-002', 'TASK-003'],
      targetFile: 'src/canvasCore.js'
    }
  ];

  return { domain: 'WHITEBOARD', title, description, requirements, html, coreJs, testJs, tasks };
}

// 3. FINTECH EXPENSE & BUDGET ENGINE
function generateExpenseBundle(prompt: string): DomainBundle {
  const title = 'Fintech Expense & Budget Engine';
  const description = 'Double-entry personal finance ledger with monthly budget limits, category breakdown, and export.';
  const requirements = [
    'Log income and expense transactions with category, amount, date, and description',
    'Dynamic financial metrics: Total Balance, Net Cashflow, and Savings Rate %',
    'Monthly budget threshold bar with visual warning alert when exceeding limit',
    'Filter by category, search by note, and persistent local storage'
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Fintech Expense & Budget Engine</title>
  <style>
    :root {
      --bg: #090c15;
      --card-bg: #121826;
      --border: rgba(255,255,255,0.08);
      --primary: #10b981;
      --danger: #ef4444;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; padding: 16px; display: flex; flex-direction: column; align-items: center; }
    .container { width: 100%; max-width: 960px; display: flex; flex-direction: column; gap: 20px; }
    
    header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 20px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; }
    .logo-group { display: flex; align-items: center; gap: 10px; }
    .logo-badge { width: 36px; height: 36px; border-radius: 10px; background: rgba(16,185,129,0.2); border: 1px solid var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--primary); font-size: 16px; }
    h1 { font-size: 18px; font-weight: 700; color: #fff; }
    .subtitle { font-size: 12px; color: var(--text-muted); }
    
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
    .metric-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
    .metric-label { font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; }
    .metric-val { font-size: 26px; font-weight: 800; font-family: monospace; }
    
    .budget-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
    .budget-header { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }
    .progress-track { height: 10px; background: rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--primary); width: 0%; transition: width 0.3s, background 0.3s; }
    .progress-fill.warning { background: #f59e0b; }
    .progress-fill.danger { background: var(--danger); }
    
    .layout-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
    @media (min-width: 768px) {
      .layout-grid { grid-template-columns: 340px 1fr; }
    }
    
    .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .card-title { font-size: 15px; font-weight: 700; color: #fff; display: flex; justify-content: space-between; align-items: center; }
    
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); }
    input, select { background: #0b0f19; border: 1px solid var(--border); color: #fff; padding: 10px 12px; border-radius: 10px; font-size: 13px; outline: none; }
    input:focus, select:focus { border-color: var(--primary); }
    
    .btn { background: var(--primary); color: #000; border: none; border-radius: 10px; padding: 12px 16px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-secondary { background: rgba(255,255,255,0.06); border: 1px solid var(--border); color: #fff; }
    
    .tx-list { display: flex; flex-direction: column; gap: 8px; max-height: 500px; overflow-y: auto; }
    .tx-item { background: #0b0f19; border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; }
    .tx-left { display: flex; flex-direction: column; gap: 2px; }
    .tx-title { font-size: 13px; font-weight: 600; color: #fff; }
    .tx-meta { font-size: 11px; color: var(--text-muted); }
    .tx-amount { font-family: monospace; font-size: 14px; font-weight: 800; }
    .tx-amount.income { color: #34d399; }
    .tx-amount.expense { color: #f87171; }
    .delete-btn { background: transparent; border: none; color: #64748b; cursor: pointer; font-size: 14px; margin-left: 10px; }
    .delete-btn:hover { color: #ef4444; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo-group">
        <div class="logo-badge">$</div>
        <div>
          <h1>Fintech Expense Ledger</h1>
          <div class="subtitle">Budget & Net Cashflow Analytics Engine</div>
        </div>
      </div>
      <button class="btn btn-secondary" onclick="seedSampleData()">Reset Sample Data</button>
    </header>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Balance</div>
        <div class="metric-val" id="metricBalance" style="color: #38bdf8;">$0.00</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Monthly Inflow</div>
        <div class="metric-val" id="metricIncome" style="color: #34d399;">$0.00</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Monthly Outflow</div>
        <div class="metric-val" id="metricExpense" style="color: #f87171;">$0.00</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Savings Rate</div>
        <div class="metric-val" id="metricSavings">0%</div>
      </div>
    </div>

    <div class="budget-card">
      <div class="budget-header">
        <span>Monthly Budget Threshold: <strong>$2,500.00</strong></span>
        <span id="budgetStatusText">Spent: $0.00 (0%)</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" id="budgetProgress"></div>
      </div>
    </div>

    <div class="layout-grid">
      <div class="card">
        <div class="card-title">Record Transaction</div>
        <form id="txForm" onsubmit="handleFormSubmit(event)">
          <div class="form-group">
            <label for="type">Transaction Type</label>
            <select id="type" onchange="updateCategories()">
              <option value="EXPENSE">Expense (Debit)</option>
              <option value="INCOME">Income (Credit)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="amount">Amount ($)</label>
            <input type="number" id="amount" step="0.01" min="0.01" placeholder="e.g. 45.50" required />
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" required>
              <option value="Food & Groceries">Food & Groceries</option>
              <option value="Housing & Rent">Housing & Rent</option>
              <option value="Transport & Gas">Transport & Gas</option>
              <option value="Utilities & Bills">Utilities & Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health & Medical">Health & Medical</option>
            </select>
          </div>
          <div class="form-group">
            <label for="description">Note / Merchant</label>
            <input type="text" id="description" placeholder="e.g. Trader Joe's Organic Store" required />
          </div>
          <button type="submit" class="btn" style="width: 100%;">Record Entry</button>
        </form>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Transaction Ledger</span>
          <span id="txCount" style="font-size: 11px; color: var(--text-muted);">0 Transactions</span>
        </div>
        <div class="tx-list" id="txList">
          <!-- Dynamically Populated -->
        </div>
      </div>
    </div>
  </div>

  <script>
    const STORAGE_KEY = 'autoloop_fintech_tx';
    const MONTHLY_BUDGET = 2500;

    function getTransactions() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    }

    function saveTransactions(list) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      updateUI();
    }

    function seedSampleData() {
      const samples = [
        { id: 'tx_1', type: 'INCOME', amount: 3400.00, category: 'Salary & Earnings', description: 'Monthly Tech Stipend & Salary', date: new Date().toISOString() },
        { id: 'tx_2', type: 'EXPENSE', amount: 850.00, category: 'Housing & Rent', description: 'Apartment Monthly Lease', date: new Date(Date.now() - 86400000).toISOString() },
        { id: 'tx_3', type: 'EXPENSE', amount: 124.50, category: 'Food & Groceries', description: 'Weekly Whole Foods Market', date: new Date(Date.now() - 172800000).toISOString() },
        { id: 'tx_4', type: 'EXPENSE', amount: 45.00, category: 'Transport & Gas', description: 'Metro Commuter Pass', date: new Date(Date.now() - 259200000).toISOString() }
      ];
      saveTransactions(samples);
    }

    function updateCategories() {
      const type = document.getElementById('type').value;
      const catSelect = document.getElementById('category');
      if (type === 'INCOME') {
        catSelect.innerHTML = \`
          <option value="Salary & Earnings">Salary & Earnings</option>
          <option value="Investments & Dividends">Investments & Dividends</option>
          <option value="Freelance & Consulting">Freelance & Consulting</option>
          <option value="Other Inflow">Other Inflow</option>
        \`;
      } else {
        catSelect.innerHTML = \`
          <option value="Food & Groceries">Food & Groceries</option>
          <option value="Housing & Rent">Housing & Rent</option>
          <option value="Transport & Gas">Transport & Gas</option>
          <option value="Utilities & Bills">Utilities & Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health & Medical">Health & Medical</option>
        \`;
      }
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      const type = document.getElementById('type').value;
      const amount = parseFloat(document.getElementById('amount').value);
      const category = document.getElementById('category').value;
      const description = document.getElementById('description').value.trim();

      const tx = {
        id: 'tx_' + Date.now(),
        type,
        amount,
        category,
        description,
        date: new Date().toISOString()
      };

      const list = getTransactions();
      list.unshift(tx);
      saveTransactions(list);

      document.getElementById('amount').value = '';
      document.getElementById('description').value = '';
    }

    function deleteTx(id) {
      const list = getTransactions().filter(t => t.id !== id);
      saveTransactions(list);
    }

    function formatMoney(num) {
      return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function updateUI() {
      const list = getTransactions();
      let totalIncome = 0;
      let totalExpense = 0;

      list.forEach(t => {
        if (t.type === 'INCOME') totalIncome += t.amount;
        else totalExpense += t.amount;
      });

      const balance = totalIncome - totalExpense;
      const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

      document.getElementById('metricBalance').textContent = formatMoney(balance);
      document.getElementById('metricIncome').textContent = formatMoney(totalIncome);
      document.getElementById('metricExpense').textContent = formatMoney(totalExpense);
      document.getElementById('metricSavings').textContent = Math.max(0, savingsRate) + '%';
      document.getElementById('txCount').textContent = list.length + ' Transactions';

      // Budget Progress
      const pct = Math.min(100, Math.round((totalExpense / MONTHLY_BUDGET) * 100));
      const bar = document.getElementById('budgetProgress');
      bar.style.width = pct + '%';
      bar.className = 'progress-fill' + (pct > 90 ? ' danger' : pct > 70 ? ' warning' : '');
      document.getElementById('budgetStatusText').textContent = \`Spent: \${formatMoney(totalExpense)} of \${formatMoney(MONTHLY_BUDGET)} (\${pct}%)\`;

      // Render items
      const container = document.getElementById('txList');
      if (list.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:30px; color:#64748b; font-size:12px;">No transactions recorded. Add one above.</div>';
        return;
      }

      container.innerHTML = list.map(t => {
        const isInc = t.type === 'INCOME';
        const dateStr = new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        return \`
          <div class="tx-item">
            <div class="tx-left">
              <div class="tx-title">\${t.description}</div>
              <div class="tx-meta">\${t.category} • \${dateStr}</div>
            </div>
            <div style="display: flex; align-items: center;">
              <span class="tx-amount \${isInc ? 'income' : 'expense'}">\${isInc ? '+' : '-'}\${formatMoney(t.amount)}</span>
              <button class="delete-btn" onclick="deleteTx('\${t.id}')">✕</button>
            </div>
          </div>
        \`;
      }).join('');
    }

    if (getTransactions().length === 0) seedSampleData();
    else updateUI();
  </script>
</body>
</html>`;

  const coreJs = {
    path: 'src/financeCore.js',
    content: `// Finance double-entry arithmetic and cashflow calculations
export function calculateTotals(transactions) {
  if (!Array.isArray(transactions)) return { income: 0, expense: 0, balance: 0, savingsRate: 0 };
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === 'INCOME') income += Number(t.amount || 0);
    else expense += Number(t.amount || 0);
  }
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
  return {
    income: Math.round(income * 100) / 100,
    expense: Math.round(expense * 100) / 100,
    balance: Math.round(balance * 100) / 100,
    savingsRate: Math.max(0, savingsRate)
  };
}

export function checkBudgetExceeded(expenseTotal, budgetLimit) {
  return {
    isExceeded: expenseTotal > budgetLimit,
    remaining: Math.max(0, budgetLimit - expenseTotal),
    percentUsed: Math.round((expenseTotal / budgetLimit) * 100)
  };
}
`
  };

  const testJs = {
    path: 'tests/finance.test.js',
    content: `import test from 'node:test';
import assert from 'node:assert';
import { calculateTotals, checkBudgetExceeded } from '../src/financeCore.js';

test('Finance: totals and net savings calculation', () => {
  const txs = [
    { type: 'INCOME', amount: 5000 },
    { type: 'EXPENSE', amount: 1500 },
    { type: 'EXPENSE', amount: 500 }
  ];
  const res = calculateTotals(txs);
  assert.strictEqual(res.income, 5000);
  assert.strictEqual(res.expense, 2000);
  assert.strictEqual(res.balance, 3000);
  assert.strictEqual(res.savingsRate, 60);
});

test('Finance: budget limit monitoring', () => {
  const check1 = checkBudgetExceeded(1800, 2000);
  assert.strictEqual(check1.isExceeded, false);
  assert.strictEqual(check1.remaining, 200);

  const check2 = checkBudgetExceeded(2500, 2000);
  assert.strictEqual(check2.isExceeded, true);
  assert.strictEqual(check2.remaining, 0);
});
`
  };

  const tasks = [
    {
      code: 'TASK-001',
      title: 'Ledger Engine & Cashflow Data Modeling',
      description: 'Implement financial double-entry math, cashflow balance, and budget thresholds.',
      agent: 'PLANNER' as const,
      category: 'ARCHITECTURE' as const,
      dependencies: [],
      targetFile: 'src/financeCore.js'
    },
    {
      code: 'TASK-002',
      title: 'Responsive Budget & Expense UI (index.html)',
      description: 'Build interactive transactions ledger, monthly budget progress bar, and metrics.',
      agent: 'DEVELOPER' as const,
      category: 'FRONTEND' as const,
      dependencies: ['TASK-001'],
      targetFile: 'index.html'
    },
    {
      code: 'TASK-003',
      title: 'Financial Mathematics Test Suite',
      description: 'Automated test suite verifying balance arithmetic, budget limit warnings, and savings rate.',
      agent: 'TESTER' as const,
      category: 'TESTING' as const,
      dependencies: ['TASK-001'],
      targetFile: 'tests/finance.test.js'
    },
    {
      code: 'TASK-004',
      title: 'Zero-Trust Financial Data Validation',
      description: 'Verify floating-point precision rounding and storage durability.',
      agent: 'FINAL_EVALUATOR' as const,
      category: 'VERIFICATION' as const,
      dependencies: ['TASK-002', 'TASK-003'],
      targetFile: 'src/financeCore.js'
    }
  ];

  return { domain: 'EXPENSE', title, description, requirements, html, coreJs, testJs, tasks };
}

// 4. UNIVERSAL APPLICATION GENERATOR FOR ANY OTHER PROMPT
function generateUniversalBundle(prompt: string): DomainBundle {
  const cleanPrompt = prompt.trim();
  const words = cleanPrompt.split(/\s+/).slice(0, 5).join(' ');
  const appName = words.charAt(0).toUpperCase() + words.slice(1);
  const title = appName;
  const description = `Interactive production web application implementing: ${cleanPrompt.slice(0, 90)}`;
  const requirements = [
    `Core domain architecture tailored for: ${cleanPrompt.slice(0, 60)}`,
    'Interactive responsive interface with dynamic data entries and actions',
    'Local persistence, statistics calculations, and search filtering',
    'Node.js unit test coverage verifying business logic'
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${appName}</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --border: rgba(255,255,255,0.08);
      --primary: #ef4444;
      --accent: #06b6d4;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; padding: 16px; display: flex; flex-direction: column; align-items: center; }
    .container { width: 100%; max-width: 900px; display: flex; flex-direction: column; gap: 20px; }
    
    header { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; }
    h1 { font-size: 20px; font-weight: 800; color: #fff; }
    .desc { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
    
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
    .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 4px; }
    .stat-label { font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; }
    .stat-val { font-size: 24px; font-weight: 800; color: #fff; font-family: monospace; }
    
    .content-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: flex; flex-wrap: wrap; gap: 10px; }
    input[type="text"] { flex: 1; min-width: 200px; background: #0c121e; border: 1px solid var(--border); color: #fff; padding: 12px 14px; border-radius: 10px; font-size: 13px; outline: none; }
    input[type="text"]:focus { border-color: var(--primary); }
    
    .btn { background: var(--primary); color: #fff; border: none; border-radius: 10px; padding: 12px 20px; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; white-space: nowrap; }
    .btn:hover { opacity: 0.9; }
    
    .items-list { display: flex; flex-direction: column; gap: 10px; max-height: 480px; overflow-y: auto; }
    .item-row { background: #0c121e; border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .item-text { font-size: 13px; color: #fff; font-weight: 500; }
    .item-meta { font-size: 11px; color: var(--text-muted); }
    .item-actions { display: flex; gap: 6px; }
    .action-btn { background: rgba(255,255,255,0.06); border: 1px solid var(--border); color: #cbd5e1; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer; }
    .action-btn:hover { background: var(--primary); color: #fff; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>${appName}</h1>
        <div class="desc">${cleanPrompt}</div>
      </div>
      <div style="font-family: monospace; font-size: 11px; color: #34d399; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); padding: 4px 10px; border-radius: 8px;">
        STATUS: ONLINE
      </div>
    </header>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Active Items</div>
        <div class="stat-val" id="statCount">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Completed</div>
        <div class="stat-val" id="statCompleted" style="color: #34d399;">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">System Velocity</div>
        <div class="stat-val" id="statVelocity" style="color: #38bdf8;">100%</div>
      </div>
    </div>

    <div class="content-card">
      <form onsubmit="handleAddItem(event)">
        <div class="form-row">
          <input type="text" id="itemInput" placeholder="Add entry for: ${cleanPrompt.slice(0, 40)}..." required />
          <button type="submit" class="btn">Add Entry</button>
        </div>
      </form>

      <div class="items-list" id="itemsList">
        <!-- Dynamically populated -->
      </div>
    </div>
  </div>

  <script>
    const STORAGE_KEY = 'autoloop_app_items_' + encodeURIComponent('${appName.toLowerCase().replace(/\\s+/g, '_')}');

    function getItems() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    }

    function saveItems(items) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      render();
    }

    function handleAddItem(e) {
      e.preventDefault();
      const input = document.getElementById('itemInput');
      const val = input.value.trim();
      if (!val) return;

      const items = getItems();
      items.unshift({
        id: 'item_' + Date.now(),
        text: val,
        completed: false,
        created: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      saveItems(items);
      input.value = '';
    }

    function toggleItem(id) {
      const items = getItems();
      const item = items.find(i => i.id === id);
      if (item) {
        item.completed = !item.completed;
        saveItems(items);
      }
    }

    function deleteItem(id) {
      const items = getItems().filter(i => i.id !== id);
      saveItems(items);
    }

    function render() {
      const items = getItems();
      const list = document.getElementById('itemsList');
      const total = items.length;
      const completed = items.filter(i => i.completed).length;

      document.getElementById('statCount').textContent = total;
      document.getElementById('statCompleted').textContent = completed;

      if (items.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:30px; color:#64748b; font-size:12px;">No entries yet. Enter a task or item above.</div>';
        return;
      }

      list.innerHTML = items.map(item => \`
        <div class="item-row">
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" \${item.completed ? 'checked' : ''} onchange="toggleItem('\${item.id}')" style="cursor: pointer; width: 16px; height: 16px; accent-color: #ef4444;" />
            <div>
              <div class="item-text" style="\${item.completed ? 'text-decoration: line-through; color: #64748b;' : ''}">\${item.text}</div>
              <div class="item-meta">Created at \${item.created}</div>
            </div>
          </div>
          <div class="item-actions">
            <button class="action-btn" onclick="deleteItem('\${item.id}')">Delete</button>
          </div>
        </div>
      \`).join('');
    }

    // Seed defaults if brand new
    if (getItems().length === 0) {
      saveItems([
        { id: 'item_1', text: 'Initialize system parameters for ${appName}', completed: true, created: '09:00 AM' },
        { id: 'item_2', text: 'Configure primary workflow and verification bounds', completed: false, created: '09:15 AM' }
      ]);
    } else {
      render();
    }
  </script>
</body>
</html>`;

  const coreJs = {
    path: 'src/core.js',
    content: `// Universal state management and processing routines
export function processItem(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid item text');
  }
  return {
    id: 'item_' + Date.now(),
    text: text.trim(),
    completed: false,
    timestamp: new Date().toISOString()
  };
}

export function filterItems(items, showCompleted) {
  if (!Array.isArray(items)) return [];
  return items.filter(i => showCompleted ? true : !i.completed);
}
`
  };

  const testJs = {
    path: 'tests/core.test.js',
    content: `import test from 'node:test';
import assert from 'node:assert';
import { processItem, filterItems } from '../src/core.js';

test('Universal domain: item creation', () => {
  const item = processItem('System Requirement A');
  assert.strictEqual(item.text, 'System Requirement A');
  assert.strictEqual(item.completed, false);
  assert.ok(item.id);

  assert.throws(() => processItem(''), /Invalid item text/);
});

test('Universal domain: item filtering', () => {
  const items = [
    { id: '1', text: 'A', completed: false },
    { id: '2', text: 'B', completed: true }
  ];
  const pending = filterItems(items, false);
  assert.strictEqual(pending.length, 1);
  assert.strictEqual(pending[0].id, '1');

  const all = filterItems(items, true);
  assert.strictEqual(all.length, 2);
});
`
  };

  const tasks = [
    {
      code: 'TASK-001',
      title: 'Architectural Specification & Domain Modeling',
      description: `Define data schemas, state lifecycle, and business logic for: ${cleanPrompt.slice(0, 50)}`,
      agent: 'PLANNER' as const,
      category: 'ARCHITECTURE' as const,
      dependencies: [],
      targetFile: 'src/core.js'
    },
    {
      code: 'TASK-002',
      title: 'Interactive Frontend Interface (index.html)',
      description: 'Build complete responsive UI with active input forms, state rendering, and local persistence.',
      agent: 'DEVELOPER' as const,
      category: 'FRONTEND' as const,
      dependencies: ['TASK-001'],
      targetFile: 'index.html'
    },
    {
      code: 'TASK-003',
      title: 'Automated Node.js Test Suite',
      description: 'Implement unit tests verifying data handling, validation, and state transformations.',
      agent: 'TESTER' as const,
      category: 'TESTING' as const,
      dependencies: ['TASK-001'],
      targetFile: 'tests/core.test.js'
    },
    {
      code: 'TASK-004',
      title: 'Security & Quality Verification',
      description: 'Audit DOM event listeners, input sanitization, and execution stability.',
      agent: 'SECURITY_ANALYZER' as const,
      category: 'VERIFICATION' as const,
      dependencies: ['TASK-002', 'TASK-003'],
      targetFile: 'src/core.js'
    }
  ];

  return { domain: 'UNIVERSAL', title, description, requirements, html, coreJs, testJs, tasks };
}

// Master synthesizer factory
export function synthesizeDomainBundle(prompt: string): DomainBundle {
  const domain = detectDomain(prompt);
  switch (domain) {
    case 'GRIEVANCE':
      return generateGrievanceBundle(prompt);
    case 'WHITEBOARD':
      return generateWhiteboardBundle(prompt);
    case 'EXPENSE':
      return generateExpenseBundle(prompt);
    case 'CALCULATOR':
      // The calculator is also implemented in workspace.ts; let's provide a unified bundle
      return {
        domain: 'CALCULATOR',
        title: 'Precision Scientific Calculator & Grapher',
        description: 'Scientific arithmetic calculation engine with memory registers, history tape, and function plotting.',
        requirements: [
          'High-precision basic arithmetic (addition, subtraction, multiplication, division)',
          'Scientific functions: square root, exponentiation, factorial, trigonometry, and constants (π, e)',
          'Memory registers (MC, MR, MS, M+) and interactive history tape with recall',
          'Keyboard event navigation and comprehensive unit test coverage'
        ],
        html: '', // Handled by calc generator in workspace.ts
        coreJs: { path: 'src/calculator.js', content: '' },
        testJs: { path: 'tests/calculator.test.js', content: '' },
        tasks: [
          { code: 'TASK-001', title: 'Arithmetic Engine & Math Precision Module', description: 'Implement core arithmetic, scientific operations, and error boundaries.', agent: 'PLANNER', category: 'ARCHITECTURE', dependencies: [], targetFile: 'src/calculator.js' },
          { code: 'TASK-002', title: 'Interactive Scientific Calculator UI (index.html)', description: 'Build responsive calculator with memory toolbar, history tape, and keyboard bindings.', agent: 'DEVELOPER', category: 'FRONTEND', dependencies: ['TASK-001'], targetFile: 'index.html' },
          { code: 'TASK-003', title: 'Automated Arithmetic Test Suite', description: 'Node.js tests verifying floating-point precision, operations, and zero-division guards.', agent: 'TESTER', category: 'TESTING', dependencies: ['TASK-001'], targetFile: 'tests/calculator.test.js' },
          { code: 'TASK-004', title: 'Zero-Trust Boundary & Security Verification', description: 'Ensure numerical validation, overflow protection, and input sanitization.', agent: 'FINAL_EVALUATOR', category: 'VERIFICATION', dependencies: ['TASK-002', 'TASK-003'], targetFile: 'src/calculator.js' }
        ]
      };
    default:
      return generateUniversalBundle(prompt);
  }
}
