# Architecture

**Analysis Date:** 2026-06-10

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      Workflow Orchestration                  │
│               `.gemini/gsd-core/workflows/*.md`              │
├──────────────────┬──────────────────┬───────────────────────┤
│   Agent Layer    │   Agent Layer    │    Agent Layer       │
│ `.claude/agents` │ `.codex/agents`  │  `.gemini/agents`    │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Command Routing (CLI)                     │
│         `gsd-tools.cjs`                                      │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  Core Logic Libraries                                        │
│  `.gemini/gsd-core/bin/lib/*.cjs`                            │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Command Router | Central CLI entry point for all GSD operations | `.gemini/gsd-core/bin/gsd-tools.cjs` |
| Core Libs | Domain logic for phases, state, roadmap, and git | `.gemini/gsd-core/bin/lib/` |
| Agents | Model-specific prompt templates and tool definitions | `.gemini/agents/` |
| Workflows | High-level process definitions using agents and tools | `.gemini/gsd-core/workflows/` |

## Pattern Overview

**Overall:** CLI-driven Modular Core with Agentic Orchestration.

**Key Characteristics:**
- **Model Isolation:** Separate directories for `.claude`, `.codex`, and `.gemini` ensure model-specific optimizations.
- **Library-First Logic:** Core operations are encapsulated in CJS modules, usable by both the CLI and agents.
- **Workflow-Driven:** Complex tasks are decomposed into workflows defined in Markdown.

## Layers

**Workflow Layer:**
- Purpose: Defines the sequence of operations for a specific GSD command.
- Location: `.gemini/gsd-core/workflows/`
- Contains: Markdown files with embedded logic and agent calls.

**Agent Layer:**
- Purpose: Model-specific personas that execute tasks within workflows.
- Location: `.gemini/agents/`
- Contains: Markdown definitions with frontmatter and system instructions.

**CLI/Core Layer:**
- Purpose: Provides the atomic tools and state management required by agents.
- Location: `.gemini/gsd-core/bin/`

## Data Flow

### Primary Request Path

1. User invokes SlashCommand (e.g., `/gsd-new-project`)
2. Orchestrator reads Workflow Markdown (`.gemini/gsd-core/workflows/new-project.md`)
3. Orchestrator executes embedded bash/logic and spawns Subagents
4. Subagents invoke CLI Core (`gsd-tools.cjs`) to read/write state and artifacts
5. Final result is committed and displayed to user

**State Management:**
- Managed via filesystem in `.planning/` directory using markdown and JSON files.

## Entry Points

**gsd-tools.cjs:**
- Location: `.gemini/gsd-core/bin/gsd-tools.cjs`
- Triggers: Invoked by shell or agents via `node`.
- Responsibilities: Routes commands to the appropriate library module.

---

*Architecture analysis: 2026-06-10*
