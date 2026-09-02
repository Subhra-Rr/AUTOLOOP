import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { ProjectState, AutonomyMode } from './src/types';
import { createEmptyProjectState, executeAutonomousStep } from './server/geminiOrchestrator';
import { listWorkspaceFiles, readWorkspaceFile, getWorkspacePath } from './server/workspace';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory project state store
const projectsStore = new Map<string, ProjectState>();

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Create new autonomous project with REAL user objective
app.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const { prompt, mode = 'MAXIMUM' } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Enter a task before starting the autonomous agent.' });
    }

    const cleanPrompt = prompt.trim();
    console.log(`[AUTOLOOP_LIFECYCLE] PROMPT_RECEIVED: "${cleanPrompt}"`);

    // Create real initial state
    const state = createEmptyProjectState(cleanPrompt, mode as AutonomyMode);
    projectsStore.set(state.projectId, state);
    console.log(`[AUTOLOOP_LIFECYCLE] EXECUTION_CREATED: ${state.projectId}`);
    console.log(`[AUTOLOOP_LIFECYCLE] AGENT_STARTED: Mode=${mode}`);

    // Immediately kick off the first real step (Architectural Planning via Gemini or Local Synthesizer & Workspace Init)
    const stepResult = await executeAutonomousStep(state);
    projectsStore.set(stepResult.project.projectId, stepResult.project);

    return res.status(201).json({ 
      success: true, 
      project: stepResult.project 
    });
  } catch (err: any) {
    console.error(`[AUTOLOOP_LIFECYCLE] EXECUTION_FAILED:`, err);
    return res.status(500).json({ 
      error: `Failed to initialize autonomous project: ${err?.message || 'Unknown error'}` 
    });
  }
});

// Get project state
app.get('/api/projects/:id', (req: Request, res: Response) => {
  let project = projectsStore.get(req.params.id);
  if (!project) {
    project = createEmptyProjectState(`Project ${req.params.id}`);
    project.projectId = req.params.id;
    projectsStore.set(req.params.id, project);
  }
  return res.json({ project });
});

// Execute next real autonomous step
app.post('/api/projects/:id/step', async (req: Request, res: Response) => {
  let project = projectsStore.get(req.params.id);
  if (!project) {
    project = createEmptyProjectState(`Project ${req.params.id}`);
    project.projectId = req.params.id;
    projectsStore.set(req.params.id, project);
  }

  if (project.status === 'COMPLETED' || project.status === 'BLOCKED' || project.status === 'PAUSED') {
    return res.json({ 
      project, 
      done: project.status === 'COMPLETED', 
      blocked: project.status === 'BLOCKED' 
    });
  }

  try {
    const result = await executeAutonomousStep(project);
    projectsStore.set(result.project.projectId, result.project);
    return res.json({ 
      project: result.project, 
      done: result.done, 
      blocked: result.blocked,
      error: result.error 
    });
  } catch (err: any) {
    project.status = 'BLOCKED';
    project.terminalLogs.push({
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      agent: 'ORCHESTRATOR',
      level: 'ERROR',
      message: `Autonomous execution step failed: ${err.message}`
    });
    projectsStore.set(project.projectId, project);
    return res.status(500).json({ 
      error: err.message, 
      project 
    });
  }
});

// Pause project
app.post('/api/projects/:id/pause', (req: Request, res: Response) => {
  const project = projectsStore.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  project.status = 'PAUSED';
  projectsStore.set(project.projectId, project);
  return res.json({ success: true, project });
});

// Resume project
app.post('/api/projects/:id/resume', async (req: Request, res: Response) => {
  const project = projectsStore.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  project.status = 'EXECUTING';
  projectsStore.set(project.projectId, project);
  return res.json({ success: true, project });
});

// Abort project
app.post('/api/projects/:id/abort', (req: Request, res: Response) => {
  const project = projectsStore.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  project.status = 'PAUSED';
  project.terminalLogs.push({
    id: 'log-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toLocaleTimeString(),
    agent: 'ORCHESTRATOR',
    level: 'WARN',
    message: 'Autonomous execution aborted by supervisor.'
  });
  projectsStore.set(project.projectId, project);
  return res.json({ success: true, project });
});

