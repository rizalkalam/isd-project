# External Integrations

**Analysis Date:** 2026-06-10

## APIs & External Services

**AI LLM Providers:**
- **Anthropic (Claude)** - Core agent brain for the Claude workflow path.
  - SDK/Client: `claude` (Claude Code CLI)
  - Auth: Handled via `claude auth`
- **OpenAI (Codex)** - Core agent brain for the Codex workflow path.
  - SDK/Client: `codex` CLI
  - Auth: API key (usually `OPENAI_API_KEY`)

**Search & Information:**
- **Brave Search API** - Used for web search capabilities during research phases.
  - SDK/Client: Native `fetch` in Node.js
  - Auth: `BRAVE_API_KEY`

**Package Ecosystems:**
- **NPM Registry** - Checked for package legitimacy and metadata.
- **PyPI** - Checked for Python package metadata.
- **Crates.io** - Checked for Rust crate metadata.

## Data Storage

**Databases:**
- **Local Filesystem** - Primary state storage. All planning, state, and history artifacts are stored as files in `.planning/`.
  - Client: Native `node:fs`

**File Storage:**
- **Local filesystem only** - GSD Core manages all artifacts on the local disk within the project directory.

**Caching:**
- **Local JSON snapshots** - Used for performance and drift detection.

## Authentication & Identity

**Auth Provider:**
- **GitHub** - Central identity and collaboration platform.
  - Implementation: Authenticated via GitHub CLI (`gh auth login`).
- **Tool-specific Auth** - Claude Code and Codex manage their own sessions via their respective CLIs.

## Monitoring & Observability

**Error Tracking:**
- **None** - Errors are logged to the console and captured in `discussion-log.md` or `.gsd-session-report.md`.

**Logs:**
- **Markdown-based logs** - Every session and phase has associated logs:
  - `discussion-log.md`
  - `.gsd-session-report.md`
  - `VERIFICATION.md`

## CI/CD & Deployment

**Hosting:**
- **Not applicable** - This is a development toolkit. However, it supports projects deploying to Vercel, Render, Railway, and Supabase.

**CI Pipeline:**
- **GitHub Actions** - Commonly used with GSD projects for automated verification and shipping.

## Environment Configuration

**Required env vars:**
- `BRAVE_API_KEY` (optional, enables web search)
- `GSD_WEBSEARCH_TIMEOUT_MS` (optional, defaults to 10000)

**Secrets location:**
- Environment variables or tool-specific auth stores (e.g., `gh` config).

## Webhooks & Callbacks

**Incoming:**
- **None**

**Outgoing:**
- **GitHub API** - Triggered via `gh` CLI for PR creation, issue updates, etc.

---

*Integration audit: 2026-06-10*
