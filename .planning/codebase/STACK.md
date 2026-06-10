# Technology Stack

**Analysis Date:** 2026-06-10

## Languages

**Primary:**
- JavaScript (CommonJS) - Core logic in `.gemini/gsd-core/bin/lib/` and entry point `gsd-tools.cjs`.

**Secondary:**
- Python - Utility scripts in `scripts/` (e.g., `render_term.py`, `verify_doc_links.py`).
- Markdown - Workflow and agent definitions in `.gemini/gsd-core/workflows/` and `.gemini/agents/`.

## Runtime

**Environment:**
- Node.js (v20+ assumed for GSD Core)

**Package Manager:**
- npm (minimal usage, only `package.json` with type definition)
- Lockfile: missing

## Frameworks

**Core:**
- GSD Core - Internal framework for agent orchestration and workflow management.

**Testing:**
- Not detected (tests may be handled via external GSD commands or scripts).

**Build/Dev:**
- None detected (direct execution of scripts).

## Key Dependencies

**Critical:**
- None (uses built-in Node.js modules `fs`, `path`, etc.).

**Infrastructure:**
- Git - Used for state tracking and commits.
- GitHub CLI (`gh`) - Used for PR and repository management.

## Configuration

**Environment:**
- Assumed via environment variables for AI service credentials.

**Build:**
- None.

## Platform Requirements

**Development:**
- Windows/Linux/macOS with Node.js and Git.

**Production:**
- Not applicable (CLI tool).

---

*Stack analysis: 2026-06-10*
