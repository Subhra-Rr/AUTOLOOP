import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { ProjectFile, TestCase, AuditLogEvent, ToolRisk } from '../src/types';
import { redactSecrets, classifyCommandRisk } from '../src/lib/engine';

const WORKSPACE_BASE = path.join(process.cwd(), '.workspaces');

// Ensure base workspaces root exists
if (!fs.existsSync(WORKSPACE_BASE)) {
  fs.mkdirSync(WORKSPACE_BASE, { recursive: true });
}

export function getWorkspacePath(projectId: string): string {
  const safeId = projectId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(WORKSPACE_BASE, safeId);
}

// Ensure path is strictly inside workspace to prevent directory traversal
export function resolveSafePath(projectId: string, relPath: string): string {
  const wsRoot = getWorkspacePath(projectId);
  const normalized = path.normalize(relPath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = path.resolve(wsRoot, normalized);
  if (!fullPath.startsWith(wsRoot)) {
    throw new Error(`Zero-Trust Security Violation: Path "${relPath}" escapes workspace sandbox.`);
  }
  return fullPath;
}

export async function initProjectWorkspace(projectId: string, name: string, prompt: string): Promise<string> {
  const wsDir = getWorkspacePath(projectId);
  if (!fs.existsSync(wsDir)) {
    await fs.promises.mkdir(wsDir, { recursive: true });
  }

  // Create initial package.json in workspace so tests and modules can run
  const pkgJson = {
    name: projectId.toLowerCase(),
    version: '1.0.0',
    type: 'module',
    description: name,
    scripts: {
      test: 'node --test'
    }
  };

  await fs.promises.writeFile(
    path.join(wsDir, 'package.json'),
    JSON.stringify(pkgJson, null, 2),
    'utf-8'
  );

  return wsDir;
}

export async function writeWorkspaceFile(
  projectId: string,
  relPath: string,
  content: string
): Promise<{ fullPath: string; bytes: number; lineCount: number }> {
  const safePath = resolveSafePath(projectId, relPath);
  const parentDir = path.dirname(safePath);
  
  if (!fs.existsSync(parentDir)) {
    await fs.promises.mkdir(parentDir, { recursive: true });
  }

  await fs.promises.writeFile(safePath, content, 'utf-8');
  const stats = await fs.promises.stat(safePath);
  const lineCount = content.split('\n').length;

  return {
    fullPath: safePath,
    bytes: stats.size,
    lineCount
  };
}

export async function readWorkspaceFile(projectId: string, relPath: string): Promise<string> {
  const safePath = resolveSafePath(projectId, relPath);
  if (!fs.existsSync(safePath)) {
    throw new Error(`File not found: ${relPath}`);
  }
  return await fs.promises.readFile(safePath, 'utf-8');
}

export async function editWorkspaceFile(
  projectId: string,
  relPath: string,
  searchContent: string,
  replaceContent: string
): Promise<{ before: string; after: string }> {
  const safePath = resolveSafePath(projectId, relPath);
  if (!fs.existsSync(safePath)) {
    throw new Error(`File not found for editing: ${relPath}`);
  }

  const currentContent = await fs.promises.readFile(safePath, 'utf-8');
  if (!currentContent.includes(searchContent)) {
    // If exact match fails, try whitespace-normalized replacement or replace entire content if targeted
    throw new Error(`Target content not found in ${relPath} for surgical replacement.`);
  }

  const updatedContent = currentContent.replace(searchContent, replaceContent);
  await fs.promises.writeFile(safePath, updatedContent, 'utf-8');

  return {
    before: currentContent,
    after: updatedContent
  };
}

export async function deleteWorkspaceFile(projectId: string, relPath: string): Promise<boolean> {
  const safePath = resolveSafePath(projectId, relPath);
  if (fs.existsSync(safePath)) {
    await fs.promises.unlink(safePath);
    return true;
  }
  return false;
}

export async function listWorkspaceFiles(projectId: string): Promise<ProjectFile[]> {
  const wsRoot = getWorkspacePath(projectId);
  if (!fs.existsSync(wsRoot)) {
    return [];
  }

  const results: ProjectFile[] = [];

  async function scanDir(currentDir: string) {
    const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'package.json') {
        continue;
      }
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(wsRoot, fullPath).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (entry.isFile()) {
        const content = await fs.promises.readFile(fullPath, 'utf-8');
        const ext = path.extname(entry.name).toLowerCase();
        let language = 'typescript';
        if (ext === '.js' || ext === '.mjs') language = 'javascript';
        else if (ext === '.json') language = 'json';
        else if (ext === '.sql') language = 'sql';
        else if (ext === '.html') language = 'html';
        else if (ext === '.css') language = 'css';
        else if (ext === '.md') language = 'markdown';

        results.push({
          path: relPath,
          name: entry.name,
          language,
          content,
          isModified: false,
          isNew: true
        });
      }
    }
  }

  await scanDir(wsRoot);
  return results;
}

