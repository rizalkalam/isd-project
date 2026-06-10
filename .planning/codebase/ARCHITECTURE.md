<!-- refreshed: 2026-06-10 -->
# Architecture

**Analysis Date:** 2026-06-10

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      Command Interface                      │
│         (Slash Commands in Agent Terminal / CLI)            │
├──────────────────┬──────────────────┬───────────────────────┤
│   Claude Code    │      Codex       │        Gemini         │
│  `.claude/`      │     `.codex/`    │       `.gemini/`      │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Workflow Orchestration                   │
│         `.claude/gsd-core/workflows/` (Markdown)            │
│         `.codex/skills/` (Skill Adapters)                   │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Specialized Agent Layer                   │
│         `.claude/agents/*.md` (System Prompts)              │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  State & Project Data            Source Code                │
│  `.planning/`                    `src/`, `app/`, etc.       │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| **Command Interface** | Provides user entry points for lifecycle phases. | `.claude/commands/` |
| **Workflow Engine** | Orchestrates tasks using Markdown-defined logic. | `.claude/gsd-core/workflows/` |
| **Specialized Agents** | Perform specific roles (Planner, Executor, Verifier). | `.claude/agents/` |
| **Skill Adapters** | Maps generic workflow commands to platform-specific tools. | `.codex/skills/` |
| **State Management** | Tracks project progress, requirements, and plans. | `.planning/` |

## Pattern Overview

**Overall:** Agentic Workflow Orchestration (AWO)

**Key Characteristics:**
- **Spec-First:** Workflows mandate discussion and planning before execution.
- **Persona-Based:** Tasks are delegated to specialized agents with distinct system prompts.
- **Markdown-Driven:** Logic and instructions are defined in human-readable Markdown files.

## Layers

**Command Layer:**
- Purpose: Entry point for user interaction.
- Location: `.claude/commands/`
- Contains: Slash command definitions.
- Depends on: Workflow Layer.
- Used by: User.

**Workflow Layer:**
- Purpose: Defines the sequence of steps for a GSD phase.
- Location: `.claude/gsd-core/workflows/`
- Contains: Markdown-based instruction sets and tool call patterns.
- Depends on: Agent Layer.
- Used by: Command Layer.

**Agent Layer:**
- Purpose: Defines the specialized behavior and knowledge of AI agents.
- Location: `.claude/agents/`
- Contains: Markdown system prompts.
- Depends on: Infrastructure (LLM runtime).
- Used by: Workflow Layer.

## Data Flow

### Primary Request Path (Phase Execution)

1. **Trigger:** User issues a command like `/gsd:plan-phase` (`.claude/commands/gsd/plan-phase.md`).
2. **Orchestration:** GSD Core loads the `plan-phase.md` workflow (`.claude/gsd-core/workflows/plan-phase.md`).
3. **Execution:** The workflow spawns a `gsd-planner` agent (`.claude/agents/gsd-planner.md`) to create a `PLAN.md`.
4. **Verification:** The workflow spawns a `gsd-plan-checker` to validate the plan against requirements.
5. **Persistence:** The final plan is written to `.planning/phases/phase-N/PLAN.md`.

### State Management:
- **Project State:** Managed in `.planning/PROJECT.md` and `.planning/ROADMAP.md`.
- **Phase State:** Each phase has its own directory in `.planning/phases/`.

## Key Abstractions

**Skill:**
- Purpose: Encapsulates a high-level capability (e.g., "Add Tests").
- Examples: `.codex/skills/gsd-add-tests/`
- Pattern: Adapter pattern (translating workflow commands to tool calls).

**Workflow:**
- Purpose: A scripted sequence of agent interactions and tool uses.
- Examples: `.claude/gsd-core/workflows/execute-phase.md`
- Pattern: Scripting/Orchestration.

## Entry Points

**Slash Commands:**
- Location: `.claude/commands/gsd/`
- Triggers: User input in the agent terminal.
- Responsibilities: Initialize the appropriate workflow with user arguments.

## Architectural Constraints

- **Platform Dependency:** Agent configurations and command formats are platform-specific (`.claude` vs `.codex`).
- **Markdown Logic:** Workflows rely on the LLM's ability to follow complex instructions embedded in Markdown.
- **Git Integration:** Workflows often assume a Git repository structure and use Git hooks (`.claude/hooks/`).

## Anti-Patterns

### Inline Execution without Planning

**What happens:** Skipping `/gsd:plan-phase` and jumping directly to code changes.
**Why it's wrong:** Leads to architectural drift and misalignment with requirements.
**Do this instead:** Always follow the GSD lifecycle: Discuss -> Plan -> Execute.

## Error Handling

**Strategy:** Human-in-the-loop and Agentic Verification.

**Patterns:**
- **Verification Loops:** Workflows (like `plan-phase`) include a verification step where a different agent checks the output.
- **Checkpoints:** State is saved at key steps to allow for recovery or manual correction.

---

*Architecture analysis: 2026-06-10*
