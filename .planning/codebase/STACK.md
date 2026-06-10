# Technology Stack

**Analysis Date:** 2026-06-10

## Languages

**Primary:**
- JavaScript (Node.js) - Core logic of `gsd-core` and lifecycle hooks. Uses CommonJS (`.cjs`) and ESM.

**Secondary:**
- Python - Automation scripts located in `scripts/`.
- Markdown - Agent definitions (`.claude/agents/*.md`), documentation, and planning artifacts.
- Shell (Bash/PowerShell) - Integration hooks and orchestration scripts.

## Runtime

**Environment:**
- Node.js >= 20.0.0 (Required for `gsd-core` and agent CLIs)
- Python 3.x (For utility scripts)

**Package Manager:**
- npm (Used for installing agent CLIs)
- Lockfile: `package-lock.json` (Not present in root, but Node.js environment is required)

## Frameworks

**Core:**
- GSD Core v1.4.3 - The primary framework for agentic workflow orchestration.
- Claude Code (Anthropic) - AI agent framework for the Claude path.
- Codex (OpenAI) - AI agent framework for the Codex path.

**Testing:**
- Not explicitly detected in root, but `gsd-core` includes `verify` and `uat` (User Acceptance Testing) workflows that leverage internal verification patterns.

**Build/Dev:**
- `gsd-tools.cjs` - Internal CLI tools for GSD management.

## Key Dependencies

**Critical:**
- `gh` (GitHub CLI) >= 2.40 - Used for repository management, pull requests, and issues.
- `git` >= 2.40 - Core version control system for tracking all changes.

**Infrastructure:**
- Brave Search API - Integrated for web search capabilities.
- NPM/PyPI/Crates.io registries - Referenced for package legitimacy checks.

## Configuration

**Environment:**
- Configured via environment variables and project-specific JSON/TOML files.
- Key configs required: `BRAVE_API_KEY` (optional, for web search), LLM API keys (handled by respective agent CLIs).

**Build:**
- `.claude/gsd-file-manifest.json` - Tracks framework file integrity and versions.
- `.codex/config.toml` - Orchestration configuration for Codex agents.

## Platform Requirements

**Development:**
- Cross-platform: Works on Ubuntu/WSL, macOS, and Windows.
- GitHub account and authenticated `gh` CLI required.

**Production:**
- Not applicable (This is a developer toolkit/framework).

---

*Stack analysis: 2026-06-10*