export interface CommandExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  risk: ToolRisk;
  blocked: boolean;
  blockedReason?: string;
}

export async function executeWorkspaceCommand(
  projectId: string,
  commandStr: string,
  timeoutMs: number = 20000
): Promise<CommandExecutionResult> {
  const risk = classifyCommandRisk(commandStr);
  if (risk === 'BLOCKED') {
    return {
      stdout: '',
      stderr: `[Zero-Trust Policy] Command execution BLOCKED: "${commandStr}" violates host sandbox constraints.`,
      exitCode: 126,
      durationMs: 5,
      risk: 'BLOCKED',
      blocked: true,
      blockedReason: 'Command violates host security policy.'
    };
  }

  const wsRoot = getWorkspacePath(projectId);
  const startTime = Date.now();

  return new Promise((resolve) => {
    // Execute command within workspace directory
    const child = spawn(commandStr, {
      cwd: wsRoot,
      shell: true,
      env: {
        ...process.env,
        PATH: process.env.PATH,
        NODE_ENV: 'test',
        PWD: wsRoot
      }
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve({
        stdout: redactSecrets(stdout),
        stderr: redactSecrets(stderr + `\n[Timeout] Command exceeded limit of ${timeoutMs}ms.`),
        exitCode: 124,
        durationMs: Date.now() - startTime,
        risk,
        blocked: false
      });
    }, timeoutMs);

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        stdout: redactSecrets(stdout),
        stderr: redactSecrets(stderr),
        exitCode: code ?? 0,
        durationMs: Date.now() - startTime,
        risk,
        blocked: false
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        stdout: redactSecrets(stdout),
        stderr: redactSecrets(err.message),
        exitCode: 1,
        durationMs: Date.now() - startTime,
        risk,
        blocked: false
      });
    });
  });
}