// Get real workspace files on disk
app.get('/api/projects/:id/files', async (req: Request, res: Response) => {
  const project = projectsStore.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  try {
    const files = await listWorkspaceFiles(project.projectId);
    return res.json({ files });
  } catch (err: any) {
    return res.status(500).json({ error: `Failed to read workspace files: ${err.message}` });
  }
});

// Get specific workspace file content on disk
app.get('/api/projects/:id/file', async (req: Request, res: Response) => {
  const filePath = req.query.path as string;
  if (!filePath) return res.status(400).json({ error: 'File path is required' });

  try {
    const content = await readWorkspaceFile(req.params.id, filePath);
    return res.json({ path: filePath, content });
  } catch (err: any) {
    return res.status(404).json({ error: `File not found on disk: ${err.message}` });
  }
});

// Human Intervention handlers
app.post('/api/projects/:id/intervention/approve', (req: Request, res: Response) => {
  const project = projectsStore.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const { interventionId } = req.body;
  project.pendingInterventions = project.pendingInterventions.filter(p => p.id !== interventionId);
  if (project.status === 'BLOCKED' || project.status === 'PAUSED') {
    project.status = 'EXECUTING';
  }
  projectsStore.set(project.projectId, project);
  return res.json({ success: true, project });
});

app.post('/api/projects/:id/intervention/reject', (req: Request, res: Response) => {
  const project = projectsStore.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const { interventionId } = req.body;
  project.pendingInterventions = project.pendingInterventions.filter(p => p.id !== interventionId);
  projectsStore.set(project.projectId, project);
  return res.json({ success: true, project });
});

