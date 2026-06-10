# Codebase Structure

**Analysis Date:** 2026-06-10

## Directory Layout

```
isd-project/
├── .claude/            # Claude Code agent and command config
├── .codex/             # Codex agent and skill config
├── .gemini/            # Gemini agent config
├── .planning/          # Active GSD project state and history
├── assets/             # Project screenshots and media
├── docs/               # Tutorial modules and mindset docs
├── sample-project/     # Reference implementation (Library Management)
├── scripts/            # Internal maintenance and rendering scripts
├── templates/          # Standard GSD document templates
└── README.md           # Project entry documentation
```

## Directory Purposes

**[.claude]:**
- Purpose: Configuration for the Claude Code agent platform.
- Contains: Agents, commands, hooks, and the GSD Core workflow definitions.
- Key files: `.claude/gsd-core/workflows/*.md`, `.claude/agents/*.md`

**[.codex]:**
- Purpose: Configuration for the Codex agent platform.
- Contains: Skills and agent adapters for Codex.
- Key files: `.codex/skills/gsd-*/SKILL.md`

**[.planning]:**
- Purpose: Stores the source of truth for the current project state.
- Contains: `PROJECT.md`, `ROADMAP.md`, and phase-specific artifacts.
- Key files: `.planning/PROJECT.md`, `.planning/ROADMAP.md`

**[docs]:**
- Purpose: Educational material for students.
- Contains: Sequential Markdown files for different learning modules.
- Key files: `docs/00-mindset.md` to `docs/13-reviewing-ai-code.md`

**[sample-project]:**
- Purpose: A sandbox or reference implementation for learning.
- Contains: `library-management/` with its own `.planning/` and `PROJECT_SPEC.md`.

## Key File Locations

**Entry Points:**
- `README.md`: Tutorial overview and setup.
- `.claude/commands/gsd/`: Definitions for slash commands.

**Configuration:**
- `.claude/package.json`: Basic project type config.
- `.claude/gsd-core/VERSION`: Framework versioning.

**Core Logic:**
- `.claude/gsd-core/workflows/`: The "executable" logic of the GSD framework.

**Testing:**
- `.claude/gsd-core/workflows/add-tests.md`: Workflow for generating tests.
- `docs/12-verify-and-ship.md`: Guidelines for verification.

## Naming Conventions

**Files:**
- **Agents:** `gsd-[role].md` (e.g., `gsd-planner.md`)
- **Workflows:** `kebab-case.md` (e.g., `plan-phase.md`)
- **Documentation:** `NN-kebab-case.md` (e.g., `01-setup-environment.md`)
- **GSD State Docs:** `UPPER_CASE.md` (e.g., `PLAN.md`, `PROJECT.md`)

**Directories:**
- **Agent Platforms:** `.[platform_name]` (e.g., `.claude`)
- **Workflows:** `kebab-case` (e.g., `gsd-core/workflows`)

## Where to Add New Code

**New Feature (in tutorial):**
- Primary code: Should be added under a project directory (e.g., `app/library-management/`) following the GSD process.

**New Agent Capability:**
- Implementation: Add a new workflow in `.claude/gsd-core/workflows/` and a corresponding agent in `.claude/agents/`.

**Utilities:**
- Shared helpers: `scripts/`

## Special Directories

**[.planning]:**
- Purpose: Active project tracking.
- Generated: Yes (by GSD commands).
- Committed: Yes (essential for context transfer).

**[.claude]:**
- Purpose: Agent environment.
- Generated: No (part of the framework).
- Committed: Yes.

---

*Structure analysis: 2026-06-10*