export async function runWorkspaceTests(projectId: string): Promise<{
  allPassed: boolean;
  testCases: TestCase[];
  rawOutput: string;
  exitCode: number;
  totalPassed: number;
  totalFailed: number;
}> {
  const wsRoot = getWorkspacePath(projectId);
  const testsDir = path.join(wsRoot, 'tests');

  if (!fs.existsSync(testsDir)) {
    return {
      allPassed: true,
      testCases: [],
      rawOutput: 'No tests directory found in workspace.',
      exitCode: 0,
      totalPassed: 0,
      totalFailed: 0
    };
  }

  // Find all test files
  const entries = await fs.promises.readdir(testsDir);
  const testFiles = entries.filter(f => f.endsWith('.test.js') || f.endsWith('.test.mjs') || f.endsWith('.test.ts') || f.endsWith('_test.js'));

  if (testFiles.length === 0) {
    return {
      allPassed: true,
      testCases: [],
      rawOutput: 'Zero test files found to execute.',
      exitCode: 0,
      totalPassed: 0,
      totalFailed: 0
    };
  }

  const testCases: TestCase[] = [];
  let totalPassed = 0;
  let totalFailed = 0;
  let fullOutput = '';
  let overallExitCode = 0;

  for (const testFile of testFiles) {
    const relTestPath = path.join('tests', testFile);
    const cmdResult = await executeWorkspaceCommand(projectId, `node --test ${relTestPath}`);
    fullOutput += `\n--- RUNNING ${relTestPath} ---\n` + cmdResult.stdout + (cmdResult.stderr ? '\n' + cmdResult.stderr : '');
    
    if (cmdResult.exitCode !== 0) {
      overallExitCode = cmdResult.exitCode;
    }

    // Parse test output lines
    const lines = (cmdResult.stdout + '\n' + cmdResult.stderr).split('\n');
    let currentSuite = testFile;

    for (const line of lines) {
      const passMatch = line.match(/(?:ok|✔|PASS)\s+\d*\s*-?\s*(.*)/i);
      const failMatch = line.match(/(?:not ok|✖|FAIL)\s+\d*\s*-?\s*(.*)/i);

      if (passMatch && passMatch[1]?.trim()) {
        const testName = passMatch[1].trim();
        totalPassed++;
        testCases.push({
          id: `test-${testCases.length + 1}`,
          name: testName,
          suite: currentSuite,
          status: 'PASSED',
          durationMs: Math.max(15, cmdResult.durationMs / 4)
        });
      } else if (failMatch && failMatch[1]?.trim()) {
        const testName = failMatch[1].trim();
        totalFailed++;
        testCases.push({
          id: `test-${testCases.length + 1}`,
          name: testName,
          suite: currentSuite,
          status: 'FAILED',
          durationMs: Math.max(25, cmdResult.durationMs / 4),
          errorDetails: {
            message: `Assertion failure in test: ${testName}`,
            file: relTestPath,
            line: 1,
            expected: 'truthy / 200 OK',
            actual: 'assertion error',
            stackTrace: cmdResult.stderr || cmdResult.stdout
          }
        });
      }
    }

    // If runner output format was generic but passed/failed
    if (testCases.length === 0) {
      if (cmdResult.exitCode === 0) {
        totalPassed++;
        testCases.push({
          id: `test-${testCases.length + 1}`,
          name: `Suite execution (${testFile})`,
          suite: testFile,
          status: 'PASSED',
          durationMs: cmdResult.durationMs
        });
      } else {
        totalFailed++;
        testCases.push({
          id: `test-${testCases.length + 1}`,
          name: `Suite execution (${testFile})`,
          suite: testFile,
          status: 'FAILED',
          durationMs: cmdResult.durationMs,
          errorDetails: {
            message: `Test execution exited with code ${cmdResult.exitCode}`,
            file: relTestPath,
            line: 1,
            expected: 'Exit code 0',
            actual: `Exit code ${cmdResult.exitCode}`,
            stackTrace: cmdResult.stderr || cmdResult.stdout
          }
        });
      }
    }
  }

  return {
    allPassed: totalFailed === 0 && overallExitCode === 0,
    testCases,
    rawOutput: fullOutput,
    exitCode: overallExitCode,
    totalPassed,
    totalFailed
  };
}

export async function runWorkspaceSecurityAudit(projectId: string): Promise<{
  scannedFiles: number;
  findings: Array<{ file: string; rule: string; severity: 'HIGH' | 'MEDIUM' | 'LOW'; line: number }>;
  secretCount: number;
}> {
  const files = await listWorkspaceFiles(projectId);
  const findings: Array<{ file: string; rule: string; severity: 'HIGH' | 'MEDIUM' | 'LOW'; line: number }> = [];
  let secretCount = 0;

  for (const file of files) {
    const lines = file.content.split('\n');
    lines.forEach((line, idx) => {
      // Check for hardcoded API keys
      if (/AIza[0-9A-Za-z-_]{35}/.test(line) || /sk-[a-zA-Z0-9]{20,}/.test(line)) {
        secretCount++;
        findings.push({
          file: file.path,
          rule: 'Hardcoded Secret / API Key detected',
          severity: 'HIGH',
          line: idx + 1
        });
      }
      // Check for eval() usage
      if (/\beval\s*\(/.test(line)) {
        findings.push({
          file: file.path,
          rule: 'Unsafe eval() invocation',
          severity: 'HIGH',
          line: idx + 1
        });
      }
      // Check for raw child_process execution without sanitation
      if (/exec\s*\(/.test(line) && !line.includes('spawn') && !file.path.includes('test')) {
        findings.push({
          file: file.path,
          rule: 'Potentially unsanitized command execution',
          severity: 'MEDIUM',
          line: idx + 1
        });
      }
    });
  }

  return {
    scannedFiles: files.length,
    findings,
    secretCount
  };
}
