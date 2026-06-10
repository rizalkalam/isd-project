# Codebase Structure

**Analysis Date:** 2026-06-10

## Directory Layout

```
[project-root]/
├── .claude/          # Claude-specific implementation
│   ├── agents/       # Agent persona definitions
│   └── gsd-core/     # Core logic and workflows
├── .codex/           # Codex-specific implementation
├── .gemini/          # Gemini-specific implementation
├── docs/             # Global documentation
├── scripts/          # Utility and maintenance scripts
├── templates/        # PRD, Spec, and Roadmap templates
└── .planning/        # Project-specific planning state (generated)
```

## Directory Purposes

**.gemini/gsd-core/bin/lib/:**
- Purpose: Core domain logic modules.
- Contains: CommonJS files (`.cjs`).
- Key files: `core.cjs`, `state.cjs`, `phase.cjs`, `roadmap.cjs`.

**.gemini/gsd-core/workflows/:**
- Purpose: Multi-step process definitions.
- Contains: Markdown files defining GSD commands (e.g., `new-project.md`).

**.gemini/agents/:**
- Purpose: Agent persona definitions for Gemini runtime.
- Contains: Markdown files with instructions and tool definitions.

## Key File Locations

**Entry Points:**
- `.gemini/gsd-core/bin/gsd-tools.cjs`: Main CLI entry.

**Configuration:**
- `.gemini/settings.json`: Runtime settings.
- `.gemini/gsd-install-state.json`: Installation metadata.

**Documentation:**
- `docs/`: Comprehensive GSD workflow guides.

## Naming Conventions

**Files:**
- Kebab-case for workflows and agents: `new-project.md`, `gsd-codebase-mapper.md`.
- Kebab-case for core libraries: `state-command-router.cjs`.

**Directories:**
- Dot-prefixed for runtime environments: `.gemini`, `.claude`.

## Where to Add New Code

**New Core Logic:**
- Implementation: `.gemini/gsd-core/bin/lib/`

**New Workflow:**
- Primary code: `.gemini/gsd-core/workflows/`

**New Agent:**
- Implementation: `.gemini/agents/`

---

*Structure analysis: 2026-06-10*
