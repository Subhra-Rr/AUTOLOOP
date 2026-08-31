import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { ProjectState, AutonomyMode } from './src/types';
import { createEmptyProjectState, executeAutonomousStep } from './server/geminiOrchestrator';
import { listWorkspaceFiles, readWorkspaceFile } from './server/workspace';

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

    // Check if GEMINI_API_KEY is present
    if (!process.env.GEMINI_API_KEY) {
      console.log(`[AUTOLOOP_LIFECYCLE] EXECUTION_FAILED: Missing GEMINI_API_KEY`);
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the server environment. Please set GEMINI_API_KEY to enable real AI execution.'
      });
    }

    // Create real initial state
    const state = createEmptyProjectState(cleanPrompt, mode as AutonomyMode);
    projectsStore.set(state.projectId, state);
    console.log(`[AUTOLOOP_LIFECYCLE] EXECUTION_CREATED: ${state.projectId}`);
    console.log(`[AUTOLOOP_LIFECYCLE] AGENT_STARTED: Mode=${mode}`);

    // Immediately kick off the first real step (Architectural Planning via Gemini & Workspace Init)
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
  const project = projectsStore.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  return res.json({ project });
});

// Execute next real autonomous step
app.post('/api/projects/:id/step', async (req: Request, res: Response) => {
  const project = projectsStore.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
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
