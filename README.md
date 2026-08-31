# AUTOLOOP — Autonomous AI Software Engineering Engine

> An autonomous end-to-end AI software engineering platform driven by Gemini LLM orchestration, zero-trust filesystem sandboxing, automated test verification, and closed-loop self-repair.

---

## Overview

**AUTOLOOP** is an autonomous software engineering engine designed to translate natural language user objectives into verified, production-ready software artifacts. It operates under a strict **Zero-Trust & Honest Execution** paradigm:

- **No Prompt = No Agent**: The platform remains completely idle until a real user prompt is submitted.
- **Root Objective Fidelity**: The exact user prompt (`originalUserPrompt`) acts as the root objective for all downstream task synthesis and tool executions.
- **Real Tool & Process Execution**: Writes real files to isolated disk workspaces (`.workspaces/{projectId}`), executes commands, and runs automated Node.js test suites.
- **Automated Failure-Repair Loop**: When test assertions fail, the repair agent isolates root causes, synthesizes patches, and re-executes tests to verify resolutions.
- **9/9 Definition of Done (DoD) Verification**: Validates deliverables against comprehensive software engineering criteria including architecture, type safety, test coverage, and secret leak prevention.

---

## Core Capabilities

### 1. Dynamic Task Synthesis
- Analyzes user goals via Gemini models (`gemini-3.7-flash` & `gemini-3.1-flash-lite`).
- Generates structured, dependency-ordered task graphs across architecture, backend, frontend, testing, and security domains.

### 2. Zero-Trust Sandboxed Workspaces
- Isolated workspace directory allocated per execution project (`.workspaces/{projectId}`).
- Path traversal prevention ensuring safe, contained file operations (`writeFile`, `readFile`, `editFile`, `deleteFile`).
- Secret redaction and command policy enforcement blocking dangerous system calls.

### 3. Automated Test Runner & Self-Repair Engine
- Executes automated test suites using the Node.js test runner (`node:test`, `node:assert`).
- Automatically captures failures, isolates failing assertions, and triggers the AI Self-Repair Agent.
- Applies surgical diff patches to workspace files and re-tests until green or max attempts reached.

### 4. Interactive Command Center
- **Workspace Explorer**: Live tree view and code viewer with syntax highlighting and patch diff comparisons.
- **Real-Time Terminal & Execution Logs**: Full streaming visibility into agent tool invocations, commands, and outputs.
- **Security & Quality Radar**: Live static analysis scanning for leaked credentials, unsafe `eval()` calls, and vulnerabilities.
- **Supervisory Controls**: Pause, resume, abort, step-by-step execution, and human intervention approval workflows.

---

## Execution Lifecycle

```
[USER PROMPT SUBMISSION]
         │
         ▼
[PROMPT_RECEIVED] ───► Validate & Store exact originalUserPrompt
         │
         ▼
[EXECUTION_CREATED] ───► Initialize isolated disk workspace
         │
         ▼
[AGENT_STARTED] ───► Call Gemini for architectural task graph
         │
         ▼
┌───► [NEXT_AGENT_ITERATION] ───► Execute next task in dependency graph
│        │
│        ├───► [TOOL_REQUESTED: writeFile / executeCommand]
│        │        │
│        │        ▼
│        ├───► [TOOL_EXECUTED & RESULT_RETURNED]
│        │        │
│        └───► [TEST_EXECUTION]
│                 │
│                 ├── (Failures detected) ──► [SELF-REPAIR LOOP] ──► Apply Patch ──┐
│                 │                                                                 │
│                 └── (Passed) ─────────────────────────────────────────────────────┘
│
└──────────── (More tasks pending)
         │
         ▼ (All tasks completed)
[VERIFICATION_STARTED] ───► Audit 9/9 Definition of Done criteria
         │
         ▼
[COMPLETED] ───► Production artifacts verified & ready
```

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend Server**: Node.js, Express, Vite middleware
- **AI Orchestration**: `@google/genai` SDK (Gemini 3.7 Flash & Gemini 3.1 Flash Lite)
- **Testing Runtime**: Node.js Test Runner (`node --test`)
- **Storage & Sandboxing**: Native filesystem sandboxes with zero-trust path isolation

---

## Getting Started

### Prerequisites

- Node.js 18+ or Node.js 20+
- A Google Gemini API Key (`GEMINI_API_KEY`)

### Environment Setup

Create a `.env` file or export the key in your environment:

```bash
GEMINI_API_KEY="your_gemini_api_key_here"
```

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
# Build the client and server bundles
npm run build

# Start the production server
npm start
```

---

## Security & Privacy

- All LLM API calls and secret keys remain strictly server-side.
- Sandboxed workspace paths are normalized and prevented from escaping `.workspaces/`.
- Pre-execution regex inspection blocks dangerous shell patterns (e.g., recursive root deletions, arbitrary permission modifications).
- Static analysis scans code for exposed API keys and sensitive tokens before marking any build as complete.

---

## License & Attribution

Copyright © 2026 by Subhradeet Sabat | All Rights Reserved.
