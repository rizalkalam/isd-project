# External Integrations

**Analysis Date:** 2026-06-11

## APIs & External Services

**AI Agents:**
- Anthropic Claude API - Powering Claude Code.
- OpenAI API - Powering Codex.

**Search:**
- Brave Search API - Used for web research during `plan` and `discuss` phases.
  - SDK/Client: `fetch` via `gsd-tools.cjs`.
  - Auth: `BRAVE_API_KEY`.

**Version Control:**
- GitHub API - Used for repository management, PRs, and issues.
  - SDK/Client: `gh` (GitHub CLI).
  - Auth: `gh auth login`.

## Data Storage

**Databases:**
- None (Filesystem-based state management).

**File Storage:**
- Local filesystem only - Primary storage for `.planning/` artifacts and project source.
- Git - Distributed versioned storage.

**Caching:**
- None.

## Authentication & Identity

**Auth Provider:**
- GitHub (via `gh` CLI) - For repository access and collaboration.
- API Key-based - For LLMs and search services.

## Monitoring & Observability

**Error Tracking:**
- None.

**Logs:**
- Console-based logging via `gsd-core` commands and hooks.
- Markdown reports: Verification and UAT reports saved to `.planning/phases/`.

## CI/CD & Deployment

**Hosting:**
- GitHub - Hosting the repository and tutorial content.

**CI Pipeline:**
- GitHub Actions - Standard GSD Core repositories use GitHub Actions for workflow automation and verification.

## Environment Configuration

**Required env vars:**
- `BRAVE_API_KEY` - Required for web search functionality.
- `ANTHROPIC_API_KEY` - Used by Claude Code.
- `OPENAI_API_KEY` - Used by Codex.

**Secrets location:**
- Environment variables or `~/.gsd/` local files (e.g., `~/.gsd/brave_api_key`).

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- Agent Lifecycle Hooks - Scripts in `.claude/hooks/` and `.gemini/hooks/` triggered by agent CLI events (e.g., `SessionStart`, `PostToolUse`).

---

*Integration audit: 2026-06-11*