// Live Sandbox Application Preview Handler
app.get(['/api/projects/:id/preview', '/api/projects/:id/preview/*'], async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const project = projectsStore.get(projectId);
  const wsRoot = getWorkspacePath(projectId);

  if (!fs.existsSync(wsRoot)) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Sandbox Initializing</title></head>
        <body style="background:#09090b;color:#f4f4f5;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="text-align:center;padding:24px;background:#18181b;border-radius:12px;border:1px solid #27272a;max-width:480px;">
            <h2 style="color:#06b6d4;margin-top:0;">Sandbox Initializing</h2>
            <p style="color:#a1a1aa;font-size:14px;">The workspace for this project is being created on disk...</p>
          </div>
        </body>
      </html>
    `);
  }

  // Extract relative subpath within preview
  const originalUrl = req.originalUrl || req.url;
  const prefix = `/api/projects/${projectId}/preview`;
  let subPath = originalUrl.slice(prefix.length).split('?')[0];
  if (!subPath || subPath === '/' || subPath === '') {
    subPath = '/index.html';
  }

  const cleanSubPath = subPath.replace(/^\/+/, '');
  
  // Helper to send HTML with base tag injected for bulletproof relative paths and telemetry bridge
  const sendHtmlWithBase = async (filePath: string) => {
    let content = await fs.promises.readFile(filePath, 'utf-8');
    const baseTag = `<base href="/api/projects/${projectId}/preview/">`;
    
    const telemetryScript = `
<script id="__autoloop_telemetry_bridge__">
(function() {
  // Bridge errors to parent window
  window.addEventListener('error', function(e) {
    try {
      window.parent.postMessage({
        type: 'AUTOLOOP_PREVIEW_LOG',
        level: 'ERROR',
        message: 'Runtime Error: ' + (e.message || e.error || 'Unknown script error'),
        source: e.filename ? e.filename.split('/').pop() + ':' + e.lineno : 'inline'
      }, '*');
    } catch(err) {}
  });

  // Intercept button and control interactions
  window.addEventListener('DOMContentLoaded', function() {
    const interactables = document.querySelectorAll('button, input, select, textarea, [role="button"], a');
    interactables.forEach(function(el) {
      el.addEventListener('click', function() {
        const text = (el.textContent || el.value || el.id || el.className || '').trim().slice(0, 30);
        try {
          window.parent.postMessage({
            type: 'AUTOLOOP_PREVIEW_INTERACTION',
            tagName: el.tagName,
            label: text || 'Action Triggered',
            timestamp: new Date().toLocaleTimeString()
          }, '*');
        } catch(err) {}
      }, true);
    });

    // Notify parent window that preview DOM is ready and interactive
    try {
      window.parent.postMessage({
        type: 'AUTOLOOP_PREVIEW_STATUS',
        status: 'READY',
        interactiveElementsCount: interactables.length
      }, '*');
    } catch(err) {}
  });
})();
</script>
`;

    if (!content.includes('<base')) {
      if (content.includes('<head>')) {
        content = content.replace('<head>', `<head>\n  ${baseTag}\n  ${telemetryScript}`);
      } else if (content.includes('<head ')) {
        content = content.replace(/(<head[^>]*>)/i, `$1\n  ${baseTag}\n  ${telemetryScript}`);
      } else {
        content = `${baseTag}\n${telemetryScript}\n${content}`;
      }
    } else {
      content = content.replace('</head>', `${telemetryScript}\n</head>`);
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(content);
  };

  // Potential candidate paths in workspace
  const candidatePaths = [
    path.join(wsRoot, cleanSubPath),
    path.join(wsRoot, 'public', cleanSubPath),
    path.join(wsRoot, 'src', cleanSubPath),
    path.join(wsRoot, 'dist', cleanSubPath),
  ];

  for (const full of candidatePaths) {
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      if (full.endsWith('.html')) {
        return await sendHtmlWithBase(full);
      }
      return res.sendFile(full);
    }
  }

  // Search recursively for the requested filename if it wasn't at the root
  const fileName = path.basename(cleanSubPath);
  const allWsFiles = await listWorkspaceFiles(projectId);
  const matchedFile = allWsFiles.find(f => path.basename(f.path) === fileName || f.path === cleanSubPath);
  if (matchedFile) {
    const full = path.join(wsRoot, matchedFile.path);
    if (fs.existsSync(full)) {
      if (full.endsWith('.html')) {
        return await sendHtmlWithBase(full);
      }
      return res.sendFile(full);
    }
  }

  // If requesting root/index.html and specific file not found, try any .html file in workspace
  if (cleanSubPath === 'index.html' || cleanSubPath === '') {
    const htmlFile = allWsFiles.find(f => f.path.endsWith('.html') || f.path === 'index.html');
    if (htmlFile) {
      const full = path.join(wsRoot, htmlFile.path);
      if (fs.existsSync(full)) {
        return await sendHtmlWithBase(full);
      }
    }

    // If no HTML exists yet, render a rich live compiling view
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${project?.name || 'Workspace Preview'}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #070707; color: #f4f4f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .card { background: #0e0e0e; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 32px; max-width: 540px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.6); text-align: center; }
            .badge { display: inline-block; background: rgba(6,182,212,0.15); color: #22d3ee; font-family: monospace; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(6,182,212,0.3); margin-bottom: 16px; }
            h2 { font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #ffffff; }
            p { color: #888888; font-size: 13px; line-height: 1.5; margin: 0 0 20px 0; }
            .meta { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; text-align: left; font-family: monospace; font-size: 11px; margin-bottom: 20px; }
            .meta-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .meta-row:last-child { margin-bottom: 0; }
            .meta-label { color: #666666; }
            .meta-val { color: #22d3ee; font-weight: bold; }
            .spinner { width: 24px; height: 24px; border: 2px solid rgba(6,182,212,0.2); border-top-color: #06b6d4; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">AUTONOMOUS ARTIFACT RUNTIME</div>
            <h2>${project?.name || 'Synthesizing Application'}</h2>
            <p>The autonomous agent is currently writing source code files to the workspace. Once the HTML entry point is compiled, the live interactive preview will mount here.</p>
            <div class="meta">
              <div class="meta-row"><span class="meta-label">OBJECTIVE:</span><span class="meta-val">${(project?.originalUserPrompt || '').slice(0, 40)}...</span></div>
              <div class="meta-row"><span class="meta-label">FILES WRITTEN:</span><span class="meta-val">${allWsFiles.length} files</span></div>
              <div class="meta-row"><span class="meta-label">STATUS:</span><span class="meta-val">${project?.status || 'EXECUTING'}</span></div>
            </div>
            <div class="spinner"></div>
          </div>
        </body>
      </html>
    `);
  }

  return res.status(404).send('File not found in workspace: ' + cleanSubPath);
});

// Explicit API 404 handler to guarantee API calls return JSON error and NEVER fallback to HTML
app.all('/api/*', (req: Request, res: Response) => {
  return res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Global API Error Middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  if (req.originalUrl.startsWith('/api/')) {
    console.error('[API Server Error]', err);
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
  next(err);
});

// Production and dev server mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AUTOLOOP Autonomous Engine server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
