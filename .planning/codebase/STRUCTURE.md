# Codebase Structure

**Analysis Date:** 2026-06-11

## Directory Layout

```
[project-root]/
├── .claude/         # Claude-specific agent configuration and core logic
│   ├── agents/      # Agent definition files (.md)
│   ├── commands/    # Custom command definitions
│   ├── gsd-core/    # Core GSD system (bin, workflows, templates)
│   └── hooks/       # System and git hooks
├── .codex/          # Codex-specific agent configuration (mirrors .claude)
├── .gemini/         # Gemini-specific agent configuration (mirrors .claude)
├── docs/            # GSD system documentation for users
├── templates/       # Root-level templates for new GSD projects
├── sample-project/  # Example implementation of a GSD project
├── scripts/         # Internal utility and maintenance scripts
├── .planning/       # (Generated) Project-specific planning artifacts
└── CLAUDE.md        # Entry point and command reference for agents
```

## Directory Purposes

**.claude/agents/:**
- Purpose: Defines the roles and system instructions for Claude-based GSD agents.
- Contains: Markdown files for each agent type.
- Key files: `gsd-planner.md`, `gsd-executor.md`, `gsd-verifier.md`.

**.claude/gsd-core/bin/:**
- Purpose: Houses the CLI tool and the supporting logic libraries.
- Contains: `.cjs` JavaScript files (Node.js).
- Key files: `gsd-tools.cjs`, `lib/state.cjs`, `lib/roadmap.cjs`, `lib/core.cjs`.

**.claude/gsd-core/workflows/:**
- Purpose: Step-by-step procedure guides for agents.
- Contains: Markdown files that define phase logic.
- Key files: `plan-phase.md`, `execute-phase.md`, `discuss-phase.md`.

**.claude/gsd-core/templates/:**
- Purpose: Standard templates used by the system to scaffold new files.
- Contains: Markdown and JSON templates.
- Key files: `ROADMAP.md`, `STATE.md`, `PLAN.md`.

**.claude/gsd-core/references/:**
- Purpose: Knowledge base and behavioral guidelines for agents.
- Contains: Instructional markdown files.
- Key files: `gates.md`, `planner-antipatterns.md`, `verification-patterns.md`.

## Key File Locations

**Entry Points:**
- `CLAUDE.md`: Main command reference and project overview for Claude.
- `.claude/gsd-core/bin/gsd-tools.cjs`: Primary CLI utility.

**Configuration:**
- `.planning/config.json`: Project-specific GSD configuration (generated).
- `.claude/gsd-core/bin/shared/config-schema.manifest.json`: Configuration schema.

**Core Logic:**
- `.claude/gsd-core/bin/lib/core.cjs`: Shared internal helpers.
- `.claude/gsd-core/bin/lib/state.cjs`: State machine logic.

**Testing:**
- `.claude/gsd-core/bin/lib/verify.cjs`: Verification logic for project deliverables.

## Naming Conventions

**Files:**
- Agent definitions: `gsd-{role}.md` (e.g., `gsd-planner.md`)
- Library components: `{noun}.cjs` (e.g., `roadmap.cjs`)
- Workflows: `{action}-phase.md` or `{action}.md` (e.g., `plan-phase.md`)

**Directories:**
- Phase directories (in `.planning/`): `NN-{kebab-case-name}` (e.g., `01-foundation`)
- Milestone archives: `vX.Y-phases`

## Where to Add New Code

**New Agent:**
- Implementation: Add a new `.md` file to `.claude/agents/`.

**New Workflow Step:**
- Implementation: Modify the relevant `.md` file in `.claude/gsd-core/workflows/`.

**New CLI Command:**
- Library logic: Add or update a `.cjs` file in `.claude/gsd-core/bin/lib/`.
- CLI Routing: Update the command dispatcher in `.claude/gsd-core/bin/gsd-tools.cjs`.

**New Global Template:**
- Implementation: Add to `.claude/gsd-core/templates/` (or the root `templates/` for initial project setup).

## Special Directories

**.planning/:**
- Purpose: Contains all project-specific GSD state and artifacts.
- Generated: Yes (during `/gsd:new-project`).
- Committed: Yes (source of truth for progress).

**node_modules/:**
- Purpose: Standard Node.js dependencies (if any, typically excluded from GSD mapping).
- Generated: Yes.
- Committed: No.

---

*Structure analysis: 2026-06-11*
