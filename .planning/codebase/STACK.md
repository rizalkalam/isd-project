# Technology Stack

**Analysis Date:** 2026-06-11

## Languages

**Primary:**
- JavaScript (Node.js) >= 20.0.0 - Core logic of `gsd-core` and lifecycle hooks in `.claude/hooks/` and `.gemini/hooks/`.

**Secondary:**
- Python 3.x - Automation scripts located in `scripts/` (e.g., `scripts/verify_doc_links.py`).
- Markdown - Agent definitions (`.claude/agents/*.md`), documentation, and planning artifacts.
- Shell (Bash/PowerShell) - Integration hooks and orchestration scripts.

## Runtime

**Environment:**
- Node.js >= 20.0.0
- Python 3.x

**Package Manager:**
- npm
- Lockfile: Not present in root, but required for tool installation (e.g., `npx @opengsd/gsd-core@latest`).

## Frameworks

**Core:**
- GSD Core v1.4.3 - The primary framework for agentic workflow orchestration.
- Claude Code (Anthropic) - AI agent framework for the Claude path.
- Codex (OpenAI) - AI agent framework for the Codex path.

**Testing:**
- Internal GSD Verification - Leverages `verify` and `uat` (User Acceptance Testing) workflows.
- Python scripts - `scripts/verify_doc_links.py` for documentation integrity.

**Build/Dev:**
- `gsd-tools.cjs` - Internal CLI tools for GSD management.

## Key Dependencies

**Critical:**
- `git` >= 2.40 - Core version control system for tracking all changes and state.
- `gh` (GitHub CLI) >= 2.40 - Used for repository management, pull requests, and issues.

**Infrastructure:**
- Brave Search API - Integrated for web search capabilities during research phases.

## Configuration

**Environment:**
- Configured via environment variables and project-specific JSON/TOML files.
- Key configs required: `BRAVE_API_KEY` (optional, for web search), LLM API keys (handled by respective agent CLIs).

**Build:**
- `.claude/gsd-file-manifest.json` - Tracks framework file integrity and versions.
- `settings.local.json` - Configures agent lifecycle hooks.

## Platform Requirements

**Development:**
- Cross-platform support: Windows (via WSL/PowerShell), macOS, and Linux.
- GitHub account and authenticated `gh` CLI required.

**Production:**
- Not applicable (This is a developer toolkit/framework).

---

*Stack analysis: 2026-06-11*
