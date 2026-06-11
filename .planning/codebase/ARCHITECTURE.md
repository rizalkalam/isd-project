<!-- refreshed: 2026-06-11 -->
# Architecture

**Analysis Date:** 2026-06-11

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      Agent Layer                            │
│           `.claude/agents/gsd-*.md`                         │
├──────────────────┬──────────────────┬───────────────────────┤
│   gsd-planner    │   gsd-executor   │    gsd-verifier       │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Workflow Layer                           │
│      `.claude/gsd-core/workflows/*.md`                      │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Tooling Layer (CLI)                      │
│      `.claude/gsd-core/bin/gsd-tools.cjs`                   │
│      `.claude/gsd-core/bin/lib/*.cjs`                       │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Filesystem (State/Docs)                    │
│      `.planning/` (STATE.md, ROADMAP.md, etc.)              │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Agents | Orchestrate the GSD process, interface with the user, and execute workflows. | `.claude/agents/*.md` |
| Workflows | Define the step-by-step procedures for each phase (discuss, plan, execute, verify). | `.claude/gsd-core/workflows/*.md` |
| gsd-tools | Centralized CLI utility for all GSD workflow operations (state, roadmap, phase management). | `.claude/gsd-core/bin/gsd-tools.cjs` |
| Core Library | Specialized logic for state management, git operations, and project artifacts. | `.claude/gsd-core/bin/lib/*.cjs` |
| State | Tracks the current progress, active phase, and project metadata. | `.planning/STATE.md` |
| Roadmap | Defines the project milestones and phases. | `ROADMAP.md` |

## Pattern Overview

**Overall:** Agentic Workflow with Modular CLI

**Key Characteristics:**
- **Workflow-Driven**: Agent behavior is governed by markdown-based workflows that describe steps and decision points.
- **CLI-Augmented**: Agents rely on a specialized CLI (`gsd-tools.cjs`) to perform complex filesystem and git operations safely and consistently.
- **File-Based State**: The system's source of truth is stored in markdown and JSON files within the `.planning/` directory, allowing for transparency and git-tracking.

## Layers

**Agent Layer:**
- Purpose: Provides specialized personas for different parts of the SDLC.
- Location: `.claude/agents/`
- Contains: System instructions and role-specific constraints.
- Depends on: Workflow Layer.
- Used by: User / LLM.

**Workflow Layer:**
- Purpose: Defines the business logic of the GSD process.
- Location: `.claude/gsd-core/workflows/`
- Contains: Procedural markdown files with embedded shell commands.
- Depends on: Tooling Layer.
- Used by: Agent Layer.

**Tooling Layer:**
- Purpose: Automates repetitive and complex tasks.
- Location: `.claude/gsd-core/bin/`
- Contains: Node.js scripts and libraries.
- Depends on: Filesystem/OS.
- Used by: Workflow Layer.

## Data Flow

### Primary Request Path (Phase Operation)

1. **Agent Invocation**: The user or another agent triggers a workflow (e.g., `/gsd:plan-phase`).
2. **Workflow Execution**: The agent reads the corresponding workflow file (e.g., `.claude/gsd-core/workflows/plan-phase.md`).
3. **CLI Command**: The agent executes a shell command defined in the workflow (e.g., `node .claude/gsd-core/bin/gsd-tools.cjs phase start ...`).
4. **Library Logic**: `gsd-tools.cjs` calls internal functions in `bin/lib/state.cjs` or `bin/lib/roadmap.cjs`.
5. **State Update**: The library modifies files in `.planning/` (e.g., updates `STATE.md`).
6. **Agent Feedback**: The agent receives the command output and reports back to the user or proceeds to the next step.

### State Management:
- Handled primarily by `bin/lib/state.cjs` and `bin/lib/planning-workspace.cjs`.
- Uses a file-locking mechanism (`_heldStateLocks` in `state.cjs`) to prevent concurrent modifications during the same process.
- Frontmatter in `.planning/STATE.md` serves as the primary data store for active project parameters.

## Key Abstractions

**Gates:**
- Purpose: Validation checkpoints that control workflow progression.
- Examples: `.claude/gsd-core/references/gates.md`
- Pattern: Pre-flight, Revision, Escalation, and Abort.

**Phases:**
- Purpose: Incremental units of work defined in the roadmap.
- Examples: `.planning/phases/NN-{name}/`
- Pattern: Decimal numbering (e.g., 01.10) for insertion and sequencing.

**Worktrees:**
- Purpose: Isolated environments for executing plans without polluting the main branch.
- Examples: `bin/lib/worktree-safety.cjs`
- Pattern: Automated creation and cleanup of git worktrees.

## Entry Points

**gsd-tools CLI:**
- Location: `.claude/gsd-core/bin/gsd-tools.cjs`
- Triggers: Shell commands from Agents or Workflows.
- Responsibilities: Dispatches commands to specialized libraries.

**Claude Entry (CLAUDE.md):**
- Location: `CLAUDE.md`
- Triggers: Initial project load by the agent.
- Responsibilities: Provides high-level commands and environment context.

## Architectural Constraints

- **Threading:** Single-threaded Node.js execution for the CLI.
- **Global state:** No in-memory global state across agent turns; all persistence is in `.planning/`.
- **File System Dependency:** Heavily reliant on POSIX-style paths (handled by `toPosixPath` in `core.cjs`).
- **Git Integration:** Requires an initialized git repository for most operations (tracked via `.git`).

## Anti-Patterns

### Checkpoint Human-Automation
**What happens:** Asking a human to perform a task that can be automated via CLI.
**Why it's wrong:** Reduces efficiency and introduces human error.
**Do this instead:** Automate via `gsd-tools` or relevant CLI (e.g., Vercel, Prisma).

### Vague Task Definitions
**What happens:** Creating tasks like "Style the dashboard" without specifics.
**Why it's wrong:** Causes ambiguity and requires clarifying questions.
**Do this instead:** Provide specific, measurable tasks (e.g., "Add Tailwind classes to Dashboard.tsx: grid layout (3 cols on lg)...").

### Reflexive SUMMARY Chaining
**What happens:** Every plan referencing all previous SUMMARY files.
**Why it's wrong:** Wastes context budget and bloats prompts.
**Do this instead:** Use selective context, referencing only what is strictly necessary.

## Error Handling

**Strategy:** Use of formal Gate Taxonomy.

**Patterns:**
- **Pre-flight Gates**: Check preconditions (e.g., file existence) before starting.
- **Revision Gates**: Evaluate output quality and loop back to the agent if needed (max 3 iterations).
- **Escalation Gates**: Pause for human input when automated resolution fails.

## Cross-Cutting Concerns

**Logging:** Handled by `.claude/gsd-core/bin/lib/observability/logger.cjs`.
**Validation:** Centralized in `bin/lib/validate.cjs` and specialized logic in roadmap/state libraries.
**Configuration:** Managed via `.planning/config.json` and `bin/lib/configuration.cjs`.

---

*Architecture analysis: 2026-06-11*
